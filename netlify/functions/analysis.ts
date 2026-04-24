import type { Context } from "@netlify/functions";
import { auditLog } from "./utils/auditLog.js";
import { isAuthError, verifyAuth } from "./utils/auth.js";
import { analyzeSkinWithGemini, GeminiError } from "./utils/geminiService.js";
import { applySafetyGate } from "./utils/medicalSafety.js";
import { errorResponse, jsonResponse, parseBody } from "./utils/response.js";
import { supabase } from "./utils/supabase.js";

const MEDICAL_DISCLAIMER =
  "THIS IS A RISK TRIAGE RESULT — NOT A MEDICAL DIAGNOSIS. " +
  "This tool is a decision-support aid only. " +
  "Always consult a qualified, registered dermatologist. " +
  "In an emergency, call 999 (UK) or 911 (US) immediately.";

/**
 * Authenticated AI analysis endpoint.
 *
 * POST /.netlify/functions/analysis?uploadId=xxx
 *   → Trigger analysis: download image, call Gemini, save results, return synchronously
 *
 * GET /.netlify/functions/analysis?analysisId=xxx
 *   → Fetch analysis result by analysis ID
 *
 * GET /.netlify/functions/analysis?byUploadId=xxx
 *   → Fetch analysis result by upload ID
 */
export default async function handler(request: Request, _context: Context) {
  if (request.method === "POST") {
    return handleTrigger(request);
  }

  if (request.method === "GET") {
    return handleGet(request);
  }

  return errorResponse(405, "METHOD_NOT_ALLOWED", "Only GET and POST are allowed.");
}

// ─── POST: Trigger Analysis ──────────────────────────────────────────

async function handleTrigger(request: Request) {
  // Authenticate
  const auth = await verifyAuth(request, "patient");
  if (isAuthError(auth)) return auth;

  // Extract uploadId from query string
  const url = new URL(request.url);
  const uploadId = url.searchParams.get("uploadId");

  if (!uploadId) {
    return errorResponse(400, "MISSING_PARAM", "uploadId query parameter is required.");
  }

  try {
    // Verify the upload exists and belongs to this user
    const { data: upload, error: uploadErr } = await supabase
      .from("uploads")
      .select("id, user_id, status, storage_path")
      .eq("id", uploadId)
      .single();

    if (uploadErr || !upload) {
      return errorResponse(404, "NOT_FOUND", "Upload not found.");
    }
    if (upload.user_id !== auth.userId) {
      return errorResponse(403, "FORBIDDEN", "Access denied.");
    }
    if (upload.status === "expired") {
      return errorResponse(
        410,
        "UPLOAD_EXPIRED",
        "This upload has expired and cannot be analysed.",
      );
    }

    // Check for existing in-progress analysis
    const { data: existing } = await supabase
      .from("analysis_results")
      .select("id, status")
      .eq("upload_id", uploadId)
      .in("status", ["queued", "processing", "complete"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existing?.status === "complete") {
      // Already completed — return the existing result
      return await fetchAndReturnAnalysis(existing.id, auth.userId, upload.storage_path);
    }

    // Create analysis record
    const { data: analysis, error: insertErr } = await supabase
      .from("analysis_results")
      .insert({
        upload_id: uploadId,
        status: "processing",
        progress: 0,
        started_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertErr) {
      return errorResponse(500, "DB_ERROR", "Failed to create analysis record.");
    }

    // Mark upload as processing
    await supabase
      .from("uploads")
      .update({ status: "processing" })
      .eq("id", uploadId);

    // === Run the AI pipeline synchronously ===

    // 1. Download image from Supabase storage
    const { data: fileData, error: downloadErr } = await supabase.storage
      .from("skin-images")
      .download(upload.storage_path);

    if (downloadErr || !fileData) {
      await markFailed(analysis.id, "Could not download image for AI pipeline.");
      await supabase.from("uploads").update({ status: "failed" }).eq("id", uploadId);
      return errorResponse(500, "STORAGE_ERROR", "Could not download image for analysis.");
    }

    // 2. Convert to base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    const ext = upload.storage_path.split(".").pop()?.toLowerCase();
    const mimeType =
      ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";

    // 3. Call Gemini AI
    const aiResult = await analyzeSkinWithGemini(base64Image, mimeType);

    // 4. Apply medical safety gate
    const safeResult = applySafetyGate(
      aiResult.summary,
      aiResult.risk_level,
      aiResult.confidence,
    );

    // 5. Save results to Supabase
    await supabase
      .from("analysis_results")
      .update({
        status: "complete",
        progress: 100,
        risk_level: aiResult.risk_level,
        confidence: Math.round(aiResult.confidence * 1000) / 1000,
        severity_score: Math.round(aiResult.severity_score * 10) / 10,
        summary: safeResult.summary,
        disclaimer: safeResult.disclaimer,
        referral_required: safeResult.referralRequired,
        emergency_flag: safeResult.emergencyFlag,
        xai_metadata: {
          ...(aiResult.bounding_box ? { bounding_box: aiResult.bounding_box } : {}),
          ...(aiResult.regimen ? { regimen: aiResult.regimen } : {}),
        },
        completed_at: new Date().toISOString(),
      })
      .eq("id", analysis.id);

    // 6. Mark upload complete
    await supabase
      .from("uploads")
      .update({ status: "complete" })
      .eq("id", uploadId);

    // 7. Audit log (fire-and-forget)
    void auditLog("analysis.complete", {
      userId: auth.userId,
      resourceType: "analysis",
      resourceId: analysis.id,
      metadata: {
        riskLevel: aiResult.risk_level,
        referralRequired: safeResult.referralRequired,
        emergencyFlag: safeResult.emergencyFlag,
        safetyWarningIssued: safeResult.warningIssued,
      },
    });

    if (safeResult.emergencyFlag) {
      void auditLog("analysis.emergency", {
        userId: auth.userId,
        resourceType: "analysis",
        resourceId: analysis.id,
        metadata: { riskLevel: aiResult.risk_level },
      });
    }

    // Generate signed URL for the image
    const { data: signedData } = await supabase.storage
      .from("skin-images")
      .createSignedUrl(upload.storage_path, 3600);

    // Return the complete result
    return jsonResponse({
      id: analysis.id,
      analysisId: analysis.id,
      uploadId,
      upload_id: uploadId,
      status: "complete",
      progress: 100,
      risk_level: aiResult.risk_level,
      confidence: Math.round(aiResult.confidence * 1000) / 1000,
      severity_score: Math.round(aiResult.severity_score * 10) / 10,
      summary: safeResult.summary,
      disclaimer: safeResult.disclaimer,
      referral_required: safeResult.referralRequired,
      emergency_flag: safeResult.emergencyFlag,
      xai_metadata: {
        ...(aiResult.bounding_box ? { bounding_box: aiResult.bounding_box } : {}),
        ...(aiResult.regimen ? { regimen: aiResult.regimen } : {}),
      },
      completed_at: new Date().toISOString(),
      imageUrl: signedData?.signedUrl ?? null,
    });
  } catch (err) {
    if (err instanceof GeminiError) {
      return errorResponse(err.status, err.code, err.message);
    }
    console.error("[Analysis Function] Error:", err);
    return errorResponse(
      500,
      "INTERNAL_ERROR",
      err instanceof Error ? err.message : "An unexpected error occurred.",
    );
  }
}

// ─── GET: Fetch Analysis Result ──────────────────────────────────────

async function handleGet(request: Request) {
  // Authenticate
  const auth = await verifyAuth(request, "patient", "doctor");
  if (isAuthError(auth)) return auth;

  const url = new URL(request.url);
  const analysisId = url.searchParams.get("analysisId");
  const byUploadId = url.searchParams.get("byUploadId");

  if (analysisId) {
    return await fetchAndReturnAnalysis(analysisId, auth.userId);
  }

  if (byUploadId) {
    return await fetchByUploadId(byUploadId, auth.userId);
  }

  return errorResponse(
    400,
    "MISSING_PARAM",
    "Provide analysisId or byUploadId query parameter.",
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────

async function fetchAndReturnAnalysis(
  analysisId: string,
  userId: string,
  storagePath?: string,
) {
  const { data: analysis, error } = await supabase
    .from("analysis_results")
    .select("*, uploads!inner(user_id, storage_path)")
    .eq("id", analysisId)
    .single();

  if (error || !analysis) {
    return errorResponse(404, "NOT_FOUND", "Analysis not found.");
  }

  // Verify ownership
  const uploadData = Array.isArray(analysis.uploads)
    ? analysis.uploads[0]
    : analysis.uploads;

  if ((uploadData as { user_id: string }).user_id !== userId) {
    return errorResponse(403, "FORBIDDEN", "Access denied.");
  }

  // Get signed image URL
  const path =
    storagePath ?? (uploadData as { storage_path: string })?.storage_path;
  let imageUrl = null;
  if (path) {
    const { data: signedData } = await supabase.storage
      .from("skin-images")
      .createSignedUrl(path, 3600);
    imageUrl = signedData?.signedUrl ?? null;
  }

  const { uploads: _u, ...result } = analysis as Record<string, unknown>;
  void _u;

  return jsonResponse({
    ...result,
    imageUrl,
    disclaimer: MEDICAL_DISCLAIMER,
  });
}

async function fetchByUploadId(uploadId: string, userId: string) {
  // Verify upload ownership
  const { data: upload, error: uploadErr } = await supabase
    .from("uploads")
    .select("user_id, storage_path")
    .eq("id", uploadId)
    .single();

  if (uploadErr || !upload) {
    return errorResponse(404, "NOT_FOUND", "Upload not found.");
  }
  if (upload.user_id !== userId) {
    return errorResponse(403, "FORBIDDEN", "Access denied.");
  }

  const { data: analysis, error } = await supabase
    .from("analysis_results")
    .select("*")
    .eq("upload_id", uploadId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !analysis) {
    return errorResponse(404, "NOT_FOUND", "No analysis found for this upload.");
  }

  // Get signed image URL
  const { data: signedData } = await supabase.storage
    .from("skin-images")
    .createSignedUrl(upload.storage_path, 3600);

  return jsonResponse({
    ...analysis,
    imageUrl: signedData?.signedUrl ?? null,
    disclaimer: MEDICAL_DISCLAIMER,
  });
}

async function markFailed(analysisId: string, errorMessage: string) {
  await supabase
    .from("analysis_results")
    .update({ status: "failed", error_message: errorMessage })
    .eq("id", analysisId);
}

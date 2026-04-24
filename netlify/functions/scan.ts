import type { Context } from "@netlify/functions";
import { z } from "zod";
import { analyzeSkinWithGemini, GeminiError } from "./utils/geminiService.js";
import { applySafetyGate } from "./utils/medicalSafety.js";
import { errorResponse, jsonResponse, parseBody } from "./utils/response.js";

/**
 * Public AI skin scan — no authentication required.
 * POST /.netlify/functions/scan
 *
 * Body: { base64Image: string, mimeType: string }
 */

const PublicScanSchema = z.object({
  base64Image: z
    .string()
    .min(1, "base64Image is required")
    .max(15 * 1024 * 1024, "Image data too large"), // ~10 MB base64
  mimeType: z.enum(["image/jpeg", "image/png", "image/webp"], {
    errorMap: () => ({
      message: "mimeType must be image/jpeg, image/png, or image/webp",
    }),
  }),
});

export default async function handler(request: Request, _context: Context) {
  // Only allow POST
  if (request.method !== "POST") {
    return errorResponse(405, "METHOD_NOT_ALLOWED", "Only POST is allowed.");
  }

  try {
    // Parse & validate body
    const body = await parseBody(request);
    if (!body) {
      return errorResponse(400, "INVALID_BODY", "Request body must be JSON.");
    }

    const parsed = PublicScanSchema.safeParse(body);
    if (!parsed.success) {
      return errorResponse(
        422,
        "VALIDATION_ERROR",
        parsed.error.errors[0].message,
      );
    }

    const { base64Image, mimeType } = parsed.data;

    // Call Gemini AI
    const aiResult = await analyzeSkinWithGemini(base64Image, mimeType);

    // Apply medical safety gate
    const safeResult = applySafetyGate(
      aiResult.summary,
      aiResult.risk_level,
      aiResult.confidence,
    );

    return jsonResponse({
      success: true,
      data: {
        risk_level: aiResult.risk_level,
        confidence: Math.round(aiResult.confidence * 1000) / 1000,
        severity_score: Math.round(aiResult.severity_score * 10) / 10,
        summary: safeResult.summary,
        disclaimer: safeResult.disclaimer,
        top_label: aiResult.top_label,
        bounding_box: aiResult.bounding_box || null,
        referral_required: safeResult.referralRequired,
        emergency_flag: safeResult.emergencyFlag,
        regimen: aiResult.regimen || null,
      },
    });
  } catch (err) {
    if (err instanceof GeminiError) {
      return errorResponse(err.status, err.code, err.message);
    }

    console.error("[Scan Function] Unexpected error:", err);
    return errorResponse(
      500,
      "INTERNAL_ERROR",
      "An unexpected error occurred. Please try again.",
    );
  }
}

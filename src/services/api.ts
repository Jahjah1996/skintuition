/**
 * api client — Skintuition
 */
import type { SymptomData } from "../components/medical/SymptomQuestionnaire";
import { supabase } from "../config/supabase";

// re-export symptoms
export type { SymptomData };

// Use a relative path.
// Locally: Vite proxy forwards it to Express.
// Vercel: vercel.json rewrites it to the serverless function.
const BASE_URL = "/api/v1";

// typescript types

export interface CreateUploadPayload {
  filename: string;
  mimeType: "image/jpeg" | "image/png" | "image/webp";
  sizeBytes: number;
  bodyPart?: string;
}

export interface UploadResponse {
  uploadId: string;
  signedUrl: string;
  token: string;
  expiresAt: string;
  disclaimer: string;
}

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export interface AnalysisResponse {
  id?: string;
  analysisId?: string;
  uploadId?: string;
  upload_id?: string;
  status: "queued" | "processing" | "complete" | "failed";
  progress?: number;
  riskLevel?: RiskLevel;
  risk_level?: RiskLevel;
  confidence?: number;
  severityScore?: number;
  severity_score?: number;
  summary?: string;
  disclaimer: string;
  referralRequired?: boolean;
  referral_required?: boolean;
  emergencyFlag?: boolean;
  emergency_flag?: boolean;
  xaiMetadata?: {
    gradcamUrl: string | null;
    attentionRegions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      score: number;
    }>;
    topFeatures: string[];
    explanation: string;
    regimen?: {
      morning: Array<{ step: string; product: string; purpose: string }>;
      evening: Array<{ step: string; product: string; purpose: string }>;
    };
  };
  xai_metadata?: {
    bounding_box?: {
      ymin: number;
      xmin: number;
      ymax: number;
      xmax: number;
    };
    gradcamUrl: string | null;
    attentionRegions: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
      score: number;
    }>;
    topFeatures: string[];
    explanation: string;
    regimen?: {
      morning: Array<{ step: string; product: string; purpose: string }>;
      evening: Array<{ step: string; product: string; purpose: string }>;
    };
  };
  pipelineStages?: Record<string, string>;
  pipeline_stages?: Record<string, string>;
  errorMessage?: string;
  error_message?: string;
  completedAt?: string;
  completed_at?: string;
}

export interface AnalysisTriggerResponse {
  analysisId: string;
  uploadId: string;
  status: "queued" | "processing" | "complete" | "failed";
  message?: string;
  estimatedSeconds?: number;
  disclaimer?: string;
}

// base fetch

async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res
      .json()
      .catch(() => ({ error: { message: res.statusText } }));
    throw Object.assign(new Error(body?.error?.message ?? "API Error"), {
      status: res.status,
      code: body?.error?.code,
    });
  }

  return res.json() as Promise<T>;
}

// api methods

export const api = {
  health: {
    get: () => apiFetch<{ status: string; version: string }>("/health"),
  },

  uploads: {
    create: (payload: CreateUploadPayload) =>
      apiFetch<UploadResponse>("/uploads", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    list: (params?: { page?: number; limit?: number; status?: string }) => {
      const qs = new URLSearchParams(
        Object.entries(params ?? {})
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)]),
      ).toString();
      return apiFetch<{ data: unknown[]; pagination: unknown }>(
        `/uploads${qs ? `?${qs}` : ""}`,
      );
    },

    getById: (id: string) =>
      apiFetch<UploadResponse & { imageUrl: string }>(`/uploads/${id}`),

    markUploaded: (id: string) =>
      apiFetch<{ id: string; status: string }>(`/uploads/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "uploaded" }),
      }),
  },

  analysis: {
    trigger: (uploadId: string, _symptomContext?: SymptomData) =>
      apiFetch<AnalysisResponse>(`/analysis/trigger?uploadId=${uploadId}`, {
        method: "POST",
      }),

    getById: (analysisId: string) =>
      apiFetch<AnalysisResponse>(`/analysis/get?analysisId=${analysisId}`),

    getByUploadId: (uploadId: string) =>
      apiFetch<AnalysisResponse>(`/analysis/get?byUploadId=${uploadId}`),
  },
};

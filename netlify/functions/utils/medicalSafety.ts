/**
 * Medical safety gate — filters AI output for compliance.
 * Direct port from backend/src/services/medicalSafety.ts
 */

export type RiskLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

const MANDATORY_DISCLAIMER =
  "THIS IS A RISK TRIAGE RESULT — NOT A MEDICAL DIAGNOSIS. " +
  "This tool is a decision-support aid only. " +
  "Always consult a qualified, registered dermatologist. " +
  "In an emergency, call 999 (UK) or 911 (US) immediately.";

// Banned diagnostic phrases
const BANNED_PHRASES = [
  "you have",
  "you are diagnosed",
  "this is cancer",
  "this is melanoma",
  "malignant",
  "diagnosed with",
  "confirms cancer",
  "is cancerous",
];

export interface SafetyCheckResult {
  summary: string;
  disclaimer: string;
  referralRequired: boolean;
  emergencyFlag: boolean;
  warningIssued: boolean;
}

/**
 * Apply the medical safety gate to AI-generated text.
 */
export function applySafetyGate(
  rawSummary: string,
  riskLevel: RiskLevel,
  confidence: number,
): SafetyCheckResult {
  // Remove banned phrases
  let cleanSummary = rawSummary;
  let warningIssued = false;

  for (const phrase of BANNED_PHRASES) {
    const regex = new RegExp(phrase, "gi");
    if (regex.test(cleanSummary)) {
      cleanSummary = cleanSummary.replace(regex, "[redacted]");
      warningIssued = true;
    }
  }

  const referralRequired = riskLevel === "HIGH" || riskLevel === "CRITICAL";
  const emergencyFlag = riskLevel === "CRITICAL";
  const fullSummary = `${cleanSummary} — ${MANDATORY_DISCLAIMER}`;

  // Clamp confidence to [0, 1] — Gemini sometimes returns values like 85 instead of 0.85
  if (confidence > 1) confidence = confidence / 100;
  confidence = Math.max(0, Math.min(1, confidence));

  return {
    summary: fullSummary,
    disclaimer: MANDATORY_DISCLAIMER,
    referralRequired,
    emergencyFlag,
    warningIssued,
  };
}

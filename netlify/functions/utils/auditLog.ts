import { supabase } from "./supabase.js";

/**
 * Fire-and-forget audit log entry.
 * Failures are silently ignored to avoid blocking the main flow.
 */
export async function auditLog(
  event: string,
  context: {
    userId?: string;
    resourceType?: string;
    resourceId?: string;
    metadata?: Record<string, unknown>;
    ipAddress?: string;
    userAgent?: string;
  },
): Promise<void> {
  try {
    await supabase.from("audit_logs").insert({
      user_id: context.userId ?? null,
      event,
      resource_type: context.resourceType ?? null,
      resource_id: context.resourceId ?? null,
      metadata: context.metadata ?? {},
      ip_address: context.ipAddress ?? null,
      user_agent: context.userAgent ?? null,
    });
  } catch {
    // Silently ignore audit failures — never block the main flow
  }
}

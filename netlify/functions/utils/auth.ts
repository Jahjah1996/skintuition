import { supabase } from "./supabase.js";
import { errorResponse } from "./response.js";

export type UserRole = "patient" | "doctor";

export interface AuthResult {
  userId: string;
  email: string;
  role: UserRole;
}

/**
 * Verify the JWT from the Authorization header and optionally check roles.
 * Returns the authenticated user info or a pre-built error Response.
 */
export async function verifyAuth(
  request: Request,
  ...requiredRoles: UserRole[]
): Promise<AuthResult | Response> {
  const authHeader = request.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(
      401,
      "UNAUTHORIZED",
      "Authorization header missing or malformed.",
    );
  }

  const token = authHeader.replace("Bearer ", "").trim();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser(token);

  if (error || !user) {
    return errorResponse(
      401,
      "UNAUTHORIZED",
      error?.message ?? "JWT token is invalid or expired.",
    );
  }

  // Fetch role from profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return errorResponse(
      403,
      "FORBIDDEN",
      "User profile not found. Please complete registration.",
    );
  }

  const role = profile.role as UserRole;

  // Check required roles if any were specified
  if (requiredRoles.length > 0 && !requiredRoles.includes(role)) {
    return errorResponse(
      403,
      "FORBIDDEN",
      `Access denied. Required role: ${requiredRoles.join(" or ")}. Your role: ${role}.`,
    );
  }

  return {
    userId: user.id,
    email: user.email ?? "",
    role,
  };
}

/** Type guard: returns true if verifyAuth returned an error Response */
export function isAuthError(result: AuthResult | Response): result is Response {
  return result instanceof Response;
}

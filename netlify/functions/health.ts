import type { Context } from "@netlify/functions";

/**
 * Health check endpoint
 * GET /.netlify/functions/health
 */
export default async function handler(_request: Request, _context: Context) {
  return new Response(
    JSON.stringify({
      status: "ok",
      version: "1.0.0",
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: { "Content-Type": "application/json" },
    },
  );
}

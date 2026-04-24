/**
 * Netlify Function response helpers
 */

export function jsonResponse(body: unknown, statusCode = 200) {
  return new Response(JSON.stringify(body), {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  } as ResponseInit);
}

export function errorResponse(
  statusCode: number,
  code: string,
  message: string,
) {
  return jsonResponse(
    {
      error: {
        code,
        message,
        timestamp: new Date().toISOString(),
      },
    },
    statusCode,
  );
}

/** Parse JSON body from a Netlify function event, return null on failure. */
export async function parseBody<T = unknown>(
  request: Request,
): Promise<T | null> {
  try {
    const text = await request.text();
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

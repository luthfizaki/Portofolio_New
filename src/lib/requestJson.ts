export async function requestJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<{ res: Response; data: T }> {
  const res = await fetch(input, init);
  const text = await res.text();
  const trimmed = text.trim();
  const contentType = res.headers.get("content-type") || "";

  if (trimmed) {
    const looksLikeJson = contentType.includes("application/json") || trimmed.startsWith("{") || trimmed.startsWith("[");
    if (!looksLikeJson) {
      const preview = trimmed.replace(/\s+/g, " ").slice(0, 120);
      throw new Error(`API returned non-JSON response: ${preview || "empty response"}`);
    }
  }

  let data: T;
  try {
    data = trimmed ? JSON.parse(text) : (null as T);
  } catch {
    throw new Error("API returned invalid JSON");
  }

  return { res, data };
}

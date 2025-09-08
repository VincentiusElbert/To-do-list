export async function apiFetch(input: string, init?: RequestInit) {
  const tryOnce = async (url: string) => {
    const res = await fetch(url, init).catch((e) => {
      throw new Error(
        `Network error: ${e instanceof Error ? e.message : String(e)}`,
      );
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  };

  const urls = [input, input.startsWith("/api") ? input : `/api${input}`];
  let lastErr: any;
  for (const url of urls) {
    try {
      return await tryOnce(url);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("Request failed");
}

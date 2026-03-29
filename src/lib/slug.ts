/** URL-safe slug; falls back if title has no usable characters. */
export function slugifyTitle(title: string, fallback: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 96);
  return s || fallback;
}

export function parseUrlLines(raw: string | null | undefined): string[] {
  if (!raw?.trim()) return [];
  return raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

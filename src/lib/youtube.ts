/**
 * Extract YouTube video id from common URL shapes; return embed URL for iframe.
 * Prefer hosting video on YouTube/Vimeo and storing only the link in Postgres.
 */
export function getYoutubeEmbedSrc(input: string | null | undefined): string | null {
  const id = extractYoutubeVideoId(input);
  if (!id) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}

export function extractYoutubeVideoId(
  input: string | null | undefined,
): string | null {
  const raw = input?.trim();
  if (!raw) return null;

  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const u = new URL(raw);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (u.pathname.startsWith("/embed/")) {
        const id = u.pathname.split("/")[2];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id && /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
      }
      const v = u.searchParams.get("v");
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    }
  } catch {
    /* not a full URL */
  }

  return null;
}

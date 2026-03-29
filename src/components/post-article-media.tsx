import Image from "next/image";
import { getYoutubeEmbedSrc } from "@/lib/youtube";
import type { PostDetail } from "@/types/post";

type Props = {
  post: PostDetail;
};

/** Ordered embed URLs: `post_videos` first, then legacy `posts.video_url` if not duplicate. */
function collectYoutubeEmbeds(post: PostDetail): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  for (const row of post.videos) {
    const src = getYoutubeEmbedSrc(row.url);
    if (src && !seen.has(src)) {
      seen.add(src);
      out.push(src);
    }
  }

  const legacy = getYoutubeEmbedSrc(post.video_url);
  if (legacy && !seen.has(legacy)) {
    out.push(legacy);
  }

  return out;
}

export function PostArticleMedia({ post }: Props) {
  const embeds = collectYoutubeEmbeds(post);
  const hasImages = post.images.length > 0;
  const hasVideos = embeds.length > 0;

  if (!hasImages && !hasVideos) return null;

  return (
    <div className="mt-10 space-y-10">
      {hasImages ? (
        <section aria-label="Φωτογραφίες">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ring-gold">
            Φωτογραφίες
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {post.images.map((img, index) => (
              <li
                key={img.id}
                className="relative aspect-video overflow-hidden border border-ring-gold/50"
              >
                <Image
                  src={img.url}
                  alt={`${post.title} — φωτογραφία ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasVideos ? (
        <section aria-label="Βίντεο">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-ring-gold">
            Βίντεο
          </h2>
          <ul className="space-y-8">
            {embeds.map((src, index) => (
              <li key={`${src}-${index}`}>
                <div className="relative aspect-video w-full overflow-hidden border border-ring-gold/50 bg-black">
                  <iframe
                    title={`Βίντεο ${index + 1}: ${post.title}`}
                    src={src}
                    className="absolute inset-0 h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

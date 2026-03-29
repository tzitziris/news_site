import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/types/post";
import { newsPage } from "@/lib/site";

type Props = { post: Post };

export function NewsPostCard({ post }: Props) {
  const href = `/news/${post.slug?.trim() || post.id}`;
  const src = post.cover_image_url?.trim();

  return (
    <li>
      <Link
        href={href}
        className="group flex min-h-[11rem] flex-col border border-ring-gold/80 bg-ring-black transition-colors hover:border-ring-gold-bright md:flex-row"
      >
        <div className="relative aspect-video w-full shrink-0 md:h-auto md:w-56 md:min-h-[11rem]">
          {src ? (
            <Image
              src={src}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 224px"
            />
          ) : (
            <div
              className="absolute inset-0 bg-zinc-900"
              aria-hidden
            />
          )}
        </div>
        <article className="flex flex-1 flex-col justify-center gap-3 p-5 md:p-6">
          <h2 className="line-clamp-2 text-lg font-extrabold uppercase leading-tight tracking-wide text-ring-gold-bright md:text-xl">
            {post.title}
          </h2>
          {post.excerpt ? (
            <p className="line-clamp-3 text-sm leading-relaxed text-ring-white/90">
              {post.excerpt}
            </p>
          ) : null}
          <span className="text-sm font-bold uppercase tracking-wide text-ring-gold group-hover:text-ring-gold-bright">
            {newsPage.readMore}
          </span>
        </article>
      </Link>
    </li>
  );
}

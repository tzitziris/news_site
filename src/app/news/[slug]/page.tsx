import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostArticleMedia } from "@/components/post-article-media";
import { getPublishedPost } from "@/lib/data/posts";
import { newsPage, siteName } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return { title: "Άρθρο" };
  return {
    title: post.title,
    description: post.excerpt ?? `${siteName} — ${post.title}`,
  };
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Intl.DateTimeFormat("el", {
      dateStyle: "long",
    }).format(new Date(iso));
  } catch {
    return null;
  }
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();

  const coverSrc = post.cover_image_url?.trim();
  const dateLabel = formatDate(post.published_at);

  return (
    <article className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <p className="mb-6">
        <Link
          href="/news"
          className="text-sm font-bold uppercase tracking-wide text-ring-gold hover:text-ring-gold-bright"
        >
          ← {newsPage.titleWhite} {newsPage.titleAccent}
        </Link>
      </p>

      <header className="border-b border-ring-gold/30 pb-6">
        <h1 className="text-3xl font-extrabold uppercase leading-tight tracking-wide text-ring-gold-bright md:text-4xl">
          {post.title}
        </h1>
        {dateLabel && post.published_at ? (
          <p className="mt-4 text-sm text-ring-muted">
            <time dateTime={post.published_at}>{dateLabel}</time>
          </p>
        ) : null}
      </header>

      {coverSrc ? (
        <div className="relative mt-8 aspect-video w-full overflow-hidden border border-ring-gold/60">
          <Image
            src={coverSrc}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      ) : null}

      {post.excerpt ? (
        <p className="mt-8 text-lg font-medium leading-relaxed text-ring-white/95">
          {post.excerpt}
        </p>
      ) : null}

      {post.body ? (
        <div className="mt-8 whitespace-pre-wrap leading-relaxed text-ring-white/90">
          {post.body}
        </div>
      ) : null}

      <PostArticleMedia post={post} />
    </article>
  );
}

import type { Metadata } from "next";
import { NewsPostCard } from "@/components/news-post-card";
import { getPublishedPosts } from "@/lib/data/posts";
import { newsPage, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: `${newsPage.titleWhite} ${newsPage.titleAccent}`.trim(),
  description: `Τελευταία νέα από το ${siteName}.`,
};

export default async function NewsPage() {
  const result = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <h1 className="mb-10 text-center text-3xl font-extrabold uppercase tracking-wide md:mb-14 md:text-4xl">
        <span className="text-ring-white">{newsPage.titleWhite}</span>
        <span className="text-ring-gold-bright">{newsPage.titleAccent}</span>
      </h1>

      {!result.ok ? (
        <p className="text-center text-ring-muted" role="alert">
          {result.message}
        </p>
      ) : result.posts.length === 0 ? (
        <p className="text-center text-ring-muted">{newsPage.empty}</p>
      ) : (
        <ul className="grid gap-8 md:grid-cols-2">
          {result.posts.map((post) => (
            <NewsPostCard key={post.id} post={post} />
          ))}
        </ul>
      )}
    </div>
  );
}

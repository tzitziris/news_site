import Link from "next/link";
import { notFound } from "next/navigation";
import { PostEditorForm } from "@/components/admin/post-editor-form";
import type { PostEditorInitial } from "@/components/admin/post-editor-form";
import { createClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditPostPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();

  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  const [{ data: imgs }, { data: vids }] = await Promise.all([
    supabase
      .from("post_images")
      .select("url")
      .eq("post_id", id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("post_videos")
      .select("url")
      .eq("post_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  const initial: PostEditorInitial = {
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    body: post.body,
    cover_image_url: post.cover_image_url,
    slug: post.slug,
    video_url: post.video_url,
    published: post.published,
    published_at: post.published_at,
    gallery_text: (imgs ?? []).map((r) => r.url).join("\n"),
    videos_text: (vids ?? []).map((r) => r.url).join("\n"),
  };

  const publicPath = post.slug?.trim()
    ? `/news/${post.slug.trim()}`
    : `/news/${post.id}`;

  return (
    <div>
      <h1 className="mb-2 text-xl font-extrabold uppercase tracking-wide text-ring-gold-bright">
        Επεξεργασία
      </h1>
      {sp.saved === "1" ? (
        <p className="mb-4 text-sm text-emerald-400/90">Αποθηκεύτηκε.</p>
      ) : null}
      <p className="mb-8 text-sm text-ring-muted">
        Δημόσια προβολή:{" "}
        <Link href={publicPath} className="text-ring-gold underline">
          {publicPath}
        </Link>{" "}
        (μόνο αν είναι δημοσιευμένο)
      </p>
      <PostEditorForm mode="edit" initial={initial} />
    </div>
  );
}

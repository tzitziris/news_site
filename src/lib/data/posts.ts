import { createClient } from "@/lib/supabase/server";
import { newsPage } from "@/lib/site";
import type { Post, PostDetail, PostImage, PostVideo } from "@/types/post";

export type PostsResult =
  | { ok: true; posts: Post[] }
  | { ok: false; posts: []; message: string };

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const LIST_SELECT = "id, title, excerpt, published_at, cover_image_url, slug";
const DETAIL_SELECT =
  "id, title, excerpt, published_at, cover_image_url, slug, body, video_url";

/**
 * Fetches published posts for public display. RLS on `posts` should allow
 * only rows the anon role may read (see migration policies).
 *
 * Requires migration `20260330120000_news_media.sql` (or older cover/slug migration).
 */
export async function getPublishedPosts(): Promise<PostsResult> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("posts")
    .select(LIST_SELECT)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("[posts] Supabase:", error.code, error.message);
    return {
      ok: false,
      posts: [],
      message: newsPage.loadError,
    };
  }

  return { ok: true, posts: (data ?? []) as Post[] };
}

/** Single published post by UUID or slug, with ordered gallery images and videos. */
export async function getPublishedPost(
  slugOrId: string,
): Promise<PostDetail | null> {
  const supabase = await createClient();
  const key = slugOrId.trim();
  if (!key) return null;

  const byId = UUID_RE.test(key);
  let q = supabase.from("posts").select(DETAIL_SELECT);
  q = byId ? q.eq("id", key) : q.eq("slug", key);
  const { data: row, error } = await q.maybeSingle();

  if (error) {
    console.error("[posts] getPublishedPost:", error.code, error.message);
    return null;
  }

  if (!row) return null;

  const base = row as Post & {
    body: string | null;
    video_url: string | null;
  };

  const [imgRes, vidRes] = await Promise.all([
    supabase
      .from("post_images")
      .select("id, url, sort_order")
      .eq("post_id", base.id)
      .order("sort_order", { ascending: true }),
    supabase
      .from("post_videos")
      .select("id, url, sort_order")
      .eq("post_id", base.id)
      .order("sort_order", { ascending: true }),
  ]);

  if (imgRes.error) {
    console.error("[posts] post_images:", imgRes.error.code, imgRes.error.message);
  }
  if (vidRes.error) {
    console.error("[posts] post_videos:", vidRes.error.code, vidRes.error.message);
  }

  const images = (imgRes.data ?? []) as PostImage[];
  const videos = (vidRes.data ?? []) as PostVideo[];

  return {
    ...base,
    body: base.body,
    video_url: base.video_url ?? null,
    images,
    videos,
  };
}

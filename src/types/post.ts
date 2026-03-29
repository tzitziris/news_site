/** Row shape for `public.posts` (see supabase/migrations). */
export type Post = {
  id: string;
  title: string;
  excerpt: string | null;
  published_at: string | null;
  cover_image_url: string | null;
  slug: string | null;
};

/** Gallery row: public image URL (e.g. Supabase Storage), ordered per post. */
export type PostImage = {
  id: string;
  url: string;
  sort_order: number;
};

/** Video row: YouTube watch / youtu.be / shorts URL, ordered per post. */
export type PostVideo = {
  id: string;
  url: string;
  sort_order: number;
};

export type PostDetail = Post & {
  body: string | null;
  /** @deprecated Prefer `post_videos`; still supported for older rows. */
  video_url: string | null;
  images: PostImage[];
  videos: PostVideo[];
};

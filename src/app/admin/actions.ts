"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { parseUrlLines, slugifyTitle } from "@/lib/slug";

export type ActionState = { error: string } | null;

function emptyToNull(v: FormDataEntryValue | null): string | null {
  const s = String(v ?? "").trim();
  return s || null;
}

function toIsoOrNull(raw: string): string | null {
  const t = raw.trim();
  if (!t) return null;
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export async function loginAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) {
    return { error: "Συμπληρώστε email και κωδικό." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Αποτυχία σύνδεσης." };
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    await supabase.auth.signOut();
    return {
      error: "Αυτός ο λογαριασμός δεν έχει δικαιώματα διαχειριστή.",
    };
  }

  redirect("/admin");
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const UPLOAD_MAX_BYTES = 5 * 1024 * 1024;
const UPLOAD_MIME = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

function extFromMime(mime: string): string {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  return "jpg";
}

export type UploadImageResult = { url: string } | { error: string };

/** Ανέβασμα εικόνας στο Storage bucket `post-media` (μόνο admins). */
export async function uploadPostImage(
  formData: FormData,
): Promise<UploadImageResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Χρειάζεται σύνδεση." };
  }

  const { data: adminRow } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!adminRow) {
    return { error: "Δεν έχετε δικαιώματα ανεβάσματος." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Δεν επιλέχθηκε αρχείο." };
  }

  if (file.size > UPLOAD_MAX_BYTES) {
    return { error: "Μέγιστο μέγεθος 5 MB." };
  }

  if (!UPLOAD_MIME.has(file.type)) {
    return {
      error: "Επιτρέπονται μόνο JPEG, PNG, WebP ή GIF.",
    };
  }

  const ext = extFromMime(file.type);
  const path = `${user.id.slice(0, 8)}/${Date.now()}-${crypto.randomUUID().slice(0, 10)}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error: upErr } = await supabase.storage
    .from("post-media")
    .upload(path, bytes, {
      contentType: file.type,
      upsert: false,
    });

  if (upErr) {
    return { error: upErr.message };
  }

  const { data: pub } = supabase.storage.from("post-media").getPublicUrl(path);
  return { url: pub.publicUrl };
}

async function syncGalleryAndVideos(
  supabase: Awaited<ReturnType<typeof createClient>>,
  postId: string,
  galleryUrls: string[],
  videoUrls: string[],
) {
  const { error: d1 } = await supabase
    .from("post_images")
    .delete()
    .eq("post_id", postId);
  if (d1) return d1.message;

  if (galleryUrls.length) {
    const { error: i1 } = await supabase.from("post_images").insert(
      galleryUrls.map((url, i) => ({
        post_id: postId,
        url,
        sort_order: i,
      })),
    );
    if (i1) return i1.message;
  }

  const { error: d2 } = await supabase
    .from("post_videos")
    .delete()
    .eq("post_id", postId);
  if (d2) return d2.message;

  if (videoUrls.length) {
    const { error: i2 } = await supabase.from("post_videos").insert(
      videoUrls.map((url, i) => ({
        post_id: postId,
        url,
        sort_order: i,
      })),
    );
    if (i2) return i2.message;
  }

  return null;
}

export async function createPost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { error: "Ο τίτλος είναι υποχρεωτικός." };
  }

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugifyTitle(slugInput || title, `post-${Date.now()}`);

  const published = formData.get("published") === "on";
  const publishedAtIso =
    toIsoOrNull(String(formData.get("published_at") ?? "")) ??
    (published ? new Date().toISOString() : null);

  const row = {
    title,
    excerpt: emptyToNull(formData.get("excerpt")),
    body: emptyToNull(formData.get("body")),
    cover_image_url: emptyToNull(formData.get("cover_image_url")),
    slug,
    video_url: emptyToNull(formData.get("video_url")),
    published,
    published_at: published ? publishedAtIso : null,
  };

  const { data: post, error } = await supabase
    .from("posts")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return { error: "Το slug υπάρχει ήδη — άλλαξέ το." };
    }
    return { error: error.message };
  }

  const gallery = parseUrlLines(String(formData.get("gallery_urls") ?? ""));
  const videos = parseUrlLines(String(formData.get("video_urls") ?? ""));

  const syncErr = await syncGalleryAndVideos(supabase, post.id, gallery, videos);
  if (syncErr) {
    await supabase.from("posts").delete().eq("id", post.id);
    return { error: syncErr };
  }

  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  redirect(`/admin/posts/${post.id}/edit?saved=1`);
}

export async function updatePost(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const { supabase } = await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: "Λείπει το id της δημοσίευσης." };
  }

  const title = String(formData.get("title") ?? "").trim();
  if (!title) {
    return { error: "Ο τίτλος είναι υποχρεωτικός." };
  }

  const slugInput = String(formData.get("slug") ?? "").trim();
  const slug = slugifyTitle(slugInput || title, id);

  const published = formData.get("published") === "on";
  const publishedAtIso =
    toIsoOrNull(String(formData.get("published_at") ?? "")) ??
    (published ? new Date().toISOString() : null);

  const { error } = await supabase
    .from("posts")
    .update({
      title,
      excerpt: emptyToNull(formData.get("excerpt")),
      body: emptyToNull(formData.get("body")),
      cover_image_url: emptyToNull(formData.get("cover_image_url")),
      slug,
      video_url: emptyToNull(formData.get("video_url")),
      published,
      published_at: published ? publishedAtIso : null,
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: "Το slug υπάρχει ήδη — άλλαξέ το." };
    }
    return { error: error.message };
  }

  const gallery = parseUrlLines(String(formData.get("gallery_urls") ?? ""));
  const videos = parseUrlLines(String(formData.get("video_urls") ?? ""));

  const syncErr = await syncGalleryAndVideos(supabase, id, gallery, videos);
  if (syncErr) {
    return { error: syncErr };
  }

  revalidatePath("/news");
  revalidatePath(`/news/${slug}`);
  redirect(`/admin/posts/${id}/edit?saved=1`);
}

export async function deletePost(formData: FormData) {
  const { supabase } = await requireAdmin();
  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    redirect("/admin?error=delete");
  }

  const { data: post } = await supabase
    .from("posts")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) {
    redirect("/admin?error=delete");
  }

  revalidatePath("/news");
  if (post?.slug) {
    revalidatePath(`/news/${post.slug}`);
  }
  redirect("/admin");
}

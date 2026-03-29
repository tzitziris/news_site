"use client";

import { forwardRef, useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import {
  createPost,
  updatePost,
  type ActionState,
} from "@/app/admin/actions";
import { AdminImageUpload } from "@/components/admin/admin-image-upload";

export type PostEditorInitial = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_image_url: string | null;
  slug: string | null;
  video_url: string | null;
  published: boolean;
  published_at: string | null;
  gallery_text: string;
  videos_text: string;
};

function toDatetimeLocal(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-xs font-bold uppercase text-ring-muted">
      {children}
    </label>
  );
}

const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input(props, ref) {
  return (
    <input
      ref={ref}
      {...props}
      className="mt-1 w-full border border-ring-gold/40 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-ring-gold disabled:opacity-50"
    />
  );
});

const TextArea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function TextArea(props, ref) {
  return (
    <textarea
      ref={ref}
      {...props}
      className="mt-1 w-full border border-ring-gold/40 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-ring-gold"
    />
  );
});

function SubmitRow({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-ring-gold px-8 py-3 text-sm font-bold uppercase text-black disabled:opacity-50"
    >
      {pending ? "Αποθήκευση…" : label}
    </button>
  );
}

export function PostEditorForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: PostEditorInitial;
}) {
  const action = mode === "create" ? createPost : updatePost;
  const [state, formAction] = useActionState(action, null as ActionState);
  const coverUrlRef = useRef<HTMLInputElement>(null);
  const galleryUrlsRef = useRef<HTMLTextAreaElement>(null);

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      {state?.error ? (
        <p className="rounded border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}

      {mode === "edit" && initial ? (
        <input type="hidden" name="id" value={initial.id} />
      ) : null}

      <div>
        <FieldLabel>Τίτλος *</FieldLabel>
        <Input
          name="title"
          required
          defaultValue={initial?.title ?? ""}
        />
      </div>

      <div>
        <FieldLabel>Slug (URL)</FieldLabel>
        <Input
          name="slug"
          placeholder="Αφήστε κενό για αυτόματο από τίτλο"
          defaultValue={initial?.slug ?? ""}
        />
        <p className="mt-1 text-xs text-ring-muted">
          Εμφανίζεται στο /news/το-slug-σας
        </p>
      </div>

      <div>
        <FieldLabel>Εισαγωγή (excerpt)</FieldLabel>
        <TextArea
          name="excerpt"
          rows={3}
          defaultValue={initial?.excerpt ?? ""}
        />
      </div>

      <div>
        <FieldLabel>Κυρίως κείμενο</FieldLabel>
        <TextArea
          name="body"
          rows={14}
          defaultValue={initial?.body ?? ""}
        />
      </div>

      <div>
        <FieldLabel>URL εξώφυλλου (εικόνα)</FieldLabel>
        <Input
          ref={coverUrlRef}
          name="cover_image_url"
          type="url"
          placeholder="https://..."
          defaultValue={initial?.cover_image_url ?? ""}
        />
        <AdminImageUpload target="cover" fileInputRef={coverUrlRef} />
      </div>

      <div>
        <FieldLabel>Ένα βίντεο (legacy YouTube URL)</FieldLabel>
        <Input
          name="video_url"
          type="url"
          placeholder="https://www.youtube.com/watch?v=..."
          defaultValue={initial?.video_url ?? ""}
        />
        <p className="mt-1 text-xs text-ring-muted">
          Για πολλά βίντεο χρησιμοποιήστε τη λίστα παρακάτω.
        </p>
      </div>

      <div>
        <FieldLabel>Επιπλέον εικόνες (μία URL ανά γραμμή)</FieldLabel>
        <TextArea
          ref={galleryUrlsRef}
          name="gallery_urls"
          rows={5}
          placeholder="https://...&#10;https://..."
          defaultValue={initial?.gallery_text ?? ""}
        />
        <AdminImageUpload
          target="gallery"
          galleryTextareaRef={galleryUrlsRef}
        />
      </div>

      <div>
        <FieldLabel>Βίντεο YouTube (μία URL ανά γραμμή)</FieldLabel>
        <TextArea
          name="video_urls"
          rows={4}
          placeholder="https://www.youtube.com/watch?v=...&#10;https://youtu.be/..."
          defaultValue={initial?.videos_text ?? ""}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-ring-gold/20 pt-6">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial?.published ?? false}
            className="h-4 w-4 accent-ring-gold"
          />
          Δημοσιευμένο (εμφανίζεται στο /news)
        </label>
      </div>

      <div>
        <FieldLabel>Ημερομηνία δημοσίευσης</FieldLabel>
        <Input
          type="datetime-local"
          name="published_at"
          defaultValue={toDatetimeLocal(initial?.published_at ?? null)}
        />
        <p className="mt-1 text-xs text-ring-muted">
          Αν είναι κενό και το άρθρο είναι δημοσιευμένο, ορίζεται τώρα.
        </p>
      </div>

      <div className="pt-4">
        <SubmitRow
          label={mode === "create" ? "Δημιουργία" : "Αποθήκευση"}
        />
      </div>
    </form>
  );
}

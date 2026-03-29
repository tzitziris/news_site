"use client";

import { useRef, useState } from "react";
import { uploadPostImage } from "@/app/admin/actions";

type Target = "cover" | "gallery";

export function AdminImageUpload({
  target,
  fileInputRef,
  galleryTextareaRef,
}: {
  target: Target;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
  galleryTextareaRef?: React.RefObject<HTMLTextAreaElement | null>;
}) {
  const pickRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;

    setBusy(true);
    setMsg(null);
    const fd = new FormData();
    fd.append("file", f);
    const r = await uploadPostImage(fd);
    setBusy(false);

    if ("error" in r) {
      setMsg({ kind: "err", text: r.error });
      return;
    }

    if (target === "cover" && fileInputRef?.current) {
      fileInputRef.current.value = r.url;
      setMsg({
        kind: "ok",
        text: "Η εικόνα ανέβηκε· το URL μπήκε στο εξώφυλλο. Αποθήκευσε το άρθρο.",
      });
    } else if (
      target === "gallery" &&
      galleryTextareaRef?.current
    ) {
      const ta = galleryTextareaRef.current;
      ta.value = ta.value.trim() ? `${ta.value.trim()}\n${r.url}` : r.url;
      setMsg({
        kind: "ok",
        text: "Η εικόνα προστέθηκε στη λίστα. Αποθήκευσε το άρθρο.",
      });
    }
  }

  const label =
    target === "cover"
      ? "Ανέβασμα εξώφυλλου από συσκευή"
      : "Ανέβασμα εικόνας στη gallery";

  return (
    <div className="mt-2 space-y-1">
      <input
        ref={pickRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={onFile}
      />
      <button
        type="button"
        disabled={busy}
        onClick={() => pickRef.current?.click()}
        className="rounded-full border border-ring-gold/60 px-4 py-1.5 text-xs font-bold uppercase text-ring-gold hover:bg-ring-gold/10 disabled:opacity-50"
      >
        {busy ? "Ανέβασμα…" : label}
      </button>
      <p className="text-xs text-ring-muted">
        Από κινητό: ανοίγει συλλογή φωτογραφιών ή κάμερα (ανάλογα τη συσκευή).
        Μέχρι 5 MB · JPEG, PNG, WebP, GIF.
      </p>
      {msg ? (
        <p
          className={
            msg.kind === "err"
              ? "text-xs text-red-300"
              : "text-xs text-emerald-400/90"
          }
          role="status"
        >
          {msg.text}
        </p>
      ) : null}
    </div>
  );
}

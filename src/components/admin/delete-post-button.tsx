"use client";

import { deletePost } from "@/app/admin/actions";

export function DeletePostButton({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <form
      action={deletePost}
      onSubmit={(e) => {
        if (
          !confirm(
            `Διαγραφή της δημοσίευσης «${title}»; Δεν αναιρείται.`,
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-full border border-red-500/60 px-4 py-1.5 text-xs font-bold uppercase text-red-300 hover:bg-red-950/50"
      >
        Διαγραφή
      </button>
    </form>
  );
}

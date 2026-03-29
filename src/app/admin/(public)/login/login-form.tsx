"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type ActionState } from "@/app/admin/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-ring-gold py-3 text-sm font-bold uppercase text-black disabled:opacity-50"
    >
      {pending ? "Σύνδεση…" : "Σύνδεση"}
    </button>
  );
}

export function LoginForm({ forbidden }: { forbidden: boolean }) {
  const [state, formAction] = useActionState(loginAction, null as ActionState);

  return (
    <form action={formAction} className="space-y-4">
      {forbidden ? (
        <p className="rounded border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          Ο λογαριασμός συνδέθηκε αλλά δεν είναι διαχειριστής. Ζητήστε προσθήκη
          στον πίνακα admin_users ή χρησιμοποιήστε άλλο email.
        </p>
      ) : null}
      {state?.error ? (
        <p className="rounded border border-red-500/50 bg-red-950/40 px-3 py-2 text-sm text-red-200">
          {state.error}
        </p>
      ) : null}
      <div>
        <label className="block text-xs font-bold uppercase text-ring-muted">
          Email
        </label>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full border border-ring-gold/40 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-ring-gold"
        />
      </div>
      <div>
        <label className="block text-xs font-bold uppercase text-ring-muted">
          Κωδικός
        </label>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full border border-ring-gold/40 bg-zinc-950 px-3 py-2 text-white outline-none focus:border-ring-gold"
        />
      </div>
      <SubmitButton />
    </form>
  );
}

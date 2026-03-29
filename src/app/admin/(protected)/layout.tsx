import Link from "next/link";
import { signOutAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ring-gold/30 pb-4">
        <nav className="flex flex-wrap gap-6 text-sm font-bold uppercase tracking-wide">
          <Link
            href="/admin"
            className="text-ring-gold hover:text-ring-gold-bright"
          >
            Λίστα
          </Link>
          <Link
            href="/admin/posts/new"
            className="text-ring-gold hover:text-ring-gold-bright"
          >
            Νέα δημοσίευση
          </Link>
        </nav>
        <form action={signOutAction}>
          <button
            type="submit"
            className="text-xs font-bold uppercase tracking-wide text-ring-muted hover:text-white"
          >
            Έξοδος
          </button>
        </form>
      </div>
      {children}
    </div>
  );
}

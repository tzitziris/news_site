import { siteName } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-ring-gold/40 bg-ring-black py-10 text-center text-sm text-ring-muted">
      <p className="font-semibold uppercase tracking-wide text-ring-white">
        © {year} {siteName}
      </p>
      <p className="mt-2 text-xs">Όλα τα δικαιώματα διατηρούνται.</p>
    </footer>
  );
}

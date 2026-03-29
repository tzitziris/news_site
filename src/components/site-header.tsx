import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { siteName } from "@/lib/site";

export function SiteHeader() {
  return (
    <header
      className="border-b-2 border-ring-black bg-ring-gold"
      style={{
        backgroundImage: `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 3px,
          rgba(0, 0, 0, 0.04) 3px,
          rgba(0, 0, 0, 0.04) 6px
        )`,
      }}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-4 sm:flex-row sm:justify-between sm:gap-6">
        <p className="shrink-0 text-center sm:text-left">
          <Link
            href="/"
            className="text-lg font-black uppercase tracking-tight text-ring-black sm:text-xl"
          >
            {siteName}
          </Link>
        </p>
        <SiteNav />
      </div>
    </header>
  );
}

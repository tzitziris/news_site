"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLabels } from "@/lib/site";

const items = [
  { href: "/", label: navLabels.home },
  { href: "/about", label: navLabels.about },
  { href: "/contact", label: navLabels.contact },
  { href: "/news", label: navLabels.news },
] as const;

function linkActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Κύρια πλοήγηση">
      <ul className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
        {items.map(({ href, label }) => {
          const active = linkActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                className={`inline-block px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-ring-black transition-colors sm:text-sm ${
                  active
                    ? "rounded-full border-2 border-ring-black"
                    : "rounded-full border-2 border-transparent hover:opacity-80"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

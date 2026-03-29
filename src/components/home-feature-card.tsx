import Link from "next/link";

type Props = {
  href: string;
  label: string;
  title: string;
};

export function HomeFeatureCard({ href, label, title }: Props) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-[10rem] flex-col items-center justify-center border border-ring-gold/90 bg-ring-black px-6 py-8 text-center transition-colors hover:border-ring-gold-bright"
      >
        <span className="text-xs font-semibold uppercase tracking-widest text-ring-white/80">
          {label}
        </span>
        <span className="mt-3 text-lg font-extrabold uppercase tracking-wide text-ring-gold-bright sm:text-xl">
          {title}
        </span>
      </Link>
    </li>
  );
}

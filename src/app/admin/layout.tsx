import Link from "next/link";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="border-b border-ring-gold/40 bg-zinc-950 py-2 text-center text-sm">
        <Link
          href="/"
          className="text-ring-gold hover:text-ring-gold-bright hover:underline"
        >
          ← Επιστροφή στο δημόσιο site
        </Link>
      </div>
      <div className="min-h-[70vh] bg-black text-white">{children}</div>
    </>
  );
}

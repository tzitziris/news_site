import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DeletePostButton } from "@/components/admin/delete-post-button";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminDashboardPage({ searchParams }: Props) {
  const supabase = await createClient();
  const sp = await searchParams;

  const { data: posts, error } = await supabase
    .from("posts")
    .select("id, title, slug, published, published_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-red-300">
        Σφάλμα φόρτωσης: {error.message}
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-extrabold uppercase tracking-wide text-ring-gold-bright">
        Δημοσιεύσεις
      </h1>
      {sp.error === "delete" ? (
        <p className="mt-2 text-sm text-red-300">Η διαγραφή απέτυχε.</p>
      ) : null}
      <p className="mt-2 text-sm text-ring-muted">
        Ό,τι δεν είναι «Δημοσιευμένο» μένει εκτός δημόσιου /news.
      </p>

      <ul className="mt-8 divide-y divide-ring-gold/20 border border-ring-gold/30">
        {(posts ?? []).length === 0 ? (
          <li className="px-4 py-8 text-center text-ring-muted">
            Καμία δημοσίευση.{" "}
            <Link href="/admin/posts/new" className="text-ring-gold underline">
              Δημιουργία
            </Link>
          </li>
        ) : (
          (posts ?? []).map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-white">{p.title}</p>
                <p className="text-xs text-ring-muted">
                  {p.published ? (
                    <span className="text-emerald-400/90">Δημοσιευμένο</span>
                  ) : (
                    <span className="text-amber-400/90">Πρόχειρο</span>
                  )}
                  {p.slug ? (
                    <>
                      {" · "}
                      <span className="font-mono">/{p.slug}</span>
                    </>
                  ) : null}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="rounded-full border border-ring-gold px-4 py-1.5 text-xs font-bold uppercase text-ring-gold hover:bg-ring-gold/10"
                >
                  Επεξεργασία
                </Link>
                <DeletePostButton id={p.id} title={p.title} />
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

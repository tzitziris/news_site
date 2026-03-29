import { LoginForm } from "./login-form";

type Props = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const { error } = await searchParams;
  const forbidden = error === "forbidden";

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16">
      <div>
        <h1 className="text-2xl font-extrabold uppercase tracking-wide text-ring-gold-bright">
          Σύνδεση διαχειριστή
        </h1>
        <p className="mt-2 text-sm text-ring-muted">
          Χρησιμοποιήστε το email και τον κωδικό του λογαριασμού Supabase που
          έχει προστεθεί στον πίνακα <code className="text-ring-gold">admin_users</code>.
        </p>
      </div>
      <LoginForm forbidden={forbidden} />
    </div>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Επικοινωνία",
  description: "Στοιχεία επικοινωνίας με το γυμναστήριο.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="border-b border-ring-gold/40 pb-4 text-3xl font-extrabold uppercase tracking-wide text-ring-gold-bright md:text-4xl">
        Επικοινωνία
      </h1>
      <p className="mt-8 text-ring-white/90">
        Συμπληρώστε διεύθυνση, email και τηλέφωνο. Μπορείτε να χρησιμοποιήσετε
        συνδέσμους{" "}
        <code className="text-ring-gold">mailto:</code> και{" "}
        <code className="text-ring-gold">tel:</code>.
      </p>
      <address className="mt-8 space-y-3 not-italic text-ring-white/90">
        <p>
          <span className="font-bold uppercase tracking-wide text-ring-gold">
            Email:
          </span>{" "}
          <a
            className="underline decoration-ring-gold/50 hover:text-ring-gold-bright"
            href="mailto:info@example.com"
          >
            info@example.com
          </a>
        </p>
        <p>
          <span className="font-bold uppercase tracking-wide text-ring-gold">
            Τηλέφωνο:
          </span>{" "}
          <a
            className="underline decoration-ring-gold/50 hover:text-ring-gold-bright"
            href="tel:+302100000000"
          >
            +30 210 000 0000
          </a>
        </p>
        <p>
          <span className="font-bold uppercase tracking-wide text-ring-gold">
            Διεύθυνση:
          </span>{" "}
          Οδός, πόλη, ΤΚ
        </p>
      </address>
    </div>
  );
}

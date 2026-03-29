import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Σχετικά",
  description: "Η ιστορία και η φιλοσοφία του γυμναστηρίου.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:py-16">
      <h1 className="border-b border-ring-gold/40 pb-4 text-3xl font-extrabold uppercase tracking-wide text-ring-gold-bright md:text-4xl">
        Σχετικά με εμάς
      </h1>
      <div className="mt-8 space-y-4 leading-relaxed text-ring-white/90">
        <p>
          Εδώ μπορείτε να περιγράψετε την ιστορία του γυμναστηρίου, την
          εμπειρία των προπονητών και τον τρόπο προπόνησης (μποξ, pad work,
          φυσική κατάσταση κ.λπ.).
        </p>
        <p className="text-ring-muted text-sm">
          Αντικαταστήστε αυτές τις παραγράφους με το πραγματικό σας κείμενο.
        </p>
      </div>
    </div>
  );
}

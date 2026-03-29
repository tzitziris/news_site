import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HomeFeatureCard } from "@/components/home-feature-card";
import { homeHero, siteDescription, siteName } from "@/lib/site";

export const metadata: Metadata = {
  title: "Αρχική",
  description: siteDescription,
};

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1599058945522-682d55b544b6?auto=format&fit=crop&w=1920&q=80";

export default function HomePage() {
  return (
    <>
      <section className="relative flex min-h-[min(70vh,36rem)] items-center justify-center overflow-hidden px-4 py-20 text-center">
        <Image
          src={HERO_IMAGE}
          alt="Εσωτερικό χώρος γυμναστηρίου με σάκο και ρινγκ"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-ring-black/65"
          aria-hidden
        />
        <div className="relative z-10 max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-ring-white sm:text-base">
            {homeHero.kicker}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold uppercase leading-tight tracking-tight text-ring-gold-bright sm:text-5xl md:text-6xl">
            {siteName}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-ring-white/90 sm:text-base">
            {siteDescription}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              className="inline-flex min-w-[14rem] items-center justify-center rounded-full bg-ring-gold px-8 py-3 text-sm font-bold uppercase tracking-wide text-ring-black transition-colors hover:bg-ring-gold-bright"
            >
              {homeHero.primaryCta}
            </Link>
            <Link
              href="/about"
              className="inline-flex min-w-[14rem] items-center justify-center rounded-full border-2 border-ring-gold px-8 py-3 text-sm font-bold uppercase tracking-wide text-ring-white transition-colors hover:border-ring-gold-bright hover:text-ring-gold-bright"
            >
              {homeHero.secondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="sr-only">Ενότητες</h2>
        <ul className="grid gap-6 md:grid-cols-3">
          <HomeFeatureCard
            href="/about"
            label="Γυμναστήριο"
            title="Προπόνηση"
          />
          <HomeFeatureCard
            href="/contact"
            label="Επικοινωνία"
            title="Ραντεβού"
          />
          <HomeFeatureCard
            href="/news"
            label="Ενημέρωση"
            title="Νέα & Blog"
          />
        </ul>
      </section>
    </>
  );
}

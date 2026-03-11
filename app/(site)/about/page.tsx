import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Learn how ${SITE_NAME} creates and publishes daily market trend analysis.`,
  keywords: ["about codeprompt blog", "developer publication", "market intelligence platform", "AI editorial workflow"],
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-6 pb-8">
      <section className="surface animate-fade-up p-5 sm:p-7 md:p-10">
        <p className="accent-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">About CodePrompt Blog</p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
          A publication built for fast-moving markets
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-[15px] md:text-lg">{SITE_DESCRIPTION}</p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="surface interactive-card animate-fade-up delay-1 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-white">Editorial Workflow</h2>
          <ol className="mt-4 space-y-3 text-sm leading-7 text-[var(--muted)]">
            <li>1. Track real-time trend signals from market feeds.</li>
            <li>2. Select non-redundant, high-interest topics.</li>
            <li>3. Generate structured long-form blog drafts.</li>
            <li>4. Publish directly to the website and blog archive.</li>
          </ol>
        </article>

        <article className="surface interactive-card animate-fade-up delay-2 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-white">What makes us different</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-[var(--muted)]">
            <li>Three fresh market-focused posts every day</li>
            <li>SEO-first architecture with clean metadata and schema</li>
            <li>Archive-ready URL structure and RSS support</li>
            <li>Transparent contact channels for updates and corrections</li>
          </ul>
        </article>
      </section>
    </div>
  );
}

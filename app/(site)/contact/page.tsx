import type { Metadata } from "next";
import { CONTACT_EMAILS, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${SITE_NAME} editorial team for collaboration, corrections, and story ideas.`,
  keywords: ["contact codeprompt blog", "editorial contact", "info@codeprompt.in", "contact@codeprompt.in"],
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="space-y-6 pb-8">
      <section className="surface animate-fade-up p-5 sm:p-7 md:p-10">
        <p className="accent-chip inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">Contact</p>
        <h1 className="mt-4 font-display text-3xl font-semibold leading-tight text-white sm:text-4xl md:text-5xl">
          Reach the CodePrompt Blog team
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-[15px] md:text-lg">
          For editorial suggestions, corrections, media requests, and partnerships, contact us by email.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="surface interactive-card animate-fade-up delay-1 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-white">Editorial Inbox</h2>
          <div className="mt-4 space-y-3 text-sm">
            {CONTACT_EMAILS.map((email) => (
              <a
                key={email}
                href={`mailto:${email}`}
                className="block rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-[var(--accent)] hover:text-[#67e8f9]"
              >
                {email}
              </a>
            ))}
          </div>
        </article>

        <article className="surface interactive-card animate-fade-up delay-2 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold text-white">What to include</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-[var(--muted)]">
            <li>Topic or article URL</li>
            <li>Reason for contact (feedback, correction, request)</li>
            <li>Any supporting references or context</li>
          </ul>
        </article>
      </section>
    </div>
  );
}

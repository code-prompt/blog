import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAILS } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 pb-10 pt-12">
      <div className="page-shell grid gap-8 text-center md:grid-cols-3 md:items-start md:text-left">
        <div className="animate-fade-up">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg border border-[#29406a] bg-[#0c1630]">
              <Image src="/logo.png" alt="CodePrompt Blog logo" width={28} height={28} className="object-contain" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--muted)] md:tracking-[0.4em]">CodePrompt Blog</span>
          </Link>
          <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[var(--muted)] md:mx-0">
            A developer-style intelligence feed for markets, startups, and AI-driven business changes.
          </p>
        </div>

        <div className="animate-fade-up delay-1">
          <h2 className="text-sm font-semibold text-white">Quick Links</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            <li>
              <Link href="/blogs" className="hover:text-white">
                All Blogs
              </Link>
            </li>
            <li>
              <Link href="/system-design" className="hover:text-white">
                System Design
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <a href="/feed.xml" className="hover:text-white">
                RSS Feed
              </a>
            </li>
          </ul>
        </div>

        <div className="animate-fade-up delay-2">
          <h2 className="text-sm font-semibold text-white">Contact</h2>
          <ul className="mt-3 space-y-2 text-sm text-[var(--muted)]">
            {CONTACT_EMAILS.map((email) => (
              <li key={email}>
                <a href={`mailto:${email}`} className="hover:text-[var(--accent)]">
                  {email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="page-shell mt-8 border-t border-white/10 pt-5">
        <p className="text-center text-[10px] uppercase tracking-[0.2em] text-[#4a5f86] md:text-left">© 2026 CodePrompt Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}

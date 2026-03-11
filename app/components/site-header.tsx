"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blogs", label: "Blogs" },
  { href: "/system-design", label: "System Design" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-50">
      <div className="page-shell">
        <div className="flex h-18 items-center justify-between gap-3 sm:h-20">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <Link href="/" className="flex min-w-0 items-center gap-3">
              <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#29406a] bg-[#0c1630]">
                <Image src="/logo.png" alt="CodePrompt Blog logo" width={32} height={32} className="object-contain" priority />
              </span>
              <p className="truncate font-display text-base font-semibold tracking-tight text-white sm:text-lg">
                CodePrompt <span className="text-[var(--accent)]">Blog</span>
              </p>
            </Link>

            <nav className="hidden items-center gap-7 md:flex" aria-label="Primary">
              {navLinks.map((item) => {
                const active = isActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm transition ${
                      active ? "text-white" : "text-[var(--muted)] hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <Link
            href="/blogs"
            className="rounded-lg bg-[var(--accent)] px-3 py-2 text-xs font-semibold text-[#02121f] shadow-[0_12px_30px_-12px_rgba(34,211,238,0.75)] transition hover:brightness-110 sm:px-4 sm:text-sm"
          >
            <span className="sm:hidden">Latest</span>
            <span className="hidden sm:inline">Latest Posts</span>
          </Link>
        </div>
      </div>

      <div className="border-t border-white/5 md:hidden">
        <div
          className="page-shell flex h-12 snap-x snap-mandatory items-center gap-4 overflow-x-auto text-sm text-[var(--muted)]"
          aria-label="Mobile Navigation"
        >
          {navLinks.map((item) => {
            const active = isActive(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`snap-start whitespace-nowrap rounded-md px-2.5 py-1.5 transition ${
                  active ? "bg-white/10 text-white" : "hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

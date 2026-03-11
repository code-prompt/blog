import type { ReactNode } from "react";
import { SiteFooter } from "@/app/components/site-footer";
import { SiteHeader } from "@/app/components/site-header";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="page-shell pb-14 pt-24 sm:pb-16 sm:pt-28 md:pt-32">{children}</main>
      <SiteFooter />
    </div>
  );
}

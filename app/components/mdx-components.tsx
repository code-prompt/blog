import type { ComponentPropsWithoutRef, ReactNode } from "react";

function Callout({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-[rgba(34,211,238,0.4)] bg-[var(--accent-soft)] px-4 py-3 text-[15px] leading-7 text-[#cffafe]">
      {children}
    </div>
  );
}

export const mdxComponents = {
  h2: (props: ComponentPropsWithoutRef<"h2">) => (
    <h2 className="mt-10 font-display text-2xl font-semibold text-white md:text-3xl" {...props} />
  ),
  h3: (props: ComponentPropsWithoutRef<"h3">) => (
    <h3 className="mt-8 font-display text-xl font-semibold text-white" {...props} />
  ),
  p: (props: ComponentPropsWithoutRef<"p">) => (
    <p className="mt-4 text-[15px] leading-8 text-[var(--muted)] md:text-base" {...props} />
  ),
  ul: (props: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-8 text-[var(--muted)]" {...props} />
  ),
  ol: (props: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] leading-8 text-[var(--muted)]" {...props} />
  ),
  li: (props: ComponentPropsWithoutRef<"li">) => <li className="pl-1" {...props} />,
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a className="text-[var(--accent)] underline decoration-[rgba(34,211,238,0.45)] underline-offset-4 hover:text-[#67e8f9]" {...props} />
  ),
  blockquote: (props: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-6 border-l-2 border-[var(--accent)] pl-4 text-[15px] italic leading-8 text-[#cffafe]" {...props} />
  ),
  code: (props: ComponentPropsWithoutRef<"code">) => (
    <code className="rounded bg-[#0b1830] px-1.5 py-0.5 text-[13px] text-[#93c5fd]" {...props} />
  ),
  pre: (props: ComponentPropsWithoutRef<"pre">) => (
    <pre className="my-6 overflow-x-auto rounded-xl border border-[#284470] bg-[#060f21] p-4 text-[13px] text-[#93c5fd]" {...props} />
  ),
  table: (props: ComponentPropsWithoutRef<"table">) => (
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse overflow-hidden rounded-lg border border-[#29406a] text-left text-sm text-[var(--muted)]" {...props} />
    </div>
  ),
  th: (props: ComponentPropsWithoutRef<"th">) => <th className="bg-[#0c1730] px-3 py-2 font-semibold text-white" {...props} />,
  td: (props: ComponentPropsWithoutRef<"td">) => <td className="border-t border-[#29406a] px-3 py-2" {...props} />,
  Callout,
};

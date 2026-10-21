import type { ReactNode } from "react";
import Reveal from "../Reveal";

type Props = { index: number; title: string; children: ReactNode };

/** A numbered case-study chapter: sticky label on the left, content on the right. */
export default function CaseSection({ index, title, children }: Props) {
  const id = title.toLowerCase().replace(/[^a-z]+/g, "-");
  return (
    <section aria-labelledby={id} className="grid gap-6 border-t border-line py-16 md:py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
      <div>
        <div className="lg:sticky lg:top-32">
          <p className="font-label text-xs text-ink-2">{String(index).padStart(2, "0")}</p>
          <h2 id={id} className="mt-2 text-2xl font-medium tracking-[-0.03em] md:text-3xl">
            {title}
          </h2>
        </div>
      </div>
      <Reveal>{children}</Reveal>
    </section>
  );
}

/** Visible, honest stand-in for content that hasn't been written yet. */
export function Placeholder({ field }: { field: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/20 bg-paper-2 p-6 md:p-8">
      <p className="font-label text-[11px] uppercase tracking-[0.16em] text-ink-2">Placeholder</p>
      <p className="mt-2 text-ink-2">
        Add this in <code className="font-mono text-sm text-ink">data/projects.ts</code> →{" "}
        <code className="font-mono text-sm text-ink">caseStudy.{field}</code>
      </p>
    </div>
  );
}

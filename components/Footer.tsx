import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer data-header="dark" className="bg-night px-gutter text-sm text-white/55">
      <div className="mx-auto flex max-w-[1680px] flex-col gap-4 border-t border-white/15 py-8 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="text-white">{site.name}</span> — {site.role}
        </p>
        <p>© {new Date().getFullYear()}</p>
        <a href="#main" className="link-underline inline-flex items-center gap-2 self-start text-white/80 sm:self-auto">
          Back to top <ArrowUp className="size-3.5" aria-hidden />
        </a>
      </div>
    </footer>
  );
}

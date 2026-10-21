"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { navigation, site } from "@/data/site";
import { ScrollTrigger } from "@/lib/gsap";

const EASE = [0.76, 0, 0.24, 1] as const;
const ORIGIN = "at calc(100% - var(--gutter) - 1.75rem) 3.25rem";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const button = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Deep links like /#work: the browser jumps to the anchor before the pinned sections add
  // their scroll space, landing in the wrong place. Jump again after the first layout pass.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    const jump = () => {
      ScrollTrigger.removeEventListener("refresh", jump);
      const el = document.getElementById(id);
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "auto" });
    };
    ScrollTrigger.addEventListener("refresh", jump);
    ScrollTrigger.refresh();
    return () => ScrollTrigger.removeEventListener("refresh", jump);
  }, [pathname]);

  // Switch the header to light text while it sits over a dark section
  useEffect(() => {
    const probe = 48; // vertical centre of the header
    const update = () => {
      const dark = [...document.querySelectorAll<HTMLElement>("[data-header='dark']")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      setOnDark(dark);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [pathname]);

  // Lock scroll, trap focus and support Escape while the menu is open
  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("a")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key !== "Tab" || !panel.current || !button.current) return;
      const items = [button.current, ...panel.current.querySelectorAll<HTMLElement>("a")];
      const i = items.indexOf(document.activeElement as HTMLElement);
      const next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next].focus();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const goTo = (id: string) => (e: MouseEvent<HTMLAnchorElement>) => {
    setOpen(false);
    if (pathname !== "/") return; // let Next navigate to "/#id"
    e.preventDefault();
    // wait a frame so the scroll lock is released before scrolling
    requestAnimationFrame(() => {
      const target = id === "home" ? 0 : document.getElementById(id)?.getBoundingClientRect().top;
      if (target === undefined) return;
      window.scrollTo({ top: id === "home" ? 0 : window.scrollY + target, behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id === "home" ? "/" : `#${id}`);
    });
  };

  return (
    <>
      <header className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-gutter py-5 transition-colors duration-500 ${
          open || onDark ? "text-white" : "text-ink"
        }`}>
        <Link
          href="/"
          onClick={goTo("home")}
          className="pointer-events-auto font-display text-xl font-semibold tracking-[-0.02em]"
          aria-label={`${site.name} — home`}
        >
          {site.shortName}
          <span className="font-normal opacity-60">©</span>
        </Link>

        <button
          ref={button}
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="pointer-events-auto relative grid size-14 place-items-center rounded-full border border-current transition-transform duration-500 ease-out-expo hover:scale-105"
        >
          <span className="relative block h-3 w-5" aria-hidden>
            <motion.span
              className="absolute left-0 top-0 h-[1.5px] w-full bg-current"
              animate={open ? { top: "50%", rotate: 45 } : { top: "0%", rotate: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
            <motion.span
              className="absolute bottom-0 left-0 h-[1.5px] w-full bg-current"
              animate={open ? { bottom: "calc(50% - 1.5px)", rotate: -45 } : { bottom: "0%", rotate: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
            />
          </span>
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className="fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-night bg-morpheus px-gutter pb-10 pt-32 text-white"
            initial={{ clipPath: `circle(0% ${ORIGIN})` }}
            animate={{ clipPath: `circle(150% ${ORIGIN})` }}
            exit={{ clipPath: `circle(0% ${ORIGIN})` }}
            transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
          >
            <nav aria-label="Primary">
              <ul>
                {navigation.map((item, i) => (
                  <li key={item.id} className="overflow-hidden border-b border-white/10">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "100%" }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.25 + i * 0.06 }}
                    >
                      <Link
                        href={item.id === "home" ? "/" : `/#${item.id}`}
                        onClick={goTo(item.id)}
                        className="group flex items-baseline gap-5 py-3 md:gap-8 md:py-4"
                      >
                        <span className="w-8 font-label text-xs text-white/40">{String(i + 1).padStart(2, "0")}</span>
                        <span className="font-display text-[clamp(2.25rem,6.5vw,6rem)] font-medium leading-none tracking-[-0.045em] transition-transform duration-700 ease-out-expo group-hover:translate-x-4 group-focus-visible:translate-x-4">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="mt-12 flex flex-col gap-2 font-label text-[11px] uppercase tracking-[0.16em] text-white/50 sm:flex-row sm:justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <span>{site.name} — {site.role}</span>
              <span>Design · Engineering · Innovation</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

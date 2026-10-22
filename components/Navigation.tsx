"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState, type MouseEvent, type Ref } from "react";
import { navigation, site } from "@/data/site";
import { ScrollTrigger } from "@/lib/gsap";

const EASE = [0.76, 0, 0.24, 1] as const;
// The menu opens as a circle from whichever button was used: top-right, or the floating pill
const ORIGIN_TOP = "at calc(100% - var(--gutter) - 1.75rem) 3.25rem";
const ORIGIN_PILL = "at 50% calc(100% - 3rem)";

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const [onDark, setOnDark] = useState(false);
  // From Selected Work down (or on pages without it) the logo and menu move into a floating pill
  const [docked, setDocked] = useState(false);
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const topButton = useRef<HTMLButtonElement>(null);
  const pillButton = useRef<HTMLButtonElement>(null);
  const activeButton = () => (docked ? pillButton : topButton).current;
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

  // Switch the header to light text while it sits over a dark section, and dock the
  // navigation into the bottom pill once Selected Work reaches the middle of the screen
  useEffect(() => {
    const probe = 48; // vertical centre of the header
    const update = () => {
      const dark = [...document.querySelectorAll<HTMLElement>("[data-header='dark']")].some((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= probe && r.bottom >= probe;
      });
      setOnDark(dark);
      const work = document.getElementById("work");
      const workBox = work?.parentElement?.classList.contains("pin-spacer") ? work.parentElement : work;
      setDocked(!workBox || workBox.getBoundingClientRect().top < window.innerHeight * 0.5);
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
      const button = activeButton();
      if (e.key === "Escape") {
        setOpen(false);
        button?.focus();
      }
      if (e.key !== "Tab" || !panel.current || !button) return;
      const items = [button, ...panel.current.querySelectorAll<HTMLElement>("a")];
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
  }, [open, docked]);

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
      {/* Top bar: shown on the intro and the three-card section */}
      <header
        inert={docked}
        aria-hidden={docked || undefined}
        className={`pointer-events-none fixed inset-x-0 top-0 z-50 flex items-center justify-between px-gutter py-5 transition-[color,opacity,translate] duration-500 ease-out-expo ${
          open || onDark ? "text-white" : "text-ink"
        } ${docked ? "-translate-y-4 opacity-0" : ""}`}
      >
        <HomeLink onClick={goTo("home")} white={open || onDark} className="h-7 md:h-8" />
        <MenuButton ref={topButton} open={open} white={onDark} onClick={() => setOpen((o) => !o)} className="size-14" />
      </header>

      {/* Floating pill: logo and menu in white, bottom centre, from Selected Work on */}
      <motion.div
        inert={!docked}
        aria-hidden={!docked || undefined}
        className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2"
        initial={false}
        animate={docked ? { y: 0, opacity: 1 } : { y: 32, opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav
          aria-label="Quick navigation"
          // Trial fill: the iridescent gradient from the menu icon (globals.css → bg-iridescent-pill)
          // Clickable cues: a light sweep every few seconds (globals.css → .nav-pill), a lift on
          // hover and a press on click
          className="nav-pill pointer-events-auto relative flex items-center overflow-hidden rounded-full bg-purple bg-iridescent-pill py-1.5 pl-5 pr-1.5 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_22px_48px_-12px_rgba(74,36,255,0.55),0_8px_18px_-6px_rgba(26,15,44,0.45)] transition-[translate,scale,box-shadow] duration-500 ease-out-expo hover:-translate-y-1 hover:scale-[1.04] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.4),0_28px_56px_-12px_rgba(74,36,255,0.7),0_10px_22px_-6px_rgba(26,15,44,0.5)] active:scale-[0.97]"
        >
          <HomeLink onClick={goTo("home")} white className="h-6" />
          <span aria-hidden className="mx-3 h-6 w-px bg-white/35" />
          <MenuButton ref={pillButton} open={open} white onClick={() => setOpen((o) => !o)} className="size-11" />
        </nav>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panel}
            id="site-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            className={`fixed inset-0 z-40 flex flex-col justify-between overflow-y-auto bg-night bg-morpheus px-gutter pt-32 text-white ${docked ? "pb-28" : "pb-10"}`}
            initial={{ clipPath: `circle(0% ${docked ? ORIGIN_PILL : ORIGIN_TOP})` }}
            animate={{ clipPath: `circle(150% ${docked ? ORIGIN_PILL : ORIGIN_TOP})` }}
            exit={{ clipPath: `circle(0% ${docked ? ORIGIN_PILL : ORIGIN_TOP})` }}
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

/** The Que wordmark linking home; `white` turns it solid white for dark backgrounds. */
function HomeLink({ onClick, white, className }: { onClick: (e: MouseEvent<HTMLAnchorElement>) => void; white: boolean; className: string }) {
  return (
    <Link href="/" onClick={onClick} className="pointer-events-auto block" aria-label={`${site.name} — home`}>
      {/* trimmed web copy of public/logos/Glossy Iridescent QUE Wordmark (1).png */}
      <Image
        src="/logos/que-wordmark.png"
        alt=""
        width={546}
        height={160}
        priority
        className={`w-auto transition-[filter] duration-500 ${className} ${white ? "brightness-0 invert" : ""}`}
      />
    </Link>
  );
}

type MenuButtonProps = {
  ref: Ref<HTMLButtonElement>;
  open: boolean;
  white: boolean;
  onClick: () => void;
  className: string;
};

/** Glossy menu bars that fade into a close cross while the menu is open. */
function MenuButton({ ref, open, white, onClick, className }: MenuButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="site-menu"
      aria-label={open ? "Close menu" : "Open menu"}
      className={`pointer-events-auto relative grid place-items-center transition-transform duration-500 ease-out-expo hover:scale-105 ${className}`}
    >
      {/* trimmed web copy of public/logos/Glossy Neon Gradient Menu Bars.png */}
      <motion.span
        aria-hidden
        className="absolute inset-0 grid place-items-center"
        animate={open ? { opacity: 0, scale: 0.6, rotate: -20 } : { opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
      >
        <Image
          src="/logos/menu-bars.png"
          alt=""
          width={160}
          height={126}
          priority
          className={`h-auto w-9 transition-[filter] duration-500 ${white ? "brightness-0 invert" : ""}`}
        />
      </motion.span>
      <span className="relative block h-3 w-5" aria-hidden>
        <motion.span
          className="absolute left-0 top-1/2 h-[1.5px] w-full bg-current"
          animate={open ? { opacity: 1, rotate: 45, scaleX: 1 } : { opacity: 0, rotate: 0, scaleX: 0.3 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
        <motion.span
          className="absolute left-0 top-1/2 h-[1.5px] w-full bg-current"
          animate={open ? { opacity: 1, rotate: -45, scaleX: 1 } : { opacity: 0, rotate: 0, scaleX: 0.3 }}
          transition={{ duration: 0.4, ease: EASE }}
        />
      </span>
    </button>
  );
}

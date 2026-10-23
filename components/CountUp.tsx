"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Counts a figure like "6+" or "2×" up from zero the first time it scrolls into view,
 * keeping any suffix in place. Text that isn't a number (e.g. "Grand Prix") is shown as is.
 */
export default function CountUp({ value, delay = 0, className }: { value: string; delay?: number; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);
  const digits = useRef<HTMLSpanElement>(null);
  const inView = useInView(el, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const match = value.match(/^(\d+)(.*)$/);
  const target = match ? Number(match[1]) : 0;
  const suffix = match?.[2] ?? "";
  const numeric = Boolean(match);

  useEffect(() => {
    const node = digits.current;
    if (!numeric || !node) return;
    // reduced motion: show the final figure straight away, no count
    if (reduce) {
      node.textContent = value;
      return;
    }
    if (!inView) return;
    const controls = animate(0, target, {
      duration: 0.9 + target * 0.08, // bigger numbers take a little longer
      delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => (node.textContent = `${Math.round(v)}${suffix}`),
    });
    return () => controls.stop();
  }, [inView, reduce, numeric, target, suffix, delay, value]);

  return (
    <span ref={el} className={className}>
      {/* Starts at zero (with its suffix) on the server and the first client render alike,
          so hydration matches; screen readers get the final figure instead */}
      <span ref={digits} aria-hidden>
        {numeric ? `0${suffix}` : value}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}

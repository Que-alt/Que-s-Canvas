"use client";

import { motion, type Variants } from "motion/react";
import { Fragment, type ElementType } from "react";

type Word = { text: string; keyword: boolean; space: boolean; pause?: boolean };

const NBSP = " ";

/** Marks a dramatic beat in the copy: the following words start on a new line and reveal late. */
export const PAUSE = "{pause}";

/** Splits "Hello *big world*" into words, flagging *emphasised* ones and {pause} beats. */
export function parseWords(text: string): Word[] {
  const words: Word[] = [];
  let pauseNext = false;

  const push = (text: string, keyword: boolean) => {
    words.push({ text, keyword, space: false, pause: pauseNext || undefined });
    pauseNext = false;
  };

  text.split("*").forEach((segment, i) => {
    const keyword = i % 2 === 1;
    const parts = segment.split(/(\s+)/);
    parts.forEach((raw, j) => {
      let part = raw;
      if (!part) return;
      if (part.includes(PAUSE)) {
        // "{pause}" may be glued to a word, e.g. "me…{pause}"
        const [before, after] = part.split(PAUSE);
        if (before) push(before, keyword);
        pauseNext = true;
        if (!after) return;
        part = after;
      }
      if (/^\s+$/.test(part)) {
        const last = words[words.length - 1];
        if (last && !last.text.endsWith(NBSP)) last.space = true;
        return;
      }
      // keep multi-word keywords together so the underline is continuous
      const joinNext = keyword && j < parts.length - 2;
      push(joinNext ? part + NBSP : part, keyword);
    });
  });
  return words;
}

export const plainText = (text: string) => text.replaceAll("*", "").replaceAll(PAUSE, " ");

const wordVariants: Variants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.045 },
  }),
};

type Props = {
  text: string;
  as?: ElementType;
  className?: string;
  /**
   * "static" renders split words for an external driver (e.g. GSAP).
   * "inView" reveals words once when the element scrolls into view.
   */
  mode?: "static" | "inView";
  delay?: number;
  id?: string;
};

/**
 * Accessible split-text: screen readers get the full sentence once,
 * the visual layer is split into masked words that can be animated.
 */
export default function AnimatedText({ text, as: Tag = "p", className, mode = "static", delay = 0, id }: Props) {
  const words = parseWords(text);

  const renderWord = (w: Word, i: number) => {
    const cls = `word${w.keyword ? " kw" : ""}`;
    return (
      <Fragment key={i}>
        {w.pause && <br />}
        <span className="word-mask">
          {mode === "inView" ? (
            <motion.span className={cls} variants={wordVariants} custom={i + delay * 20}>
              {w.text}
            </motion.span>
          ) : (
            <span
              className={cls}
              data-word=""
              data-kw={w.keyword ? "" : undefined}
              data-pause={w.pause ? "" : undefined}
            >
              {w.text}
            </span>
          )}
        </span>
        {w.space && " "}
      </Fragment>
    );
  };

  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{plainText(text)}</span>
      {mode === "inView" ? (
        <motion.span
          aria-hidden="true"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {words.map(renderWord)}
        </motion.span>
      ) : (
        <span aria-hidden="true">{words.map(renderWord)}</span>
      )}
    </Tag>
  );
}

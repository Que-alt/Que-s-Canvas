"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowUpRight, Check, ChevronDown, Copy, X } from "lucide-react";
import { site } from "@/data/site";

// Web3Forms delivers each submission to the inbox the access key was created with.
// The key is meant to be public; it lives in .env.local as NEXT_PUBLIC_WEB3FORMS_KEY.
const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
const ENDPOINT = "https://api.web3forms.com/submit";

const TOPICS = ["A project", "A role", "Working together", "Something else"];

type Status = "idle" | "sending" | "sent" | "error";

/**
 * Lead form in a modal dialog. Native <dialog> handles focus, Esc and the backdrop;
 * the page behind stops scrolling while it's open.
 */
export default function ContactForm({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      document.documentElement.style.overflow = "hidden";
    } else if (!open && d.open) {
      d.close();
    }
  }, [open]);

  const handleClose = () => {
    document.documentElement.style.overflow = "";
    if (status === "sent" || status === "error") setStatus("idle");
    onClose();
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget; // React clears currentTarget after the await below
    const data = new FormData(form);
    if (data.get("botcheck")) return; // the hidden field only bots fill in
    if (!ACCESS_KEY) {
      setError("The form isn't connected yet. Please email me directly instead.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Portfolio enquiry: ${data.get("topic")} from ${data.get("name")}`,
          from_name: "Portfolio contact form",
          name: data.get("name"),
          email: data.get("email"),
          topic: data.get("topic"),
          message: data.get("message"),
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.message);
      setStatus("sent");
      form.reset();
    } catch {
      setError("Something went wrong sending your message. Please try again, or email me directly.");
      setStatus("error");
    }
  };

  // Fields are plain rows on the panel: label above, a hairline below that brightens on focus
  const row = "block border-b border-white/15 pb-3 pt-5 transition-colors duration-300 focus-within:border-white/60";
  const label = "block text-sm text-white/50";
  const input = "contact-field mt-1.5 w-full bg-transparent text-lg text-white placeholder:text-white/25 outline-none";

  return (
    <dialog
      ref={dialog}
      onClose={handleClose}
      onClick={(e) => e.target === e.currentTarget && dialog.current?.close()} // click on the backdrop
      aria-labelledby="contact-form-title"
      className="contact-dialog m-auto w-[min(100%-2rem,34rem)] max-h-[calc(100svh-2rem)] overflow-y-auto rounded-3xl bg-night p-0 text-white ring-1 ring-white/10 backdrop:bg-night/70 backdrop:backdrop-blur-sm"
    >
      <div className="relative px-7 pb-7 pt-8 md:px-10 md:pb-9 md:pt-10">
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label="Close"
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white md:right-6 md:top-6"
        >
          <X className="size-5" aria-hidden />
        </button>

        {status === "sent" ? (
          <div role="status" className="pb-2 pt-6">
            {/* Que wordmark, turned solid white like the floating nav pill's */}
            <Image src="/logos/que-wordmark.png" alt="Que" width={546} height={160} className="h-8 w-auto brightness-0 invert" />
            <h2 id="contact-form-title" className="mt-8 font-display text-[clamp(1.6rem,3.4vw,2.1rem)] font-medium leading-[1.1] tracking-[-0.03em]">
              Thanks, message received. <span className="text-accent">I&apos;ll get back to you soon.</span>
            </h2>
          </div>
        ) : (
          <>
            <h2 id="contact-form-title" className="pr-12 font-display text-[clamp(1.6rem,3.4vw,2.1rem)] font-medium leading-[1.1] tracking-[-0.03em]">
              Let&apos;s create something.
            </h2>
            <p className="mt-2 text-white/60">Tell me a little about it and I&apos;ll get back to you.</p>

            <form onSubmit={submit} className="mt-4">
              <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
              <label className={row}>
                <span className={label}>Name</span>
                <input name="name" required autoComplete="name" className={input} />
              </label>
              <label className={row}>
                <span className={label}>Email</span>
                <input name="email" type="email" required autoComplete="email" className={input} />
              </label>
              {/* not a wrapping label: that would read the option list into the field's name */}
              <div className={`${row} relative`}>
                <label htmlFor="cf-topic" className={label}>What&apos;s this about?</label>
                <select id="cf-topic" name="topic" defaultValue={TOPICS[0]} className={`${input} cursor-pointer appearance-none pr-8`}>
                  {TOPICS.map((t) => (
                    <option key={t} value={t} className="bg-night text-white">
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute bottom-4 right-0 size-4 text-white/50" aria-hidden />
              </div>
              <label className={row}>
                <span className={label}>Message</span>
                <textarea name="message" required rows={3} className={`${input} resize-none`} />
              </label>

              {status === "error" && (
                <p role="alert" className="mt-4 text-sm text-[#ffb4b4]">{error}</p>
              )}

              <div className="mt-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-5">
                <EmailFallback />
                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-ink transition-colors hover:bg-accent disabled:opacity-60"
                >
                  {status === "sending" ? "Sending…" : "Send"}
                  <ArrowUpRight className="size-4 transition-transform duration-500 ease-out-expo group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </dialog>
  );
}

/** Quiet alternative for people who'd rather use their own mail app, with a copy shortcut. */
function EmailFallback() {
  const { email } = site.contact;
  const [copied, setCopied] = useState(false);
  if (!email) return null;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };
  return (
    <p className="flex items-center gap-1 text-sm text-white/50">
      Or email{" "}
      <a href={`mailto:${email}`} className="text-white/80 transition-colors hover:text-white">{email}</a>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Email address copied" : "Copy email address"}
        title={copied ? "Copied" : "Copy"}
        className="grid size-8 place-items-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
      >
        {copied ? <Check className="size-3.5 text-accent" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      </button>
    </p>
  );
}

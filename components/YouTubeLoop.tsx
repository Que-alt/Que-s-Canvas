"use client";

import { useEffect, useRef, useState } from "react";

const ORIGIN = "https://www.youtube-nocookie.com";

/**
 * A YouTube video used as a silent, looping background: muted, no controls, no
 * interaction, cropped to cover its container. Plays only while on screen and never
 * under reduced motion (the thumbnail shows instead).
 */
export default function YouTubeLoop({ id, title }: { id: string; title: string }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [embed, setEmbed] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEmbed(!reduce.matches);
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);

  // Pause off screen, resume on screen (via the IFrame API's postMessage commands)
  useEffect(() => {
    if (!embed || !wrap.current) return;
    const send = (func: "playVideo" | "pauseVideo") =>
      frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), ORIGIN);
    const io = new IntersectionObserver(([e]) => send(e.isIntersecting ? "playVideo" : "pauseVideo"), {
      rootMargin: "20% 0px",
    });
    io.observe(wrap.current);
    return () => io.disconnect();
  }, [embed]);

  // Reveal the player only once YouTube reports playback, so its black loading frame and
  // spinner never show: the thumbnail stays until the footage is actually moving.
  useEffect(() => {
    if (!embed) return;
    const onMessage = (e: MessageEvent) => {
      if (e.origin !== ORIGIN || e.source !== frame.current?.contentWindow || typeof e.data !== "string") return;
      try {
        const msg = JSON.parse(e.data);
        const state = msg.event === "onStateChange" ? msg.info : msg.info?.playerState;
        if (state === 1) setPlaying(true);
      } catch {
        // not a player message
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embed]);

  // Subscribe to the player's state events once the embed has loaded
  const listen = () =>
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id }), ORIGIN);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    playlist: id, // required for a single video to loop
    controls: "0",
    playsinline: "1",
    rel: "0",
    iv_load_policy: "3",
    disablekb: "1",
    enablejsapi: "1",
  });

  return (
    <span ref={wrap} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden bg-night">
      {/* Thumbnail underneath: shown while the player loads, and on its own under reduced motion */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
        alt=""
        className="absolute left-1/2 top-0 h-full w-auto max-w-none -translate-x-1/2"
        loading="lazy"
      />
      {embed && (
        // 16:9 player at full card height, centred: its 4:3 picture covers the 4:5 card
        <iframe
          ref={frame}
          src={`${ORIGIN}/embed/${id}?${params}`}
          title={title}
          tabIndex={-1}
          allow="autoplay; encrypted-media; picture-in-picture"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={listen}
          className={`absolute left-1/2 top-0 h-full aspect-video max-w-none -translate-x-1/2 border-0 transition-opacity duration-700 ${playing ? "opacity-100" : "opacity-0"}`}
        />
      )}
    </span>
  );
}

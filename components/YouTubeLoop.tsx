"use client";

import { useEffect, useRef, useState } from "react";

const ORIGIN = "https://www.youtube-nocookie.com";

/**
 * A YouTube video used as a silent, looping background: muted, no controls, no
 * interaction, cropped to cover its container. The player only loads once it's within a
 * screen of view, plays only while on screen and `active`, and never under reduced motion
 * (the thumbnail shows instead). `end` loops just the first `end` seconds, e.g. to leave out
 * an end card.
 */
export default function YouTubeLoop({ id, title, active = true, end }: { id: string; title: string; active?: boolean; end?: number }) {
  const wrap = useRef<HTMLSpanElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [motionOk, setMotionOk] = useState(false);
  const [near, setNear] = useState(false); // within a screen of view: load the player
  const [visible, setVisible] = useState(false); // on screen: let it play
  const [loaded, setLoaded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const embed = motionOk && near;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotionOk(!reduce.matches);
    update();
    reduce.addEventListener("change", update);
    return () => reduce.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!wrap.current) return;
    const nearIO = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "100% 0px" });
    const seenIO = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: "20% 0px" });
    nearIO.observe(wrap.current);
    seenIO.observe(wrap.current);
    return () => {
      nearIO.disconnect();
      seenIO.disconnect();
    };
  }, []);

  // Play only while on screen and active (via the IFrame API's postMessage commands)
  useEffect(() => {
    if (!embed || !loaded) return;
    const func = visible && active ? "playVideo" : "pauseVideo";
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), ORIGIN);
  }, [embed, loaded, visible, active]);

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
        // cut the loop short: back to the start just before `end`
        const time = msg.event === "infoDelivery" ? msg.info?.currentTime : undefined;
        if (end && typeof time === "number" && time >= end - 0.25) {
          frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: "seekTo", args: [0, true] }), ORIGIN);
        }
      } catch {
        // not a player message
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [embed, end]);

  // Subscribe to the player's state events once the embed has loaded
  const listen = () => {
    frame.current?.contentWindow?.postMessage(JSON.stringify({ event: "listening", id }), ORIGIN);
    setLoaded(true);
  };

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

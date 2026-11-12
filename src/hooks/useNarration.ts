"use client";

import { startTransition, useCallback, useEffect, useRef, useState } from "react";
import { COURSE_CONFIG } from "@/config/course";
import copy from "@/locales/en-us.json";

export function useNarration(text: string, contentLoaded: boolean) {
  const [muted, setMuted] = useState(false);
  const [available, setAvailable] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [message, setMessage] = useState("");
  const mutedRef = useRef(false);
  const runRef = useRef(0);
  const stop = useCallback(() => {
    runRef.current += 1;
    if (typeof window !== "undefined" && "speechSynthesis" in window)
      window.speechSynthesis.cancel();
    setPlaying(false);
  }, []);
  const speak = useCallback(
    (content: string) => {
      if (
        typeof window === "undefined" ||
        !("speechSynthesis" in window) ||
        mutedRef.current ||
        !content.trim()
      )
        return;
      stop();
      setMessage("");
      const run = runRef.current;
      const chunks = content
        .replace(/\*\*|`|>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .match(/.{1,450}(?:\s|$)|\S{1,450}/g) ?? [content];
      try {
        chunks.forEach((chunk, index) => {
          const utterance = new SpeechSynthesisUtterance(chunk.trim());
          utterance.onstart = () => {
            if (run === runRef.current) setPlaying(true);
          };
          utterance.onend = () => {
            if (run === runRef.current && index === chunks.length - 1) setPlaying(false);
          };
          utterance.onerror = (event) => {
            if (
              run !== runRef.current ||
              event.error === "canceled" ||
              event.error === "interrupted"
            )
              return;
            runRef.current += 1;
            window.speechSynthesis.cancel();
            setPlaying(false);
            setMessage(copy.PLAYER.NARRATION_UNAVAILABLE_MESSAGE);
          };
          window.speechSynthesis.speak(utterance);
        });
      } catch {
        stop();
        setMessage(copy.PLAYER.NARRATION_UNAVAILABLE_MESSAGE);
      }
    },
    [stop],
  );
  useEffect(() => {
    let savedMuted = false;
    try {
      savedMuted = localStorage.getItem(COURSE_CONFIG.narrationStorageKey) === "true";
    } catch {
      /* Session preference is enough. */
    }
    mutedRef.current = savedMuted;
    const supported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    startTransition(() => {
      setMuted(savedMuted);
      setAvailable(supported);
      setReady(true);
    });
  }, []);
  useEffect(() => {
    if (!ready || !contentLoaded || !available) return;
    if (!mutedRef.current) speak(text);
    return () => {
      runRef.current += 1;
      window.speechSynthesis.cancel();
    };
  }, [text, ready, contentLoaded, available, speak]);
  const toggleMute = () => {
    const next = !mutedRef.current;
    mutedRef.current = next;
    setMuted(next);
    try {
      localStorage.setItem(COURSE_CONFIG.narrationStorageKey, String(next));
    } catch {
      /* Preference remains in memory. */
    }
    if (next) {
      stop();
      setMessage("");
    } else speak(text);
  };
  return { muted, available, playing, message, toggleMute, replay: () => speak(text), speak, stop };
}

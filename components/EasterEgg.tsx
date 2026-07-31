"use client";

import { useEffect } from "react";
import { fireConfetti } from "@/lib/confetti";

export default function EasterEgg() {
  useEffect(() => {
    console.log(
      "%c22",
      "font-size: 48px; font-weight: 800; color: #F0B429; text-shadow: 0 2px 8px rgba(240,180,41,0.4);"
    );
    console.log(
      "%cSalut, développeur curieux 👋 — c'est Valdes qui a codé ce site. Tape 22 n'importe où sur la page pour un petit bonus.",
      "font-size: 13px; color: #FDF6E3; background: #180E22; padding: 6px 10px; border-radius: 6px;"
    );

    let buffer = "";
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
        buffer = "";
        return;
      }
      if (!/^[0-9]$/.test(event.key)) {
        buffer = "";
        return;
      }
      buffer = (buffer + event.key).slice(-2);
      if (buffer === "22") {
        fireConfetti({ particleCount: 200 });
        buffer = "";
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return null;
}

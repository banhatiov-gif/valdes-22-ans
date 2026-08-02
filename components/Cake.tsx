"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Send, Check, PartyPopper } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";
import ScrollCue from "@/components/ScrollCue";

const CANDLE_X = [90, 130, 170, 210, 250];
const WISH_MAX = 140;
const WISH_COUNT_MAX = 3;
const WISH_COUNT_KEY = "valdes22-wish-count";

type WishStatus = "idle" | "submitting" | "sent" | "error";

export default function Cake() {
  const [blownOut, setBlownOut] = useState(false);
  const [wish, setWish] = useState("");
  const [status, setStatus] = useState<WishStatus>("idle");
  const [wishCount, setWishCount] = useState(0);
  const cakeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = Number(localStorage.getItem(WISH_COUNT_KEY) ?? "0");
    if (stored > 0) {
      setWishCount(stored);
      setBlownOut(true);
      setStatus("sent");
    }
  }, []);

  function handleBlow() {
    if (blownOut) return;
    setBlownOut(true);

    const rect = cakeRef.current?.getBoundingClientRect();
    fireConfetti({
      originX: rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5,
      originY: rect ? (rect.top + rect.height / 3) / window.innerHeight : 0.5,
      particleCount: 150,
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = wish.trim();
    if (!trimmed || status === "submitting") return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });
      if (!res.ok) throw new Error("request failed");
      const nextCount = wishCount + 1;
      localStorage.setItem(WISH_COUNT_KEY, String(nextCount));
      setWishCount(nextCount);
      setStatus("sent");
      setWish("");
    } catch {
      setStatus("error");
    }
  }

  function handleWriteAnother() {
    setStatus("idle");
  }

  return (
    <section
      id="gateau"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-plum px-4 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="mb-10 text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-coral/15 text-coral">
          <PartyPopper size={26} aria-hidden="true" />
        </div>
        <p className="label-mono mt-6 text-xs text-coral">Un vœu pour Valdes</p>
        <h2 className="section-heading mt-3 text-3xl text-cream sm:text-4xl">
          Souffle les bougies avec lui
        </h2>
      </motion.div>

      <div ref={cakeRef} className="relative w-full max-w-md">
        <svg
          viewBox="0 0 340 300"
          role="img"
          aria-label="Illustration d'un gâteau d'anniversaire à trois étages avec cinq bougies"
          className="w-full"
        >
          {/* plate shadow */}
          <ellipse cx="170" cy="272" rx="140" ry="14" fill="var(--plum-deep)" opacity="0.6" />

          {/* tier 3 (bottom, largest) */}
          <rect x="35" y="210" width="270" height="60" rx="14" fill="var(--plum-light)" />
          <rect x="35" y="210" width="270" height="14" rx="7" fill="var(--coral)" />

          {/* tier 2 */}
          <rect x="70" y="155" width="200" height="60" rx="14" fill="var(--plum-light)" />
          <rect x="70" y="155" width="200" height="14" rx="7" fill="var(--teal)" />

          {/* tier 1 (top, smallest) */}
          <rect x="105" y="100" width="130" height="60" rx="14" fill="var(--plum-light)" />
          <rect x="105" y="100" width="130" height="14" rx="7" fill="var(--gold)" />

          {/* candles + flames */}
          {CANDLE_X.map((x, i) => (
            <g key={x}>
              <rect x={x - 4} y="72" width="8" height="30" rx="2" fill="var(--cream)" />
              <rect x={x - 4} y="72" width="8" height="6" fill={i % 2 === 0 ? "var(--coral)" : "var(--teal)"} />
              <AnimatePresence>
                {!blownOut && (
                  <motion.ellipse
                    exit={{ opacity: 0, scale: 0, y: -6 }}
                    transition={{ duration: 0.4 }}
                    cx={x}
                    cy="66"
                    rx="5"
                    ry="9"
                    fill="var(--gold)"
                    className="candle-flame origin-bottom animate-flicker"
                    style={{ transformOrigin: `${x}px 72px` }}
                  />
                )}
              </AnimatePresence>
              {blownOut && (
                <motion.ellipse
                  cx={x}
                  cy="66"
                  rx="3"
                  ry="5"
                  fill="rgba(253, 246, 227, 0.4)"
                  style={{ filter: "blur(2px)" }}
                  initial={{ opacity: 0, y: 0, scale: 0.6 }}
                  animate={{ opacity: [0, 0.5, 0], y: -34, scale: 1.8 }}
                  transition={{ duration: 1.6, ease: "easeOut" }}
                />
              )}
            </g>
          ))}
        </svg>

        {!blownOut && (
          <motion.button
            type="button"
            onClick={handleBlow}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mx-auto mt-6 flex items-center gap-2 rounded-full bg-coral px-6 py-3 text-sm font-bold text-plum-deep shadow-[0_10px_30px_rgba(240,85,46,0.35)] sm:text-base"
          >
            <Wind size={20} aria-hidden="true" />
            Souffler les bougies
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {blownOut && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass mt-10 w-full max-w-md rounded-2xl p-6 sm:p-8"
          >
            {status === "sent" ? (
              <div className="flex flex-col items-center gap-2 py-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/20 text-teal">
                  <Check size={22} aria-hidden="true" />
                </div>
                <p className="font-display text-lg text-cream">Vœu envoyé, merci !</p>
                <p className="text-sm text-cream/60">Il rejoint tous les autres vœux, en secret.</p>
                {wishCount < WISH_COUNT_MAX ? (
                  <button
                    type="button"
                    onClick={handleWriteAnother}
                    className="mt-3 text-xs font-semibold text-gold underline-offset-2 hover:underline"
                  >
                    Envoyer un autre vœu ({WISH_COUNT_MAX - wishCount} restant
                    {WISH_COUNT_MAX - wishCount > 1 ? "s" : ""})
                  </button>
                ) : (
                  <p className="mt-3 text-xs text-cream/40">
                    Tu as envoyé tes {WISH_COUNT_MAX} vœux — merci !
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="wish" className="label-mono text-xs text-gold">
                  Ton vœu pour Valdes (anonyme) — {wishCount}/{WISH_COUNT_MAX}
                </label>
                <textarea
                  id="wish"
                  value={wish}
                  onChange={(e) => setWish(e.target.value.slice(0, WISH_MAX))}
                  maxLength={WISH_MAX}
                  rows={3}
                  placeholder="Écris un vœu secret pour Valdes..."
                  className="mt-2 w-full resize-none rounded-xl border border-cream/15 bg-plum-deep/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-gold"
                />
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-cream/40">
                    {wish.length}/{WISH_MAX}
                  </span>
                  {status === "error" && (
                    <span role="alert" className="text-xs text-coral">
                      Erreur, réessaie.
                    </span>
                  )}
                </div>
                <motion.button
                  type="submit"
                  disabled={!wish.trim() || status === "submitting"}
                  whileHover={{ scale: wish.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: wish.trim() ? 0.98 : 1 }}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-plum-deep transition-opacity disabled:opacity-40 sm:text-base"
                >
                  <Send size={18} aria-hidden="true" />
                  {status === "submitting" ? "Envoi..." : "Envoyer mon vœu"}
                </motion.button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollCue href="#galerie" label="Souvenirs" />
    </section>
  );
}

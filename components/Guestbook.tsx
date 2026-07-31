"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Loader2, AlertCircle, MessageSquareHeart } from "lucide-react";
import type { GuestbookEntry } from "@/lib/types";
import { fireConfetti } from "@/lib/confetti";

const NAME_MAX = 40;
const MESSAGE_MAX = 280;
const POSTIT_COLORS = ["bg-gold", "bg-coral", "bg-teal"];
const ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2", "rotate-3", "-rotate-3"];
const CELEBRATION_MILESTONES = [10, 25, 50, 100, 200];

type LoadState = "loading" | "ready" | "error";

export default function Guestbook() {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function loadEntries() {
    setLoadState("loading");
    try {
      const res = await fetch("/api/guestbook", { cache: "no-store" });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setEntries(data.entries ?? []);
      setLoadState("ready");
    } catch {
      setLoadState("error");
    }
  }

  useEffect(() => {
    loadEntries();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmedName = name.trim();
    const trimmedMessage = message.trim();
    if (!trimmedName || !trimmedMessage || submitting) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName, message: trimmedMessage }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setEntries((prev) => {
        const next = [data.entry, ...prev];
        if (CELEBRATION_MILESTONES.includes(next.length)) {
          fireConfetti({ particleCount: 180 });
        }
        return next;
      });
      setName("");
      setMessage("");
    } catch {
      setSubmitError("Le message n'a pas pu être envoyé. Réessaie.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="livre-or"
      className="relative w-full bg-plum px-4 py-24"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
            <MessageSquareHeart size={26} aria-hidden="true" />
          </div>
          <p className="label-mono mt-6 text-xs text-gold">Livre d&apos;or</p>
          <h2 className="section-heading mt-3 text-3xl text-cream sm:text-4xl">
            Laisse un mot à Valdes
          </h2>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          onSubmit={handleSubmit}
          className="glass mx-auto mb-16 max-w-xl rounded-2xl p-6 sm:p-8"
        >
          <div>
            <label htmlFor="gb-name" className="label-mono text-xs text-gold">
              Prénom
            </label>
            <input
              id="gb-name"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, NAME_MAX))}
              maxLength={NAME_MAX}
              placeholder="Ton prénom"
              className="mt-2 w-full rounded-xl border border-cream/15 bg-plum-deep/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-gold"
              required
            />
          </div>

          <div className="mt-4">
            <label htmlFor="gb-message" className="label-mono text-xs text-gold">
              Message
            </label>
            <textarea
              id="gb-message"
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, MESSAGE_MAX))}
              maxLength={MESSAGE_MAX}
              rows={3}
              placeholder="Ton petit mot pour Valdes..."
              className="mt-2 w-full resize-none rounded-xl border border-cream/15 bg-plum-deep/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-gold"
              required
            />
          </div>

          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-cream/40">
              {message.length}/{MESSAGE_MAX}
            </span>
            {submitError && (
              <span role="alert" className="flex items-center gap-1 text-xs text-coral">
                <AlertCircle size={13} aria-hidden="true" /> {submitError}
              </span>
            )}
          </div>

          <motion.button
            type="submit"
            disabled={!name.trim() || !message.trim() || submitting}
            whileHover={{ scale: name.trim() && message.trim() ? 1.02 : 1 }}
            whileTap={{ scale: name.trim() && message.trim() ? 0.98 : 1 }}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-plum-deep transition-opacity disabled:opacity-40 sm:text-base"
          >
            {submitting ? (
              <Loader2 size={18} className="animate-spin" aria-hidden="true" />
            ) : (
              <Send size={18} aria-hidden="true" />
            )}
            {submitting ? "Envoi..." : "Signer le livre d'or"}
          </motion.button>
        </motion.form>

        <div aria-live="polite">
          {loadState === "loading" && (
            <div className="flex items-center justify-center gap-2 py-12 text-cream/60">
              <Loader2 size={20} className="animate-spin" aria-hidden="true" />
              <span className="text-sm">Chargement des messages...</span>
            </div>
          )}

          {loadState === "error" && (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-cream/60">
              <AlertCircle size={24} className="text-coral" aria-hidden="true" />
              <p className="text-sm">Impossible de charger le livre d&apos;or.</p>
              <button
                onClick={loadEntries}
                className="rounded-full border border-cream/20 px-4 py-2 text-xs font-semibold text-cream hover:border-gold hover:text-gold"
              >
                Réessayer
              </button>
            </div>
          )}

          {loadState === "ready" && entries.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-12 text-center text-cream/50">
              <MessageSquareHeart size={28} aria-hidden="true" />
              <p className="text-sm">Sois le premier à laisser un message !</p>
            </div>
          )}

          {loadState === "ready" && entries.length > 0 && (
            <ul className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              <AnimatePresence initial={false}>
                {entries.map((entry, i) => (
                  <motion.li
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{ scale: 1.05, rotate: 0 }}
                    className={`postit relative ${POSTIT_COLORS[i % POSTIT_COLORS.length]} ${
                      ROTATIONS[i % ROTATIONS.length]
                    } flex min-h-[140px] flex-col justify-between rounded-sm p-4 text-plum-deep`}
                  >
                    <span
                      className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum-deep shadow-[0_2px_4px_rgba(0,0,0,0.4)]"
                      aria-hidden="true"
                    />
                    <p className="line-clamp-5 text-sm font-medium">{entry.message}</p>
                    <p className="mt-3 truncate font-display text-sm font-bold">
                      — {entry.name}
                    </p>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

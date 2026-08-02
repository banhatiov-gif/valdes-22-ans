"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Unlock, HeartHandshake } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";

const PASSWORD = "elza";

const MESSAGE_PARAGRAPHS = [
  "Chéri, mon cœur❤️.",
  "J’aurais tellement voulu être la pour te faire ce petit cadeau mais tu connais la raison pour laquelle j’ai pas pu😮‍💨j’ai donc été obligé de précipiter ton anniversaire 🥲.",
  "Je vais commencer par te remercier pour tout, merci infiniment d’être ce grand frère, ce bouclier, celui là qui m’écoute toujours sans que je n’ai même parler, sans me juger, et me comprends toujours 🥲, merci pour tous les efforts que tu ne cesses de faire pour moi et pour nous chaque jour, merci d’être toujours la même quand je deviens insupportable 🥺merci de me supporter, de m’accepter et de croire en moi. Je n’ai même pas les mots corrects pour t’exprimer ma gratitude et ma reconnaissance envers tes mots réconfortant et tes actions encourageantes que tu as toujours apporté dans ma vie pour me donner cette confiance et cette force en moi que j’avais perdu 🥺🤲🏾…juste merci 😭🤲🏾merci infiniment pour cette magnifique personne que tu es pour moi et pour ton entourage, je remercie l’éternel de t’avoir mis dans ma vie et je prie que cette aventure aille au delà de ce que nous espérons 🥲. Continue d’être cette personne formidable pour moi ❤️et ne change pas 🥹. Je gardes la suite du message pour nous 😂.",
  "Joyeux anniversaire mon chéri je te souhaite juste d’être heureux chaque jour qui passe et que tes efforts soient encore plus béni sur tous les plans . Soit béni au centuples et profite bien de ta journée 🥲je t’embrasse fort et je te fais plein de bisous 💋🫶🏾.",
  "Je t’aime Monsieur B❤️.",
];

export default function SpecialMessage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (password.trim().toLowerCase() === PASSWORD) {
      setUnlocked(true);
      setError(false);
      fireConfetti({ particleCount: 160 });
    } else {
      setError(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className="glass relative mx-auto mb-16 max-w-xl overflow-hidden rounded-2xl p-6 text-center sm:p-8"
    >
      <div
        className="pointer-events-none absolute -top-20 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-coral/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral/15 text-coral">
        {unlocked ? (
          <HeartHandshake size={22} aria-hidden="true" />
        ) : (
          <Lock size={20} aria-hidden="true" />
        )}
      </div>

      <p className="label-mono relative mt-4 text-xs text-coral">Message spécial</p>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.form
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="relative mt-3"
          >
            <h3 className="section-heading text-xl text-cream sm:text-2xl">
              Un mot rien que pour toi
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-cream/60">
              Cette carte est protégée par un mot de passe. Tu sais qui te l&apos;a
              donné.
            </p>

            <div className="mx-auto mt-4 flex max-w-xs items-center gap-2">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Mot de passe"
                className="w-full rounded-xl border border-cream/15 bg-plum-deep/60 px-4 py-3 text-sm text-cream placeholder:text-cream/35 focus:border-coral"
                aria-invalid={error}
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1.5 rounded-xl bg-coral px-4 py-3 text-sm font-bold text-plum-deep transition-transform hover:scale-105 active:scale-95"
              >
                <Unlock size={16} aria-hidden="true" />
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-2 text-xs text-coral">
                Mot de passe incorrect. Réessaie.
              </p>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mt-3"
          >
            <h3 className="section-heading text-xl text-cream sm:text-2xl">
              De la part d&apos;Elza
            </h3>
            <div className="mx-auto mt-4 max-w-md space-y-4 text-left text-sm leading-relaxed text-cream/85 sm:text-base">
              {MESSAGE_PARAGRAPHS.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

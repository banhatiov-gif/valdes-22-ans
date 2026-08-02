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
      fireConfetti({ particleCount: 80 });
    } else {
      setError(true);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="relative mx-auto mt-16 max-w-sm rounded-xl border border-cream/10 p-4 text-center"
    >
      <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-cream/5 text-cream/50">
        {unlocked ? (
          <HeartHandshake size={14} aria-hidden="true" />
        ) : (
          <Lock size={13} aria-hidden="true" />
        )}
      </div>

      <p className="label-mono relative mt-2 text-[0.65rem] text-cream/40">Message spécial</p>

      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.form
            key="locked"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="relative mt-2"
          >
            <p className="mx-auto max-w-xs text-xs text-cream/45">
              Protégé par un mot de passe. Tu sais qui te l&apos;a donné.
            </p>

            <div className="mx-auto mt-3 flex max-w-[15rem] items-center gap-1.5">
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }}
                placeholder="Mot de passe"
                className="w-full rounded-lg border border-cream/10 bg-plum-deep/40 px-3 py-2 text-xs text-cream placeholder:text-cream/30 focus:border-cream/30"
                aria-invalid={error}
              />
              <button
                type="submit"
                className="flex shrink-0 items-center gap-1 rounded-lg bg-cream/10 px-3 py-2 text-xs font-semibold text-cream/70 transition-colors hover:bg-cream/15 hover:text-cream"
              >
                <Unlock size={13} aria-hidden="true" />
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-2 text-[0.65rem] text-coral">
                Mot de passe incorrect.
              </p>
            )}
          </motion.form>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative mt-2"
          >
            <p className="text-xs font-semibold text-cream/60">De la part d&apos;Elza</p>
            <div className="mx-auto mt-3 max-w-xs space-y-3 text-left text-xs leading-relaxed text-cream/70">
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

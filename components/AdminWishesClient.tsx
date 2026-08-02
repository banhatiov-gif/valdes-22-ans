"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2, AlertCircle, MessageSquareHeart } from "lucide-react";
import type { Wish } from "@/lib/types";

const SESSION_KEY = "valdes22-admin-key";

type ViewState = "locked" | "loading" | "unlocked";

export default function AdminWishesClient() {
  const [passphrase, setPassphrase] = useState("");
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [state, setState] = useState<ViewState>("locked");
  const [errorMsg, setErrorMsg] = useState("");

  async function unlock(key: string) {
    setState("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/wishes", {
        headers: { "x-admin-key": key },
        cache: "no-store",
      });
      if (res.status === 401) {
        setErrorMsg("Mot de passe incorrect.");
        try {
          sessionStorage.removeItem(SESSION_KEY);
        } catch {
          // stockage indisponible (navigation privée, navigateur intégré...)
        }
        setState("locked");
        return;
      }
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setWishes(data.wishes ?? []);
      setState("unlocked");
      try {
        sessionStorage.setItem(SESSION_KEY, key);
      } catch {
        // stockage indisponible — on reste déverrouillé pour cette session,
        // il faudra juste retaper le mot de passe la prochaine fois
      }
    } catch {
      setErrorMsg("Impossible de charger les vœux. Réessaie.");
      setState("locked");
    }
  }

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = sessionStorage.getItem(SESSION_KEY);
    } catch {
      stored = null;
    }
    if (stored) unlock(stored);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!passphrase.trim()) return;
    unlock(passphrase.trim());
  }

  return (
    <main className="flex min-h-screen w-full flex-col items-center bg-plum-deep px-4 py-24">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold">
            <MessageSquareHeart size={26} aria-hidden="true" />
          </div>
          <p className="label-mono mt-6 text-xs text-gold">Accès privé</p>
          <h1 className="section-heading mt-3 text-3xl text-cream sm:text-4xl">
            Les vœux secrets
          </h1>
        </div>

        {state !== "unlocked" ? (
          <form
            onSubmit={handleSubmit}
            className="glass mx-auto max-w-sm rounded-2xl p-6 sm:p-8"
          >
            <label htmlFor="passphrase" className="label-mono text-xs text-gold">
              Mot de passe
            </label>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-cream/15 bg-plum-deep/60 px-4 py-3 focus-within:border-gold">
              <Lock size={16} className="text-cream/40" aria-hidden="true" />
              <input
                id="passphrase"
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="w-full bg-transparent text-sm text-cream outline-none placeholder:text-cream/35"
                placeholder="••••••••"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p role="alert" className="mt-2 flex items-center gap-1 text-xs text-coral">
                <AlertCircle size={13} aria-hidden="true" /> {errorMsg}
              </p>
            )}

            <motion.button
              type="submit"
              disabled={!passphrase.trim() || state === "loading"}
              whileHover={{ scale: passphrase.trim() ? 1.02 : 1 }}
              whileTap={{ scale: passphrase.trim() ? 0.98 : 1 }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-bold text-plum-deep transition-opacity disabled:opacity-40 sm:text-base"
            >
              {state === "loading" ? (
                <Loader2 size={18} className="animate-spin" aria-hidden="true" />
              ) : (
                <Lock size={18} aria-hidden="true" />
              )}
              {state === "loading" ? "Vérification..." : "Déverrouiller"}
            </motion.button>
          </form>
        ) : (
          <div>
            <p className="mb-6 text-center text-sm text-cream/60">
              {wishes.length} vœu{wishes.length > 1 ? "x" : ""} reçu
              {wishes.length > 1 ? "s" : ""}
            </p>

            {wishes.length === 0 ? (
              <p className="text-center text-sm text-cream/50">
                Aucun vœu pour l&apos;instant.
              </p>
            ) : (
              <ul className="flex flex-col gap-3">
                {wishes.map((wish) => (
                  <motion.li
                    key={wish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass rounded-xl p-4"
                  >
                    <p className="text-sm text-cream">{wish.message}</p>
                    <p className="label-mono mt-2 text-[0.65rem] text-cream/40">
                      {new Date(wish.createdAt).toLocaleString("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

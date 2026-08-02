"use client";

import { motion } from "framer-motion";
import { MessageCircle, Gift } from "lucide-react";
import ScrollCue from "@/components/ScrollCue";

const PHONE = "237681920007";
const MESSAGE =
  "Bonjour Valdes ! Je voudrais te faire une surprise en participant à ta cagnotte d'anniversaire, comment je peux faire un dépôt ?";
const WHATSAPP_URL = `https://wa.me/${PHONE}?text=${encodeURIComponent(MESSAGE)}`;

export default function Cagnotte() {
  return (
    <section
      id="cagnotte"
      className="relative flex min-h-screen w-full flex-col items-center justify-center bg-plum-deep px-4 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="glass relative w-full max-w-xl overflow-hidden rounded-3xl p-8 text-center sm:p-12"
      >
        <div
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gold/25 blur-3xl animate-pulse-glow"
          aria-hidden="true"
        />

        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold">
          <Gift size={30} aria-hidden="true" />
        </div>

        <p className="label-mono relative mt-6 text-xs text-gold">Cagnotte d&apos;anniversaire</p>

        <h2 className="section-heading relative mt-3 text-4xl text-cream sm:text-5xl">
          Envie de contribuer ?
        </h2>

        <p className="relative mx-auto mt-4 max-w-md text-balance text-sm text-cream/75 sm:text-base">
          Pas de paiement en ligne ici. Si tu as envie de lui faire une
          surprise en faisant un dépôt, fais-le tout simplement — écris à
          Valdes sur WhatsApp et il t&apos;expliquera comment faire.
        </p>

        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-teal px-6 py-3 text-sm font-bold text-plum-deep shadow-[0_10px_30px_rgba(46,196,182,0.35)] transition-shadow hover:shadow-[0_12px_36px_rgba(46,196,182,0.5)] sm:text-base"
        >
          <MessageCircle size={20} aria-hidden="true" />
          Écrire sur WhatsApp
        </motion.a>
      </motion.div>

      <ScrollCue href="#gateau" label="Gâteau" />
    </section>
  );
}

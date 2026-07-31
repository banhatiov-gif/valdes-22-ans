"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Check } from "lucide-react";

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: "Valdes fête ses 22 ans",
      text: "Viens souhaiter un joyeux anniversaire à Valdes !",
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // the user closed the native share sheet — nothing to do
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard blocked by the browser — no fallback needed here
    }
  }

  return (
    <motion.button
      type="button"
      onClick={handleShare}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 1 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="glass fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-cream shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-colors hover:text-gold"
      aria-label={copied ? "Lien copié" : "Partager cette page"}
    >
      {copied ? <Check size={20} aria-hidden="true" /> : <Share2 size={20} aria-hidden="true" />}
    </motion.button>
  );
}

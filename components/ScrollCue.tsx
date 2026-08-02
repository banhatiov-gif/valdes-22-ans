"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function ScrollCue({ href, label }: { href: string; label: string }) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="group relative z-10 mx-auto mt-16 flex w-fit flex-col items-center gap-1.5 text-cream/50 transition-colors hover:text-gold"
      aria-label={`Continuer vers ${label}`}
    >
      <span className="label-mono text-[0.65rem] uppercase tracking-wider">{label}</span>
      <motion.span
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={20} aria-hidden="true" />
      </motion.span>
    </motion.a>
  );
}

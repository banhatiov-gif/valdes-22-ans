"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Gift, Cake, BookHeart, Footprints } from "lucide-react";

const LINKS = [
  { href: "#hero", label: "Accueil", icon: Sparkles },
  { href: "#livre-or", label: "Livre d'or", icon: BookHeart },
  { href: "#cagnotte", label: "Cagnotte", icon: Gift },
  { href: "#gateau", label: "Gâteau", icon: Cake },
  { href: "#galerie", label: "Chemin", icon: Footprints },
] as const;

export default function Nav() {
  const [active, setActive] = useState<string>("#hero");
  const [reduceMotion, setReduceMotion] = useState(false);
  const { scrollYProgress } = useScroll();
  const dotLeft = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const sections = LINKS.map((link) =>
      document.querySelector(link.href)
    ).filter((el): el is Element => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed top-4 left-1/2 z-50 max-w-[calc(100vw-1.5rem)] -translate-x-1/2">
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
        aria-label="Navigation principale"
      >
        <ul className="glass no-scrollbar flex items-center gap-1 overflow-x-auto rounded-full px-2 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = active === href;
            return (
              <li key={href} className="shrink-0">
                <a
                  href={href}
                  aria-current={isActive ? "true" : undefined}
                  aria-label={label}
                  className={`relative flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full px-3 py-3 text-xs font-semibold transition-colors sm:min-h-0 sm:min-w-0 sm:px-4 sm:py-2 sm:text-sm ${
                    isActive
                      ? "text-plum-deep"
                      : "text-cream/80 hover:text-cream"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-gold"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon
                    className="relative z-10 h-6 w-6 shrink-0 sm:h-[15px] sm:w-[15px]"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 hidden sm:inline">{label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* scroll progress — echoes the dotted "path" from the story gallery */}
        <div
          className="relative mx-3 mt-1.5 h-1 rounded-full bg-cream/10"
          aria-hidden="true"
        >
          <motion.div
            className="h-full origin-left rounded-full bg-gold/80"
            style={{ scaleX: scrollYProgress }}
          />
          {!reduceMotion && (
            <motion.span
              className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_10px_4px_rgba(240,180,41,0.55)]"
              style={{ left: dotLeft }}
            />
          )}
        </div>
      </motion.nav>
    </div>
  );
}

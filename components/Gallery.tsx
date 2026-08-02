"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Baby, GraduationCap, Award, Code2, Heart, type LucideIcon } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";

interface StoryPhoto {
  src: string;
  alt: string;
}

interface StoryChapter {
  label: string;
  title: string;
  caption: string;
  icon: LucideIcon;
  photos: StoryPhoto[];
}

// Pour ajouter une photo : dépose le fichier dans /public/photos/ puis
// ajoute { src: "/photos/nom-du-fichier.jpg", alt: "..." } au chapitre voulu.
const CHAPTERS: StoryChapter[] = [
  {
    label: "Chapitre 01",
    title: "La naissance",
    caption: "Là où tout a commencé.",
    icon: Baby,
    photos: [
      { src: "/photos/moi-bebe.jpg", alt: "Valdes bébé" },
      { src: "/photos/moi-portrait-2ans.png", alt: "Portrait de Valdes à 2 ans" },
    ],
  },
  {
    label: "Chapitre 02",
    title: "Le lycée",
    caption: "Les années d'apprentissage.",
    icon: GraduationCap,
    photos: [
      { src: "/photos/moi-terminale.jpg", alt: "Valdes en terminale" },
      { src: "/photos/moi-lycee.jpg", alt: "Valdes au lycée" },
    ],
  },
  {
    label: "Chapitre 03",
    title: "Le diplôme",
    caption: "Institut Africain d'Informatique — le jour où le travail a payé.",
    icon: Award,
    photos: [
      { src: "/photos/moi-diplome-ingenieur.jpg", alt: "Valdes diplômé ingénieur" },
      { src: "/photos/moi-avec-diplome.jpg", alt: "Valdes avec son diplôme" },
    ],
  },
  {
    label: "Chapitre 04",
    title: "Aujourd'hui",
    caption: "Développeur, et l'histoire continue.",
    icon: Code2,
    photos: [
      { src: "/photos/moi-maintenant.jpg", alt: "Valdes aujourd'hui" },
      { src: "/photos/moi-maintenant-2.jpg", alt: "Valdes aujourd'hui, autre photo" },
    ],
  },
];

const ROTATIONS = ["-rotate-3", "rotate-2", "-rotate-2", "rotate-3", "-rotate-1", "rotate-1"];

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.7", "end 0.3"],
  });
  const markerTop = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="galerie" className="relative w-full overflow-hidden bg-plum-deep px-4 py-24">
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <p className="label-mono text-xs text-teal">Souvenirs</p>
          <h2 className="section-heading mt-3 text-3xl text-cream sm:text-4xl">
            Le chemin parcouru
          </h2>
        </motion.div>

        <div ref={containerRef} className="relative">
          {/* the trail — a winding dotted path running through the whole story */}
          <div
            className="story-path pointer-events-none absolute inset-y-0 left-3 w-10 sm:left-1/2 sm:-translate-x-1/2"
            aria-hidden="true"
          />

          {/* a small glow that travels down the trail as you scroll */}
          {!reduceMotion && (
            <motion.div
              className="pointer-events-none absolute left-3 -translate-x-1/2 sm:left-1/2"
              style={{ top: markerTop }}
              aria-hidden="true"
            >
              <div className="h-3 w-3 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_16px_6px_rgba(240,180,41,0.55)]" />
            </motion.div>
          )}

          <ol className="flex flex-col gap-20 sm:gap-28">
            {CHAPTERS.map((chapter, chapterIndex) => {
              const isRight = chapterIndex % 2 === 1;
              return (
                <li key={chapter.title} className="relative">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.6 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.5 }}
                    className="absolute left-3 top-0 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-gold bg-plum-deep text-gold shadow-[0_0_20px_rgba(240,180,41,0.35)] sm:left-1/2 sm:h-11 sm:w-11"
                    aria-hidden="true"
                  >
                    <chapter.icon size={16} className="sm:hidden" />
                    <chapter.icon size={18} className="hidden sm:block" />
                  </motion.div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-16">
                    <div className={isRight ? "sm:col-start-2" : "sm:col-start-1"}>
                      <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.6 }}
                        className="pl-12 sm:pl-0"
                      >
                        <p className="label-mono text-xs text-coral">{chapter.label}</p>
                        <h3 className="section-heading mt-2 text-2xl text-cream sm:text-3xl">
                          {chapter.title}
                        </h3>
                        <p className="mt-2 max-w-xs text-sm text-cream/60">{chapter.caption}</p>
                      </motion.div>

                      <div className="mt-6 grid max-w-xs grid-cols-2 gap-x-4 pl-12 sm:gap-x-5 sm:pl-0">
                        {chapter.photos.map((photo, i) => (
                          <motion.div
                            key={photo.alt}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                            whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
                            className={`${
                              ROTATIONS[(chapterIndex * 3 + i) % ROTATIONS.length]
                            } rounded-sm bg-cream p-2 pb-5 shadow-[0_16px_32px_rgba(0,0,0,0.45)] transition-shadow hover:shadow-[0_20px_44px_rgba(0,0,0,0.55)] sm:p-2.5 sm:pb-6`}
                          >
                            <div className="relative aspect-square w-full overflow-hidden bg-plum-light/40">
                              <Image
                                src={photo.src}
                                alt={photo.alt}
                                fill
                                sizes="(max-width: 640px) 40vw, 22vw"
                                className="object-cover"
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          onViewportEnter={() => fireConfetti({ particleCount: 200 })}
          transition={{ duration: 0.7 }}
          className="glass mx-auto mt-24 max-w-md rounded-2xl p-8 text-center"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold/15 text-gold">
            <Heart size={22} aria-hidden="true" />
          </div>
          <p className="label-mono mt-4 text-xs text-gold">Tu es arrivé jusqu&apos;au bout</p>
          <h3 className="section-heading mt-3 text-2xl text-cream sm:text-3xl">
            Merci d&apos;être là
          </h3>
          <p className="mx-auto mt-3 max-w-sm text-sm text-cream/70">
            Merci d&apos;avoir pris le temps de faire défiler toute cette page
            jusqu&apos;ici. Ça compte énormément pour moi.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

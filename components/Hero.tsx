"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronDown, CalendarHeart } from "lucide-react";
import { fireConfetti } from "@/lib/confetti";

const BIRTHDAY = new Date("2026-08-03T00:00:00+01:00");
const BIRTHDAY_END = new Date("2026-08-04T00:00:00+01:00");

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isToday: boolean;
  isPast: boolean;
}

function getCountdown(): Countdown {
  const now = Date.now();
  const diff = BIRTHDAY.getTime() - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isToday: now < BIRTHDAY_END.getTime(),
      isPast: now >= BIRTHDAY_END.getTime(),
    };
  }

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
    isToday: false,
    isPast: false,
  };
}

const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53) % 100}%`,
  size: 2 + ((i * 7) % 4),
  duration: 8 + (i % 6) * 2,
  delay: (i % 10) * 0.6,
  driftX: `${(i % 2 === 0 ? 1 : -1) * (20 + (i % 5) * 8)}px`,
  driftY: `${-30 - (i % 6) * 10}px`,
}));

export default function Hero() {
  const photoRef = useRef<HTMLButtonElement>(null);
  const [canTilt, setCanTilt] = useState(false);
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    setCanTilt(window.matchMedia("(pointer: fine) and (hover: hover)").matches);
    setCountdown(getCountdown());
    const interval = setInterval(() => setCountdown(getCountdown()), 1_000);
    return () => clearInterval(interval);
  }, []);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mvY, [-0.5, 0.5], [10, -10]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mvX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 150,
    damping: 20,
  });

  function handleMouseMove(event: React.MouseEvent<HTMLButtonElement>) {
    if (!canTilt) return;
    const rect = event.currentTarget.getBoundingClientRect();
    mvX.set((event.clientX - rect.left) / rect.width - 0.5);
    mvY.set((event.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    mvX.set(0);
    mvY.set(0);
  }

  function handlePhotoClick(event: React.MouseEvent<HTMLButtonElement>) {
    fireConfetti({
      originX: event.clientX / window.innerWidth,
      originY: event.clientY / window.innerHeight,
      particleCount: 160,
    });
  }

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden px-4 pb-24 pt-32"
      style={{
        background:
          "radial-gradient(circle at 50% 38%, var(--plum-light) 0%, var(--plum) 38%, var(--plum-deep) 78%)",
      }}
    >
      {/* ambient drifting particles */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <span
            key={p.id}
            className={`absolute rounded-full bg-gold/70 animate-drift ${
              i % 3 === 0 ? "hidden sm:block" : ""
            }`}
            style={
              {
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                "--drift-x": p.driftX,
                "--drift-y": p.driftY,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* huge outlined "22" behind the photo */}
      <div
        className="pointer-events-none absolute left-1/2 top-[16%] -translate-x-[38%] select-none text-stroke-gold font-display text-[9rem] font-extrabold leading-none sm:top-[14%] sm:text-[15rem] md:text-[20rem]"
        aria-hidden="true"
      >
        22
      </div>

      <div className="relative z-10 flex flex-col items-center">
        {/* glow halo */}
        <div className="relative flex items-center justify-center">
          <div
            className="absolute h-[280px] w-[280px] rounded-full bg-gold/30 blur-3xl animate-pulse-glow sm:h-[360px] sm:w-[360px]"
            aria-hidden="true"
          />
          <motion.button
            ref={photoRef}
            type="button"
            onClick={handlePhotoClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={canTilt ? { rotateX, rotateY, transformPerspective: 800 } : undefined}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            whileTap={{ scale: 0.96 }}
            className="blob-mask relative h-[240px] w-[240px] overflow-hidden border-2 border-gold/40 shadow-[0_20px_60px_rgba(0,0,0,0.55)] sm:h-[320px] sm:w-[320px]"
            aria-label="Photo de Valdes — cliquer pour faire éclater des confettis"
          >
            <Image
              src="/photos/hero.jpg"
              alt="Portrait de Valdes Banhatio"
              fill
              priority
              sizes="(max-width: 640px) 240px, 320px"
              className="object-cover"
            />
          </motion.button>
        </div>

        {/* name overlapping the photo */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="-mt-6 text-center font-display text-4xl font-bold text-cream drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)] sm:-mt-8 sm:text-6xl md:text-7xl"
        >
          Valdes Banhatio
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          className="label-mono mt-4 text-sm text-gold sm:text-base"
        >
          Fête ses 22 ans
        </motion.p>

        {countdown && !countdown.isPast && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
            className="mt-6 flex flex-col items-center gap-3"
          >
            <div className="label-mono flex items-center gap-1.5 text-xs text-cream/70 sm:text-sm">
              <CalendarHeart size={14} className="text-gold" aria-hidden="true" />
              Lundi 3 août
            </div>

            {countdown.isToday ? (
              <p className="label-mono text-sm text-gold sm:text-base">
                C&apos;est aujourd&apos;hui !
              </p>
            ) : (
              <div
                className="flex items-center gap-2 sm:gap-3"
                role="timer"
                aria-label={`Compte à rebours : ${countdown.days} jours, ${countdown.hours} heures, ${countdown.minutes} minutes et ${countdown.seconds} secondes avant l'anniversaire`}
              >
                {[
                  { value: countdown.days, label: "Jours" },
                  { value: countdown.hours, label: "Heures" },
                  { value: countdown.minutes, label: "Min" },
                  { value: countdown.seconds, label: "Sec" },
                ].map((unit) => (
                  <div
                    key={unit.label}
                    className="glass flex w-14 flex-col items-center rounded-xl py-2 sm:w-16 sm:py-2.5"
                  >
                    <span className="font-display text-xl font-bold text-gold tabular-nums sm:text-2xl">
                      {String(unit.value).padStart(2, "0")}
                    </span>
                    <span className="label-mono text-[0.6rem] text-cream/60">{unit.label}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>

      <motion.a
        href="#cagnotte"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1, duration: 0.6 }, y: { delay: 1.4, duration: 2, repeat: Infinity } }}
        className="absolute bottom-8 z-10 text-cream/70 transition-colors hover:text-gold"
        aria-label="Défiler vers la section suivante"
      >
        <ChevronDown size={28} />
      </motion.a>
    </section>
  );
}

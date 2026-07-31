interface ConfettiOptions {
  /** 0–1, relative to viewport width */
  originX?: number;
  /** 0–1, relative to viewport height */
  originY?: number;
  particleCount?: number;
  colors?: string[];
}

const DEFAULT_COLORS = ["#F0B429", "#F0552E", "#2EC4B6", "#FDF6E3"];

export function fireConfetti(options: ConfettiOptions = {}): void {
  if (typeof window === "undefined") return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const {
    originX = 0.5,
    originY = 0.5,
    particleCount = 140,
    colors = DEFAULT_COLORS,
  } = options;

  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100vw";
  canvas.style.height = "100vh";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "100";
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const h = window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    canvas.remove();
    return;
  }
  ctx.scale(dpr, dpr);

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    rotationSpeed: number;
  }

  const particles: Particle[] = Array.from({ length: particleCount }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = 4 + Math.random() * 9;
    return {
      x: originX * w,
      y: originY * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      size: 5 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)] ?? "#F0B429",
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.4,
    };
  });

  const gravity = 0.18;
  const drag = 0.985;
  const maxFrames = 130;
  let frame = 0;

  function tick() {
    if (!ctx) return;
    frame++;
    ctx.clearRect(0, 0, w, h);
    const life = Math.max(0, 1 - frame / maxFrames);

    particles.forEach((p) => {
      p.vx *= drag;
      p.vy = p.vy * drag + gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      ctx.save();
      ctx.globalAlpha = life;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    });

    if (frame < maxFrames) {
      requestAnimationFrame(tick);
    } else {
      canvas.remove();
    }
  }

  requestAnimationFrame(tick);
}

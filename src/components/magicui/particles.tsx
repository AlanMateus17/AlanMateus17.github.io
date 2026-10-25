"use client";
/**
 * Partículas "aura" no fundo do hero — reagem ao cursor (se afastam
 * levemente dele) e usam as cores da Aura (teal claro e dourado).
 * Inspirado no componente Particles da Magic UI (MIT), reescrito aqui.
 * Respeita "reduzir movimento" do sistema: nesse caso fica parado.
 */
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  quantity?: number;
  /** Força com que as partículas fogem do cursor (0 = não reagem). */
  repel?: number;
};

type Dot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ox: number;
  oy: number;
  r: number;
  alpha: number;
  gold: boolean;
};

function readColor(name: string, fallback: string) {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v || fallback;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.replace(/(.)/g, "$1$1") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export default function Particles({ className, quantity = 70, repel = 70 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let raf = 0;
    const mouse = { x: -9999, y: -9999 };
    let teal = hexToRgb(readColor("--aura-900", "#7fc4c9"));
    let gold = hexToRgb(readColor("--gold-500", "#d9a85e"));

    function seed() {
      const rect = wrap!.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(quantity * Math.min(1, Math.max(0.45, w / 1200)));
      dots = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x,
          y,
          ox: x,
          oy: y,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18,
          r: 0.8 + Math.random() * 1.8,
          alpha: 0.2 + Math.random() * 0.5,
          gold: Math.random() < 0.3,
        };
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (!reduced) {
          d.ox += d.vx;
          d.oy += d.vy;
          if (d.ox < 0 || d.ox > w) d.vx *= -1;
          if (d.oy < 0 || d.oy > h) d.vy *= -1;
          let tx = d.ox;
          let ty = d.oy;
          const dx = d.ox - mouse.x;
          const dy = d.oy - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (repel > 0 && dist < 140 && dist > 0.01) {
            const push = (1 - dist / 140) * repel;
            tx += (dx / dist) * push;
            ty += (dy / dist) * push;
          }
          d.x += (tx - d.x) * 0.08;
          d.y += (ty - d.y) * 0.08;
        }
        const [r, g, b] = d.gold ? gold : teal;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${d.alpha})`;
        ctx!.fill();
      }
      if (!reduced) raf = requestAnimationFrame(draw);
    }

    function onMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }

    const themeObserver = new MutationObserver(() => {
      teal = hexToRgb(readColor("--aura-900", "#7fc4c9"));
      gold = hexToRgb(readColor("--gold-500", "#d9a85e"));
      if (reduced) draw();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    const ro = new ResizeObserver(() => {
      seed();
      if (reduced) draw();
    });
    ro.observe(wrap);

    seed();
    draw();
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [quantity, repel]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

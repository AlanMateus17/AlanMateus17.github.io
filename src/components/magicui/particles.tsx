"use client";
/**
 * Partículas "aura" no fundo do hero — reagem ao cursor (se afastam
 * levemente dele) e usam as cores da Aura (teal claro e dourado).
 * Inspirado no componente Particles da Magic UI (MIT), reescrito aqui.
 *
 * Desempenho (pra não travar celular):
 *  - só anima enquanto o hero está visível na tela e a aba está aberta;
 *  - no celular desenha menos partículas e a 30 quadros por segundo;
 *  - "reduzir movimento" do sistema: desenha uma vez e fica parado.
 */
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  quantity?: number;
  /** Força com que as partículas fogem do cursor (0 = não reagem). */
  repel?: number;
};

type Dot = { x: number; y: number; vx: number; vy: number; ox: number; oy: number; r: number; gold: boolean; alpha: number };

function readColor(name: string, fallback: string) {
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
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const lowPower = coarse || (navigator.hardwareConcurrency ?? 8) <= 4;
    const frameMs = lowPower ? 1000 / 30 : 1000 / 60;
    const dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1.5 : 2);

    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let raf = 0;
    let last = 0;
    let visible = false;
    let running = false;
    const mouse = { x: -9999, y: -9999 };
    let teal = hexToRgb(readColor("--aura-900", "#7fc4c9"));
    let gold = hexToRgb(readColor("--gold-500", "#d9a85e"));
    let tealFill = "";
    let goldFill = "";
    const paints = () => {
      tealFill = `rgb(${teal.join(",")})`;
      goldFill = `rgb(${gold.join(",")})`;
    };
    paints();

    function seed() {
      const rect = wrap!.getBoundingClientRect();
      if (rect.width === w && rect.height === h && dots.length) return;
      w = rect.width;
      h = rect.height;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const scale = Math.min(1, Math.max(0.4, w / 1200)) * (lowPower ? 0.6 : 1);
      const count = Math.max(12, Math.round(quantity * scale));
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

    function paint(step: number) {
      ctx!.clearRect(0, 0, w, h);
      for (const d of dots) {
        if (step > 0) {
          d.ox += d.vx * step;
          d.oy += d.vy * step;
          if (d.ox < 0 || d.ox > w) d.vx *= -1;
          if (d.oy < 0 || d.oy > h) d.vy *= -1;
          let tx = d.ox;
          let ty = d.oy;
          if (repel > 0) {
            const dx = d.ox - mouse.x;
            const dy = d.oy - mouse.y;
            const dist2 = dx * dx + dy * dy;
            if (dist2 < 19600 && dist2 > 0.01) {
              const dist = Math.sqrt(dist2);
              const push = (1 - dist / 140) * repel;
              tx += (dx / dist) * push;
              ty += (dy / dist) * push;
            }
          }
          const k = Math.min(1, 0.08 * step);
          d.x += (tx - d.x) * k;
          d.y += (ty - d.y) * k;
        }
        ctx!.globalAlpha = d.alpha;
        ctx!.fillStyle = d.gold ? goldFill : tealFill;
        ctx!.beginPath();
        ctx!.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
    }

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      const elapsed = now - last;
      if (elapsed < frameMs - 1) return;
      last = now;
      paint(Math.min(3, elapsed / (1000 / 60)));
    }

    function start() {
      if (running || reduced || !visible || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    function onMove(e: PointerEvent) {
      if (!running) return;
      const rect = wrap!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) start();
        else stop();
      },
      { rootMargin: "50px" },
    );
    io.observe(wrap);

    const themeObserver = new MutationObserver(() => {
      teal = hexToRgb(readColor("--aura-900", "#7fc4c9"));
      gold = hexToRgb(readColor("--gold-500", "#d9a85e"));
      paints();
      if (!running) paint(0);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    let resizeTimer: ReturnType<typeof setTimeout>;
    const ro = new ResizeObserver(() => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        seed();
        if (!running) paint(0);
      }, 120);
    });
    ro.observe(wrap);

    seed();
    paint(0);
    if (!coarse) window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      clearTimeout(resizeTimer);
      io.disconnect();
      ro.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [quantity, repel]);

  return (
    <div ref={wrapRef} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}

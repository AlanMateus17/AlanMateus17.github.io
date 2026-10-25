"use client";
/**
 * Linha que "se escreve sozinha" no hero da Home (frases vêm do content/site.yml).
 * Pausa quando sai da tela ou a aba fica em segundo plano, pra não gastar
 * bateria nem redesenhar a página à toa.
 */
import { useEffect, useRef, useState } from "react";

export default function Typewriter({ phrases }: { phrases: string[] }) {
  const [text, setText] = useState(phrases[0] ?? "");
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!phrases.length || !el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let phrase = 0;
    let chars = phrases[0].length;
    let deleting = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let visible = true;

    const schedule = (ms: number) => {
      clearTimeout(timer);
      if (visible && !document.hidden) timer = setTimeout(tick, ms);
    };
    function tick() {
      const current = phrases[phrase];
      if (!deleting) {
        chars++;
        setText(current.slice(0, chars));
        if (chars >= current.length) {
          deleting = true;
          return schedule(2200);
        }
      } else {
        chars--;
        setText(current.slice(0, Math.max(0, chars)));
        if (chars <= 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
        }
      }
      schedule(deleting ? 40 : 75);
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) schedule(300);
      else clearTimeout(timer);
    });
    io.observe(el);
    const onVis = () => (document.hidden ? clearTimeout(timer) : schedule(300));
    document.addEventListener("visibilitychange", onVis);
    schedule(2200);

    return () => {
      clearTimeout(timer);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [phrases]);

  return (
    <p ref={ref} className="font-mono text-[15px] text-aura sm:text-base" aria-label={phrases.join(" · ")}>
      <span aria-hidden="true">
        <span className="text-gold">&gt;</span> {text}
        <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-gold" />
      </span>
    </p>
  );
}

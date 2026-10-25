"use client";
/** Linha que "se escreve sozinha" no hero da Home (frases vêm do content/site.yml). */
import { useEffect, useState } from "react";

export default function Typewriter({ phrases }: { phrases: string[] }) {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (!phrases.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let phrase = 0;
    let chars = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;
    setText("");
    const tick = () => {
      const current = phrases[phrase];
      if (!deleting) {
        chars++;
        setText(current.slice(0, chars));
        if (chars === current.length) {
          deleting = true;
          timer = setTimeout(tick, 2200);
          return;
        }
      } else {
        chars--;
        setText(current.slice(0, chars));
        if (chars === 0) {
          deleting = false;
          phrase = (phrase + 1) % phrases.length;
        }
      }
      timer = setTimeout(tick, deleting ? 40 : 75);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [phrases]);

  return (
    <p className="font-mono text-[15px] text-aura sm:text-base" aria-label={phrases.join(" · ")}>
      <span aria-hidden="true">
        <span className="text-gold">&gt;</span> {text}
        <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] animate-pulse bg-gold" />
      </span>
    </p>
  );
}

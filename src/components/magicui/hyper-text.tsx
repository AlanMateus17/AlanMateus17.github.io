"use client";
/**
 * Efeito de "decodificação" no título: as letras começam embaralhadas e vão
 * se resolvendo da esquerda pra direita. Roda ao carregar e de novo ao passar
 * o mouse. Inspirado no HyperText da Magic UI (MIT), reescrito aqui.
 * O texto real fica sempre no DOM (num span só pra leitor de tela), então leitores de tela e
 * buscadores leem o nome certo desde o primeiro momento.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*+=<>/\\01";

type Props = {
  text: string;
  className?: string;
  /** Duração total da animação em ms. */
  duration?: number;
  as?: "h1" | "h2" | "span" | "p";
};

export default function HyperText({ text, className, duration = 900, as: Tag = "span" }: Props) {
  const [display, setDisplay] = useState(text);
  const running = useRef(false);
  const frame = useRef(0);

  const run = useCallback(() => {
    if (running.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    running.current = true;
    const start = performance.now();
    const chars = Array.from(text);
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const resolved = Math.floor(progress * chars.length);
      setDisplay(
        chars
          .map((c, i) => (c === " " || i < resolved ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
          .join(""),
      );
      if (progress < 1) {
        frame.current = requestAnimationFrame(tick);
      } else {
        setDisplay(text);
        running.current = false;
      }
    };
    frame.current = requestAnimationFrame(tick);
  }, [text, duration]);

  useEffect(() => {
    run();
    return () => cancelAnimationFrame(frame.current);
  }, [run]);

  return (
    <Tag className={cn("inline-block", className)} onMouseEnter={run}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </Tag>
  );
}

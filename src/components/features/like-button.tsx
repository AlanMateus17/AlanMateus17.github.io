"use client";
/**
 * Botão de curtir (posts, comentários e projetos). Usa o CounterAPI com as
 * mesmas chaves do site antigo, e guarda no navegador quem já curtiu
 * (chave "liked:<chave>") pra não contar duas vezes.
 */
import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { incrementCount, readCount } from "@/lib/counter";
import { KEYS, getItem, setItem } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = {
  namespace: string;
  likeKey: string;
  size?: "sm" | "md";
  label?: string;
  onLiked?: () => void;
};

export default function LikeButton({ namespace, likeKey, size = "sm", label, onLiked }: Props) {
  const [count, setCount] = useState<number | null>(null);
  const [liked, setLiked] = useState(false);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    setLiked(!!getItem(KEYS.liked(likeKey)));
    readCount(namespace, "like", likeKey)
      .then(setCount)
      .catch(() => setCount(0))
      .finally(() => setBusy(false));
  }, [namespace, likeKey]);

  function like() {
    if (liked || busy) return;
    setBusy(true);
    incrementCount(namespace, "like", likeKey)
      .then((v) => {
        setItem(KEYS.liked(likeKey), "1");
        setLiked(true);
        setCount(v || (count ?? 0) + 1);
        onLiked?.();
      })
      .catch(() => {})
      .finally(() => setBusy(false));
  }

  return (
    <button
      type="button"
      onClick={like}
      disabled={busy && count === null}
      aria-pressed={liked}
      aria-label={liked ? `Você curtiu${label ? ` ${label}` : ""}` : `Curtir${label ? ` ${label}` : ""}`}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border font-mono transition-colors",
        size === "md" ? "h-12 px-5 text-sm" : "h-11 px-4 text-xs",
        liked ? "border-gold bg-gold-tint text-gold-ink" : "border-line text-muted hover:border-gold hover:text-ink",
      )}
    >
      <Heart className={cn(size === "md" ? "size-[18px]" : "size-4", liked && "fill-current")} aria-hidden="true" />
      <span>{count === null ? "–" : count}</span>
    </button>
  );
}

"use client";
/**
 * "Continue seus estudos": sugere o próximo post ainda não lido, na ordem
 * cronológica (a mesma do plano de estudos). O histórico fica só no navegador.
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { KEYS, getList } from "@/lib/storage";

export type GuidePost = { slug: string; title: string; url: string; tag: string };

export default function StudyGuide({ posts, className }: { posts: GuidePost[]; className?: string }) {
  const [next, setNext] = useState<GuidePost | null | undefined>(undefined);
  useEffect(() => {
    const lidos = getList(KEYS.postsLidos);
    setNext(posts.find((p) => !lidos.includes(p.slug)) ?? null);
  }, [posts]);
  if (next === undefined || posts.length === 0) return null;
  return (
    <div className={`card flex flex-wrap items-center justify-between gap-3 border-dashed border-gold/70 p-5 ${className ?? ""}`}>
      {next ? (
        <>
          <p className="eyebrow">Continue seus estudos</p>
          <Link href={next.url} className="font-display text-lg font-semibold text-ink hover:text-aura">
            {next.title} →
          </Link>
        </>
      ) : (
        <p className="text-[15px] text-ink">Você está em dia com todos os artigos publicados até agora!</p>
      )}
    </div>
  );
}

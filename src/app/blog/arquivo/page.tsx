import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import { getPosts } from "@/lib/content";

export const metadata: Metadata = { title: "Arquivo", description: "Todos os posts do blog, organizados por ano." };

export default function ArquivoPage() {
  const porAno = new Map<string, ReturnType<typeof getPosts>>();
  for (const p of getPosts()) {
    if (!porAno.has(p.year)) porAno.set(p.year, []);
    porAno.get(p.year)!.push(p);
  }
  return (
    <>
      <PageHero eyebrow="Blog" title="Arquivo" accent="completo." description="Todos os posts publicados, do mais recente ao mais antigo." />
      <Section narrow>
        {porAno.size === 0 && <p className="text-muted">Ainda não há posts publicados.</p>}
        {[...porAno.entries()].map(([ano, posts]) => (
          <div key={ano} className="mb-12">
            <h2 className="font-display text-3xl font-semibold">
              {ano} <span className="font-mono text-base text-muted">({posts.length})</span>
            </h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {posts.map((p) => (
                <li key={p.url} className="flex gap-5 py-4">
                  <span className="w-14 shrink-0 font-mono text-sm text-gold-ink">
                    {p.day}/{p.month}
                  </span>
                  <Link href={p.url} className="text-[16px] text-ink hover:text-aura">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
    </>
  );
}

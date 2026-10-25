import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import { getTags, slugify, formatDateBR } from "@/lib/content";

export const metadata: Metadata = { title: "Tags", description: "Todos os posts do blog organizados por assunto." };

export default function TagsPage() {
  const tags = getTags();
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Navegar"
        accent="por assunto."
        description="Todos os posts, agrupados pelas tags que uso pra classificar cada um."
      />
      <Section narrow>
        {tags.length === 0 ? (
          <p className="text-muted">Ainda não há posts com tags pra mostrar aqui.</p>
        ) : (
          <>
            <nav aria-label="Tags" className="flex flex-wrap gap-2">
              {tags.map(({ tag, posts }) => (
                <a key={tag} href={`#tag-${slugify(tag)}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-3.5 font-mono text-sm text-muted hover:border-gold hover:text-ink">
                  #{tag} ({posts.length})
                </a>
              ))}
            </nav>
            {tags.map(({ tag, posts }) => (
              <div key={tag} id={`tag-${slugify(tag)}`} className="mt-12 scroll-mt-24">
                <h2 className="font-display text-2xl font-semibold">#{tag}</h2>
                <ul className="mt-4 flex flex-col gap-3">
                  {posts.map((p) => (
                    <li key={p.url} className="card p-5">
                      <p className="font-mono text-xs tracking-wider text-aura uppercase">{p.category}</p>
                      <Link href={p.url} className="mt-1 block font-display text-xl font-semibold hover:text-aura">
                        {p.title}
                      </Link>
                      {p.excerpt && <p className="mt-1 line-clamp-2 text-[15px] text-muted">{p.excerpt}</p>}
                      <p className="mt-2 font-mono text-xs text-muted">{formatDateBR(p.date)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </>
        )}
      </Section>
    </>
  );
}

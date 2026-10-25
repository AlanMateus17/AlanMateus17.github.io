import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import { getDepoimentos } from "@/lib/content";

export const metadata: Metadata = { title: "Depoimentos", description: "O que alunos e clientes dizem sobre o trabalho de Alan Mateus." };

export default function DepoimentosPage() {
  const deps = getDepoimentos();
  return (
    <>
      <PageHero eyebrow="Depoimentos" title="O que dizem" accent="sobre o trabalho." />
      <Section>
        {deps.length === 0 ? (
          <p className="text-muted">Ainda não tem depoimentos publicados.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {deps.map((d, i) => (
              <figure key={i} className="card flex flex-col gap-5 p-7">
                <span aria-hidden="true" className="font-display text-5xl leading-none text-gold">“</span>
                <blockquote className="font-display text-xl leading-snug text-ink">{d.texto}</blockquote>
                <figcaption className="mt-auto border-t border-dashed border-line pt-4">
                  <span className="block font-semibold text-ink">{d.nome}</span>
                  <span className="block text-sm text-muted">{d.papel}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import { getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Sobre",
  description: "Página em construção — em breve, a história completa por trás deste site.",
};

/*
 * Esta página continua com o mesmo conteúdo provisório do site antigo
 * ("em construção"). Troque os textos abaixo pelos definitivos quando quiser.
 */
const MARCOS = [
  { label: "Marco 1", texto: "Em breve, um marco importante da trajetória vai aparecer aqui." },
  { label: "Marco 2", texto: "Em breve, um marco importante da trajetória vai aparecer aqui." },
  { label: "Marco 3", texto: "Em breve, um marco importante da trajetória vai aparecer aqui." },
  { label: "Marco 4", texto: "Em breve, um marco importante da trajetória vai aparecer aqui." },
  { label: "Hoje", texto: "Em breve, o momento atual da trajetória vai aparecer aqui." },
];

const DADOS = [
  ["Localização", "Em breve"],
  ["Empresa", "Em breve"],
  ["Formação", "Em breve"],
  ["Próx. cert.", "Em breve"],
];

export default function SobrePage() {
  const site = getSite();
  return (
    <>
      <PageHero
        eyebrow="Sobre"
        title="Quem sou"
        accent="e para onde vou."
        description="Esta página ainda está em construção. Em breve, uma apresentação completa sobre quem está por trás deste site."
      />

      <Section narrow title="Minha trajetória">
        <ol className="flex flex-col">
          {MARCOS.map((m, i) => (
            <li key={m.label} className="relative flex gap-5 pb-8 last:pb-0">
              {i < MARCOS.length - 1 && <span aria-hidden="true" className="absolute top-5 left-[7px] h-full border-l border-dashed border-gold/60" />}
              <span aria-hidden="true" className="relative mt-1.5 size-[15px] shrink-0 rounded-full border-2 border-gold bg-paper" />
              <div>
                <p className="eyebrow">{m.label}</p>
                <p className="mt-1 text-ink">{m.texto}</p>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <p className="eyebrow">A história</p>
            <h2 className="mt-2 font-display text-3xl font-semibold">Em construção</h2>
            <div className="post-body mt-6">
              <p>
                Esse espaço vai contar, em breve, a história completa por trás deste site — de onde veio, o que motiva, e
                para onde está indo.
              </p>
              <p>
                Por enquanto, esse é um texto de exemplo, só pra manter a estrutura da página visível enquanto o conteúdo
                definitivo não é escrito.
              </p>
              <div className="callout callout--important">
                <p>Conteúdo em construção — volte em breve pra conhecer a história completa.</p>
              </div>
              <p>
                Cada seção desta página (trajetória, dados rápidos, stack) será preenchida com informações reais assim que
                estiver pronta.
              </p>
            </div>
          </div>
          <aside className="flex flex-col gap-4">
            <div className="card p-6">
              <p className="eyebrow mb-4">Dados rápidos</p>
              <dl className="flex flex-col gap-4">
                {DADOS.map(([k, v]) => (
                  <div key={k}>
                    <dt className="font-mono text-xs tracking-wider text-muted uppercase">{k}</dt>
                    <dd className="text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <a href={`https://github.com/${site.author.github}`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              GitHub ↗
            </a>
            <Link href="/curriculo/" className="btn btn-primary">
              Ver currículo
            </Link>
          </aside>
        </div>

        <div className="mt-16">
          <p className="eyebrow">Stack</p>
          <h3 className="mt-2 font-display text-3xl font-semibold">Com o que trabalho</h3>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card p-5">
                <p className="font-semibold text-ink">Categoria {n}</p>
                <p className="mt-2 text-sm text-muted">Em breve</p>
              </div>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}

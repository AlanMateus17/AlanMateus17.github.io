import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Roteiro Público", description: "O que já foi feito e o que vem a seguir — construindo tudo em público." };

type Item = { titulo: string; desc?: string; agora?: boolean };

const SECOES: { eyebrow: string; titulo: string; itens: Item[]; nota?: string }[] = [
  {
    eyebrow: "Agora",
    titulo: "Em andamento",
    itens: [
      { titulo: "Passo 1 do plano de estudos — Lógica de Programação + Matemática Cap. 1-2", desc: "Critério de pronto: resolver 3 exercícios de lógica pura sem travar.", agora: true },
      { titulo: "AM Kaixara — arquitetura e fundamentos", desc: "PDV multi-tenant com RLS, .NET 10, Next.js. O primeiro dos 13 sistemas a sair do papel.", agora: true },
    ],
  },
  {
    eyebrow: "Blog",
    titulo: "Próximos artigos",
    itens: [
      { titulo: "Lógica de Programação: variável, condicional, laço" },
      { titulo: "Matemática Cap. 1-2: Linguagem Matemática e Teoria dos Conjuntos" },
      { titulo: "Lógica na prática: resolvendo o exercício do carrinho com desconto" },
    ],
    nota: "Os passos seguintes do plano de estudos ainda não foram detalhados — essa lista cresce conforme cada Passo é definido.",
  },
  {
    eyebrow: "Portfólio",
    titulo: "Ordem dos sistemas",
    itens: [
      { titulo: "1. AM Kaixara — PDV multi-tenant", agora: true },
      { titulo: "2. AM Rotara — gestão de pedidos e entrega" },
      { titulo: "3. AM Rendara — gestão financeira com ARCA" },
    ],
    nota: "Cada sistema reaproveita o que o anterior construiu — por isso essa ordem específica, não é aleatória.",
  },
  {
    eyebrow: "Site",
    titulo: "Melhorias planejadas",
    itens: [
      { titulo: "Estudos de caso reais de cada sistema (assim que o código existir)" },
      { titulo: "Depoimentos reais (os atuais ainda são exemplo)" },
    ],
  },
];

export default function RoteiroPage() {
  return (
    <>
      <PageHero
        eyebrow="Construindo em público"
        title="Roteiro"
        accent="público."
        description="Sem prometer prazo fechado — só o que já está andando e o que vem depois, de verdade."
      />
      <Section narrow>
        <div className="flex flex-col gap-14">
          {SECOES.map((s) => (
            <div key={s.titulo}>
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="mt-2 font-display text-3xl font-semibold">{s.titulo}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {s.itens.map((it) => (
                  <li key={it.titulo} className={cn("card flex gap-4 p-5", !it.agora && "border-dashed")}>
                    <span
                      aria-hidden="true"
                      className={cn("mt-1.5 size-3 shrink-0 rounded-full", it.agora ? "bg-success" : "border border-gold")}
                    />
                    <div>
                      <p className="font-semibold text-ink">
                        {it.titulo}
                        {it.agora && <span className="ml-2 rounded-sm bg-success-tint px-1.5 py-0.5 align-middle font-mono text-[11px] font-normal text-success">agora</span>}
                      </p>
                      {it.desc && <p className="mt-1 text-[15px] text-muted">{it.desc}</p>}
                    </div>
                  </li>
                ))}
              </ul>
              {s.nota && <p className="mt-4 text-sm text-muted">{s.nota}</p>}
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}

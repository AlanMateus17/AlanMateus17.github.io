import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";

export const metadata: Metadata = { title: "FAQ", description: "Perguntas frequentes sobre o site, comentários e como entrar em contato." };

const FAQ: { q: string; a: React.ReactNode; text: string }[] = [
  {
    q: "Como funcionam os comentários dos posts?",
    a: "Qualquer pessoa pode comentar e responder comentários. Antes de aparecer no ar, todo comentário passa pela minha aprovação — assim evito spam e mantenho a discussão saudável.",
    text: "Qualquer pessoa pode comentar e responder comentários. Antes de aparecer no ar, todo comentário passa pela aprovação do autor.",
  },
  {
    q: "Posso curtir um post ou comentário sem me cadastrar?",
    a: "Sim. Curtidas não passam por aprovação e não pedem nenhum cadastro — é só clicar no coração.",
    text: "Sim. Curtidas não passam por aprovação e não pedem nenhum cadastro.",
  },
  {
    q: "Como faço pra saber quando sai um post novo?",
    a: "Tem uma newsletter por e-mail, separada por assunto — você escolhe só os temas que te interessam. O formulário está na Home e no fim de cada post.",
    text: "Tem uma newsletter por e-mail, separada por assunto, disponível na Home e no fim de cada post.",
  },
  {
    q: "Posso reproduzir o conteúdo dos posts em outro lugar?",
    a: (
      <>
        Pode citar trechos com link de volta pro post original. Pra reproduzir o texto inteiro, me chama antes pelo{" "}
        <Link href="/contato/" className="link">contato</Link>.
      </>
    ),
    text: "Pode citar trechos com link de volta pro post original. Pra reproduzir o texto inteiro, peça antes pelo contato.",
  },
  {
    q: "Como entro em contato pra um orçamento ou parceria?",
    a: (
      <>
        Pela página de <Link href="/servicos/#orcamento" className="link">Serviços</Link> (formulário) ou direto pelo WhatsApp, que também está lá.
      </>
    ),
    text: "Pela página de Serviços (formulário) ou direto pelo WhatsApp.",
  },
];

export default function FaqPage() {
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.text } })),
  };
  return (
    <>
      <PageHero eyebrow="FAQ" title="Perguntas" accent="frequentes." />
      <Section narrow>
        <div className="flex flex-col gap-3">
          {FAQ.map((f, i) => (
            <details key={f.q} open={i === 0} className="card group p-0">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-6 py-4 font-semibold text-ink">
                {f.q}
                <span aria-hidden="true" className="font-mono text-gold transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="border-t border-dashed border-line px-6 py-4 text-[15px] leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}

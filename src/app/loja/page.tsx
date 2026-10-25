import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import { getProdutos, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Loja",
  description: "Materiais extras, mentorias e produtos digitais de Alan Mateus — além do conteúdo gratuito do site.",
};

export default function LojaPage() {
  const produtos = getProdutos();
  const site = getSite();
  return (
    <>
      <PageHero
        eyebrow="Loja"
        title="Material extra,"
        accent="além do gratuito."
        description="Tudo que já é gratuito no site continua gratuito. Aqui ficam pacotes extras, mentorias e produtos que exigem mais tempo meu pra preparar."
      />
      <Section>
        {produtos.length === 0 ? (
          <p className="text-muted">Nenhum produto disponível no momento.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {produtos.map((p) => {
              const ativo = p.checkoutUrl && p.checkoutUrl !== "#";
              return (
                <div key={p.slug} className="card flex flex-col gap-4 p-7">
                  <span className="self-start rounded-sm bg-gold-tint px-2 py-1 font-mono text-xs text-gold-ink">{p.category}</span>
                  {p.image && <img src={p.image} alt="" className="rounded-md border border-line" />}
                  <h2 className="font-display text-2xl font-semibold">{p.title}</h2>
                  <p className="text-[15px] leading-relaxed text-muted">{p.excerpt}</p>
                  <div className="mt-auto flex items-center justify-between gap-4 border-t border-dashed border-line pt-5">
                    <span className="font-mono text-2xl text-ink">{p.price}</span>
                    {ativo ? (
                      <a href={p.checkoutUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                        Comprar
                      </a>
                    ) : (
                      <span className="rounded-sm bg-aura-tint px-2.5 py-1.5 font-mono text-xs text-muted">Em breve</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-10 text-muted">
          Prefere conversar antes?{" "}
          <Link href="/servicos/#orcamento" className="link">
            Pede um orçamento
          </Link>{" "}
          ou chama no{" "}
          <a href={`https://wa.me/${site.author.whatsapp}`} target="_blank" rel="noopener noreferrer" className="link">
            WhatsApp
          </a>
          .
        </p>
      </Section>
    </>
  );
}

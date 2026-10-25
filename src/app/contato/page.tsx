import type { Metadata } from "next";
import Link from "next/link";
import { Github, Linkedin, Mail, MessageCircle } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import FormspreeForm from "@/components/features/formspree-form";
import { getSite, isConfigured } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contato",
  description: "Entre em contato com Alan Mateus — projetos de desenvolvimento, assistência técnica ou colaboração.",
};

export default function ContatoPage() {
  const site = getSite();
  const links = [
    { href: `https://wa.me/${site.author.whatsapp}`, icon: MessageCircle, label: "WhatsApp", valor: "Resposta mais rápida" },
    { href: `https://github.com/${site.author.github}`, icon: Github, label: "GitHub", valor: site.author.github },
    { href: `https://linkedin.com/in/${site.author.linkedin}`, icon: Linkedin, label: "LinkedIn", valor: site.author.linkedin },
    { href: `mailto:${site.author.email}`, icon: Mail, label: "E-mail", valor: site.author.email },
  ];
  return (
    <>
      <PageHero
        eyebrow="Contato"
        title="Vamos"
        accent="conversar."
        description="Projeto de desenvolvimento, parceria, dúvida sobre os materiais de ensino ou só um olá — qualquer motivo é válido."
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="card p-6 sm:p-8">
            <h2 className="mb-6 font-display text-2xl font-semibold">Envie uma mensagem</h2>
            <FormspreeForm
              formId={isConfigured(site.formspree_contato_id) ? site.formspree_contato_id : null}
              sucesso="Mensagem enviada! Respondo em até 24 horas nos dias úteis."
              botao="Enviar mensagem →"
              whatsapp={site.author.whatsapp}
            >
              <div>
                <label className="label" htmlFor="nome">Nome</label>
                <input type="text" id="nome" name="nome" placeholder="Seu nome" required autoComplete="name" className="field" />
              </div>
              <div>
                <label className="label" htmlFor="email">E-mail</label>
                <input type="email" id="email" name="email" placeholder="seu@email.com" required autoComplete="email" className="field" />
              </div>
              <div>
                <label className="label" htmlFor="assunto">Assunto</label>
                <select id="assunto" name="assunto" defaultValue="" className="field">
                  <option value="">Selecione um assunto</option>
                  <option>Projeto de desenvolvimento</option>
                  <option>Assistência técnica</option>
                  <option>Material educacional</option>
                  <option>Colaboração / parceria</option>
                  <option>Outro</option>
                </select>
              </div>
              <div>
                <label className="label" htmlFor="mensagem">Mensagem</label>
                <textarea id="mensagem" name="mensagem" placeholder="Descreva o que você precisa..." required className="field min-h-36" />
              </div>
            </FormspreeForm>
          </div>

          <div>
            <h2 className="mb-6 font-display text-2xl font-semibold">Links diretos</h2>
            <ul className="flex flex-col gap-3">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="card flex items-center gap-4 p-4 transition-colors hover:border-gold/60"
                  >
                    <span className="flex size-11 items-center justify-center rounded-md bg-aura-tint text-aura">
                      <l.icon className="size-5" aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{l.label}</span>
                      <span className="block truncate text-sm text-muted">{l.valor}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-lg border border-dashed border-gold/60 p-4 text-[15px] text-ink">
              <strong>Tempo de resposta:</strong> geralmente em até 24 horas nos dias úteis.
            </p>
            <p className="mt-6 text-[15px] text-muted">
              Em evento ou reunião?{" "}
              <Link href="/contato/cartao/" className="link">
                Escaneie meu cartão de visita digital →
              </Link>
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}

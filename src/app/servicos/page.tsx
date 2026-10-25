import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Code2, Smartphone } from "lucide-react";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import FormspreeForm from "@/components/features/formspree-form";
import { getSite, isConfigured } from "@/lib/content";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Desenvolvimento de sistemas sob medida, assistência técnica Apple e Xiaomi, e formação em TI. Grupo AMtech Digital — Barbacena, MG.",
};

export default function ServicosPage() {
  const site = getSite();
  const wa = (msg: string) => `https://wa.me/${site.author.whatsapp}?text=${encodeURIComponent(msg)}`;
  const servicos = [
    {
      icon: Code2,
      nome: "Desenvolvimento de Sistemas",
      tagline: "Sob medida / Multi-tenant / Escalável",
      itens: [
        "Sistemas SaaS completos (PDV, delivery, clínicas, condomínios)",
        "APIs REST em .NET com Clean Architecture",
        "Frontends em Next.js com design system próprio",
        "Banco de dados PostgreSQL com segurança por Row-Level Security",
        "Deploy em VPS com CI/CD e monitoramento",
      ],
      wa: "Olá! Vi seu site e quero um orçamento de desenvolvimento de sistema.",
    },
    {
      icon: Smartphone,
      nome: "Assistência Técnica",
      tagline: "Apple / Xiaomi / Notebooks",
      itens: [
        "Troca de tela, bateria e conector — iPhone e Xiaomi",
        "Formatação, upgrade e diagnóstico de notebooks",
        "Recuperação de dados e backup seguro",
        "Manutenção preventiva e limpeza interna",
      ],
      nota: "// em estruturação formal",
      wa: "Olá! Vi seu site e quero um orçamento de assistência técnica.",
    },
    {
      icon: BookOpen,
      nome: "Formação em TI",
      tagline: "Apostilas / Tutoriais / Treinamentos",
      itens: [
        "Apostilas das 9 matérias do EMTI (gratuitas)",
        "Tutoriais práticos em texto e vídeo",
        "Treinamento in-company em ferramentas de TI",
        "Capacitação em desenvolvimento web básico",
      ],
      link: { href: "/ensino/", label: "Ver materiais gratuitos" },
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Grupo AMtech Digital"
        title="Três frentes,"
        accent="uma empresa."
        description="Desenvolvimento de software, assistência técnica e formação em TI. Cada serviço alimentado pela experiência real dos outros."
      />
      <Section>
        <div className="grid gap-4 lg:grid-cols-3">
          {servicos.map((s, i) => (
            <div key={s.nome} className="card flex flex-col p-6">
              <span className="font-mono text-xs text-gold-ink">0{i + 1}</span>
              <s.icon className="mt-4 size-7 text-aura" aria-hidden="true" />
              <h2 className="mt-4 font-display text-2xl font-semibold">{s.nome}</h2>
              <p className="mt-1 font-mono text-xs text-muted">{s.tagline}</p>
              <ul className="mt-5 flex flex-col gap-2.5 border-t border-dashed border-line pt-5">
                {s.itens.map((it) => (
                  <li key={it} className="flex gap-2.5 text-[15px] text-ink">
                    <span aria-hidden="true" className="text-gold">→</span>
                    {it}
                  </li>
                ))}
              </ul>
              {s.nota && <p className="mt-4 font-mono text-xs text-muted">{s.nota}</p>}
              <div className="mt-auto flex flex-col gap-2 pt-6">
                {s.link ? (
                  <Link href={s.link.href} className="btn btn-primary">
                    {s.link.label}
                  </Link>
                ) : (
                  <>
                    <a href="#orcamento" className="btn btn-primary">
                      Solicitar orçamento
                    </a>
                    <a href={wa(s.wa!)} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                      Chamar no WhatsApp
                    </a>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section id="orcamento" narrow eyebrow="Orçamento" title="Solicitar orçamento" subtitle="Conta um pouco do que você precisa — respondo por e-mail ou WhatsApp, o que preferir." className="scroll-mt-20 pt-0">
        <div className="card p-6 sm:p-8">
          <FormspreeForm
            formId={isConfigured(site.formspree_orcamento_id) ? site.formspree_orcamento_id : null}
            sucesso="Pedido enviado! Você recebe uma resposta em breve."
            botao="Enviar pedido"
            whatsapp={site.author.whatsapp}
          >
            <div>
              <label className="label" htmlFor="orc-name">Nome</label>
              <input id="orc-name" name="name" type="text" required maxLength={80} autoComplete="name" className="field" />
            </div>
            <div>
              <label className="label" htmlFor="orc-contact">E-mail ou WhatsApp pra retorno</label>
              <input id="orc-contact" name="contato" type="text" required maxLength={120} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="orc-servico">Serviço de interesse</label>
              <select id="orc-servico" name="servico" required defaultValue="" className="field">
                <option value="" disabled>Selecione…</option>
                <option>Desenvolvimento de sistemas</option>
                <option>Assistência técnica</option>
                <option>Formação/treinamento in-company</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="orc-msg">O que você precisa</label>
              <textarea id="orc-msg" name="mensagem" rows={4} required maxLength={1500} className="field min-h-32" />
            </div>
          </FormspreeForm>
        </div>
      </Section>
    </>
  );
}

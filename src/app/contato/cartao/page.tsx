import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import Cartao from "@/components/features/cartao";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Cartão de Visita Digital", description: "Escaneie e salve meu contato direto na sua agenda." };

export default function CartaoPage() {
  const site = getSite();
  return (
    <>
      <PageHero eyebrow="Contato" title="Cartão de" accent="visita digital." />
      <Section narrow>
        <Cartao
          nome={site.author.name}
          org="Grupo AMtech Digital"
          cargo="Professor de Informática & Desenvolvedor"
          tel={site.author.whatsapp}
          url={site.url}
          cidade="Barbacena"
          estado="MG"
          pais="Brasil"
        />
      </Section>
    </>
  );
}

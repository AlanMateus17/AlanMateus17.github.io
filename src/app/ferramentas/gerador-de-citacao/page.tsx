import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import CitationGenerator from "@/components/features/citation-generator";

export const metadata: Metadata = {
  title: "Gerador de Citação de Aula",
  description: "Ferramenta gratuita: crie uma imagem bonita com uma frase motivacional pra postar nas redes da sua escola.",
};

export default function GeradorPage() {
  return (
    <>
      <PageHero
        eyebrow="Ferramenta gratuita"
        title="Gerador de"
        accent="citação de aula."
        description="Feito pra professores. Escreve uma frase, escolhe as cores, gera uma imagem pronta pra postar — sem cadastro, sem marca d'água."
      />
      <Section>
        <CitationGenerator />
      </Section>
    </>
  );
}

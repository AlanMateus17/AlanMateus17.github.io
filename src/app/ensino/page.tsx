import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import EnsinoList from "@/components/features/ensino-list";
import { getEnsino } from "@/lib/content";

export const metadata: Metadata = {
  title: "Ensino",
  description:
    "Apostilas gratuitas dos cursos Técnico em Informática e Técnico em Desenvolvimento de Sistemas. Materiais criados por Alan Mateus para seus alunos.",
};

export default function EnsinoPage() {
  const { cursos } = getEnsino();
  return (
    <>
      <PageHero
        eyebrow="Ensino"
        title="Materiais"
        accent="gratuitos."
        tone="ensino"
        description="Apostilas, tutoriais e roteiros dos cursos técnicos que leciono. Tudo livre para usar, adaptar e distribuir."
      />
      <Section
        eyebrow={`${cursos.length} cursos`}
        title="Apostilas por curso"
        subtitle="Organizadas por série. Cada apostila cobre teoria, exercícios e atividade prática."
      >
        <EnsinoList cursos={cursos} />
        <div className="card mt-12 flex flex-wrap items-center justify-between gap-6 border-dashed border-gold/70 p-8">
          <div className="max-w-xl">
            <h3 className="font-display text-2xl font-semibold">Você é professor?</h3>
            <p className="mt-2 text-muted">
              Todos os materiais são livres para adaptar e usar em suas aulas. Entre em contato se quiser o pacote completo
              ou colaborar.
            </p>
          </div>
          <Link href="/contato/" className="btn btn-primary">
            Entrar em contato
          </Link>
        </div>
      </Section>
    </>
  );
}

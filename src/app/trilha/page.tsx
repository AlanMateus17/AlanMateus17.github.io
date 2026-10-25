import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import Trilha from "@/components/features/trilha";
import StudyGuide from "@/components/features/study-guide";
import { guidePosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Minha Trilha de Estudos",
  description: "Acompanhe seu progresso de leitura pelos artigos do blog, na mesma ordem do plano de estudos.",
};

export default function TrilhaPage() {
  const posts = guidePosts();
  return (
    <>
      <PageHero
        eyebrow="Sua trilha"
        title="Minha trilha"
        accent="de estudos."
        description="Os artigos seguem a mesma ordem do meu plano de estudos — aqui você acompanha até onde já leu."
      />
      <Section narrow>
        <StudyGuide posts={posts} className="mb-6" />
        <Trilha posts={posts} />
      </Section>
    </>
  );
}

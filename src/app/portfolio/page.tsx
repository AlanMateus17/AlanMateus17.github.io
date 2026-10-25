import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import PortfolioList from "@/components/features/portfolio-list";
import { getSistemas, getSite } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfólio",
  description:
    "13 sistemas de gestão que venho construindo — PDV, delivery, saúde, finanças e mais. Todos construídos em Clean Architecture com .NET e Next.js.",
};

export default function PortfolioPage() {
  const sistemas = getSistemas().map(({ markdown: _m, repoUrl: _r, ...s }) => s);
  return (
    <>
      <PageHero
        eyebrow="Portfólio"
        title={`${sistemas.length} sistemas.`}
        accent="Uma arquitetura."
        description="Sistemas SaaS multi-tenant interconectados, construídos em Clean Architecture + .NET + Next.js."
      />
      <Section>
        <PortfolioList sistemas={sistemas} namespace={getSite().counterapi_namespace} />
      </Section>
    </>
  );
}

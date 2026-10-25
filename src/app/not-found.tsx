import Link from "next/link";
import PageHero from "@/components/site/page-hero";

export const metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <PageHero
      eyebrow="Erro 404"
      title="Essa página não existe"
      accent="— ou já mudou de lugar."
      description="Deve ter sido um link quebrado, um endereço digitado errado, ou algo que eu reorganizei sem querer. De qualquer forma, dá uma olhada nesses caminhos:"
    >
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn btn-primary">Ir para a Home</Link>
        <Link href="/blog/" className="btn btn-outline">Ver o Blog</Link>
        <Link href="/contato/" className="btn btn-ghost">Falar comigo</Link>
      </div>
    </PageHero>
  );
}

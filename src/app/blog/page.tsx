import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import BlogList from "@/components/features/blog-list";
import StudyGuide from "@/components/features/study-guide";
import Newsletter from "@/components/features/newsletter";
import { getPosts, getSite } from "@/lib/content";
import { guidePosts, toListPost } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artigos sobre desenvolvimento .NET, ensino de TI e segurança ofensiva. Aprendendo em público.",
};

export default function BlogPage() {
  const site = getSite();
  const posts = getPosts();
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Aprendendo"
        accent="em público."
        description="Desenvolvimento, ensino, segurança e carreira. Cada post nasce de um problema real."
      />
      <Section>
        {posts.length > 0 ? (
          <>
            <StudyGuide posts={guidePosts()} className="mb-8" />
            <BlogList posts={posts.map(toListPost)} namespace={site.counterapi_namespace} />
          </>
        ) : (
          <div className="card p-10 text-center">
            <p className="font-mono text-sm text-muted">// primeiros artigos chegando em breve</p>
            <h2 className="mt-3 font-display text-2xl font-semibold">Enquanto isso...</h2>
            <p className="mt-2 text-muted">Estou documentando tudo no vault Obsidian.</p>
            <Link href="/sobre/" className="btn btn-primary mt-6">
              Conheça a trajetória
            </Link>
          </div>
        )}
      </Section>
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <Newsletter account={site.mailerlite_account} form={site.mailerlite_form} />
      </section>
    </>
  );
}

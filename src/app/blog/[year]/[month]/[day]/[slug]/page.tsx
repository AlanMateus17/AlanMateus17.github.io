import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Particles from "@/components/magicui/particles";
import { CopyCodeButtons, PostViews, ReadBadges, ReadingProgress } from "@/components/features/post-status";
import ShareButtons from "@/components/features/share-buttons";
import Quiz from "@/components/features/quiz";
import StudyGuide from "@/components/features/study-guide";
import LikeButton from "@/components/features/like-button";
import Comments from "@/components/features/comments";
import Newsletter from "@/components/features/newsletter";
import { categoryTone } from "@/components/site/post-card";
import { formatDateBR, getComments, getPostByParams, getPostHtml, getPosts, getSite, isConfigured } from "@/lib/content";
import { extractHeadings, guidePosts } from "@/lib/blog";
import { cn } from "@/lib/utils";

type Params = { year: string; month: string; day: string; slug: string };

export function generateStaticParams(): Params[] {
  return getPosts().map((p) => ({ year: p.year, month: p.month, day: p.day, slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const post = getPostByParams(year, month, day, slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: post.url },
    openGraph: { type: "article", title: post.title, description: post.excerpt, publishedTime: post.date, url: post.url },
  };
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { year, month, day, slug } = await params;
  const post = getPostByParams(year, month, day, slug);
  if (!post) notFound();

  const site = getSite();
  const html = await getPostHtml(post);
  const headings = extractHeadings(html);
  const all = getPosts();
  const idx = all.findIndex((p) => p.url === post.url);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;
  const related = all.filter((p) => p.url !== post.url && p.category === post.category).slice(0, 3);
  const fullUrl = `${site.url}${post.url}`;
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Person", name: site.author.name, url: site.url },
    mainEntityOfPage: fullUrl,
  };

  return (
    <>
      <ReadingProgress />
      <CopyCodeButtons />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />

      <header data-share-target className="relative overflow-hidden border-b border-line">
        <Particles quantity={35} repel={45} />
        <div className="relative mx-auto max-w-3xl px-4 pt-14 pb-12 sm:px-6 sm:pt-20">
          <Link href="/blog/" className="font-mono text-sm text-muted hover:text-ink">
            ← Blog
          </Link>
          <p className={cn("mt-6 font-mono text-xs tracking-wider uppercase", categoryTone(post.category))}>{post.category}</p>
          <h1 className="mt-3 font-display text-4xl leading-[1.1] font-semibold tracking-tight text-ink sm:text-5xl">{post.title}</h1>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[13px] text-muted">
            <time dateTime={post.date}>{formatDateBR(post.date)}</time>
            <span>{post.readingMinutes} min de leitura</span>
            <PostViews slug={post.slug} namespace={site.counterapi_namespace} />
            {post.tags.map((t) => (
              <span key={t}>#{t}</span>
            ))}
          </div>
          <ReadBadges slug={post.slug} />
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        {headings.length >= 3 && (
          <nav aria-label="Sumário do post" data-print-hide className="card mb-10 p-5">
            <p className="eyebrow mb-3">Neste post</p>
            <ol className="flex flex-col gap-1.5">
              {headings.map((h) => (
                <li key={h.id} className={h.level === 3 ? "pl-4" : ""}>
                  <a href={`#${h.id}`} className={cn("text-[15px] hover:text-aura", h.level === 3 ? "text-muted" : "text-ink")}>
                    {h.text}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <article className="post-body" dangerouslySetInnerHTML={{ __html: html }} />

        <ShareButtons url={fullUrl} title={post.title} />

        {post.quiz.length > 0 && (
          <Quiz
            slug={post.slug}
            title={post.title}
            questions={post.quiz}
            formspreeId={isConfigured(site.formspree_quiz_id) ? site.formspree_quiz_id : null}
          />
        )}

        <div data-print-hide>
          <StudyGuide posts={guidePosts()} className="mt-12" />

          {related.length > 0 && (
            <div className="mt-12">
              <p className="eyebrow mb-3">Também no blog</p>
              <ul className="flex flex-col gap-2">
                {related.map((p) => (
                  <li key={p.url}>
                    <Link href={p.url} className="link">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(newer || older) && (
            <nav aria-label="Posts vizinhos" className="mt-12 grid gap-3 sm:grid-cols-2">
              {older ? (
                <Link href={older.url} className="card p-5 hover:border-gold/60">
                  <span className="font-mono text-xs text-muted">← Anterior</span>
                  <span className="mt-1 block font-display text-lg font-semibold">{older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {newer && (
                <Link href={newer.url} className="card p-5 text-right hover:border-gold/60">
                  <span className="font-mono text-xs text-muted">Próximo →</span>
                  <span className="mt-1 block font-display text-lg font-semibold">{newer.title}</span>
                </Link>
              )}
            </nav>
          )}

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <div className="flex items-center gap-3">
              <LikeButton namespace={site.counterapi_namespace} likeKey={post.slug} size="md" label="este post" />
              <span className="text-sm text-muted">curtidas</span>
            </div>
            <Link href="/blog/" className="btn btn-ghost">
              ← Todos os posts
            </Link>
          </div>

          <Comments
            slug={post.slug}
            title={post.title}
            url={fullUrl}
            comments={getComments(post.slug)}
            formspreeId={site.formspree_id}
            namespace={site.counterapi_namespace}
          />

          <div className="mt-14">
            <Newsletter account={site.mailerlite_account} form={site.mailerlite_form} />
          </div>
        </div>
      </div>
    </>
  );
}

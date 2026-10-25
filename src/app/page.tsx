import Link from "next/link";
import Particles from "@/components/magicui/particles";
import HyperText from "@/components/magicui/hyper-text";
import BlurFade from "@/components/magicui/blur-fade";
import Typewriter from "@/components/features/typewriter";
import GithubActivity from "@/components/features/github-activity";
import Newsletter from "@/components/features/newsletter";
import Section from "@/components/site/section";
import PostCard from "@/components/site/post-card";
import StatusBadge from "@/components/site/status-badge";
import { getPosts, getSistemas, getSite } from "@/lib/content";

export default function HomePage() {
  const site = getSite();
  const posts = getPosts().slice(0, 3);
  const sistemas = getSistemas();
  const destaque = ["kaixara", "rotara", "rendara"]
    .map((slug) => sistemas.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => !!s);
  const [kaixara, ...outros] = destaque;
  const anosEnsinando = new Date().getFullYear() - site.teaching_start_year;

  const frentes = [
    {
      num: "01",
      titulo: "Desenvolvimento de Software",
      tom: "text-aura",
      desc: "13 sistemas SaaS que venho construindo — PDV, delivery, veterinária, condomínios, finanças, segurança e mais. Clean Architecture, .NET 10, PostgreSQL, Next.js.",
      tags: ["C# / .NET", "PostgreSQL", "Next.js", "Docker", "Clean Arch"],
    },
    {
      num: "02",
      titulo: "Educação em TI",
      tom: "text-gold-ink",
      desc: "Professor de informática no EMTI em Barbacena — 9 matérias, 180 apostilas, centenas de alunos. Ensino Lógica, Web, Hardware, POO, Redes, Robótica e mais.",
      tags: ["HTML / CSS", "Java / POO", "Redes", "Hardware", "Robótica"],
    },
    {
      num: "03",
      titulo: "Segurança Ofensiva",
      tom: "text-warning",
      desc: "Em formação — trilha eJPT → OSCP → CRTO. Estudo ativo de pentest web, Active Directory e Red Team operations. Cada sistema que construo passa por threat modeling.",
      tags: ["OWASP", "Pentest", "Active Directory", "eJPT"],
    },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section data-share-target className="relative overflow-hidden border-b border-line">
        <Particles quantity={90} />
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 pt-16 pb-20 sm:px-6 sm:pt-24 lg:grid-cols-[1fr_400px] lg:pb-28">
          <div className="flex min-w-0 flex-col gap-6">
            <BlurFade>
              <p className="eyebrow">Grupo AMtech Digital · Barbacena, MG</p>
            </BlurFade>
            <h1 className="font-display text-[3.4rem] leading-[0.95] font-bold tracking-tight text-ink sm:text-7xl lg:text-[5.5rem]">
              <HyperText text="Alan Mateus" />
              <span className="text-gold">.</span>
            </h1>
            <BlurFade delay={0.1}>
              <Typewriter phrases={site.typewriter} />
            </BlurFade>
            <BlurFade delay={0.15}>
              <p className="max-w-xl text-lg leading-relaxed text-muted">
                Professor de informática, desenvolvedor fullstack e estudante de segurança ofensiva. Construindo 13 sistemas
                de gestão em público, documentando cada decisão, ensinando no caminho.
              </p>
            </BlurFade>
            <BlurFade delay={0.2}>
              <div className="flex flex-wrap gap-3">
                <Link href="/portfolio/" className="btn btn-primary h-12">
                  Ver portfólio →
                </Link>
                <Link href="/blog/" className="btn btn-outline h-12">
                  Ler o blog
                </Link>
              </div>
            </BlurFade>
          </div>

          <BlurFade delay={0.25}>
            <div className="card overflow-hidden font-mono text-sm" aria-label="Status atual">
              <div className="flex items-center justify-between border-b border-line bg-aura-tint px-4 py-3">
                <span className="text-xs tracking-wider text-ink uppercase">status --agora</span>
                <span className="inline-flex items-center gap-2 text-xs text-success">
                  <span aria-hidden="true" className="size-2 animate-pulse rounded-full bg-success" />
                  online
                </span>
              </div>
              <dl className="flex flex-col gap-4 p-5 leading-relaxed">
                <div>
                  <dt className="text-aura">construindo</dt>
                  <dd className="text-ink">{site.status_now.building}</dd>
                </div>
                <div>
                  <dt className="text-gold-ink">estudando</dt>
                  <dd className="text-ink">{site.status_now.studying}</dd>
                </div>
                <div>
                  <dt className="text-warning">lendo</dt>
                  <dd className="text-ink">{site.status_now.reading}</dd>
                </div>
                <div className="text-muted">
                  $ <span aria-hidden="true" className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-gold" />
                </div>
              </dl>
            </div>
          </BlurFade>
        </div>
      </section>

      {/* ===== LINHA DE STATUS ===== */}
      <div className="border-b border-line bg-surface">
        <p className="mx-auto flex max-w-6xl flex-wrap gap-x-8 gap-y-2 px-4 py-4 font-mono text-[13px] text-muted sm:px-6">
          <span>
            <span className="text-gold">▸</span> {anosEnsinando}+ anos ensinando
          </span>
          <span>
            <span className="text-gold">▸</span> {sistemas.length} sistemas planejados
          </span>
          <span>
            <span className="text-gold">▸</span> 9 matérias no EMTI
          </span>
          <span>
            <span className="text-gold">▸</span> 65+ docs no vault Obsidian
          </span>
        </p>
      </div>

      {/* ===== TRÊS FRENTES ===== */}
      <Section
        eyebrow="O que faço"
        title="Três frentes, um portfólio coerente"
        subtitle="Cada frente alimenta as outras. O que ensino informa como documento. O que codifico vira exemplo de aula. O que aprendo em segurança blinda o que construo."
      >
        <div className="grid gap-4 md:grid-cols-3">
          {frentes.map((f, i) => (
            <BlurFade key={f.num} delay={0.05 * i}>
              <div className="card flex h-full flex-col gap-3 p-6">
                <span className={`font-mono text-xs tracking-wider uppercase ${f.tom}`}>{f.num}</span>
                <h3 className="font-display text-xl font-semibold">{f.titulo}</h3>
                <p className="text-[15px] leading-relaxed text-muted">{f.desc}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {f.tags.map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      </Section>

      {/* ===== ECOSSISTEMA AURA (bento) ===== */}
      <Section
        eyebrow="Portfólio"
        title="Ecossistema Aura"
        subtitle={`${sistemas.length} sistemas AM · 10 serviços compartilhados aura-`}
        action={{ href: "/portfolio/", label: "Ver todos" }}
        className="pt-0"
      >
        <div className="grid gap-3 md:grid-cols-3">
          {kaixara && (
            <Link
              href={kaixara.url}
              className="card group flex min-h-64 flex-col justify-between gap-6 p-7 transition-colors hover:border-gold/60 md:col-span-2 md:row-span-2"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="eyebrow">Destaque · o primeiro a sair do papel</span>
                <StatusBadge status={kaixara.status} />
              </div>
              <div>
                <p className="font-display text-4xl font-semibold text-ink sm:text-5xl">{kaixara.name}</p>
                <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-muted">
                  PDV multi-tenant com RLS no PostgreSQL. Vendas, estoque, relatórios e emissão fiscal. O primeiro desses
                  sistemas.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {kaixara.stack.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          )}
          {outros.map((s) => (
            <Link key={s.slug} href={s.url} className="card flex min-h-40 flex-col items-start justify-end gap-2 p-6 transition-colors hover:border-gold/60">
              <StatusBadge status={s.status} />
              <p className="mt-2 font-display text-2xl font-semibold">{s.name}</p>
              <p className="text-[15px] leading-relaxed text-muted">{s.excerpt}</p>
            </Link>
          ))}
        </div>
      </Section>

      {/* ===== ÚLTIMOS POSTS ===== */}
      <Section eyebrow="Blog" title="Últimas publicações" action={{ href: "/blog/", label: "Ver todos" }} className="pt-0">
        {posts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.url} post={p} featured={i === 0 && posts.length > 1} />
            ))}
          </div>
        ) : (
          <p className="card p-8 text-center font-mono text-sm text-muted">// primeiros posts chegando em breve</p>
        )}
      </Section>

      {/* ===== GITHUB ===== */}
      <Section eyebrow="Prova ao vivo" title="Atividade no GitHub" className="pt-0">
        <GithubActivity user={site.author.github} />
      </Section>

      {/* ===== NEWSLETTER ===== */}
      <section className="mx-auto max-w-3xl px-4 pb-16 sm:px-6">
        <Newsletter account={site.mailerlite_account} form={site.mailerlite_form} />
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-8 px-4 py-16 sm:px-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl leading-tight font-semibold sm:text-4xl">
              Construindo em público.
              <br />
              <em className="font-medium text-gold-ink">Aprendendo em voz alta.</em>
            </h2>
            <p className="mt-4 text-[16px] leading-relaxed text-muted">
              Cada decisão técnica, cada erro e cada avanço vai para o blog. Acompanhe a jornada ou entre em contato se
              quiser colaborar.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/blog/" className="btn btn-primary h-12">
              Acompanhar o blog
            </Link>
            <Link href="/contato/" className="btn btn-gold h-12">
              Entrar em contato
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

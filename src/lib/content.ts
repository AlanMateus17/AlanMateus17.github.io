/**
 * lib/content.ts — lê o conteúdo do site (pasta /content) no momento do build.
 *
 * Tudo que antes vivia em _config.yml, _posts, _sistemas, _produtos,
 * _depoimentos e _data agora mora em /content, com o MESMO formato
 * (Markdown com front matter e YAML). Este arquivo só existe no build:
 * nada daqui vai pro navegador.
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import { renderMarkdown } from "./markdown";

const ROOT = path.join(process.cwd(), "content");

function readYaml<T>(file: string): T {
  return yaml.load(fs.readFileSync(path.join(ROOT, file), "utf8")) as T;
}

function listMarkdown(dir: string): string[] {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".md"))
    .sort();
}

/* ------------------------------------------------------------------ */
/* Configurações gerais                                                */
/* ------------------------------------------------------------------ */

export type SiteConfig = {
  title: string;
  tagline: string;
  description: string;
  url: string;
  author: {
    name: string;
    email: string;
    github: string;
    linkedin: string;
    location: string;
    whatsapp: string;
  };
  status_now: { building: string; studying: string; reading: string };
  teaching_start_year: number;
  typewriter: string[];
  formspree_id: string;
  formspree_contato_id: string;
  formspree_orcamento_id: string;
  formspree_quiz_id: string;
  counterapi_namespace: string;
  goatcounter_username: string;
  mailerlite_account: string;
  mailerlite_form: string;
};

let siteCache: SiteConfig | null = null;
export function getSite(): SiteConfig {
  if (!siteCache) siteCache = readYaml<SiteConfig>("site.yml");
  return siteCache;
}

/** Um ID de formulário ainda não configurado (placeholder do _config antigo). */
export function isConfigured(value: string | undefined | null): value is string {
  return !!value && !/^SEU_/.test(value);
}

/* ------------------------------------------------------------------ */
/* Blog                                                                 */
/* ------------------------------------------------------------------ */

export type QuizQuestion = { pergunta: string; opcoes: string[]; correta: number };

export type Post = {
  slug: string;
  title: string;
  date: string; // AAAA-MM-DD
  year: string;
  month: string;
  day: string;
  url: string;
  category: string;
  tags: string[];
  excerpt: string;
  readingMinutes: number;
  quiz: QuizQuestion[];
  markdown: string;
};

const POST_FILE = /^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/;

function countWords(md: string): number {
  return md
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`\[\]()!-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}

let postsCache: Post[] | null = null;

/** Todos os posts, do mais novo pro mais antigo (mesma ordem do site.posts do Jekyll). */
export function getPosts(): Post[] {
  if (postsCache) return postsCache;
  const posts = listMarkdown("posts")
    .map((file) => {
      const m = file.match(POST_FILE);
      if (!m) return null;
      const [, year, month, day, slug] = m;
      const raw = fs.readFileSync(path.join(ROOT, "posts", file), "utf8");
      const { data, content } = matter(raw);
      const categories: string[] = Array.isArray(data.categories)
        ? data.categories
        : data.categories
          ? [String(data.categories)]
          : [];
      const post: Post = {
        slug,
        title: String(data.title ?? slug),
        date: `${year}-${month}-${day}`,
        year,
        month,
        day,
        url: `/blog/${year}/${month}/${day}/${slug}/`,
        category: categories[0] ?? "Blog",
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        excerpt: String(data.excerpt ?? ""),
        readingMinutes: Math.floor(countWords(content) / 200) + 1,
        quiz: Array.isArray(data.quiz) ? (data.quiz as QuizQuestion[]) : [],
        markdown: content,
      };
      return post;
    })
    .filter((p): p is Post => p !== null)
    .sort((a, b) => (a.date === b.date ? b.slug.localeCompare(a.slug) : b.date.localeCompare(a.date)));
  postsCache = posts;
  return posts;
}

export function getPostByParams(year: string, month: string, day: string, slug: string) {
  return getPosts().find((p) => p.year === year && p.month === month && p.day === day && p.slug === slug);
}

export async function getPostHtml(post: Post) {
  return renderMarkdown(post.markdown);
}

/** Tags com seus posts, em ordem alfabética (igual a /blog/tags/ do site antigo). */
export function getTags(): { tag: string; posts: Post[] }[] {
  const map = new Map<string, Post[]>();
  for (const post of getPosts()) {
    for (const tag of post.tags) {
      if (!map.has(tag)) map.set(tag, []);
      map.get(tag)!.push(post);
    }
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([tag, posts]) => ({ tag, posts }));
}

/* ------------------------------------------------------------------ */
/* Comentários aprovados                                                */
/* ------------------------------------------------------------------ */

export type Comment = {
  id: string;
  name: string;
  date: string;
  message: string;
  parent?: string;
  author?: boolean;
};

export function getComments(slug: string): Comment[] {
  const dir = path.join(ROOT, "comments", slug);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => /\.ya?ml$/.test(f))
    .sort()
    .map((file) => {
      const data = yaml.load(fs.readFileSync(path.join(dir, file), "utf8")) as Record<string, unknown>;
      return {
        id: file.replace(/\.ya?ml$/, ""),
        name: String(data.name ?? "Anônimo"),
        date: String(data.date ?? ""),
        message: String(data.message ?? ""),
        parent: data.parent != null && data.parent !== "" ? String(data.parent) : undefined,
        author: data.author === true,
      };
    });
}

/* ------------------------------------------------------------------ */
/* Portfólio                                                            */
/* ------------------------------------------------------------------ */

export type Sistema = {
  slug: string;
  name: string;
  excerpt: string;
  status: "dev" | "plan";
  stack: string[];
  repoUrl: string;
  url: string;
  markdown: string;
};

let sistemasCache: Sistema[] | null = null;
export function getSistemas(): Sistema[] {
  if (sistemasCache) return sistemasCache;
  sistemasCache = listMarkdown("sistemas").map((file) => {
    const slug = file.replace(/\.md$/, "");
    const { data, content } = matter(fs.readFileSync(path.join(ROOT, "sistemas", file), "utf8"));
    return {
      slug,
      name: String(data.name ?? slug),
      excerpt: String(data.excerpt ?? ""),
      status: data.status === "dev" ? "dev" : "plan",
      stack: Array.isArray(data.stack) ? data.stack.map(String) : [],
      repoUrl: String(data.repo_url ?? ""),
      url: `/portfolio/${slug}/`,
      markdown: content,
    };
  });
  return sistemasCache;
}

/** Posts do blog que documentam um sistema (tag = nome sem o "AM ", ex.: "kaixara"). */
export function getPostsForSistema(s: Sistema): Post[] {
  const key = slugify(s.name.replace(/^AM\s+/, ""));
  return getPosts().filter((p) => p.tags.includes(key));
}

/* ------------------------------------------------------------------ */
/* Loja, depoimentos, ensino, currículo                                 */
/* ------------------------------------------------------------------ */

export type Produto = {
  slug: string;
  title: string;
  price: string;
  category: string;
  checkoutUrl: string;
  image: string;
  excerpt: string;
  markdown: string;
};

export function getProdutos(): Produto[] {
  return listMarkdown("produtos").map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(ROOT, "produtos", file), "utf8"));
    return {
      slug: file.replace(/\.md$/, ""),
      title: String(data.title ?? ""),
      price: String(data.price ?? ""),
      category: String(data.category ?? ""),
      checkoutUrl: String(data.checkout_url ?? "#"),
      image: String(data.image ?? ""),
      excerpt: String(data.excerpt ?? ""),
      markdown: content,
    };
  });
}

export type Depoimento = { nome: string; papel: string; texto: string };
export function getDepoimentos(): Depoimento[] {
  return listMarkdown("depoimentos").map((file) => {
    const { data } = matter(fs.readFileSync(path.join(ROOT, "depoimentos", file), "utf8"));
    return { nome: String(data.nome ?? ""), papel: String(data.papel ?? ""), texto: String(data.texto ?? "") };
  });
}

export type Materia = { ano: number; nome: string; icone: string; status: string; desc: string };
export type Curso = { id: string; nome: string; materias: Materia[] };
export function getEnsino(): { cursos: Curso[] } {
  return readYaml<{ cursos: Curso[] }>("ensino.yml");
}

export type Curriculo = {
  nome: string;
  cargo: string;
  localizacao: string;
  foto: string;
  github: string;
  linkedin: string;
  aberto_a_oportunidades: boolean;
  objetivo: string;
  disponibilidade: string;
  resumo: string;
  idiomas: { idioma: string; nivel: string }[];
  experiencia: { cargo: string; periodo: string; local: string; descricao: string }[];
  formacao_academica: { curso: string; periodo: string; local: string }[];
  competencias: { categoria: string; itens: string[] }[];
  nivel_seguranca: number;
  certificacoes: { nome: string; status: string }[];
  projetos_destaque: { nome: string; periodo: string; descricao: string; repo_url?: string }[];
  formacao_complementar: { titulo: string; periodo: string; onde: string; descricao: string }[];
};
export function getCurriculo(): Curriculo {
  return readYaml<Curriculo>("curriculo.yml");
}

/* ------------------------------------------------------------------ */
/* Utilitários                                                          */
/* ------------------------------------------------------------------ */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export { formatDateBR } from "./date";

import { getPosts, type Post } from "./content";
import type { ListPost } from "@/components/features/blog-list";
import type { GuidePost } from "@/components/features/study-guide";

export function toListPost(p: Post): ListPost {
  return {
    slug: p.slug,
    title: p.title,
    url: p.url,
    category: p.category,
    tags: p.tags,
    excerpt: p.excerpt,
    date: p.date,
    readingMinutes: p.readingMinutes,
  };
}

/** Posts do mais antigo pro mais novo (ordem do plano de estudos). */
export function guidePosts(): GuidePost[] {
  return [...getPosts()].reverse().map((p) => ({ slug: p.slug, title: p.title, url: p.url, tag: p.tags[0] ?? "" }));
}

/** Títulos h2/h3 do HTML do post, pro sumário "Neste post". */
export function extractHeadings(html: string) {
  const out: { level: 2 | 3; id: string; text: string }[] = [];
  const re = /<h([23]) id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    out.push({
      level: m[1] === "2" ? 2 : 3,
      id: m[2],
      text: m[3]
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&quot;/g, '"')
        .replace(/&#x27;|&#39;/g, "'")
        .trim(),
    });
  }
  return out;
}

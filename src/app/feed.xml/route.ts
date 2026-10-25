import { getPosts, getSite } from "@/lib/content";

export const dynamic = "force-static";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Feed Atom do blog (/feed.xml), como o jekyll-feed gerava antes. */
export function GET() {
  const site = getSite();
  const posts = getPosts();
  const updated = posts[0] ? `${posts[0].date}T00:00:00Z` : new Date().toISOString();
  const entries = posts
    .map(
      (p) => `  <entry>
    <title>${esc(p.title)}</title>
    <link href="${site.url}${p.url}" rel="alternate" type="text/html"/>
    <id>${site.url}${p.url}</id>
    <published>${p.date}T00:00:00Z</published>
    <updated>${p.date}T00:00:00Z</updated>
    <summary>${esc(p.excerpt)}</summary>
    ${p.tags.map((t) => `<category term="${esc(t)}"/>`).join("")}
  </entry>`,
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xml:lang="pt-BR">
  <title>${esc(site.title)}</title>
  <subtitle>${esc(site.description)}</subtitle>
  <link href="${site.url}/feed.xml" rel="self" type="application/atom+xml"/>
  <link href="${site.url}/" rel="alternate" type="text/html"/>
  <id>${site.url}/</id>
  <updated>${updated}</updated>
  <author><name>${esc(site.author.name)}</name></author>
${entries}
</feed>
`;
  return new Response(xml, { headers: { "Content-Type": "application/atom+xml; charset=utf-8" } });
}

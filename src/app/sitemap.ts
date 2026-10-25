import type { MetadataRoute } from "next";
import { ALL_PAGES } from "@/lib/nav";
import { getPosts, getSistemas, getSite } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const { url } = getSite();
  return [
    ...ALL_PAGES.map((p) => ({ url: `${url}${p.href}` })),
    ...getSistemas().map((s) => ({ url: `${url}${s.url}` })),
    ...getPosts().map((p) => ({ url: `${url}${p.url}`, lastModified: p.date })),
  ];
}

import Link from "next/link";
import { formatDateBR, type Post } from "@/lib/content";
import { cn } from "@/lib/utils";

export function categoryTone(category: string) {
  const c = category.toLowerCase();
  if (c.includes("segur")) return "text-warning";
  if (c.includes("educ") || c.includes("ensino")) return "text-gold-ink";
  return "text-aura";
}

export default function PostCard({ post, featured }: { post: Post; featured?: boolean }) {
  return (
    <article
      className={cn(
        "card group relative flex flex-col gap-3 p-6 transition-colors hover:border-gold/60",
        featured && "md:col-span-2 md:p-8",
      )}
    >
      <p className={cn("font-mono text-xs tracking-wider uppercase", categoryTone(post.category))}>{post.category}</p>
      <h3 className={cn("font-display font-semibold leading-snug text-ink", featured ? "text-2xl sm:text-3xl" : "text-xl")}>
        <Link href={post.url} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      {post.excerpt && <p className="line-clamp-3 text-[15px] leading-relaxed text-muted">{post.excerpt}</p>}
      <div className="mt-auto flex gap-4 pt-2 font-mono text-xs text-muted">
        <span>{formatDateBR(post.date)}</span>
        <span>{post.readingMinutes} min</span>
      </div>
    </article>
  );
}

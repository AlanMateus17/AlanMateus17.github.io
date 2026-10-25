import Link from "next/link";
import { FOOTER_NAV } from "@/lib/nav";
import { getSite } from "@/lib/content";

export default function Footer() {
  const site = getSite();
  const year = new Date().getFullYear();
  return (
    <footer data-print-hide className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-3">
            <Link href="/" className="inline-flex items-center gap-2.5 font-display text-xl font-semibold text-ink">
              <span aria-hidden="true" className="size-2.5 rounded-full bg-gold" />
              Alan Mateus
            </Link>
            <p className="eyebrow">Grupo AMtech Digital</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted">
              Desenvolvedor, professor e eterno estudante. Construindo em público desde 2026.
            </p>
          </div>

          {FOOTER_NAV.map((col) => (
            <div key={col.title}>
              <p className="eyebrow mb-3">{col.title}</p>
              <ul className="flex flex-col gap-1">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} prefetch={false} className="inline-flex min-h-9 items-center text-sm text-muted transition-colors hover:text-ink">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="eyebrow mb-3">Links externos</p>
            <ul className="flex flex-col gap-1">
              <li>
                <a href={`https://github.com/${site.author.github}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-sm text-muted hover:text-ink">
                  GitHub ↗
                </a>
              </li>
              <li>
                <a href={`https://linkedin.com/in/${site.author.linkedin}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-sm text-muted hover:text-ink">
                  LinkedIn ↗
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${site.author.whatsapp}`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center text-sm text-muted hover:text-ink">
                  WhatsApp ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-dashed border-gold/60 pt-6 text-sm text-muted sm:flex-row">
          <p>
            © {year} Alan Mateus · um projeto <span className="text-ink">Grupo AMtech Digital</span>. Feito com Next.js + GitHub Pages.
          </p>
          <p>{site.author.location}</p>
        </div>
      </div>
    </footer>
  );
}

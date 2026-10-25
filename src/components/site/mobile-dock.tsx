"use client";
/**
 * Dock flutuante do template Magic UI Portfolio, adaptado: aparece só no
 * celular/tablet, com os atalhos principais e a busca.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FolderGit2, Home, Mail, Newspaper, Search } from "lucide-react";
import { Dock, DockIcon } from "@/components/magicui/dock";
import { isActive } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { openPalette } from "./command-palette";

const ITEMS = [
  { href: "/", label: "Início", icon: Home },
  { href: "/portfolio/", label: "Portfólio", icon: FolderGit2 },
  { href: "/blog/", label: "Blog", icon: Newspaper },
  { href: "/contato/", label: "Contato", icon: Mail },
];

const iconClass =
  "size-full rounded-full border border-line bg-paper text-muted transition-colors";

export default function MobileDock() {
  const pathname = usePathname() || "/";
  return (
    <div data-print-hide className="pointer-events-none fixed inset-x-0 bottom-4 z-40 lg:hidden">
      <Dock className="pointer-events-auto relative mx-auto flex h-[60px] w-fit gap-2 border-line bg-surface/95 p-2 backdrop-blur-md">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined}>
              <DockIcon className={cn(iconClass, active && "border-gold text-ink")}>
                <Icon className="size-5" aria-hidden="true" />
              </DockIcon>
            </Link>
          );
        })}
        <span aria-hidden="true" className="my-auto h-2/3 w-px bg-line" />
        <button type="button" onClick={openPalette} aria-label="Buscar no site">
          <DockIcon className={iconClass}>
            <Search className="size-5" aria-hidden="true" />
          </DockIcon>
        </button>
      </Dock>
    </div>
  );
}

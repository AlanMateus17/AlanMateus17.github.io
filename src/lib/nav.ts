/** Navegação do site — usada no cabeçalho, no rodapé, no dock do celular e na paleta ⌘K. */

export type NavLink = { href: string; label: string };

export const MAIN_NAV: NavLink[] = [
  { href: "/sobre/", label: "Sobre" },
  { href: "/portfolio/", label: "Portfólio" },
  { href: "/blog/", label: "Blog" },
  { href: "/ensino/", label: "Ensino" },
  { href: "/seguranca/", label: "Segurança" },
  { href: "/curriculo/", label: "Currículo" },
];

export const FOOTER_NAV: { title: string; links: NavLink[] }[] = [
  {
    title: "Navegação",
    links: [
      { href: "/sobre/", label: "Sobre" },
      { href: "/portfolio/", label: "Portfólio" },
      { href: "/blog/", label: "Blog" },
      { href: "/blog/tags/", label: "Tags" },
      { href: "/blog/arquivo/", label: "Arquivo" },
      { href: "/ensino/", label: "Ensino" },
    ],
  },
  {
    title: "Mais",
    links: [
      { href: "/seguranca/", label: "Segurança" },
      { href: "/curriculo/", label: "Currículo" },
      { href: "/servicos/", label: "Serviços" },
      { href: "/loja/", label: "Loja" },
      { href: "/contato/", label: "Contato" },
    ],
  },
  {
    title: "Referência",
    links: [
      { href: "/faq/", label: "FAQ" },
      { href: "/trilha/", label: "Minha trilha de estudos" },
      { href: "/roteiro/", label: "Roteiro público" },
      { href: "/depoimentos/", label: "Depoimentos" },
      { href: "/privacidade/", label: "Privacidade" },
    ],
  },
];

/** Todas as páginas, pra busca da paleta de comandos (⌘K). */
export const ALL_PAGES: (NavLink & { hint?: string })[] = [
  { href: "/", label: "Início" },
  { href: "/sobre/", label: "Sobre" },
  { href: "/portfolio/", label: "Portfólio", hint: "13 sistemas" },
  { href: "/blog/", label: "Blog" },
  { href: "/blog/tags/", label: "Blog por tag" },
  { href: "/blog/arquivo/", label: "Arquivo do blog" },
  { href: "/ensino/", label: "Ensino", hint: "apostilas gratuitas" },
  { href: "/seguranca/", label: "Segurança ofensiva" },
  { href: "/curriculo/", label: "Currículo" },
  { href: "/servicos/", label: "Serviços", hint: "orçamento" },
  { href: "/loja/", label: "Loja" },
  { href: "/contato/", label: "Contato" },
  { href: "/contato/cartao/", label: "Cartão de visita digital" },
  { href: "/faq/", label: "FAQ" },
  { href: "/trilha/", label: "Minha trilha de estudos" },
  { href: "/roteiro/", label: "Roteiro público" },
  { href: "/depoimentos/", label: "Depoimentos" },
  { href: "/ferramentas/gerador-de-citacao/", label: "Gerador de citação de aula" },
  { href: "/privacidade/", label: "Privacidade" },
];

export function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href);
}

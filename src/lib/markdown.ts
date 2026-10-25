/**
 * lib/markdown.ts — transforma o Markdown dos posts e estudos de caso em HTML
 * no build (GFM, títulos com âncora e código com destaque de sintaxe).
 *
 * Os dois blocos especiais do editor (/admin/) continuam funcionando:
 *   - vídeo do YouTube (HTML puro dentro do Markdown)
 *   - caixa de destaque, escrita no formato antigo do Jekyll:
 *       > **Dica:** texto
 *       {: .callout .callout--tip }
 */
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";

const CALLOUT = /^> \*\*(Dica|Atenção|Importante):\*\* ([^\n]+(?:\n>[^\n]*)*)\n\{: \.callout \.callout--(tip|warning|important) \}$/gm;

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function preprocess(md: string): string {
  return md.replace(CALLOUT, (_all, rotulo: string, texto: string, tipo: string) => {
    const corpo = texto.replace(/\n>\s?/g, " ");
    return `<div class="callout callout--${tipo}"><p><strong>${rotulo}:</strong> ${escapeHtml(corpo)}</p></div>`;
  });
}

export async function renderMarkdown(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeSlug)
    .use(rehypePrettyCode, {
      theme: { dark: "github-dark-dimmed", light: "github-light" },
      keepBackground: false,
      defaultLang: { block: "plaintext" },
    })
    .use(rehypeStringify)
    .process(preprocess(md));
  return String(file);
}

/**
 * lib/canvas-share.ts — apoio pras ferramentas que geram imagem pra
 * compartilhar (Story de qualquer página, card do LinkedIn, citação do
 * post e gerador de citação de aula). Cores da Aura (tema escuro).
 */
export const AURA = {
  fundo1: "#0e3a45",
  fundo2: "#0b1a1e",
  moldura: "#071114",
  teal: "#7fc4c9",
  dourado: "#d9a85e",
  texto: "#e9eeec",
  suave: "#9aaeb0",
};

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    const test = (current + " " + w).trim();
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Fundo padrão das imagens: degradê petróleo + faixas douradas no topo e na base. */
export function paintBackground(ctx: CanvasRenderingContext2D, W: number, H: number, vertical = false) {
  const grad = vertical ? ctx.createLinearGradient(0, 0, 0, H) : ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, AURA.fundo1);
  grad.addColorStop(1, AURA.fundo2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = AURA.dourado;
  const faixa = Math.max(8, Math.round(W / 90));
  ctx.fillRect(0, 0, W, faixa);
  ctx.fillRect(0, H - faixa, W, faixa);
}

/** Copia a URL atual. Devolve uma promessa que diz se deu certo. */
export function copyCurrentLink(): Promise<boolean> {
  if (!navigator.clipboard) return Promise.resolve(false);
  return navigator.clipboard
    .writeText(window.location.href)
    .then(() => true)
    .catch(() => false);
}

/** No celular abre o menu nativo de compartilhar; no computador baixa o PNG. */
export function shareOrDownload(canvas: HTMLCanvasElement, fileName: string): Promise<void> {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve();
      const file = new File([blob], fileName, { type: "image/png" });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: "Compartilhar" }).catch(() => {}).finally(resolve);
      } else {
        const a = document.createElement("a");
        a.download = fileName;
        a.href = canvas.toDataURL("image/png");
        a.click();
        resolve();
      }
    }, "image/png");
  });
}

export async function loadFonts() {
  try {
    await Promise.all([
      document.fonts.load('600 48px "Fraunces Variable"'),
      document.fonts.load('500 24px "IBM Plex Sans"'),
      document.fonts.load('500 24px "IBM Plex Mono"'),
    ]);
  } catch {}
}

/** Espera o navegador desenhar a tela (o aviso "Gerando…") antes de começar um trabalho pesado. */
export function nextPaint(): Promise<void> {
  return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(r, 0))));
}

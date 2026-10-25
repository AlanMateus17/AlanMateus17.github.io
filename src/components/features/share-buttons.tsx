"use client";
/**
 * Compartilhar UM post: WhatsApp, X, copiar link, card do LinkedIn
 * (imagem 1200×627), baixar PDF (impressão do navegador) e — ao selecionar
 * um trecho do texto — gerar uma imagem de citação 1080×1080.
 */
import { useEffect, useRef, useState } from "react";
import { Download, Link2, Linkedin, Quote } from "lucide-react";
import { AURA, copyCurrentLink, loadFonts, paintBackground, roundRect, shareOrDownload, wrapText } from "@/lib/canvas-share";

const btn =
  "inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm text-ink transition-colors hover:border-gold hover:bg-gold-tint";

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [quote, setQuote] = useState<{ text: string; top: number; left: number } | null>(null);
  const quoteRef = useRef<string>("");

  const enc = encodeURIComponent;

  function copy() {
    navigator.clipboard?.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  async function finish(canvas: HTMLCanvasElement, fileName: string, copiedLink: Promise<boolean>) {
    const ok = await copiedLink;
    setBusy(ok ? "Pronto! Link também copiado." : "Pronto!");
    await new Promise((r) => setTimeout(r, ok ? 1200 : 200));
    await shareOrDownload(canvas, fileName);
    setBusy(null);
  }

  async function linkedinCard() {
    if (busy) return;
    setBusy("Gerando sua imagem…");
    try {
      const copiedLink = copyCurrentLink();
      const { default: html2canvas } = await import("html2canvas-pro");
      await loadFonts();
      const alvo = (document.querySelector("[data-share-target]") as HTMLElement) || document.body;
      const captura = await html2canvas(alvo, { backgroundColor: AURA.fundo2, scale: 2, useCORS: true });
      const W = 1200;
      const H = 627;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      paintBackground(ctx, W, H);
      ctx.textAlign = "left";
      ctx.fillStyle = AURA.dourado;
      ctx.font = '500 20px "IBM Plex Mono", monospace';
      ctx.fillText("ALAN MATEUS · GRUPO AMTECH DIGITAL", 60, 74);
      ctx.fillStyle = AURA.texto;
      ctx.font = '600 44px "Fraunces Variable", Georgia, serif';
      let y = 160;
      for (const line of wrapText(ctx, title, 500).slice(0, 5)) {
        ctx.fillText(line, 60, y);
        y += 54;
      }
      ctx.fillStyle = AURA.teal;
      ctx.font = '500 22px "IBM Plex Mono", monospace';
      ctx.fillText("alanmateus17.github.io", 60, H - 60);

      const boxW = 480;
      const boxH = 480;
      const boxX = W - boxW - 60;
      const boxY = (H - boxH) / 2;
      const s = Math.min(boxW / captura.width, boxH / captura.height);
      const iw = captura.width * s;
      const ih = captura.height * s;
      const ix = boxX + (boxW - iw) / 2;
      const iy = boxY + (boxH - ih) / 2;
      ctx.fillStyle = AURA.moldura;
      roundRect(ctx, boxX - 10, boxY - 10, boxW + 20, boxH + 20, 20);
      ctx.fill();
      ctx.save();
      roundRect(ctx, ix, iy, iw, ih, 14);
      ctx.clip();
      ctx.drawImage(captura, ix, iy, iw, ih);
      ctx.restore();
      await finish(canvas, "linkedin-alanmateus.png", copiedLink);
    } catch {
      setBusy(null);
      alert("Não deu pra gerar a imagem agora. Tenta de novo em instantes.");
    }
  }

  async function quoteImage() {
    const texto = quoteRef.current;
    setQuote(null);
    if (!texto || busy) return;
    setBusy("Gerando sua imagem…");
    const copiedLink = copyCurrentLink();
    await loadFonts();
    const W = 1080;
    const H = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    paintBackground(ctx, W, H);
    ctx.textAlign = "left";
    ctx.fillStyle = AURA.dourado;
    ctx.font = '700 140px "Fraunces Variable", Georgia, serif';
    ctx.fillText("“", 70, 250);
    ctx.fillStyle = AURA.texto;
    ctx.font = '500 46px "Fraunces Variable", Georgia, serif';
    const linhas = wrapText(ctx, texto, W - 160);
    let ty = (H - linhas.length * 62) / 2 + 30;
    for (const l of linhas) {
      ctx.fillText(l, 80, ty);
      ty += 62;
    }
    ctx.fillStyle = AURA.dourado;
    ctx.font = '500 24px "IBM Plex Mono", monospace';
    wrapText(ctx, `Alan Mateus — ${title}`, W - 160)
      .slice(0, 2)
      .forEach((l, i) => ctx.fillText(l, 80, H - 110 + i * 34));
    await finish(canvas, "citacao-alanmateus.png", copiedLink);
  }

  useEffect(() => {
    const body = document.querySelector(".post-body");
    if (!body) return;
    function onSelect() {
      const sel = window.getSelection();
      const texto = sel?.toString().trim() ?? "";
      if (!sel || texto.length < 10 || texto.length > 280 || !body!.contains(sel.anchorNode)) {
        setQuote(null);
        return;
      }
      const rect = sel.getRangeAt(0).getBoundingClientRect();
      quoteRef.current = texto;
      setQuote({ text: texto, top: window.scrollY + rect.top - 54, left: Math.max(12, rect.left + rect.width / 2 - 110) });
    }
    document.addEventListener("mouseup", onSelect);
    document.addEventListener("touchend", onSelect);
    return () => {
      document.removeEventListener("mouseup", onSelect);
      document.removeEventListener("touchend", onSelect);
    };
  }, []);

  return (
    <div data-print-hide className="mt-12 border-t border-dashed border-gold/60 pt-8">
      <p className="eyebrow mb-4">Compartilhar</p>
      <div className="flex flex-wrap gap-2">
        <a className={btn} target="_blank" rel="noopener noreferrer" href={`https://wa.me/?text=${enc(title)}%20${enc(url)}`}>
          WhatsApp
        </a>
        <a className={btn} target="_blank" rel="noopener noreferrer" href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`}>
          X
        </a>
        <button type="button" className={btn} onClick={copy}>
          <Link2 className="size-4" aria-hidden="true" /> {copied ? "Link copiado!" : "Copiar link"}
        </button>
        <button type="button" className={btn} onClick={linkedinCard}>
          <Linkedin className="size-4" aria-hidden="true" /> Card pro LinkedIn
        </button>
        <button type="button" className={btn} onClick={() => window.print()}>
          <Download className="size-4" aria-hidden="true" /> Baixar PDF
        </button>
      </div>
      <p className="mt-3 text-sm text-muted">Dica: selecione um trecho do texto pra gerar uma imagem de citação.</p>

      {quote && (
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={quoteImage}
          style={{ top: quote.top, left: quote.left }}
          className="btn btn-gold absolute z-40 h-11 rounded-full"
        >
          <Quote className="size-4" aria-hidden="true" /> Compartilhar citação
        </button>
      )}

      {busy && (
        <div role="status" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <p className="card max-w-sm px-6 py-5 text-center text-ink">{busy}</p>
        </div>
      )}
    </div>
  );
}

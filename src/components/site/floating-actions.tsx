"use client";
/**
 * Botões flutuantes de toda página:
 *   - voltar ao topo (aparece depois de rolar)
 *   - compartilhar a página como Story (imagem 1080×1920 com QR code)
 *   - instalar como app (PWA), com o passo a passo manual do iPhone
 * Também registra o service worker (/sw.js), que deixa o site abrir offline.
 */
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Download, Smartphone, X } from "lucide-react";
import { AURA, copyCurrentLink, loadFonts, paintBackground, roundRect, shareOrDownload } from "@/lib/canvas-share";
import { KEYS, getItem, setItem } from "@/lib/storage";

type BeforeInstallPrompt = Event & { prompt: () => void; userChoice: Promise<{ outcome: string }> };

const fab =
  "inline-flex size-12 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-aura-tint";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [ios, setIos] = useState(false);
  const [iosModal, setIosModal] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const deferred = useRef<BeforeInstallPrompt | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});

    const onScroll = () => setShowTop(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as Navigator & { standalone?: boolean }).standalone === true;
    const dismissed = getItem(KEYS.pwaDispensado) === "1";
    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    if (!standalone && !dismissed) {
      if (isIos) {
        setIos(true);
        setCanInstall(true);
      }
    }
    const onPrompt = (e: Event) => {
      if (standalone || getItem(KEYS.pwaDispensado) === "1") return;
      e.preventDefault();
      deferred.current = e as BeforeInstallPrompt;
      setCanInstall(true);
    };
    const onInstalled = () => {
      setItem(KEYS.pwaDispensado, "1");
      setCanInstall(false);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  useEffect(() => {
    if (!iosModal) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIosModal(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [iosModal]);

  function install() {
    if (ios) return setIosModal(true);
    const p = deferred.current;
    if (!p) return;
    p.prompt();
    p.userChoice
      .then((c) => {
        if (c.outcome === "accepted") setItem(KEYS.pwaDispensado, "1");
        setCanInstall(false);
      })
      .finally(() => (deferred.current = null));
  }

  function iosDone() {
    setItem(KEYS.pwaDispensado, "1");
    setIosModal(false);
    setCanInstall(false);
  }

  async function shareStory() {
    if (busy) return;
    setBusy("Gerando sua imagem…");
    try {
      const copied = copyCurrentLink();
      const [{ default: html2canvas }, QR] = await Promise.all([import("html2canvas-pro"), import("qrcode")]);
      await loadFonts();
      const alvo =
        (document.querySelector("[data-share-target]") as HTMLElement | null) ||
        (document.querySelector("main") as HTMLElement);
      const captura = await html2canvas(alvo, { backgroundColor: AURA.fundo2, scale: 2, useCORS: true });

      const W = 1080;
      const H = 1920;
      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext("2d")!;
      paintBackground(ctx, W, H, true);

      ctx.textAlign = "center";
      ctx.fillStyle = AURA.texto;
      ctx.font = '600 40px "Fraunces Variable", Georgia, serif';
      ctx.fillText("Alan Mateus", W / 2, 96);
      ctx.fillStyle = AURA.dourado;
      ctx.font = '500 22px "IBM Plex Mono", monospace';
      ctx.fillText("GRUPO AMTECH DIGITAL", W / 2, 136);

      const phoneW = 780;
      const phoneX = (W - phoneW) / 2;
      const phoneY = 190;
      const escala = phoneW / captura.width;
      const phoneH = Math.min(captura.height * escala, 1160);
      ctx.fillStyle = AURA.moldura;
      roundRect(ctx, phoneX - 14, phoneY - 14, phoneW + 28, phoneH + 28, 46);
      ctx.fill();
      ctx.save();
      roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 32);
      ctx.clip();
      ctx.drawImage(captura, 0, 0, captura.width, phoneH / escala, phoneX, phoneY, phoneW, phoneH);
      ctx.restore();

      const qrUrl = await QR.toDataURL(window.location.href, { width: 260, margin: 1, errorCorrectionLevel: "H" });
      const qrImg = new Image();
      await new Promise((res) => {
        qrImg.onload = res;
        qrImg.src = qrUrl;
      });
      const qrY = phoneY + phoneH + 60;
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, W / 2 - 150, qrY, 300, 300, 16);
      ctx.fill();
      ctx.drawImage(qrImg, W / 2 - 130, qrY + 20, 260, 260);
      ctx.fillStyle = AURA.texto;
      ctx.font = '500 30px "IBM Plex Sans", sans-serif';
      ctx.fillText("Aponte a câmera pra conhecer", W / 2, qrY + 350);

      const linkCopiado = await copied;
      setBusy(linkCopiado ? "Pronto! Link também copiado — cola no sticker de link do Instagram." : "Pronto!");
      await new Promise((r) => setTimeout(r, linkCopiado ? 1400 : 200));
      await shareOrDownload(canvas, "alanmateus-site.png");
    } catch {
      alert("Não deu pra gerar a imagem agora. Tenta de novo em instantes.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div data-print-hide>
      <div className="fixed right-4 bottom-24 z-30 flex flex-col items-end gap-3 lg:bottom-6">
        {canInstall && (
          <button type="button" onClick={install} className="btn btn-gold h-12 rounded-full">
            <Download className="size-4" aria-hidden="true" /> Instalar app
          </button>
        )}
        <button type="button" onClick={shareStory} className={fab} aria-label="Compartilhar esta página como Story" title="Compartilhar como Story">
          <Smartphone className="size-5" aria-hidden="true" />
        </button>
        {showTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={fab}
            aria-label="Voltar ao topo"
          >
            <ArrowUp className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {busy && (
        <div role="status" className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 p-4">
          <p className="card max-w-sm px-6 py-5 text-center text-ink">{busy}</p>
        </div>
      )}

      {iosModal && (
        <div
          className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 sm:items-center"
          onClick={(e) => e.target === e.currentTarget && setIosModal(false)}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="ios-titulo" className="card relative w-full max-w-sm p-6">
            <button
              type="button"
              onClick={() => setIosModal(false)}
              aria-label="Fechar"
              className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-md text-muted hover:text-ink"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
            <p id="ios-titulo" className="font-display text-xl font-semibold">
              Instalar no iPhone/iPad
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-5 text-[15px] text-ink marker:text-gold">
              <li>
                Toque no ícone de compartilhar <strong>⬆</strong> na barra do Safari
              </li>
              <li>
                Escolha <strong>“Adicionar à Tela de Início”</strong>
              </li>
              <li>
                Toque em <strong>“Adicionar”</strong> — pronto!
              </li>
            </ol>
            <button type="button" onClick={iosDone} className="btn btn-primary mt-6 w-full">
              Já instalei
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

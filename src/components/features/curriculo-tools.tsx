"use client";
/**
 * Recursos da página /curriculo/:
 *   - Imprimir e Baixar PDF (PDF gerado no navegador, sempre no tema claro)
 *   - QR code que abre o cartão de contato digital
 */
import { useEffect, useState } from "react";
import { Download, Printer } from "lucide-react";

export function CurriculoActions() {
  const [busy, setBusy] = useState(false);

  async function pdf() {
    const el = document.getElementById("cv");
    if (!el || busy) return;
    setBusy(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        onclone: (doc) => {
          doc.documentElement.setAttribute("data-theme", "light");
          doc.querySelectorAll("[data-print-hide]").forEach((n) => ((n as HTMLElement).style.display = "none"));
        },
      });
      const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const margin = 28;
      const imgW = pageW - margin * 2;
      const ratio = imgW / canvas.width;
      const sliceH = Math.floor((pageH - margin * 2) / ratio);
      let y = 0;
      let first = true;
      while (y < canvas.height) {
        const h = Math.min(sliceH, canvas.height - y);
        const part = document.createElement("canvas");
        part.width = canvas.width;
        part.height = h;
        part.getContext("2d")!.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
        if (!first) doc.addPage();
        doc.addImage(part.toDataURL("image/jpeg", 0.95), "JPEG", margin, margin, imgW, h * ratio);
        first = false;
        y += h;
      }
      doc.save("curriculo-alan-mateus.pdf");
    } catch {
      alert("Não deu pra gerar o PDF agora. Use o botão Imprimir e escolha “Salvar como PDF”.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" onClick={() => window.print()} className="btn btn-ghost">
        <Printer className="size-4" aria-hidden="true" /> Imprimir
      </button>
      <button type="button" onClick={pdf} disabled={busy} className="btn btn-primary">
        <Download className="size-4" aria-hidden="true" /> {busy ? "Gerando PDF…" : "Baixar PDF"}
      </button>
    </>
  );
}

export function CartaoQr({ path, size = 88, dark = "#0e3a45" }: { path: string; size?: number; dark?: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    import("qrcode").then((QR) =>
      QR.toDataURL(window.location.origin + path, { width: size * 2, margin: 1, color: { dark, light: "#ffffff" } }).then(setSrc),
    );
  }, [path, size, dark]);
  return (
    <a href={path} className="flex flex-col items-center gap-2" aria-label="Abrir cartão de contato digital">
      <span className="block rounded-md border border-line bg-white p-1.5" style={{ width: size + 12, height: size + 12 }}>
        {src && <img src={src} alt="" width={size} height={size} />}
      </span>
      <span className="font-mono text-xs text-muted">{touch ? "Toque para abrir o cartão" : "Escaneie o cartão"}</span>
    </a>
  );
}

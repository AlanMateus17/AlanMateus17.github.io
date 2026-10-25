"use client";
/**
 * Cartão de visita digital: QR code com o vCard (escaneou, salvou na agenda).
 * Em celular, escanear a própria tela não faz sentido — o botão de baixar
 * o contato vira o destaque.
 */
import { useEffect, useState } from "react";
import { Download } from "lucide-react";

type Props = { nome: string; org: string; cargo: string; tel: string; url: string; cidade: string; estado: string; pais: string };

export default function Cartao(p: Props) {
  const [qr, setQr] = useState<string | null>(null);
  const [touch, setTouch] = useState(false);

  useEffect(() => {
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${p.nome};;;;`,
      `FN:${p.nome}`,
      `ORG:${p.org}`,
      `TITLE:${p.cargo}`,
      `TEL;TYPE=CELL:+${p.tel}`,
      `URL:${p.url}`,
      `ADR:;;${p.cidade};${p.estado};;;${p.pais}`,
      "END:VCARD",
    ].join("\n");
    import("qrcode").then((QR) => QR.toDataURL(vcard, { width: 520, margin: 1, color: { dark: "#0e3a45", light: "#ffffff" } }).then(setQr));
  }, [p.nome, p.org, p.cargo, p.tel, p.url, p.cidade, p.estado, p.pais]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <p className="max-w-md text-lg text-muted">
        {touch ? "Toque no botão abaixo pra salvar o contato direto na sua agenda." : "Aponte a câmera do celular pro QR code, ou baixe o contato direto."}
      </p>
      {touch && (
        <p className="rounded-md bg-aura-tint px-4 py-3 text-sm text-ink">
          Você já está no seu celular — não precisa escanear nada. É só tocar no botão abaixo.
        </p>
      )}
      <a href="/assets/alan-mateus.vcf" download="alan-mateus.vcf" aria-label="Baixar o contato (o QR code também baixa ao tocar)">
        <span className={`block rounded-lg border border-line bg-white p-4 ${touch ? "opacity-80" : ""}`}>
          {qr ? <img src={qr} alt="" width={260} height={260} /> : <span className="block size-[260px]" />}
        </span>
      </a>
      {!touch && <p className="max-w-sm text-sm text-muted">Escaneando, o contato já é salvo direto na agenda — sem precisar digitar nada.</p>}
      <a href="/assets/alan-mateus.vcf" download="alan-mateus.vcf" className={`btn btn-primary ${touch ? "h-14 px-8 text-base" : ""}`}>
        <Download className="size-4" aria-hidden="true" /> Baixar contato (.vcf)
      </a>
    </div>
  );
}

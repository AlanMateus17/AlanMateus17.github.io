"use client";
/** Gerador de citação de aula: imagem 1080×1080 com a frase, pronta pra baixar. */
import { useState } from "react";
import { cn } from "@/lib/utils";
import { loadFonts, wrapText } from "@/lib/canvas-share";

const CORES = [
  { c1: "#0e3a45", c2: "#0b1a1e", nome: "Petróleo Aura" },
  { c1: "#7C2D12", c2: "#431407", nome: "Terracota" },
  { c1: "#1E3A8A", c2: "#0F1E4A", nome: "Azul" },
  { c1: "#166534", c2: "#052E16", nome: "Verde" },
];

export default function CitationGenerator() {
  const [texto, setTexto] = useState("");
  const [assinatura, setAssinatura] = useState("");
  const [cor, setCor] = useState(0);
  const [img, setImg] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  async function gerar() {
    if (!texto.trim()) return setErro("Escreve uma frase primeiro.");
    setErro("");
    await loadFonts();
    const W = 1080;
    const H = 1080;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, CORES[cor].c1);
    g.addColorStop(1, CORES[cor].c2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = "#d9a85e";
    ctx.fillRect(0, 0, W, 12);
    ctx.fillRect(0, H - 12, W, 12);
    ctx.textAlign = "left";
    ctx.font = '700 140px "Fraunces Variable", Georgia, serif';
    ctx.fillText("“", 70, 250);
    ctx.fillStyle = "#ffffff";
    ctx.font = '500 46px "Fraunces Variable", Georgia, serif';
    const linhas = wrapText(ctx, texto.trim(), W - 160);
    let y = (H - linhas.length * 62) / 2 + 30;
    for (const l of linhas) {
      ctx.fillText(l, 80, y);
      y += 62;
    }
    if (assinatura.trim()) {
      ctx.font = '500 26px "IBM Plex Sans", sans-serif';
      ctx.fillStyle = "#d9a85e";
      ctx.fillText(assinatura.trim(), 80, H - 100);
    }
    ctx.font = '400 20px "IBM Plex Mono", monospace';
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.fillText("gerado em alanmateus17.github.io/ferramentas", 80, H - 50);
    setImg(canvas.toDataURL("image/png"));
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
      <div className="card flex flex-col gap-5 p-6 sm:p-8">
        <div>
          <label className="label" htmlFor="citacao-texto">Frase</label>
          <textarea id="citacao-texto" rows={3} maxLength={200} placeholder="Escreva a frase aqui..." className="field min-h-28" value={texto} onChange={(e) => setTexto(e.target.value)} />
          <p className="mt-1 text-sm text-muted">{200 - texto.length} caracteres restantes</p>
        </div>
        <div>
          <label className="label" htmlFor="citacao-assinatura">Assinatura (opcional)</label>
          <input id="citacao-assinatura" maxLength={60} placeholder="Ex: Escola Municipal Tal, Prof. Fulano" className="field" value={assinatura} onChange={(e) => setAssinatura(e.target.value)} />
        </div>
        <fieldset>
          <legend className="label">Cor de fundo</legend>
          <div className="flex gap-3">
            {CORES.map((c, i) => (
              <button
                key={c.nome}
                type="button"
                aria-label={c.nome}
                aria-pressed={cor === i}
                onClick={() => setCor(i)}
                className={cn("size-12 rounded-full border-2 transition-transform", cor === i ? "scale-110 border-gold" : "border-line")}
                style={{ background: c.c1 }}
              />
            ))}
          </div>
        </fieldset>
        <div>
          <button type="button" onClick={gerar} className="btn btn-primary">Gerar imagem</button>
          {erro && <p role="alert" className="mt-2 text-sm text-danger">{erro}</p>}
        </div>
      </div>
      <div className="flex flex-col items-center gap-4">
        {img ? (
          <>
            <img src={img} alt="Citação gerada, pronta pra compartilhar" className="w-full rounded-lg border border-line" />
            <a href={img} download="citacao-de-aula.png" className="btn btn-gold">Baixar imagem</a>
          </>
        ) : (
          <div className="flex aspect-square w-full items-center justify-center rounded-lg border border-dashed border-line p-8 text-center text-sm text-muted">
            A prévia da imagem aparece aqui.
          </div>
        )}
      </div>
    </div>
  );
}

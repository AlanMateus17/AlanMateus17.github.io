"use client";
/** Easter egg: terminal falso em /terminal/. Cada comando é só uma resposta fixa. */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const COMANDOS: Record<string, string | null> = {
  help: "Comandos disponíveis:\n  whoami        — quem sou eu\n  stack         — tecnologias que uso\n  sudo hire-me  — bom, tenta\n  ls            — lista o que tem por aqui\n  cat plano.txt — meu plano de estudos\n  clear         — limpa a tela\n  exit          — sai (mentira, não sai de verdade)",
  whoami:
    "Alan Mateus — professor de TI, desenvolvedor .NET/Next.js, e um dia vou ser pentester também.\nSe você achou essa página, provavelmente é do tipo que aperta F12 antes de perguntar. Respeito.",
  stack: ".NET 10 · C# · PostgreSQL · Next.js · TypeScript · Docker · Clean Architecture\nAinda estudando: eJPT → OSCP (segurança ofensiva)",
  ls: "sobre/  portfolio/  blog/  ensino/  seguranca/  curriculo/  contato/\n(e você achou a pasta que não estava na lista)",
  "cat plano.txt": "Passo 1: Lógica de Programação + Matemática Cap 1-2\nCritério de pronto: 3 exercícios sem travar\nDepois disso: AM Kaixara, o primeiro dos 13 sistemas",
  "sudo hire-me": "[sudo] password for recrutador: \n\nAcesso negado. Mas o link do currículo funciona sem senha: /curriculo/",
  clear: null,
  exit: "Você não sai de um terminal só fechando ele. Aperta Ctrl+W ou vive aqui pra sempre.",
};

export default function Terminal() {
  const [linhas, setLinhas] = useState<string[]>(["Bem-vindo(a) ao terminal secreto.\nDigite 'help' pra ver o que dá pra fazer aqui."]);
  const [valor, setValor] = useState("");
  const hist = useRef<string[]>([]);
  const idx = useRef(-1);
  const input = useRef<HTMLInputElement>(null);
  const saida = useRef<HTMLDivElement>(null);

  useEffect(() => input.current?.focus(), []);
  useEffect(() => {
    saida.current?.scrollTo({ top: saida.current.scrollHeight });
  }, [linhas]);

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (hist.current.length && idx.current > 0) {
        idx.current--;
        setValor(hist.current[idx.current]);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (idx.current < hist.current.length - 1) {
        idx.current++;
        setValor(hist.current[idx.current]);
      } else {
        idx.current = hist.current.length;
        setValor("");
      }
      return;
    }
    if (e.key !== "Enter") return;
    const cmd = valor.trim();
    if (!cmd) return;
    hist.current.push(cmd);
    idx.current = hist.current.length;
    setValor("");
    const chave = cmd.toLowerCase();
    if (chave === "clear") return setLinhas([]);
    const resp = Object.prototype.hasOwnProperty.call(COMANDOS, chave)
      ? COMANDOS[chave]
      : `comando não encontrado: ${cmd}\ndigite 'help' pra ver o que existe.`;
    setLinhas((l) => [...l, `$ ${cmd}`, resp ?? ""]);
  }

  return (
    <div className="card overflow-hidden font-mono text-sm" onClick={() => input.current?.focus()}>
      <div className="flex items-center gap-2 border-b border-line bg-aura-tint px-4 py-3">
        <span aria-hidden="true" className="size-3 rounded-full bg-danger" />
        <span aria-hidden="true" className="size-3 rounded-full bg-warning" />
        <span aria-hidden="true" className="size-3 rounded-full bg-success" />
        <span className="ml-3 text-xs text-muted">alan@amtech: ~</span>
      </div>
      <div ref={saida} role="log" aria-live="polite" className="h-[55vh] min-h-80 overflow-y-auto p-5 leading-relaxed whitespace-pre-wrap text-ink">
        {linhas.map((l, i) => (
          <p key={i} className={l.startsWith("$ ") ? "mt-4 text-aura" : "text-ink"}>
            {l}
          </p>
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-line px-5 py-3">
        <span className="text-gold" aria-hidden="true">$</span>
        <label htmlFor="terminal-input" className="sr-only">Comando</label>
        <input
          id="terminal-input"
          ref={input}
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          onKeyDown={onKey}
          autoComplete="off"
          spellCheck={false}
          className="min-h-10 flex-1 bg-transparent text-ink outline-none"
        />
      </div>
      <p className="border-t border-line px-5 py-3 text-xs text-muted">
        Achou por acaso? <Link href="/" className="underline">Voltar pro site</Link>
      </p>
    </div>
  );
}

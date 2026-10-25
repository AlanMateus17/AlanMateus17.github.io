"use client";
/**
 * Formulário enviado pelo Formspree (chega no seu e-mail). Se o ID do
 * formulário ainda não foi configurado em content/site.yml, o formulário
 * avisa e oferece o WhatsApp em vez de falhar em silêncio.
 */
import { useState } from "react";

type Props = {
  formId: string | null;
  sucesso: string;
  botao: string;
  whatsapp: string;
  children: React.ReactNode;
  className?: string;
};

export default function FormspreeForm({ formId, sucesso, botao, whatsapp, children, className }: Props) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formId) return;
    const form = e.currentTarget;
    setBusy(true);
    setStatus("Enviando…");
    try {
      const res = await fetch(`https://formspree.io/f/${formId}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Erro ao enviar");
      }
      setStatus(sucesso);
      form.reset();
    } catch (err) {
      setStatus(`Não deu pra enviar agora (${(err as Error).message}). Tenta de novo em instantes.`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className={className ?? "flex flex-col gap-4"}>
      <p className="hidden" aria-hidden="true">
        <label>
          Não preencha este campo
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      {children}
      {formId ? (
        <div>
          <button type="submit" disabled={busy} className="btn btn-primary">
            {botao}
          </button>
        </div>
      ) : (
        <p className="rounded-md bg-warning-tint px-4 py-3 text-sm text-warning">
          Este formulário ainda não está ativo. Enquanto isso, fale direto pelo{" "}
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            WhatsApp
          </a>
          .
        </p>
      )}
      {status && (
        <p role="status" className="text-sm text-ink">
          {status}
        </p>
      )}
    </form>
  );
}

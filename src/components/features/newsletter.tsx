"use client";
/**
 * Newsletter (MailerLite) — o mesmo formulário de antes (34 assuntos +
 * automação "Receber tudo"), desenhado pelo script oficial da MailerLite.
 * Como o site troca de página sem recarregar, o script é injetado de novo
 * a cada vez que o bloco aparece, pra MailerLite desenhar o formulário.
 */
import { useEffect } from "react";

type MlWindow = Window & { ml?: ((...args: unknown[]) => void) & { q?: unknown[] } };

export default function Newsletter({ account, form }: { account: string; form: string }) {
  useEffect(() => {
    const w = window as MlWindow;
    w.ml =
      w.ml ||
      Object.assign(
        function (...args: unknown[]) {
          (w.ml!.q = w.ml!.q || []).push(args);
        },
        { q: [] as unknown[] },
      );
    w.ml("account", account);
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://assets.mailerlite.com/js/universal.js?v=${Date.now()}`;
    document.body.appendChild(s);
    return () => {
      s.remove();
    };
  }, [account, form]);

  return (
    <div className="card p-6 sm:p-8">
      <p className="eyebrow">Newsletter</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">Receba os próximos posts por e-mail</h2>
      <p className="mt-2 text-[15px] text-muted">Separado por assunto: você escolhe só os temas que te interessam.</p>
      <div className="ml-embedded mt-5" data-form={form} />
    </div>
  );
}

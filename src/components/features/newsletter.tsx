"use client";
/**
 * Newsletter (MailerLite) — o mesmo formulário de antes (34 assuntos +
 * automação "Receber tudo"), desenhado pelo script oficial da MailerLite.
 *
 * O script só começa a carregar quando o bloco chega perto da tela, pra
 * não pesar a abertura da página. Como o site troca de página sem
 * recarregar, a cada vez que o bloco aparece o script é executado de novo
 * (sai do cache do navegador, sem baixar outra vez) pra desenhar o formulário.
 * Se a MailerLite estiver fora do ar ou bloqueada, aparece um aviso.
 */
import { useEffect, useRef, useState } from "react";

type MlWindow = Window & { ml?: ((...args: unknown[]) => void) & { q?: unknown[] } };
const SRC = "https://assets.mailerlite.com/js/universal.js";

export default function Newsletter({ account, form }: { account: string; form: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let script: HTMLScriptElement | null = null;
    let check: ReturnType<typeof setTimeout>;

    const load = () => {
      const w = window as MlWindow;
      if (!w.ml) {
        const q: unknown[] = [];
        w.ml = Object.assign((...args: unknown[]) => q.push(args), { q });
      }
      w.ml("account", account);
      script = document.createElement("script");
      script.async = true;
      script.src = SRC;
      script.onerror = () => setFalhou(true);
      document.body.appendChild(script);
      // se em 8s o formulário não tiver aparecido, avisa em vez de ficar um buraco vazio
      check = setTimeout(() => {
        if (!el.querySelector(".ml-embedded > *")) setFalhou(true);
      }, 8000);
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          load();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      clearTimeout(check);
      script?.remove();
    };
  }, [account, form]);

  return (
    <div ref={ref} className="card p-6 sm:p-8">
      <p className="eyebrow">Newsletter</p>
      <h2 className="mt-2 font-display text-2xl font-semibold">Receba os próximos posts por e-mail</h2>
      <p className="mt-2 text-[15px] text-muted">Separado por assunto: você escolhe só os temas que te interessam.</p>
      <div className="ml-embedded mt-5 min-h-12" data-form={form} />
      {falhou && (
        <p className="mt-2 text-sm text-muted">
          O formulário da newsletter não carregou (talvez um bloqueador de anúncios). Recarregue a página ou fale comigo
          pelo contato.
        </p>
      )}
    </div>
  );
}

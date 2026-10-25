"use client";
/**
 * Comentários de um post. A publicação continua manual, como antes:
 * o formulário manda um e-mail via Formspree e você aprova criando um
 * arquivo .yml em content/comments/<slug-do-post>/ (passo a passo em
 * README-COMENTARIOS.md). Cada comentário tem curtida própria.
 */
import { useRef, useState } from "react";
import type { Comment } from "@/lib/content";
import { formatDateBR } from "@/lib/date";
import LikeButton from "./like-button";

type Props = {
  slug: string;
  title: string;
  url: string;
  comments: Comment[];
  formspreeId: string;
  namespace: string;
};

const LIMITE = 1000;

function CommentBody({ message }: { message: string }) {
  const [open, setOpen] = useState(false);
  const longo = message.length > 400;
  return (
    <>
      <p className={`mt-3 text-[15px] leading-relaxed whitespace-pre-line text-ink ${longo && !open ? "line-clamp-5" : ""}`}>{message}</p>
      {longo && (
        <button type="button" onClick={() => setOpen((o) => !o)} className="mt-2 min-h-9 text-sm text-aura underline underline-offset-2">
          {open ? "Ver menos" : "Ver comentário completo"}
        </button>
      )}
    </>
  );
}

export default function Comments({ slug, title, url, comments, formspreeId, namespace }: Props) {
  const [replyTo, setReplyTo] = useState<{ id: string; name: string } | null>(null);
  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const msgRef = useRef<HTMLTextAreaElement>(null);

  const top = comments.filter((c) => !c.parent);
  const repliesOf = (id: string) => comments.filter((c) => c.parent === id);
  const nameOf = (id: string) => comments.find((c) => c.id === id)?.name ?? "";

  function reply(c: Comment) {
    setReplyTo({ id: c.id, name: c.name });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setTimeout(() => msgRef.current?.focus(), 300);
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("Enviando…");
    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Erro ao enviar");
      }
      setStatus("Comentário enviado! Ele aparece aqui assim que for aprovado.");
      form.reset();
      setMsg("");
      setReplyTo(null);
    } catch (err) {
      setStatus(`Não deu pra enviar agora (${(err as Error).message}). Tenta de novo em instantes.`);
    }
  }

  function renderComment(c: Comment, parentName?: string) {
    return (
      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-2 font-semibold text-ink">
            {c.name}
            {c.author && <span className="rounded-sm bg-gold-tint px-1.5 py-0.5 font-mono text-[11px] text-gold-ink">Autor</span>}
          </span>
          <span className="font-mono text-xs text-muted">{c.date ? formatDateBR(c.date) : ""}</span>
        </div>
        {parentName && (
          <p className="mt-1 text-sm text-muted">
            ↳ respondendo a <strong className="text-ink">{parentName}</strong>
          </p>
        )}
        <CommentBody message={c.message} />
        <div className="mt-4 flex items-center gap-2">
          <LikeButton namespace={namespace} likeKey={`${slug}--c-${c.id}`} label={`o comentário de ${c.name}`} />
          <button type="button" onClick={() => reply(c)} className="min-h-11 rounded-full px-4 text-sm text-muted hover:text-ink">
            Responder
          </button>
        </div>
      </div>
    );
  }

  return (
    <section id="comentarios" data-print-hide className="mt-14" aria-labelledby="comentarios-titulo">
      <h2 id="comentarios-titulo" className="font-display text-2xl font-semibold">
        Comentários {comments.length > 0 && <span className="text-muted">({comments.length})</span>}
      </h2>

      {top.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-4">
          {top.map((c) => (
            <li key={c.id}>
              {renderComment(c)}
              {repliesOf(c.id).length > 0 && (
                <ul className="mt-3 flex flex-col gap-3 border-l border-dashed border-gold/60 pl-4 sm:ml-6 sm:pl-6">
                  {repliesOf(c.id).map((r) => (
                    <li key={r.id}>{renderComment(r, nameOf(c.id))}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-muted">Ainda não há comentários por aqui. Seja o primeiro.</p>
      )}

      <form ref={formRef} onSubmit={submit} className="card mt-8 flex flex-col gap-4 p-6">
        <input type="hidden" name="_subject" value={`Novo comentário no blog: ${title}`} />
        <input type="hidden" name="post_slug" value={slug} />
        <input type="hidden" name="post_url" value={url} />
        <input type="hidden" name="parent" value={replyTo?.id ?? ""} />
        <p className="hidden" aria-hidden="true">
          <label>
            Não preencha este campo
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" />
          </label>
        </p>

        {replyTo && (
          <p className="text-sm text-muted">
            Respondendo a <strong className="text-ink">{replyTo.name}</strong> —{" "}
            <button type="button" onClick={() => setReplyTo(null)} className="text-aura underline underline-offset-2">
              cancelar
            </button>
          </p>
        )}

        <div>
          <label className="label" htmlFor="cf-name">
            Nome
          </label>
          <input className="field" id="cf-name" name="name" type="text" required maxLength={80} autoComplete="name" />
        </div>
        <div>
          <label className="label" htmlFor="cf-email">
            E-mail <span className="font-normal text-muted">(não é publicado, só de contato)</span>
          </label>
          <input className="field" id="cf-email" name="email" type="email" maxLength={120} autoComplete="email" />
        </div>
        <div>
          <label className="label" htmlFor="cf-message">
            Comentário
          </label>
          <textarea
            ref={msgRef}
            className="field min-h-32"
            id="cf-message"
            name="message"
            rows={4}
            required
            maxLength={LIMITE}
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <p className={`mt-1 text-sm ${LIMITE - msg.length <= 100 ? "text-warning" : "text-muted"}`}>
            {LIMITE - msg.length} caracteres restantes
          </p>
        </div>
        <p className="text-sm text-muted">Comentários passam por aprovação antes de aparecer no ar.</p>
        <div>
          <button type="submit" className="btn btn-primary">
            {replyTo ? "Enviar resposta" : "Enviar comentário"}
          </button>
        </div>
        {status && (
          <p role="status" className="text-sm text-ink">
            {status}
          </p>
        )}
      </form>
    </section>
  );
}

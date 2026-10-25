"use client";
/**
 * Quiz de fixação no fim do post (só aparece se o post tiver "quiz:" no
 * front matter). Acertando tudo, a pessoa pode avisar o professor pelo
 * Formspree. Quem já concluiu vê só a mensagem de concluído.
 */
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import type { QuizQuestion } from "@/lib/content";
import { KEYS, addToList, getList } from "@/lib/storage";
import { cn } from "@/lib/utils";

type Props = { slug: string; title: string; questions: QuizQuestion[]; formspreeId: string | null };

export default function Quiz({ slug, title, questions, formspreeId }: Props) {
  const [done, setDone] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => setDone(getList(KEYS.quizzes).includes(slug)), [slug]);

  const allAnswered = Object.keys(answers).length === questions.length;
  const allRight = allAnswered && questions.every((q, i) => answers[i] === q.correta);

  async function enviar() {
    addToList(KEYS.quizzes, slug);
    if (!nome.trim() || !formspreeId) return setDone(true);
    setStatus("Enviando…");
    const dados = new FormData();
    dados.append("nome", nome.trim());
    dados.append("post", title);
    dados.append("mensagem", `${nome.trim()} concluiu o quiz do post: ${title}`);
    try {
      await fetch(`https://formspree.io/f/${formspreeId}`, { method: "POST", headers: { Accept: "application/json" }, body: dados });
      setDone(true);
    } catch {
      setStatus("Não deu pra avisar o professor agora, mas seu progresso foi salvo.");
      setTimeout(() => setDone(true), 1500);
    }
  }

  return (
    <section data-print-hide aria-labelledby="quiz-titulo" className="card mt-12 p-6 sm:p-8">
      <p className="eyebrow">Teste o que você aprendeu</p>
      <h2 id="quiz-titulo" className="mt-2 font-display text-2xl font-semibold">
        Quiz rápido
      </h2>

      {done ? (
        <p className="mt-4 inline-flex items-center gap-2 text-success">
          <Check className="size-4" aria-hidden="true" /> Quiz concluído!
        </p>
      ) : (
        <>
          <ol className="mt-6 flex flex-col gap-7">
            {questions.map((q, qi) => {
              const escolhida = answers[qi];
              const respondida = escolhida !== undefined;
              return (
                <li key={qi}>
                  <p className="font-semibold text-ink">
                    {qi + 1}. {q.pergunta}
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {q.opcoes.map((op, oi) => {
                      const certa = respondida && oi === q.correta;
                      const errada = respondida && oi === escolhida && oi !== q.correta;
                      return (
                        <button
                          key={oi}
                          type="button"
                          disabled={respondida}
                          onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                          className={cn(
                            "min-h-11 rounded-md border px-4 py-2.5 text-left text-[15px] transition-colors",
                            certa && "border-success bg-success-tint text-success",
                            errada && "border-danger bg-danger-tint text-danger",
                            !certa && !errada && "border-line text-ink enabled:hover:border-gold disabled:opacity-60",
                          )}
                        >
                          {op}
                          {certa && " ✓"}
                          {errada && " ✗"}
                        </button>
                      );
                    })}
                  </div>
                  {respondida && (
                    <p role="status" className={cn("mt-2 text-sm", escolhida === q.correta ? "text-success" : "text-danger")}>
                      {escolhida === q.correta ? "Certinho!" : "Não foi dessa vez — a certa está destacada."}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>

          {allRight && (
            <div className="mt-8 border-t border-dashed border-gold/60 pt-6">
              <p className="text-ink">Você acertou todas! Quer que o professor saiba que você concluiu?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <label htmlFor="quiz-nome" className="sr-only">
                  Seu nome (opcional)
                </label>
                <input
                  id="quiz-nome"
                  className="field max-w-xs"
                  placeholder="Seu nome (opcional)"
                  maxLength={80}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
                <button type="button" onClick={enviar} className="btn btn-primary">
                  Enviar
                </button>
              </div>
              {status && <p className="mt-2 text-sm text-muted">{status}</p>}
            </div>
          )}
          {allAnswered && !allRight && (
            <button type="button" onClick={() => setAnswers({})} className="btn btn-ghost mt-6">
              Tentar de novo
            </button>
          )}
        </>
      )}
    </section>
  );
}

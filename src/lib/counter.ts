/**
 * lib/counter.ts — contador de curtidas e visualizações (CounterAPI),
 * o mesmo serviço e as mesmas chaves do site antigo — os números já
 * acumulados continuam aparecendo.
 */
function url(namespace: string, tipo: "like" | "view", chave: string) {
  return `https://counterapi.com/api/${namespace}/${tipo}/${chave}`;
}

async function value(res: Response): Promise<number> {
  if (!res.ok) throw new Error("falhou");
  const data = (await res.json()) as { value?: number };
  return Number(data.value) || 0;
}

export function readCount(namespace: string, tipo: "like" | "view", chave: string) {
  return fetch(`${url(namespace, tipo, chave)}?readOnly=true`).then(value);
}

export function incrementCount(namespace: string, tipo: "like" | "view", chave: string) {
  return fetch(url(namespace, tipo, chave)).then(value);
}

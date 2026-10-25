/**
 * lib/storage.ts — leitura e escrita no localStorage sem quebrar a página
 * quando o navegador bloqueia o armazenamento (aba anônima, Safari restrito…).
 * As chaves são as MESMAS do site antigo, então o histórico de quem já
 * visitava (posts lidos, curtidas, quizzes, tema) continua valendo.
 */
export function getItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setItem(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {}
}

export function getList(key: string): string[] {
  try {
    const v = JSON.parse(getItem(key) || "[]");
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export function addToList(key: string, value: string) {
  const list = getList(key);
  if (!list.includes(value)) {
    list.push(value);
    setItem(key, JSON.stringify(list));
  }
  return list;
}

export const KEYS = {
  postsLidos: "posts-lidos",
  quizzes: "quizzes-concluidos",
  liked: (key: string) => `liked:${key}`,
  pwaDispensado: "pwa-install-dismissed",
  theme: "theme",
};

/** "2026-08-30" → "30/08/2026" (sem fuso horário, pra não mudar o dia). */
export function formatDateBR(date: string): string {
  const [y, m, d] = date.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

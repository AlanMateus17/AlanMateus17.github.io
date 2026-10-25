import { cn } from "@/lib/utils";

/** Selo de estado — sempre com texto, nunca só cor (regra da Aura). */
export default function StatusBadge({ status, long }: { status: "dev" | "plan" | "disponivel" | "em-producao"; long?: boolean }) {
  const map = {
    dev: { label: long ? "Em desenvolvimento" : "Em dev", cls: "bg-success-tint text-success" },
    plan: { label: "Planejado", cls: "bg-gold-tint text-gold-ink" },
    disponivel: { label: "Apostilas disponíveis", cls: "bg-success-tint text-success" },
    "em-producao": { label: "Em produção", cls: "bg-gold-tint text-gold-ink" },
  }[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-sm px-2 py-1 font-mono text-xs whitespace-nowrap", map.cls)}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {map.label}
    </span>
  );
}

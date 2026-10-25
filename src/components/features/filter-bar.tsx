"use client";
import { cn } from "@/lib/utils";

export type FilterOption = { value: string; label: string };

export default function FilterBar({
  options,
  value,
  onChange,
  label = "Filtrar",
}: {
  options: FilterOption[];
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors",
            value === o.value ? "border-aura bg-aura text-on-aura" : "border-line text-muted hover:border-gold hover:text-ink",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

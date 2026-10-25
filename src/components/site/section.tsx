import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: { href: string; label: string };
  id?: string;
  className?: string;
  children: React.ReactNode;
  narrow?: boolean;
};

export default function Section({ eyebrow, title, subtitle, action, id, className, children, narrow }: Props) {
  return (
    <section id={id} className={cn("mx-auto px-4 py-16 sm:px-6", narrow ? "max-w-3xl" : "max-w-6xl", className)}>
      {(eyebrow || title || action) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 className="mt-2 font-display text-3xl leading-tight font-semibold text-ink sm:text-4xl">{title}</h2>}
            {subtitle && <p className="mt-3 text-[16px] leading-relaxed text-muted">{subtitle}</p>}
          </div>
          {action && (
            <Link href={action.href} className="btn btn-ghost">
              {action.label} →
            </Link>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

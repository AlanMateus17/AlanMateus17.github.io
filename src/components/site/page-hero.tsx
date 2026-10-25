import Particles from "@/components/magicui/particles";
import BlurFade from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: string;
  /** Segunda linha do título, em itálico dourado (como no site antigo). */
  accent?: string;
  description?: React.ReactNode;
  tone?: "aura" | "ensino" | "seguranca";
  children?: React.ReactNode;
  className?: string;
};

const accentTone = {
  aura: "text-gold-ink",
  ensino: "text-gold-ink",
  seguranca: "text-warning",
};

export default function PageHero({ eyebrow, title, accent, description, tone = "aura", children, className }: Props) {
  return (
    <header data-share-target className={cn("relative overflow-hidden border-b border-line", className)}>
      <Particles quantity={40} repel={50} />
      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-14 sm:px-6 sm:pt-24 sm:pb-20">
        <BlurFade>
          <p className={cn("eyebrow", tone === "seguranca" && "text-warning")}>{eyebrow}</p>
        </BlurFade>
        <BlurFade delay={0.06}>
          <h1 className="mt-4 max-w-4xl font-display text-[2.6rem] leading-[1.04] font-semibold tracking-tight text-ink sm:text-6xl">
            {title}
            {accent && (
              <>
                <br />
                <em className={cn("font-medium", accentTone[tone])}>{accent}</em>
              </>
            )}
          </h1>
        </BlurFade>
        {description && (
          <BlurFade delay={0.12}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>
          </BlurFade>
        )}
        {children}
      </div>
    </header>
  );
}

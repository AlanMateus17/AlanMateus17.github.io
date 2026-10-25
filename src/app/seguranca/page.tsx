import type { Metadata } from "next";
import PageHero from "@/components/site/page-hero";
import Section from "@/components/site/section";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Segurança Ofensiva",
  description: "Trilha de estudos em segurança ofensiva — eJPT, OSCP e além. Writeups, notas e laboratório.",
};

const CERTS = [
  { nome: "eJPT", sub: "INE — pentest básico e metodologia", ativo: true },
  { nome: "OSCP", sub: "OffSec PEN-200 — metodologia completa e AD", ativo: false },
  { nome: "CRTO", sub: "Zero-Point Security — C2 e red team", ativo: false },
  { nome: "CRTP", sub: "Altered Security — AD kill chain", ativo: false },
  { nome: "OSEP", sub: "OffSec PEN-300 — evasion avançada", ativo: false },
];

const LAB = [
  ["Kali Linux", "VM no Acer Nitro AN515-45"],
  ["BloodHound CE", "via Docker no WSL2"],
  ["TryHackMe", "trilha Jr Pentester"],
  ["PortSwigger Web Academy", "labs de web security"],
  ["HackTheBox", "máquinas ativas"],
];

export default function SegurancaPage() {
  return (
    <>
      <PageHero
        eyebrow="Segurança Ofensiva"
        title="Red Team"
        accent="em formação."
        tone="seguranca"
        description="Trilha eJPT → OSCP → CRTO → além. Cada sistema que construo passa por threat modeling. Aqui ficam os writeups e notas de estudo."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <p className="eyebrow text-warning">Trilha de certificações</p>
            <ol className="mt-6 flex flex-col">
              {CERTS.map((c, i) => (
                <li key={c.nome} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < CERTS.length - 1 && <span aria-hidden="true" className="absolute top-5 left-[9px] h-full w-px border-l border-dashed border-line" />}
                  <span
                    aria-hidden="true"
                    className={cn("relative mt-1 size-[19px] shrink-0 rounded-full border-2", c.ativo ? "border-warning bg-warning-tint" : "border-line bg-paper")}
                  />
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-ink">
                      {c.nome}
                      {c.ativo && <span className="rounded-sm bg-warning-tint px-1.5 py-0.5 font-mono text-[11px] text-warning">estudando agora</span>}
                    </p>
                    <p className="text-sm text-muted">{c.sub}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="card p-6">
            <p className="eyebrow text-warning">Laboratório</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">Setup de estudos</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {LAB.map(([nome, detalhe]) => (
                <li key={nome} className="flex flex-wrap justify-between gap-2 py-3.5">
                  <span className="font-semibold text-ink">{nome}</span>
                  <span className="font-mono text-sm text-muted">{detalhe}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12">
          <p className="eyebrow text-warning">Writeups</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Notas de laboratório</h2>
          <div className="card mt-6 border-dashed p-8 text-center">
            <p className="font-mono text-sm text-muted">// writeups chegando à medida que avanço na trilha</p>
            <p className="mt-2 text-muted">Cada máquina resolvida ou técnica documentada vai aparecer aqui. Comece acompanhando o blog.</p>
          </div>
        </div>
      </Section>
    </>
  );
}

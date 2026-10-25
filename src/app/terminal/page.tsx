import type { Metadata } from "next";
import Terminal from "@/components/features/terminal";

export const metadata: Metadata = { title: "~", description: "Você achou.", robots: { index: false, follow: false } };

export default function TerminalPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Terminal />
    </div>
  );
}

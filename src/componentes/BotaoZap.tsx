import { MessageCircle } from "lucide-react";
import { linkWhatsApp } from "@/lib/formato";

/** Botão flutuante fixo de WhatsApp. */
export function BotaoZap({ whatsapp }: { whatsapp: string }) {
  const zap = linkWhatsApp(
    whatsapp,
    "Olá! Vim pelo site da ZH Informática e gostaria de atendimento."
  );

  return (
    <a
      href={zap}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-zap px-4 py-3.5 font-bold text-white shadow-xl transition hover:bg-zap-escuro hover:shadow-2xl"
    >
      <MessageCircle className="size-6" />
      <span className="hidden text-sm sm:inline">Fale conosco</span>
    </a>
  );
}

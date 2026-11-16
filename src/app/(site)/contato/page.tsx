import { Clock, AtSign, Mail, MapPin, MessageCircle } from "lucide-react";
import { buscarConfig } from "@/lib/dados";
import { linkWhatsApp } from "@/lib/formato";

export const revalidate = 300;
export const metadata = { title: "Contato" };

export default async function PaginaContato() {
  const config = await buscarConfig();
  const zap = linkWhatsApp(
    config.whatsapp,
    "Olá! Vim pelo site da ZH Informática."
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-2xl font-extrabold tracking-tight text-zh-azul-950 sm:text-3xl">
        Fale com a ZH Informática
      </h1>
      <p className="mt-1 text-sm text-zh-azul-900/55">
        Estamos no Centro de Faxinal dos Guedes. Passe na loja ou chame no
        WhatsApp.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.3fr]">
        <div className="grid gap-3">
          <Bloco icone={MapPin} titulo="Endereço">
            {config.endereco}
          </Bloco>

          <Bloco icone={MessageCircle} titulo="WhatsApp">
            <a
              href={zap}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-zap-escuro hover:underline"
            >
              Clique para conversar agora
            </a>
          </Bloco>

          {config.horario && (
            <Bloco icone={Clock} titulo="Horário de atendimento">
              {config.horario}
            </Bloco>
          )}

          {config.instagram && (
            <Bloco icone={AtSign} titulo="Instagram">
              <a
                href={config.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-zh-azul-600 hover:underline"
              >
                @zhinformatica
              </a>
            </Bloco>
          )}

          {config.email && (
            <Bloco icone={Mail} titulo="E-mail">
              {config.email}
            </Bloco>
          )}

          <a
            href={zap}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl bg-zap px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-zap-escuro"
          >
            Chamar no WhatsApp
          </a>
        </div>

        <div className="overflow-hidden rounded-3xl border border-zh-azul-100">
          <iframe
            title="Mapa da ZH Informática"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              config.endereco
            )}&output=embed`}
            className="h-full min-h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}

function Bloco({
  icone: Icone,
  titulo,
  children,
}: {
  icone: React.ElementType;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-zh-azul-100 bg-white p-5">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-zh-azul-50 text-zh-azul-600">
        <Icone className="size-5" />
      </span>
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-zh-azul-400">
          {titulo}
        </p>
        <div className="mt-1 text-sm leading-relaxed text-zh-azul-950">
          {children}
        </div>
      </div>
    </div>
  );
}

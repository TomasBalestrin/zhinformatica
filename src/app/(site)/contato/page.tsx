import { AtSign, Clock, Mail, MapPin, MessageCircle } from "lucide-react";
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
    <>
      <div className="border-b border-zinc-100">
        <div className="mx-auto max-w-[1226px] px-4 py-10">
          <h1 className="text-[26px] font-medium text-zinc-900">
            Fale com a ZH Informática
          </h1>
          <p className="mt-2 text-[14px] text-zinc-500">
            Estamos no Centro de Faxinal dos Guedes. Passe na loja ou chame no
            WhatsApp.
          </p>
        </div>
      </div>

      <div className="faixa-cinza">
        <div className="mx-auto max-w-[1226px] px-4 py-8">
          <div className="grid gap-px bg-zinc-100 lg:grid-cols-[380px_1fr]">
            <div className="grid gap-px bg-zinc-100">
              <Bloco icone={MapPin} titulo="Endereço">
                {config.endereco}
              </Bloco>

              <Bloco icone={MessageCircle} titulo="WhatsApp">
                <a
                  href={zap}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zh-laranja-500 transition hover:underline"
                >
                  Clique para conversar agora
                </a>
              </Bloco>

              {config.horario && (
                <Bloco icone={Clock} titulo="Horário">
                  {config.horario}
                </Bloco>
              )}

              {config.instagram && (
                <Bloco icone={AtSign} titulo="Instagram">
                  <a
                    href={config.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zh-laranja-500 transition hover:underline"
                  >
                    zhinformatica
                  </a>
                </Bloco>
              )}

              {config.email && (
                <Bloco icone={Mail} titulo="E-mail">
                  {config.email}
                </Bloco>
              )}
            </div>

            <iframe
              title="Mapa da ZH Informática"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                config.endereco
              )}&output=embed`}
              className="h-full min-h-[440px] w-full border-0 bg-white"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </>
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
    <div className="flex gap-4 bg-white px-7 py-7">
      <Icone className="mt-0.5 size-5 shrink-0 text-zinc-300" />
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wide text-zinc-400">
          {titulo}
        </p>
        <div className="mt-1.5 text-[14px] leading-relaxed text-zinc-700">
          {children}
        </div>
      </div>
    </div>
  );
}

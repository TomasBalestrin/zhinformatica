import Link from "next/link";
import { AtSign, Clock, MapPin, Phone } from "lucide-react";
import { linkWhatsApp } from "@/lib/formato";
import type { Categoria, Config } from "@/lib/tipos";

export function Rodape({
  categorias,
  config,
}: {
  categorias: Categoria[];
  config: Config;
}) {
  const zap = linkWhatsApp(
    config.whatsapp,
    "Olá! Vim pelo site da ZH Informática."
  );
  const telefoneBonito = formatarTelefone(config.whatsapp);

  return (
    <footer className="border-t border-zinc-100 bg-white">
      {/* chamada final */}
      <div className="faixa-cinza">
        <div className="mx-auto flex max-w-[1226px] flex-col items-center gap-5 px-4 py-14 text-center">
          <h2 className="text-[24px] font-medium text-zinc-900">
            Não achou o que procurava?
          </h2>
          <p className="max-w-lg text-[15px] leading-relaxed text-zinc-600">
            O estoque da loja é maior do que o site mostra. Chame no WhatsApp e
            pergunte — respondemos no horário comercial.
          </p>
          <a
            href={zap}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-zh-laranja-500 px-7 py-3 text-[14px] font-medium text-white transition hover:bg-zh-laranja-600"
          >
            Falar com a loja
          </a>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1226px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-[13px] font-medium text-zinc-900">Categorias</h3>
          <ul className="mt-4 space-y-2.5">
            {categorias.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/produtos?categoria=${c.slug}`}
                  className="text-[13px] text-zinc-500 transition hover:text-zh-laranja-500"
                >
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[13px] font-medium text-zinc-900">A loja</h3>
          <ul className="mt-4 space-y-2.5">
            {[
              { href: "/produtos", rotulo: "Todos os produtos" },
              { href: "/assistencia", rotulo: "Assistência técnica" },
              { href: "/contato", rotulo: "Contato e localização" },
              { href: "/admin", rotulo: "Área administrativa" },
            ].map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-[13px] text-zinc-500 transition hover:text-zh-laranja-500"
                >
                  {l.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-[13px] font-medium text-zinc-900">Atendimento</h3>
          <ul className="mt-4 space-y-3">
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-zinc-300" />
              <a
                href={zap}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-zinc-500 transition hover:text-zh-laranja-500"
              >
                {telefoneBonito}
              </a>
            </li>
            {config.horario && (
              <li className="flex gap-2.5">
                <Clock className="mt-0.5 size-4 shrink-0 text-zinc-300" />
                <span className="text-[13px] leading-relaxed text-zinc-500">
                  {config.horario}
                </span>
              </li>
            )}
            {config.instagram && (
              <li className="flex gap-2.5">
                <AtSign className="mt-0.5 size-4 shrink-0 text-zinc-300" />
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-zinc-500 transition hover:text-zh-laranja-500"
                >
                  zhinformatica
                </a>
              </li>
            )}
          </ul>
        </div>

        <div>
          <h3 className="text-[13px] font-medium text-zinc-900">Endereço</h3>
          <p className="mt-4 flex gap-2.5">
            <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-300" />
            <span className="text-[13px] leading-relaxed text-zinc-500">
              {config.endereco}
            </span>
          </p>
        </div>
      </div>

      <div className="border-t border-zinc-100">
        <div className="mx-auto max-w-[1226px] px-4 py-6 text-center text-[12px] text-zinc-400">
          © {new Date().getFullYear()} ZH Informática — Faxinal dos Guedes/SC
        </div>
      </div>
    </footer>
  );
}

function formatarTelefone(numero: string): string {
  const d = (numero || "").replace(/\D/g, "");
  if (d.length >= 12) {
    const ddd = d.slice(2, 4);
    const resto = d.slice(4);
    const meio = resto.length === 9 ? resto.slice(0, 5) : resto.slice(0, 4);
    const fim = resto.length === 9 ? resto.slice(5) : resto.slice(4);
    return `(${ddd}) ${meio}-${fim}`;
  }
  return numero;
}

import Link from "next/link";
import { Clock, AtSign, MapPin, Phone } from "lucide-react";
import { Logo } from "./Logo";
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
    <footer className="mt-20 bg-zh-azul-950 text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo claro src={config.logo || null} />
          <p className="mt-4 text-sm leading-relaxed">
            Apple, Xiaomi, JBL, HP, ASUS e ACER. Linha gamer completa, Starlink,
            móveis para escritório e assistência técnica especializada.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Categorias
          </h3>
          <ul className="space-y-2 text-sm">
            {categorias.slice(0, 7).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/produtos?categoria=${c.slug}`}
                  className="transition hover:text-zh-laranja-400"
                >
                  {c.nome}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Navegação
          </h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/produtos" className="hover:text-zh-laranja-400">
                Todos os produtos
              </Link>
            </li>
            <li>
              <Link href="/assistencia" className="hover:text-zh-laranja-400">
                Assistência técnica
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-zh-laranja-400">
                Contato e localização
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-zh-laranja-400">
                Área administrativa
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
            Contato
          </h3>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-zh-laranja-400" />
              <span>{config.endereco}</span>
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-zh-laranja-400" />
              <a href={zap} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {telefoneBonito}
              </a>
            </li>
            {config.horario && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-zh-laranja-400" />
                <span>{config.horario}</span>
              </li>
            )}
            {config.instagram && (
              <li className="flex gap-3">
                <AtSign className="mt-0.5 size-4 shrink-0 text-zh-laranja-400" />
                <a
                  href={config.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  @zhinformatica
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/50">
          © {new Date().getFullYear()} ZH Informática. Todos os direitos
          reservados.
        </div>
      </div>
    </footer>
  );
}

function formatarTelefone(numero: string): string {
  const d = (numero || "").replace(/\D/g, "");
  // 55 49 9 9999 9999
  if (d.length >= 12) {
    const ddd = d.slice(2, 4);
    const resto = d.slice(4);
    const meio = resto.length === 9 ? resto.slice(0, 5) : resto.slice(0, 4);
    const fim = resto.length === 9 ? resto.slice(5) : resto.slice(4);
    return `(${ddd}) ${meio}-${fim}`;
  }
  return numero;
}

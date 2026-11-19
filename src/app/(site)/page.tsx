import Link from "next/link";
import {
  ArrowRight,
  Gamepad2,
  Headphones,
  Laptop,
  MapPin,
  Monitor,
  Printer,
  Satellite,
  ShieldCheck,
  Smartphone,
  Truck,
  Wrench,
} from "lucide-react";
import { Carrossel } from "@/componentes/Carrossel";
import { CardProduto } from "@/componentes/CardProduto";
import {
  buscarBanners,
  buscarCategorias,
  buscarConfig,
  buscarProdutos,
  proporcoesDosBanners,
} from "@/lib/dados";
import { linkWhatsApp } from "@/lib/formato";

export const revalidate = 60;

const ICONES: Record<string, React.ElementType> = {
  celulares: Smartphone,
  notebooks: Laptop,
  fones: Headphones,
  "caixas-de-som": Headphones,
  perifericos: Monitor,
  gamer: Gamepad2,
  starlink: Satellite,
  impressoras: Printer,
  relogios: Smartphone,
  escritorio: Monitor,
};

export default async function Home() {
  const [banners, categorias, config, destaques, recentes] = await Promise.all([
    buscarBanners(),
    buscarCategorias(),
    buscarConfig(),
    buscarProdutos({ destaque: true, limite: 10 }),
    buscarProdutos({ limite: 10 }),
  ]);

  const proporcoesBanner = await proporcoesDosBanners(banners);
  const vitrine = destaques.length > 0 ? destaques : recentes;

  return (
    <>
      {banners.length > 0 ? (
        <Carrossel banners={banners} proporcoes={proporcoesBanner} />
      ) : (
        <HeroPadrao whatsapp={config.whatsapp} />
      )}

      {/* garantias da loja */}
      <section className="border-b border-zinc-100 pt-10">
        <div className="mx-auto grid max-w-[1226px] grid-cols-2 gap-px border-x border-zinc-100 bg-zinc-100 lg:grid-cols-4">
          {[
            { icone: ShieldCheck, titulo: "Produtos originais", texto: "Com garantia de fábrica" },
            { icone: Wrench, titulo: "Assistência própria", texto: "Técnicos na loja" },
            { icone: Truck, titulo: "Entrega na região", texto: "Faxinal e cidades vizinhas" },
            { icone: MapPin, titulo: "Loja física", texto: "Centro de Faxinal dos Guedes" },
          ].map((d) => (
            <div
              key={d.titulo}
              className="flex items-center justify-center gap-3 bg-white px-3 py-7 text-center sm:text-left"
            >
              <d.icone className="size-6 shrink-0 text-zh-laranja-500" />
              <div>
                <p className="text-[13px] font-medium text-zinc-900">{d.titulo}</p>
                <p className="mt-0.5 text-[12px] text-zinc-500">{d.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* categorias */}
      <Secao titulo="Categorias">
        <div className="grid grid-cols-2 gap-px bg-zinc-100 sm:grid-cols-3 lg:grid-cols-5">
          {categorias.map((c) => {
            const Icone = ICONES[c.slug] ?? Monitor;
            return (
              <Link
                key={c.id}
                href={`/produtos?categoria=${c.slug}`}
                className="group flex flex-col items-center gap-4 bg-white px-4 py-9 text-center transition hover:bg-zinc-50"
              >
                <Icone className="size-9 text-zinc-400 transition group-hover:text-zh-laranja-500" />
                <span className="text-[14px] leading-tight text-zinc-700">
                  {c.nome}
                </span>
              </Link>
            );
          })}
        </div>
      </Secao>

      {/* vitrine */}
      <Secao
        titulo={destaques.length > 0 ? "Destaques" : "Novidades"}
        verTudo="/produtos"
        cinza
      >
        {vitrine.length > 0 ? (
          <div className="grid grid-cols-2 gap-px bg-zinc-100 lg:grid-cols-5">
            {vitrine.map((p) => (
              <CardProduto key={p.id} produto={p} whatsapp={config.whatsapp} />
            ))}
          </div>
        ) : (
          <div className="bg-white px-6 py-20 text-center">
            <p className="text-[15px] text-zinc-500">
              Nenhum produto cadastrado ainda. Acesse a{" "}
              <Link href="/admin" className="text-zh-laranja-500 underline">
                área administrativa
              </Link>{" "}
              para cadastrar os primeiros.
            </p>
          </div>
        )}
      </Secao>

      {/* bloco de assistência */}
      <section className="mx-auto max-w-[1226px] px-4 py-10">
        <div className="grid gap-px bg-zinc-100 lg:grid-cols-2">
          <div className="flex flex-col justify-center bg-zh-azul-800 px-8 py-14 sm:px-12">
            <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-zh-laranja-400">
              Assistência técnica
            </p>
            <h2 className="mt-4 text-[28px] font-medium leading-tight text-white sm:text-[34px]">
              Seu equipamento com problema? A gente resolve.
            </h2>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              Troca de tela, bateria, formatação, upgrade de SSD e memória,
              recuperação de dados e manutenção de impressoras. O orçamento sai
              antes do conserto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={linkWhatsApp(
                  config.whatsapp,
                  "Olá! Gostaria de um orçamento de assistência técnica."
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zh-laranja-500 px-6 py-3 text-[14px] font-medium text-white transition hover:bg-zh-laranja-600"
              >
                Pedir orçamento
              </a>
              <Link
                href="/assistencia"
                className="border border-white/25 px-6 py-3 text-[14px] font-medium text-white transition hover:bg-white/10"
              >
                Ver serviços
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-zinc-100">
            {[
              { icone: Smartphone, texto: "Troca de tela e bateria" },
              { icone: Monitor, texto: "Formatação e limpeza" },
              { icone: Laptop, texto: "Upgrade de SSD e memória" },
              { icone: Printer, texto: "Manutenção de impressoras" },
            ].map((s) => (
              <div
                key={s.texto}
                className="flex flex-col items-center justify-center gap-4 bg-white px-5 py-12 text-center"
              >
                <s.icone className="size-8 text-zinc-300" />
                <p className="text-[14px] leading-snug text-zinc-700">
                  {s.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* localização */}
      <Secao titulo="Onde estamos" cinza>
        <div className="grid gap-px bg-zinc-100 lg:grid-cols-[380px_1fr]">
          <div className="bg-white px-8 py-10">
            <h3 className="text-[17px] font-medium text-zinc-900">
              ZH Informática
            </h3>
            <p className="mt-3 text-[14px] leading-relaxed text-zinc-600">
              {config.endereco}
            </p>
            {config.horario && (
              <p className="mt-4 text-[13px] leading-relaxed text-zinc-500">
                {config.horario}
              </p>
            )}
            <a
              href={linkWhatsApp(
                config.whatsapp,
                "Olá! Vim pelo site da ZH Informática."
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block bg-zh-laranja-500 px-6 py-3 text-[14px] font-medium text-white transition hover:bg-zh-laranja-600"
            >
              Chamar no WhatsApp
            </a>
          </div>

          <iframe
            title="Mapa da ZH Informática"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              config.endereco
            )}&output=embed`}
            className="h-[360px] w-full border-0 bg-white"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Secao>
    </>
  );
}

/** Bloco de catálogo: título discreto, link "ver tudo" à direita. */
function Secao({
  titulo,
  verTudo,
  cinza = false,
  children,
}: {
  titulo: string;
  verTudo?: string;
  cinza?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className={cinza ? "faixa-cinza" : ""}>
      <div className="mx-auto max-w-[1226px] px-4 py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-[22px] font-medium text-zinc-900">{titulo}</h2>
          {verTudo && (
            <Link
              href={verTudo}
              className="flex shrink-0 items-center gap-1 text-[13px] text-zinc-500 transition hover:text-zh-laranja-500"
            >
              Ver tudo <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
        {children}
      </div>
    </section>
  );
}

function HeroPadrao({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="bg-zh-azul-800">
      <div className="mx-auto max-w-[1226px] px-4 py-24 text-center">
        <h1 className="mx-auto max-w-3xl text-[34px] font-medium leading-tight text-white sm:text-[48px]">
          Tecnologia, games e assistência técnica em Faxinal dos Guedes.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70 sm:text-[17px]">
          iPhones, notebooks, PS5, Starlink, fones, caixas de som, periféricos e
          móveis para escritório.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            href="/produtos"
            className="bg-zh-laranja-500 px-7 py-3 text-[14px] font-medium text-white transition hover:bg-zh-laranja-600"
          >
            Ver produtos
          </Link>
          <a
            href={linkWhatsApp(whatsapp, "Olá! Vim pelo site da ZH Informática.")}
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/25 px-7 py-3 text-[14px] font-medium text-white transition hover:bg-white/10"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

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
  Shield,
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
    buscarProdutos({ destaque: true, limite: 8 }),
    buscarProdutos({ limite: 8 }),
  ]);

  const vitrine = destaques.length > 0 ? destaques : recentes;
  const proporcoesBanner = await proporcoesDosBanners(banners);

  return (
    <>
      {banners.length > 0 ? (
        <Carrossel banners={banners} proporcoes={proporcoesBanner} />
      ) : (
        <HeroPadrao whatsapp={config.whatsapp} />
      )}

      {/* diferenciais */}
      <section className="mx-auto mt-10 grid max-w-7xl gap-3 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icone: Shield, titulo: "Produtos originais", texto: "Apple, Xiaomi, JBL, HP, ASUS e ACER com garantia." },
          { icone: Wrench, titulo: "Assistência técnica", texto: "Manutenção de celulares, notebooks e computadores." },
          { icone: Truck, titulo: "Entrega na região", texto: "Faxinal dos Guedes e cidades vizinhas." },
          { icone: MapPin, titulo: "Loja física", texto: "Venha conhecer no Centro da cidade." },
        ].map((d) => (
          <div
            key={d.titulo}
            className="flex gap-3 rounded-2xl border border-zh-azul-100 bg-white p-4"
          >
            <d.icone className="size-6 shrink-0 text-zh-laranja-500" />
            <div>
              <p className="text-sm font-bold text-zh-azul-950">{d.titulo}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-zh-azul-900/60">
                {d.texto}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* categorias */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <Titulo
          titulo="Navegue por categoria"
          subtitulo="Tudo o que você precisa em tecnologia, em um só lugar."
        />
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categorias.map((c) => {
            const Icone = ICONES[c.slug] ?? Monitor;
            return (
              <Link
                key={c.id}
                href={`/produtos?categoria=${c.slug}`}
                className="group flex flex-col items-center gap-3 rounded-2xl border border-zh-azul-100 bg-white p-5 text-center transition hover:-translate-y-1 hover:border-zh-azul-300 hover:shadow-md"
              >
                <span className="grid size-12 place-items-center rounded-xl bg-zh-azul-50 text-zh-azul-600 transition group-hover:bg-zh-azul-600 group-hover:text-white">
                  <Icone className="size-6" />
                </span>
                <span className="text-[13px] font-semibold leading-tight text-zh-azul-950">
                  {c.nome}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* vitrine */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="flex items-end justify-between gap-4">
          <Titulo
            titulo={destaques.length > 0 ? "Destaques da loja" : "Novidades"}
            subtitulo="Clique e negocie direto pelo WhatsApp."
          />
          <Link
            href="/produtos"
            className="hidden shrink-0 items-center gap-1 text-sm font-bold text-zh-azul-600 hover:text-zh-laranja-500 sm:flex"
          >
            Ver todos <ArrowRight className="size-4" />
          </Link>
        </div>

        {vitrine.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {vitrine.map((p) => (
              <CardProduto key={p.id} produto={p} whatsapp={config.whatsapp} />
            ))}
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-zh-azul-200 bg-white p-12 text-center">
            <p className="text-sm text-zh-azul-900/60">
              Nenhum produto cadastrado ainda. Acesse a{" "}
              <Link href="/admin" className="font-bold text-zh-azul-600 underline">
                área administrativa
              </Link>{" "}
              para cadastrar os primeiros.
            </p>
          </div>
        )}
      </section>

      {/* assistência */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="overflow-hidden rounded-3xl bg-zh-azul-800">
          <div className="grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-zh-laranja-500/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zh-laranja-300">
                <Wrench className="size-3.5" /> Assistência técnica
              </span>
              <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                Seu equipamento com problema? A gente resolve.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/75">
                Troca de tela, bateria, formatação, limpeza interna, upgrade de
                memória e SSD, recuperação de dados e manutenção de impressoras.
                Orçamento sem compromisso.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={linkWhatsApp(
                    config.whatsapp,
                    "Olá! Gostaria de um orçamento de assistência técnica."
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-zap px-5 py-3 text-sm font-bold text-white transition hover:bg-zap-escuro"
                >
                  Pedir orçamento
                </a>
                <Link
                  href="/assistencia"
                  className="rounded-full border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  Ver todos os serviços
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                "Troca de tela e bateria",
                "Formatação e limpeza",
                "Upgrade de SSD e memória",
                "Manutenção de impressoras",
              ].map((s) => (
                <div
                  key={s}
                  className="rounded-2xl bg-white/8 p-4 text-sm font-semibold text-white/90 ring-1 ring-white/10"
                >
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* localização */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <Titulo titulo="Onde estamos" subtitulo={config.endereco} />
        <div className="mt-6 overflow-hidden rounded-3xl border border-zh-azul-100">
          <iframe
            title="Mapa da ZH Informática"
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              config.endereco
            )}&output=embed`}
            className="h-80 w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}

function Titulo({ titulo, subtitulo }: { titulo: string; subtitulo?: string }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold tracking-tight text-zh-azul-950 sm:text-2xl">
        {titulo}
      </h2>
      {subtitulo && (
        <p className="mt-1 text-sm text-zh-azul-900/55">{subtitulo}</p>
      )}
    </div>
  );
}

function HeroPadrao({ whatsapp }: { whatsapp: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-6">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-zh-azul-700 via-zh-azul-800 to-zh-azul-950 p-8 sm:p-14">
        <span className="inline-block rounded-full bg-zh-laranja-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zh-laranja-300">
          Faxinal dos Guedes · SC
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-5xl">
          Tecnologia, games e assistência técnica em um só lugar.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
          iPhones, notebooks, PS5, Starlink, fones, caixas de som, periféricos e
          móveis para escritório. Atendimento próximo e preço justo.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/produtos"
            className="rounded-full bg-zh-laranja-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-zh-laranja-600"
          >
            Ver produtos
          </Link>
          <a
            href={linkWhatsApp(whatsapp, "Olá! Vim pelo site da ZH Informática.")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-zap px-6 py-3 text-sm font-bold text-white transition hover:bg-zap-escuro"
          >
            Falar no WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

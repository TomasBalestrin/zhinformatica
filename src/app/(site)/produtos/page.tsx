import Link from "next/link";
import { SearchX } from "lucide-react";
import { CardProduto } from "@/componentes/CardProduto";
import { buscarCategorias, buscarConfig, buscarProdutos } from "@/lib/dados";

export const revalidate = 60;

export const metadata = { title: "Produtos" };

export default async function PaginaProdutos({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; busca?: string }>;
}) {
  const { categoria, busca } = await searchParams;

  const [categorias, config, produtos] = await Promise.all([
    buscarCategorias(),
    buscarConfig(),
    buscarProdutos({ categoriaSlug: categoria, busca }),
  ]);

  const atual = categorias.find((c) => c.slug === categoria);
  const titulo = busca
    ? `Resultados para "${busca}"`
    : (atual?.nome ?? "Todos os produtos");

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <nav className="text-xs text-zh-azul-900/50">
        <Link href="/" className="hover:text-zh-azul-600">
          Início
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-semibold text-zh-azul-900/80">{titulo}</span>
      </nav>

      <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-zh-azul-950 sm:text-3xl">
        {titulo}
      </h1>
      <p className="mt-1 text-sm text-zh-azul-900/55">
        {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
      </p>

      {/* filtros */}
      <div className="sem-barra mt-6 flex gap-2 overflow-x-auto pb-1">
        <Chip ativo={!categoria && !busca} href="/produtos">
          Todos
        </Chip>
        {categorias.map((c) => (
          <Chip
            key={c.id}
            ativo={c.slug === categoria}
            href={`/produtos?categoria=${c.slug}`}
          >
            {c.nome}
          </Chip>
        ))}
      </div>

      {produtos.length > 0 ? (
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {produtos.map((p) => (
            <CardProduto key={p.id} produto={p} whatsapp={config.whatsapp} />
          ))}
        </div>
      ) : (
        <div className="mt-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zh-azul-200 bg-white p-14 text-center">
          <SearchX className="size-10 text-zh-azul-200" />
          <p className="text-sm font-semibold text-zh-azul-950">
            Nenhum produto encontrado
          </p>
          <p className="max-w-sm text-xs text-zh-azul-900/55">
            Tente outra categoria ou fale com a gente no WhatsApp — temos muito
            mais em estoque do que aparece aqui.
          </p>
        </div>
      )}
    </div>
  );
}

function Chip({
  href,
  ativo,
  children,
}: {
  href: string;
  ativo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-[13px] font-semibold transition ${
        ativo
          ? "bg-zh-azul-600 text-white"
          : "border border-zh-azul-100 bg-white text-zh-azul-900/75 hover:border-zh-azul-300"
      }`}
    >
      {children}
    </Link>
  );
}

import Link from "next/link";
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
    <>
      <div className="border-b border-zinc-100">
        <div className="mx-auto max-w-[1226px] px-4 py-8">
          <nav className="text-[12px] text-zinc-400">
            <Link href="/" className="transition hover:text-zh-laranja-500">
              Início
            </Link>
            <span className="mx-2">/</span>
            <span className="text-zinc-600">{titulo}</span>
          </nav>
          <h1 className="mt-3 text-[26px] font-medium text-zinc-900">
            {titulo}
          </h1>
          <p className="mt-1 text-[13px] text-zinc-500">
            {produtos.length} {produtos.length === 1 ? "produto" : "produtos"}
          </p>
        </div>
      </div>

      {/* filtros */}
      <div className="border-b border-zinc-100">
        <div className="sem-barra mx-auto flex max-w-[1226px] gap-6 overflow-x-auto px-4">
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
      </div>

      <div className="faixa-cinza">
        <div className="mx-auto max-w-[1226px] px-4 py-8">
          {produtos.length > 0 ? (
            <div className="grid grid-cols-2 gap-px bg-zinc-100 lg:grid-cols-5">
              {produtos.map((p) => (
                <CardProduto key={p.id} produto={p} whatsapp={config.whatsapp} />
              ))}
            </div>
          ) : (
            <div className="bg-white px-6 py-24 text-center">
              <p className="text-[16px] text-zinc-900">
                Nenhum produto encontrado
              </p>
              <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-zinc-500">
                Tente outra categoria ou chame no WhatsApp — o estoque da loja é
                maior do que o site mostra.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
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
      className={`whitespace-nowrap border-b-2 py-4 text-[14px] transition ${
        ativo
          ? "border-zh-laranja-500 text-zh-laranja-500"
          : "border-transparent text-zinc-600 hover:text-zh-laranja-500"
      }`}
    >
      {children}
    </Link>
  );
}

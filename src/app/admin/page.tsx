import Link from "next/link";
import { ArrowUpRight, Images, Package, Star, Tags } from "lucide-react";
import { criarClienteServidor } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export default async function PainelAdmin() {
  const supabase = await criarClienteServidor();

  const [produtos, ativos, destaques, banners, categorias] = await Promise.all([
    supabase.from("produtos").select("id", { count: "exact", head: true }),
    supabase
      .from("produtos")
      .select("id", { count: "exact", head: true })
      .eq("ativo", true),
    supabase
      .from("produtos")
      .select("id", { count: "exact", head: true })
      .eq("destaque", true),
    supabase.from("banners").select("id", { count: "exact", head: true }),
    supabase.from("categorias").select("id", { count: "exact", head: true }),
  ]);

  const cartoes = [
    { rotulo: "Produtos cadastrados", valor: produtos.count ?? 0, icone: Package },
    { rotulo: "Produtos visíveis", valor: ativos.count ?? 0, icone: Package },
    { rotulo: "Em destaque", valor: destaques.count ?? 0, icone: Star },
    { rotulo: "Banners", valor: banners.count ?? 0, icone: Images },
    { rotulo: "Categorias", valor: categorias.count ?? 0, icone: Tags },
  ];

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-zh-azul-950">
        Painel
      </h1>
      <p className="mt-1 text-sm text-zh-azul-900/55">
        Gerencie o conteúdo que aparece no site da ZH Informática.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cartoes.map((c) => (
          <div
            key={c.rotulo}
            className="rounded-2xl border border-zh-azul-100 bg-white p-5"
          >
            <c.icone className="size-5 text-zh-laranja-500" />
            <p className="mt-3 text-3xl font-extrabold text-zh-azul-950">
              {c.valor}
            </p>
            <p className="text-xs font-semibold text-zh-azul-900/55">
              {c.rotulo}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mt-10 text-sm font-bold uppercase tracking-wider text-zh-azul-400">
        Ações rápidas
      </h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Atalho
          href="/admin/produtos/novo"
          titulo="Cadastrar produto"
          texto="Adicione um novo item ao catálogo com foto, preço e categoria."
        />
        <Atalho
          href="/admin/banners"
          titulo="Gerenciar banners"
          texto="Troque as imagens do carrossel da página inicial."
        />
        <Atalho
          href="/admin/configuracoes"
          titulo="Dados da loja"
          texto="Atualize WhatsApp, endereço, horário e Instagram."
        />
        <Atalho
          href="/"
          titulo="Ver site publicado"
          texto="Confira como os clientes estão vendo a loja."
        />
      </div>
    </div>
  );
}

function Atalho({
  href,
  titulo,
  texto,
}: {
  href: string;
  titulo: string;
  texto: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start justify-between gap-4 rounded-2xl border border-zh-azul-100 bg-white p-5 transition hover:border-zh-azul-300 hover:shadow-md"
    >
      <span>
        <span className="block text-sm font-bold text-zh-azul-950">
          {titulo}
        </span>
        <span className="mt-1 block text-xs leading-relaxed text-zh-azul-900/55">
          {texto}
        </span>
      </span>
      <ArrowUpRight className="size-4 shrink-0 text-zh-azul-300 transition group-hover:text-zh-laranja-500" />
    </Link>
  );
}

import { ListaProdutosAdmin } from "@/componentes/ListaProdutosAdmin";
import { criarClienteServidor } from "@/lib/supabase-server";
import type { Categoria, Produto } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function AdminProdutos() {
  const supabase = await criarClienteServidor();

  const [{ data: produtos }, { data: categorias }] = await Promise.all([
    supabase
      .from("produtos")
      .select("*")
      .order("criado_em", { ascending: false }),
    supabase.from("categorias").select("*").order("ordem"),
  ]);

  return (
    <ListaProdutosAdmin
      produtos={(produtos ?? []) as Produto[]}
      categorias={(categorias ?? []) as Categoria[]}
    />
  );
}

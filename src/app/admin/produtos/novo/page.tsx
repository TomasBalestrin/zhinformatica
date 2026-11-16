import { FormProduto } from "@/componentes/FormProduto";
import { criarClienteServidor } from "@/lib/supabase-server";
import type { Categoria } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function NovoProduto() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("categorias").select("*").order("ordem");
  return <FormProduto categorias={(data ?? []) as Categoria[]} />;
}

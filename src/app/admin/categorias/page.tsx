import { GerenciadorCategorias } from "@/componentes/GerenciadorCategorias";
import { criarClienteServidor } from "@/lib/supabase-server";
import type { Categoria } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function AdminCategorias() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("categorias").select("*").order("ordem");
  return <GerenciadorCategorias categorias={(data ?? []) as Categoria[]} />;
}

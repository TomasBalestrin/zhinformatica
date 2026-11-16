import { notFound } from "next/navigation";
import { FormProduto } from "@/componentes/FormProduto";
import { criarClienteServidor } from "@/lib/supabase-server";
import type { Categoria, Produto } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function EditarProduto({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await criarClienteServidor();

  const [{ data: produto }, { data: categorias }] = await Promise.all([
    supabase.from("produtos").select("*").eq("id", id).maybeSingle(),
    supabase.from("categorias").select("*").order("ordem"),
  ]);

  if (!produto) notFound();

  return (
    <FormProduto
      produto={produto as Produto}
      categorias={(categorias ?? []) as Categoria[]}
    />
  );
}

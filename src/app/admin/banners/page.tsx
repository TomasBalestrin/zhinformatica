import { GerenciadorBanners } from "@/componentes/GerenciadorBanners";
import { criarClienteServidor } from "@/lib/supabase-server";
import type { Banner } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function AdminBanners() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("banners").select("*").order("ordem");
  return <GerenciadorBanners banners={(data ?? []) as Banner[]} />;
}

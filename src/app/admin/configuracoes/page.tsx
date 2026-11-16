import { FormConfiguracoes } from "@/componentes/FormConfiguracoes";
import { criarClienteServidor } from "@/lib/supabase-server";
import type { Config } from "@/lib/tipos";

export const dynamic = "force-dynamic";

export default async function AdminConfiguracoes() {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("configuracoes").select("chave, valor");

  const config: Config = {};
  (data ?? []).forEach((l) => {
    config[l.chave] = l.valor ?? "";
  });

  return <FormConfiguracoes config={config} />;
}

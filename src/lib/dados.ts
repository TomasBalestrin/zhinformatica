import { criarClienteServidor } from "./supabase-server";
import type { Banner, Categoria, Config, Produto } from "./tipos";

export async function buscarConfig(): Promise<Config> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase.from("configuracoes").select("chave, valor");
  const config: Config = {};
  (data ?? []).forEach((linha) => {
    config[linha.chave] = linha.valor ?? "";
  });
  // Padrões caso o banco ainda esteja vazio.
  config.whatsapp ??= "554934360215";
  config.endereco ??=
    "R. Sete de Setembro, N° 245 - Centro, Faxinal dos Guedes - SC, 89694-000";
  return config;
}

export async function buscarBanners(): Promise<Banner[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  return (data ?? []) as Banner[];
}

export async function buscarCategorias(): Promise<Categoria[]> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("categorias")
    .select("*")
    .order("ordem", { ascending: true });
  return (data ?? []) as Categoria[];
}

export async function buscarProdutos(opcoes?: {
  categoriaSlug?: string;
  destaque?: boolean;
  busca?: string;
  limite?: number;
}): Promise<Produto[]> {
  const supabase = await criarClienteServidor();

  let categoriaId: string | undefined;
  if (opcoes?.categoriaSlug) {
    const { data: cat } = await supabase
      .from("categorias")
      .select("id")
      .eq("slug", opcoes.categoriaSlug)
      .maybeSingle();
    if (!cat) return [];
    categoriaId = cat.id;
  }

  let query = supabase
    .from("produtos")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true })
    .order("criado_em", { ascending: false });

  if (categoriaId) query = query.eq("categoria_id", categoriaId);
  if (opcoes?.destaque) query = query.eq("destaque", true);
  if (opcoes?.busca) query = query.ilike("nome", `%${opcoes.busca}%`);
  if (opcoes?.limite) query = query.limit(opcoes.limite);

  const { data } = await query;
  return (data ?? []) as Produto[];
}

export async function buscarProduto(id: string): Promise<Produto | null> {
  const supabase = await criarClienteServidor();
  const { data } = await supabase
    .from("produtos")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  return (data as Produto) ?? null;
}

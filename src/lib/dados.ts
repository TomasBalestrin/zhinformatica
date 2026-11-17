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

/**
 * Proporções (largura ÷ altura) dos banners, por tipo de tela.
 *
 * O carrossel usa essas medidas como altura da moldura, assim a imagem
 * aparece inteira, sem corte — em vez de forçar um formato fixo ao qual o
 * banner enviado precisaria se encaixar.
 */
export async function proporcoesDosBanners(
  banners: Banner[]
): Promise<{ desktop: number | null; mobile: number | null }> {
  if (banners.length === 0) return { desktop: null, mobile: null };

  const [desktop, mobile] = await Promise.all([
    menorProporcao(banners.map((b) => b.imagem_url)),
    // Banner sem imagem de celular cai na de desktop, como na renderização.
    menorProporcao(banners.map((b) => b.imagem_mobile_url ?? b.imagem_url)),
  ]);

  return { desktop, mobile };
}

/** A menor proporção é a imagem mais alta: ela define a moldura. */
async function menorProporcao(urls: string[]): Promise<number | null> {
  const medidas = await Promise.all(urls.map((u) => medirImagem(u)));
  const validas = medidas.filter((m): m is number => m !== null);
  return validas.length > 0 ? Math.min(...validas) : null;
}

/** Lê largura e altura direto do cabeçalho do PNG/JPEG, sem baixar tudo. */
async function medirImagem(url: string): Promise<number | null> {
  try {
    const resposta = await fetch(url, {
      headers: { Range: "bytes=0-4095" },
      next: { revalidate: 3600 },
    });
    if (!resposta.ok) return null;

    const bytes = new Uint8Array(await resposta.arrayBuffer());
    const tamanho = dimensoesPng(bytes) ?? dimensoesJpeg(bytes);
    if (!tamanho || tamanho.altura === 0) return null;

    return tamanho.largura / tamanho.altura;
  } catch {
    return null;
  }
}

function dimensoesPng(b: Uint8Array) {
  // Assinatura PNG seguida do chunk IHDR, que traz largura e altura.
  if (b.length < 24 || b[0] !== 0x89 || b[1] !== 0x50) return null;
  const vista = new DataView(b.buffer, b.byteOffset);
  return { largura: vista.getUint32(16), altura: vista.getUint32(20) };
}

function dimensoesJpeg(b: Uint8Array) {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  const vista = new DataView(b.buffer, b.byteOffset);

  let i = 2;
  while (i + 9 < b.length) {
    if (b[i] !== 0xff) {
      i++;
      continue;
    }
    const marcador = b[i + 1];
    // SOF0–SOF3 e SOF5–SOF15 carregam as dimensões; pulamos os demais.
    const ehSof =
      marcador >= 0xc0 && marcador <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marcador);
    if (ehSof) {
      return { altura: vista.getUint16(i + 5), largura: vista.getUint16(i + 7) };
    }
    i += 2 + vista.getUint16(i + 2);
  }
  return null;
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

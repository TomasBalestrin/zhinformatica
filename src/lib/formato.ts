import type { Produto } from "./tipos";

export function formatarPreco(preco: number | null): string {
  if (preco === null || preco === undefined) return "Consulte o valor";
  return preco.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

/** Monta o link do WhatsApp já com a mensagem pronta sobre o produto. */
export function linkWhatsApp(numero: string, mensagem: string): string {
  const limpo = (numero || "").replace(/\D/g, "");
  return `https://wa.me/${limpo}?text=${encodeURIComponent(mensagem)}`;
}

export function mensagemProduto(produto: Pick<Produto, "nome" | "preco">): string {
  const base = `Olá! Tenho interesse no produto *${produto.nome}*`;
  return produto.preco
    ? `${base} (${formatarPreco(produto.preco)}). Pode me passar mais informações?`
    : `${base}. Pode me passar o valor e mais informações?`;
}

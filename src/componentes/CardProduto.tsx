import Image from "next/image";
import { ImageOff, MessageCircle } from "lucide-react";
import { formatarPreco, linkWhatsApp, mensagemProduto } from "@/lib/formato";
import type { Produto } from "@/lib/tipos";

export function CardProduto({
  produto,
  whatsapp,
}: {
  produto: Produto;
  whatsapp: string;
}) {
  const zap = linkWhatsApp(whatsapp, mensagemProduto(produto));

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-zh-azul-100/80 bg-white shadow-sm transition hover:-translate-y-1 hover:border-zh-azul-200 hover:shadow-lg">
      <div className="relative aspect-square overflow-hidden bg-zh-azul-50/60">
        {produto.imagem_url ? (
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-contain p-4 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zh-azul-200">
            <ImageOff className="size-10" />
          </div>
        )}

        {produto.destaque && (
          <span className="absolute left-3 top-3 rounded-full bg-zh-laranja-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            Destaque
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-zh-azul-950">
          {produto.nome}
        </h3>

        {produto.descricao && (
          <p className="line-clamp-2 text-xs leading-relaxed text-zh-azul-900/55">
            {produto.descricao}
          </p>
        )}

        <p
          className={`mt-auto pt-2 font-extrabold ${
            produto.preco
              ? "text-lg text-zh-azul-700"
              : "text-sm text-zh-azul-900/60"
          }`}
        >
          {formatarPreco(produto.preco)}
        </p>

        <a
          href={zap}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-zap px-3 py-2.5 text-[13px] font-bold text-white transition hover:bg-zap-escuro"
        >
          <MessageCircle className="size-4" />
          Comprar no WhatsApp
        </a>
      </div>
    </article>
  );
}

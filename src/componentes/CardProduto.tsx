import Image from "next/image";
import { ImageOff } from "lucide-react";
import { formatarPreco, linkWhatsApp, mensagemProduto } from "@/lib/formato";
import type { Produto } from "@/lib/tipos";

/**
 * Card de catálogo: imagem grande em quadrado branco, nome discreto e o preço
 * como único ponto forte de cor. O card inteiro é o link para o WhatsApp.
 */
export function CardProduto({
  produto,
  whatsapp,
}: {
  produto: Produto;
  whatsapp: string;
}) {
  const zap = linkWhatsApp(whatsapp, mensagemProduto(produto));

  return (
    <a
      href={zap}
      target="_blank"
      rel="noopener noreferrer"
      className="card-produto group flex flex-col px-4 py-6 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-zh-azul-600"
    >
      <div className="relative mx-auto aspect-square w-full max-w-[220px]">
        {produto.imagem_url ? (
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 220px"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-200">
            <ImageOff className="size-10" />
          </div>
        )}

        {produto.destaque && (
          <span className="absolute left-0 top-0 bg-zh-laranja-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            Destaque
          </span>
        )}
      </div>

      <h3 className="mt-5 text-[15px] leading-snug text-zinc-900 group-hover:text-zh-laranja-500">
        {produto.nome}
      </h3>

      {produto.descricao && (
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-zinc-500">
          {produto.descricao}
        </p>
      )}

      <p
        className={`mt-auto pt-3 ${
          produto.preco
            ? "text-[17px] font-medium text-zh-laranja-500"
            : "text-[13px] text-zinc-500"
        }`}
      >
        {formatarPreco(produto.preco)}
      </p>
    </a>
  );
}

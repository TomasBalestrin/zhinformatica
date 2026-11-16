"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { criarClienteNavegador } from "@/lib/supabase-browser";

/**
 * Envia a imagem para o bucket público "midia" do Supabase Storage
 * e devolve a URL pública pelo callback `aoMudar`.
 */
export function UploadImagem({
  valor,
  aoMudar,
  pasta = "produtos",
  proporcao = "aspect-square",
}: {
  valor: string | null;
  aoMudar: (url: string | null) => void;
  pasta?: string;
  proporcao?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviar(arquivo: File) {
    setErro(null);

    if (!arquivo.type.startsWith("image/")) {
      setErro("Selecione um arquivo de imagem.");
      return;
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 5 MB.");
      return;
    }

    setEnviando(true);
    const supabase = criarClienteNavegador();
    const extensao = arquivo.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const caminho = `${pasta}/${crypto.randomUUID()}.${extensao}`;

    const { error } = await supabase.storage
      .from("midia")
      .upload(caminho, arquivo, { cacheControl: "31536000", upsert: false });

    if (error) {
      setErro("Falha no envio. Verifique sua conexão e tente de novo.");
      setEnviando(false);
      return;
    }

    const { data } = supabase.storage.from("midia").getPublicUrl(caminho);
    aoMudar(data.publicUrl);
    setEnviando(false);
  }

  return (
    <div className="grid gap-2">
      <div
        className={`relative ${proporcao} w-full overflow-hidden rounded-2xl border-2 border-dashed border-zh-azul-200 bg-zh-azul-50/50`}
      >
        {valor ? (
          <>
            <Image
              src={valor}
              alt="Pré-visualização"
              fill
              sizes="400px"
              className="object-contain p-2"
            />
            <button
              type="button"
              onClick={() => aoMudar(null)}
              className="absolute right-2 top-2 grid size-8 place-items-center rounded-lg bg-white/90 text-red-600 shadow transition hover:bg-white"
              aria-label="Remover imagem"
            >
              <Trash2 className="size-4" />
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={enviando}
            className="flex h-full w-full flex-col items-center justify-center gap-2 text-zh-azul-500 transition hover:bg-zh-azul-50"
          >
            {enviando ? (
              <Loader2 className="size-7 animate-spin" />
            ) : (
              <ImagePlus className="size-7" />
            )}
            <span className="text-xs font-semibold">
              {enviando ? "Enviando…" : "Clique para enviar imagem"}
            </span>
            <span className="text-[10px] text-zh-azul-400">
              JPG, PNG ou WEBP até 5 MB
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const arquivo = e.target.files?.[0];
          if (arquivo) enviar(arquivo);
          e.target.value = "";
        }}
      />

      {erro && <p className="text-xs font-semibold text-red-600">{erro}</p>}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { UploadImagem } from "./UploadImagem";
import { Campo, Entrada, Interruptor } from "./CamposAdmin";
import { obterClienteNavegador } from "@/lib/supabase-browser";
import type { Banner } from "@/lib/tipos";

export function GerenciadorBanners({ banners }: { banners: Banner[] }) {
  const router = useRouter();
  const [editando, setEditando] = useState<Banner | "novo" | null>(null);

  async function apagar(banner: Banner) {
    if (!confirm("Excluir este banner?")) return;
    const supabase = await obterClienteNavegador();
    await supabase.from("banners").delete().eq("id", banner.id);
    router.refresh();
  }

  async function alternarAtivo(banner: Banner) {
    const supabase = await obterClienteNavegador();
    await supabase
      .from("banners")
      .update({ ativo: !banner.ativo })
      .eq("id", banner.id);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zh-azul-950">
            Banners
          </h1>
          <p className="mt-1 text-sm text-zh-azul-900/55">
            Imagens do carrossel na página inicial. Tamanho recomendado:
            1600×600 px.
          </p>
        </div>
        <button
          onClick={() => setEditando("novo")}
          className="flex items-center gap-2 rounded-xl bg-zh-azul-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zh-azul-700"
        >
          <Plus className="size-4" /> Novo banner
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        {banners.map((b) => (
          <div
            key={b.id}
            className="overflow-hidden rounded-2xl border border-zh-azul-100 bg-white"
          >
            <div className="relative aspect-[21/8] bg-zh-azul-50">
              <Image
                src={b.imagem_url}
                alt={b.titulo ?? "Banner"}
                fill
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-zh-azul-950">
                  {b.titulo || "Sem título"}
                </p>
                <p className="truncate text-xs text-zh-azul-900/55">
                  {b.subtitulo || "—"} · ordem {b.ordem}
                </p>
              </div>
              <button
                onClick={() => alternarAtivo(b)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide transition ${
                  b.ativo
                    ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                    : "bg-zh-azul-100 text-zh-azul-600 hover:bg-zh-azul-200"
                }`}
              >
                {b.ativo ? "Ativo" : "Oculto"}
              </button>
              <button
                onClick={() => setEditando(b)}
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-zh-azul-600 transition hover:bg-zh-azul-50"
              >
                Editar
              </button>
              <button
                onClick={() => apagar(b)}
                className="grid size-9 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
                aria-label="Excluir banner"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zh-azul-200 bg-white p-12 text-center text-sm text-zh-azul-900/55">
            Nenhum banner cadastrado. Sem banners, a página inicial mostra um
            destaque padrão.
          </div>
        )}
      </div>

      {editando && (
        <ModalBanner
          banner={editando === "novo" ? undefined : editando}
          aoFechar={() => setEditando(null)}
        />
      )}
    </div>
  );
}

function ModalBanner({
  banner,
  aoFechar,
}: {
  banner?: Banner;
  aoFechar: () => void;
}) {
  const router = useRouter();
  const [titulo, setTitulo] = useState(banner?.titulo ?? "");
  const [subtitulo, setSubtitulo] = useState(banner?.subtitulo ?? "");
  const [imagem, setImagem] = useState<string | null>(banner?.imagem_url ?? null);
  const [link, setLink] = useState(banner?.link ?? "");
  const [ativo, setAtivo] = useState(banner?.ativo ?? true);
  const [ordem, setOrdem] = useState(String(banner?.ordem ?? 0));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    if (!imagem) {
      setErro("Envie uma imagem para o banner.");
      return;
    }

    setSalvando(true);
    setErro(null);

    const registro = {
      titulo: titulo.trim() || null,
      subtitulo: subtitulo.trim() || null,
      imagem_url: imagem,
      link: link.trim() || null,
      ativo,
      ordem: Number(ordem) || 0,
    };

    const supabase = await obterClienteNavegador();
    const { error } = banner
      ? await supabase.from("banners").update(registro).eq("id", banner.id)
      : await supabase.from("banners").insert(registro);

    setSalvando(false);

    if (error) {
      setErro("Não foi possível salvar o banner.");
      return;
    }

    aoFechar();
    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-zh-azul-950/60 p-4">
      <form
        onSubmit={salvar}
        className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-zh-azul-950">
            {banner ? "Editar banner" : "Novo banner"}
          </h2>
          <button
            type="button"
            onClick={aoFechar}
            className="grid size-9 place-items-center rounded-lg text-zh-azul-500 hover:bg-zh-azul-50"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zh-azul-400">
              Imagem do banner
            </p>
            <UploadImagem
              valor={imagem}
              aoMudar={setImagem}
              pasta="banners"
              proporcao="aspect-[21/8]"
            />
          </div>

          <Campo rotulo="Título" dica="Opcional — aparece sobre a imagem.">
            <Entrada
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Linha gamer completa"
            />
          </Campo>

          <Campo rotulo="Subtítulo">
            <Entrada
              value={subtitulo}
              onChange={(e) => setSubtitulo(e.target.value)}
              placeholder="PS5, headsets e cadeiras com preço especial"
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo rotulo="Link ao clicar" dica="Ex.: /produtos?categoria=gamer">
              <Entrada
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/produtos"
              />
            </Campo>
            <Campo rotulo="Ordem">
              <Entrada
                value={ordem}
                onChange={(e) => setOrdem(e.target.value)}
                inputMode="numeric"
              />
            </Campo>
          </div>

          <Interruptor rotulo="Ativo" marcado={ativo} aoMudar={setAtivo} />

          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="flex items-center justify-center gap-2 rounded-xl bg-zh-azul-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-zh-azul-700 disabled:opacity-60"
          >
            {salvando ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            Salvar banner
          </button>
        </div>
      </form>
    </div>
  );
}

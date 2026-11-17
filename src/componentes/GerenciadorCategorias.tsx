"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Entrada } from "./CamposAdmin";
import { obterClienteNavegador } from "@/lib/supabase-browser";
import type { Categoria } from "@/lib/tipos";

/** Transforma "PS5 & Gamer" em "ps5-gamer". */
function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function GerenciadorCategorias({
  categorias,
}: {
  categorias: Categoria[];
}) {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    const limpo = nome.trim();
    if (!limpo) return;

    setSalvando(true);
    setErro(null);

    const supabase = await obterClienteNavegador();
    const { error } = await supabase.from("categorias").insert({
      nome: limpo,
      slug: gerarSlug(limpo),
      ordem: categorias.length + 1,
    });

    setSalvando(false);

    if (error) {
      setErro("Já existe uma categoria com esse nome.");
      return;
    }

    setNome("");
    router.refresh();
  }

  async function apagar(categoria: Categoria) {
    if (
      !confirm(
        `Excluir "${categoria.nome}"? Os produtos dela ficarão sem categoria.`
      )
    )
      return;

    const supabase = await obterClienteNavegador();
    await supabase.from("categorias").delete().eq("id", categoria.id);
    router.refresh();
  }

  async function salvarOrdem(categoria: Categoria, valor: string) {
    const supabase = await obterClienteNavegador();
    await supabase
      .from("categorias")
      .update({ ordem: Number(valor) || 0 })
      .eq("id", categoria.id);
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-zh-azul-950">
        Categorias
      </h1>
      <p className="mt-1 text-sm text-zh-azul-900/55">
        Aparecem no menu do site e nos filtros de produtos.
      </p>

      <form onSubmit={adicionar} className="mt-5 flex gap-2">
        <Entrada
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Nome da nova categoria"
          className="flex-1"
        />
        <button
          type="submit"
          disabled={salvando}
          className="flex shrink-0 items-center gap-2 rounded-xl bg-zh-azul-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zh-azul-700 disabled:opacity-60"
        >
          {salvando ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Plus className="size-4" />
          )}
          Adicionar
        </button>
      </form>

      {erro && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
          {erro}
        </p>
      )}

      <div className="mt-5 grid gap-2">
        {categorias.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 rounded-2xl border border-zh-azul-100 bg-white p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-zh-azul-950">
                {c.nome}
              </p>
              <p className="truncate text-xs text-zh-azul-900/45">/{c.slug}</p>
            </div>

            <label className="flex items-center gap-2 text-xs text-zh-azul-900/55">
              Ordem
              <Entrada
                defaultValue={String(c.ordem)}
                onBlur={(e) => salvarOrdem(c, e.target.value)}
                inputMode="numeric"
                className="w-16 px-2 py-1.5 text-center"
              />
            </label>

            <button
              onClick={() => apagar(c)}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-red-600 transition hover:bg-red-50"
              aria-label={`Excluir ${c.nome}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

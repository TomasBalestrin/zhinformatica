"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ImageOff, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { obterClienteNavegador } from "@/lib/supabase-browser";
import { formatarPreco } from "@/lib/formato";
import type { Categoria, Produto } from "@/lib/tipos";

export function ListaProdutosAdmin({
  produtos,
  categorias,
}: {
  produtos: Produto[];
  categorias: Categoria[];
}) {
  const router = useRouter();
  const [busca, setBusca] = useState("");
  const [apagando, setApagando] = useState<string | null>(null);

  const nomeCategoria = useMemo(
    () => Object.fromEntries(categorias.map((c) => [c.id, c.nome])),
    [categorias]
  );

  const filtrados = produtos.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  async function apagar(produto: Produto) {
    if (!confirm(`Excluir "${produto.nome}"? Essa ação não pode ser desfeita.`))
      return;

    setApagando(produto.id);
    const supabase = await obterClienteNavegador();
    const { error } = await supabase
      .from("produtos")
      .delete()
      .eq("id", produto.id);
    setApagando(null);

    if (error) {
      alert("Não foi possível excluir. Tente novamente.");
      return;
    }
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zh-azul-950">
            Produtos
          </h1>
          <p className="mt-1 text-sm text-zh-azul-900/55">
            {produtos.length} cadastrados
          </p>
        </div>
        <Link
          href="/admin/produtos/novo"
          className="flex items-center gap-2 rounded-xl bg-zh-azul-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-zh-azul-700"
        >
          <Plus className="size-4" /> Novo produto
        </Link>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-zh-azul-100 bg-white px-4 py-2.5">
        <Search className="size-4 text-zh-azul-400" />
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar produto pelo nome…"
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      <div className="mt-4 grid gap-2">
        {filtrados.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-4 rounded-2xl border border-zh-azul-100 bg-white p-3"
          >
            <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-zh-azul-50">
              {p.imagem_url ? (
                <Image
                  src={p.imagem_url}
                  alt={p.nome}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              ) : (
                <div className="grid h-full place-items-center text-zh-azul-200">
                  <ImageOff className="size-5" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate text-sm font-bold text-zh-azul-950">
                {p.destaque && (
                  <Star className="size-3.5 shrink-0 fill-zh-laranja-500 text-zh-laranja-500" />
                )}
                {p.nome}
              </p>
              <p className="mt-0.5 truncate text-xs text-zh-azul-900/55">
                {p.categoria_id
                  ? (nomeCategoria[p.categoria_id] ?? "Sem categoria")
                  : "Sem categoria"}{" "}
                · {formatarPreco(p.preco)}
              </p>
              {!p.ativo && (
                <span className="mt-1 inline-block rounded-full bg-zh-azul-100 px-2 py-0.5 text-[10px] font-bold uppercase text-zh-azul-600">
                  Oculto no site
                </span>
              )}
            </div>

            <Link
              href={`/admin/produtos/${p.id}`}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-zh-azul-600 transition hover:bg-zh-azul-50"
              aria-label={`Editar ${p.nome}`}
            >
              <Pencil className="size-4" />
            </Link>
            <button
              onClick={() => apagar(p)}
              disabled={apagando === p.id}
              className="grid size-9 shrink-0 place-items-center rounded-lg text-red-600 transition hover:bg-red-50 disabled:opacity-40"
              aria-label={`Excluir ${p.nome}`}
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}

        {filtrados.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zh-azul-200 bg-white p-12 text-center text-sm text-zh-azul-900/55">
            {produtos.length === 0
              ? "Nenhum produto cadastrado ainda."
              : "Nenhum produto corresponde à busca."}
          </div>
        )}
      </div>
    </div>
  );
}

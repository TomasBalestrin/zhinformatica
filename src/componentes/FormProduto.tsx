"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { UploadImagem } from "./UploadImagem";
import {
  AreaTexto,
  Campo,
  Entrada,
  Interruptor,
  Selecao,
} from "./CamposAdmin";
import { obterClienteNavegador } from "@/lib/supabase-browser";
import type { Categoria, Produto } from "@/lib/tipos";

export function FormProduto({
  produto,
  categorias,
}: {
  produto?: Produto;
  categorias: Categoria[];
}) {
  const router = useRouter();
  const [nome, setNome] = useState(produto?.nome ?? "");
  const [descricao, setDescricao] = useState(produto?.descricao ?? "");
  const [preco, setPreco] = useState(
    produto?.preco != null ? String(produto.preco).replace(".", ",") : ""
  );
  const [imagem, setImagem] = useState<string | null>(produto?.imagem_url ?? null);
  const [categoriaId, setCategoriaId] = useState(produto?.categoria_id ?? "");
  const [destaque, setDestaque] = useState(produto?.destaque ?? false);
  const [ativo, setAtivo] = useState(produto?.ativo ?? true);
  const [ordem, setOrdem] = useState(String(produto?.ordem ?? 0));
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);

    const precoLimpo = preco.trim().replace(/\./g, "").replace(",", ".");
    const precoNumero = precoLimpo === "" ? null : Number(precoLimpo);

    if (precoNumero !== null && Number.isNaN(precoNumero)) {
      setErro("Preço inválido. Use apenas números, ex.: 1299,90");
      setSalvando(false);
      return;
    }

    const registro = {
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      preco: precoNumero,
      imagem_url: imagem,
      categoria_id: categoriaId || null,
      destaque,
      ativo,
      ordem: Number(ordem) || 0,
    };

    const supabase = await obterClienteNavegador();
    const { error } = produto
      ? await supabase.from("produtos").update(registro).eq("id", produto.id)
      : await supabase.from("produtos").insert(registro);

    setSalvando(false);

    if (error) {
      setErro("Não foi possível salvar. Verifique os dados e tente de novo.");
      return;
    }

    router.push("/admin/produtos");
    router.refresh();
  }

  return (
    <form onSubmit={salvar} className="mx-auto max-w-3xl">
      <Link
        href="/admin/produtos"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zh-azul-600 hover:text-zh-laranja-500"
      >
        <ArrowLeft className="size-4" /> Voltar para produtos
      </Link>

      <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-zh-azul-950">
        {produto ? "Editar produto" : "Novo produto"}
      </h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-zh-azul-400">
            Foto do produto
          </p>
          <UploadImagem valor={imagem} aoMudar={setImagem} pasta="produtos" />
        </div>

        <div className="grid content-start gap-4">
          <Campo rotulo="Nome do produto">
            <Entrada
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="iPhone 15 128GB Preto"
              required
            />
          </Campo>

          <Campo rotulo="Descrição" dica="Aparece abaixo do nome no card.">
            <AreaTexto
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={3}
              placeholder="Lacrado, 1 ano de garantia Apple."
            />
          </Campo>

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              rotulo="Preço (R$)"
              dica="Deixe vazio para exibir 'Consulte o valor'."
            >
              <Entrada
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                inputMode="decimal"
                placeholder="4299,90"
              />
            </Campo>

            <Campo rotulo="Categoria">
              <Selecao
                value={categoriaId}
                onChange={(e) => setCategoriaId(e.target.value)}
              >
                <option value="">Sem categoria</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </Selecao>
            </Campo>
          </div>

          <Campo
            rotulo="Ordem de exibição"
            dica="Menor número aparece primeiro na listagem."
          >
            <Entrada
              value={ordem}
              onChange={(e) => setOrdem(e.target.value)}
              inputMode="numeric"
            />
          </Campo>

          <div className="grid gap-3 rounded-2xl border border-zh-azul-100 bg-white p-4">
            <Interruptor
              rotulo="Visível no site"
              marcado={ativo}
              aoMudar={setAtivo}
            />
            <Interruptor
              rotulo="Mostrar em destaque na página inicial"
              marcado={destaque}
              aoMudar={setDestaque}
            />
          </div>

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
            {produto ? "Salvar alterações" : "Cadastrar produto"}
          </button>
        </div>
      </div>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { Logo } from "./Logo";
import { linkWhatsApp } from "@/lib/formato";
import type { Categoria } from "@/lib/tipos";

export function Cabecalho({
  categorias,
  whatsapp,
  logo = null,
}: {
  categorias: Categoria[];
  whatsapp: string;
  logo?: string | null;
}) {
  const [aberto, setAberto] = useState(false);
  const [buscaAberta, setBuscaAberta] = useState(false);
  const zap = linkWhatsApp(
    whatsapp,
    "Olá! Vim pelo site da ZH Informática e gostaria de atendimento."
  );

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* faixa de avisos */}
      <div className="bg-zinc-900 text-white">
        <div className="mx-auto flex max-w-[1226px] items-center justify-between gap-4 px-4 py-2 text-[11px] sm:text-xs">
          <p className="truncate">
            R. Sete de Setembro, 245 — Centro, Faxinal dos Guedes/SC
          </p>
          <p className="hidden shrink-0 sm:block">
            Seg–Sex 8h30–18h30 · Sáb 8h30–12h
          </p>
        </div>
      </div>

      <div className="border-b border-zinc-100">
        <div className="mx-auto flex h-[68px] max-w-[1226px] items-center gap-8 px-4">
          <Link href="/" aria-label="ZH Informática — início" className="shrink-0">
            <Logo src={logo} />
          </Link>

          {/* categorias no topo, como numa loja */}
          <nav className="hidden flex-1 items-center gap-7 lg:flex">
            {categorias.slice(0, 6).map((c) => (
              <Link
                key={c.id}
                href={`/produtos?categoria=${c.slug}`}
                className="whitespace-nowrap text-[14px] text-zinc-600 transition hover:text-zh-laranja-500"
              >
                {c.nome}
              </Link>
            ))}
            <Link
              href="/produtos"
              className="whitespace-nowrap text-[14px] text-zinc-600 transition hover:text-zh-laranja-500"
            >
              Ver tudo
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-5">
            <button
              onClick={() => setBuscaAberta((v) => !v)}
              aria-label="Buscar produtos"
              aria-expanded={buscaAberta}
              className="hidden text-zinc-600 transition hover:text-zh-laranja-500 lg:block"
            >
              <Search className="size-[18px]" />
            </button>

            <a
              href={zap}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden whitespace-nowrap bg-zh-laranja-500 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-zh-laranja-600 sm:block"
            >
              Falar no WhatsApp
            </a>

            <button
              onClick={() => setAberto((v) => !v)}
              className="text-zinc-700 lg:hidden"
              aria-label="Abrir menu"
              aria-expanded={aberto}
            >
              {aberto ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* busca que desce do topo */}
        {buscaAberta && (
          <div className="border-t border-zinc-100 bg-white">
            <form
              action="/produtos"
              className="mx-auto flex max-w-[1226px] items-center gap-3 px-4 py-4"
            >
              <Search className="size-5 shrink-0 text-zinc-400" />
              <input
                name="busca"
                autoFocus
                placeholder="Buscar iPhone, notebook, PS5…"
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="shrink-0 bg-zh-laranja-500 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-zh-laranja-600"
              >
                Buscar
              </button>
            </form>
          </div>
        )}
      </div>

      {/* menu no celular */}
      {aberto && (
        <div className="border-b border-zinc-100 bg-white px-4 py-5 lg:hidden">
          <form
            action="/produtos"
            className="mb-5 flex items-center gap-2 border border-zinc-200 px-4 py-2.5"
          >
            <Search className="size-4 text-zinc-400" />
            <input
              name="busca"
              placeholder="Buscar produto…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>

          <div className="grid gap-0.5">
            {categorias.map((c) => (
              <Link
                key={c.id}
                href={`/produtos?categoria=${c.slug}`}
                onClick={() => setAberto(false)}
                className="border-b border-zinc-100 py-3 text-[15px] text-zinc-700"
              >
                {c.nome}
              </Link>
            ))}
            <Link
              href="/assistencia"
              onClick={() => setAberto(false)}
              className="border-b border-zinc-100 py-3 text-[15px] text-zinc-700"
            >
              Assistência técnica
            </Link>
            <Link
              href="/contato"
              onClick={() => setAberto(false)}
              className="border-b border-zinc-100 py-3 text-[15px] text-zinc-700"
            >
              Contato
            </Link>
          </div>

          <a
            href={zap}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 block bg-zh-laranja-500 px-4 py-3 text-center text-sm font-medium text-white"
          >
            Falar no WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}

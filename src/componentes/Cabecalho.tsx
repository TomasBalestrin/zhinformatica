"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Phone, Search, X } from "lucide-react";
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
  const zap = linkWhatsApp(
    whatsapp,
    "Olá! Vim pelo site da ZH Informática e gostaria de atendimento."
  );

  return (
    <header className="sticky top-0 z-50 border-b border-zh-azul-100 bg-white/90 backdrop-blur-md">
      {/* faixa superior */}
      <div className="bg-zh-azul-700 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-1.5 text-[11.5px] sm:text-xs">
          <p className="truncate">
            R. Sete de Setembro, 245 — Centro, Faxinal dos Guedes/SC
          </p>
          <p className="hidden shrink-0 sm:block">
            Seg–Sex 8h30–18h30 · Sáb 8h30–12h
          </p>
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" aria-label="ZH Informática — início">
          <Logo src={logo} />
        </Link>

        {/* busca desktop */}
        <form
          action="/produtos"
          className="ml-auto hidden max-w-md flex-1 items-center gap-2 rounded-full border border-zh-azul-100 bg-zh-azul-50/60 px-4 py-2 focus-within:border-zh-azul-400 lg:flex"
        >
          <Search className="size-4 shrink-0 text-zh-azul-600" />
          <input
            name="busca"
            placeholder="Buscar iPhone, notebook, PS5…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-zh-azul-400"
          />
        </form>

        <nav className="ml-auto hidden items-center gap-6 text-sm font-semibold text-zh-azul-950 lg:ml-0 lg:flex">
          <Link href="/produtos" className="hover:text-zh-laranja-500">
            Produtos
          </Link>
          <Link href="/assistencia" className="hover:text-zh-laranja-500">
            Assistência
          </Link>
          <Link href="/contato" className="hover:text-zh-laranja-500">
            Contato
          </Link>
        </nav>

        <a
          href={zap}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-full bg-zap px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-zap-escuro sm:flex"
        >
          <Phone className="size-4" />
          WhatsApp
        </a>

        <button
          onClick={() => setAberto((v) => !v)}
          className="ml-auto rounded-lg p-2 text-zh-azul-900 lg:hidden"
          aria-label="Abrir menu"
          aria-expanded={aberto}
        >
          {aberto ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* categorias desktop */}
      <div className="hidden border-t border-zh-azul-50 bg-white lg:block">
        <div className="sem-barra mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4">
          {categorias.map((c) => (
            <Link
              key={c.id}
              href={`/produtos?categoria=${c.slug}`}
              className="whitespace-nowrap rounded-md px-3 py-2.5 text-[13px] font-medium text-zh-azul-900/80 transition hover:bg-zh-azul-50 hover:text-zh-azul-700"
            >
              {c.nome}
            </Link>
          ))}
        </div>
      </div>

      {/* menu mobile */}
      {aberto && (
        <div className="border-t border-zh-azul-100 bg-white px-4 py-4 lg:hidden">
          <form
            action="/produtos"
            className="mb-4 flex items-center gap-2 rounded-full border border-zh-azul-100 bg-zh-azul-50/60 px-4 py-2.5"
          >
            <Search className="size-4 text-zh-azul-600" />
            <input
              name="busca"
              placeholder="Buscar produto…"
              className="w-full bg-transparent text-sm outline-none"
            />
          </form>

          <div className="grid gap-1 text-sm font-semibold text-zh-azul-950">
            <Link href="/produtos" onClick={() => setAberto(false)} className="py-2">
              Todos os produtos
            </Link>
            <Link href="/assistencia" onClick={() => setAberto(false)} className="py-2">
              Assistência técnica
            </Link>
            <Link href="/contato" onClick={() => setAberto(false)} className="py-2">
              Contato
            </Link>
          </div>

          <p className="mt-4 mb-2 text-[11px] font-bold uppercase tracking-wider text-zh-azul-400">
            Categorias
          </p>
          <div className="grid grid-cols-2 gap-1">
            {categorias.map((c) => (
              <Link
                key={c.id}
                href={`/produtos?categoria=${c.slug}`}
                onClick={() => setAberto(false)}
                className="rounded-md bg-zh-azul-50/70 px-3 py-2 text-[13px] text-zh-azul-900"
              >
                {c.nome}
              </Link>
            ))}
          </div>

          <a
            href={zap}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-zap px-4 py-3 text-sm font-bold text-white"
          >
            <Phone className="size-4" /> Falar no WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}

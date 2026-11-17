"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase do navegador.
 *
 * As credenciais vêm de /api/config (lidas no servidor em tempo de execução)
 * e não das variáveis NEXT_PUBLIC_* embutidas no build. Isso mantém o painel
 * funcionando mesmo quando a plataforma de deploy expõe as variáveis apenas
 * ao servidor — caso em que o bundle sairia sem elas e o painel quebraria.
 *
 * Mantemos o fallback para as variáveis de build: quando elas existem, nem
 * chega a haver requisição.
 */
let clientePromise: Promise<SupabaseClient> | null = null;

async function buscarCredenciais(): Promise<{ url: string; chave: string }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const chave = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (url && chave) return { url, chave };

  const resposta = await fetch("/api/config", { cache: "no-store" });
  if (!resposta.ok) {
    throw new Error(
      "[ZH Informática] Não foi possível carregar a configuração do Supabase. " +
        "Confira as variáveis de ambiente do projeto."
    );
  }

  const dados = (await resposta.json()) as { url?: string; chave?: string };
  if (!dados.url || !dados.chave) {
    throw new Error(
      "[ZH Informática] Configuração do Supabase incompleta no servidor."
    );
  }

  return { url: dados.url, chave: dados.chave };
}

/** Use em código assíncrono (login, formulários, uploads). */
export async function obterClienteNavegador(): Promise<SupabaseClient> {
  if (!clientePromise) {
    clientePromise = buscarCredenciais().then(({ url, chave }) =>
      createBrowserClient(url, chave)
    );
    // Uma falha não deve envenenar as tentativas seguintes.
    clientePromise.catch(() => {
      clientePromise = null;
    });
  }
  return clientePromise;
}

import { NextResponse } from "next/server";
import { chaveSupabase, urlSupabase } from "@/lib/ambiente";

export const dynamic = "force-dynamic";

/**
 * Entrega as credenciais públicas do Supabase ao navegador em tempo de execução.
 *
 * Variáveis NEXT_PUBLIC_* são embutidas durante o build. Quando a plataforma
 * de deploy não as expõe ao build (apenas ao servidor), o código do cliente
 * fica sem elas e o painel não carrega. Lendo por aqui, o navegador sempre
 * recebe o valor que o servidor tem agora.
 *
 * São as mesmas credenciais públicas que já iriam para o bundle: a proteção
 * real do banco é o RLS, não o sigilo da chave anon.
 */
export async function GET() {
  try {
    return NextResponse.json(
      { url: urlSupabase(), chave: chaveSupabase() },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (erro) {
    return NextResponse.json(
      { erro: erro instanceof Error ? erro.message : "Configuração ausente." },
      { status: 500 }
    );
  }
}

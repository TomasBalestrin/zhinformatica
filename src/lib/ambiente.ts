/**
 * Lê e valida as variáveis do Supabase.
 *
 * Sem elas o site inteiro responde erro 500, e a mensagem original
 * ("Your project's URL and Key are required...") não diz onde configurar.
 * Aqui trocamos por uma instrução acionável.
 */
function exigir(nome: string): string {
  const valor = process.env[nome]?.trim();

  if (!valor) {
    throw new Error(
      `[ZH Informática] A variável de ambiente ${nome} não está definida.\n\n` +
        `• Na Vercel: Settings → Environment Variables → adicione ${nome} ` +
        `e depois faça Deployments → ... → Redeploy (adicionar a variável ` +
        `sozinho não republica o site).\n` +
        `• Localmente: preencha o arquivo .env.local e reinicie o servidor.\n\n` +
        `Os valores estão no painel do Supabase, em Project Settings → API.`
    );
  }

  return valor;
}

export function urlSupabase(): string {
  return exigir("NEXT_PUBLIC_SUPABASE_URL");
}

export function chaveSupabase(): string {
  return exigir("NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

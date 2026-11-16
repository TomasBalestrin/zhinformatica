import type { NextConfig } from "next";

/**
 * Libera as imagens do Supabase Storage para o <Image> do Next.
 * Lido na inicialização: ao trocar NEXT_PUBLIC_SUPABASE_URL, reinicie o servidor.
 */
function hostDoSupabase(): string | undefined {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return undefined;
  try {
    return new URL(url).hostname;
  } catch {
    // URL inválida no .env — não derruba o build por causa disso.
    console.warn(
      `[zh] NEXT_PUBLIC_SUPABASE_URL inválida: "${url}". ` +
        "As imagens enviadas no painel não vão carregar até corrigir."
    );
    return undefined;
  }
}

const host = hostDoSupabase();

const nextConfig: NextConfig = {
  images: {
    remotePatterns: host
      ? [
          {
            protocol: "https",
            hostname: host,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
};

export default nextConfig;

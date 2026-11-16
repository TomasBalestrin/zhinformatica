"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { Logo } from "@/componentes/Logo";
import { criarClienteNavegador } from "@/lib/supabase-browser";

export default function PaginaLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [logo, setLogo] = useState<string | null>(null);

  // A logo é um dado público — buscamos direto para a tela não ficar genérica.
  useEffect(() => {
    criarClienteNavegador()
      .from("configuracoes")
      .select("valor")
      .eq("chave", "logo")
      .maybeSingle()
      .then(({ data }) => setLogo(data?.valor || null));
  }, []);

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);

    const supabase = criarClienteNavegador();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro("E-mail ou senha inválidos.");
      setCarregando(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="grid min-h-screen place-items-center bg-zh-azul-950 px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl">
        <div className="flex justify-center">
          <Logo tamanho={56} mostrarTexto={false} src={logo} />
        </div>

        <h1 className="mt-5 text-center text-lg font-extrabold text-zh-azul-950">
          Área administrativa
        </h1>
        <p className="mt-1 text-center text-xs text-zh-azul-900/55">
          Entre para gerenciar produtos e banners.
        </p>

        <form onSubmit={entrar} className="mt-7 grid gap-4">
          <Campo
            rotulo="E-mail"
            tipo="email"
            valor={email}
            aoMudar={setEmail}
            placeholder="voce@zhinformatica.com"
          />
          <Campo
            rotulo="Senha"
            tipo="password"
            valor={senha}
            aoMudar={setSenha}
            placeholder="••••••••"
          />

          {erro && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
              {erro}
            </p>
          )}

          <button
            type="submit"
            disabled={carregando}
            className="flex items-center justify-center gap-2 rounded-xl bg-zh-azul-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-zh-azul-700 disabled:opacity-60"
          >
            {carregando ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LockKeyhole className="size-4" />
            )}
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}

function Campo({
  rotulo,
  tipo,
  valor,
  aoMudar,
  placeholder,
}: {
  rotulo: string;
  tipo: string;
  valor: string;
  aoMudar: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wider text-zh-azul-400">
        {rotulo}
      </span>
      <input
        type={tipo}
        value={valor}
        onChange={(e) => aoMudar(e.target.value)}
        placeholder={placeholder}
        required
        className="rounded-xl border border-zh-azul-100 bg-zh-azul-50/40 px-4 py-3 text-sm outline-none transition focus:border-zh-azul-400 focus:bg-white"
      />
    </label>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Check, Loader2, Save } from "lucide-react";
import { AreaTexto, Campo, Entrada } from "./CamposAdmin";
import { UploadImagem } from "./UploadImagem";
import { criarClienteNavegador } from "@/lib/supabase-browser";
import type { Config } from "@/lib/tipos";

export function FormConfiguracoes({ config }: { config: Config }) {
  const router = useRouter();
  const [valores, setValores] = useState<Config>({
    whatsapp: config.whatsapp ?? "",
    endereco: config.endereco ?? "",
    horario: config.horario ?? "",
    instagram: config.instagram ?? "",
    email: config.email ?? "",
    logo: config.logo ?? "",
  });
  const [salvando, setSalvando] = useState(false);
  const [salvo, setSalvo] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function mudar(chave: string, valor: string) {
    setValores((v) => ({ ...v, [chave]: valor }));
    setSalvo(false);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);
    setErro(null);

    const supabase = criarClienteNavegador();
    const linhas = Object.entries(valores).map(([chave, valor]) => ({
      chave,
      valor,
    }));

    const { error } = await supabase
      .from("configuracoes")
      .upsert(linhas, { onConflict: "chave" });

    setSalvando(false);

    if (error) {
      setErro("Não foi possível salvar as configurações.");
      return;
    }

    setSalvo(true);
    router.refresh();
  }

  return (
    <form onSubmit={salvar} className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-zh-azul-950">
        Configurações da loja
      </h1>
      <p className="mt-1 text-sm text-zh-azul-900/55">
        Esses dados aparecem no rodapé, no mapa e nos botões de WhatsApp.
      </p>

      <div className="mt-6 grid gap-4 rounded-2xl border border-zh-azul-100 bg-white p-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-zh-azul-400">
            Logo da loja
          </p>
          <p className="mb-2 mt-1 text-[11px] text-zh-azul-900/45">
            Aparece no topo do site, no rodapé e no painel. Use PNG com fundo
            transparente, quadrado (ex.: 512×512 px). Sem logo enviada, o site
            usa o símbolo padrão.
          </p>
          <div className="max-w-[180px]">
            <UploadImagem
              valor={valores.logo || null}
              aoMudar={(url) => mudar("logo", url ?? "")}
              pasta="logo"
            />
          </div>
        </div>

        <Campo
          rotulo="WhatsApp"
          dica="Com código do país e DDD, só números. Ex.: 554934360215"
        >
          <Entrada
            value={valores.whatsapp}
            onChange={(e) => mudar("whatsapp", e.target.value)}
            inputMode="numeric"
            required
          />
        </Campo>

        <Campo rotulo="Endereço" dica="Usado também no mapa do Google.">
          <AreaTexto
            value={valores.endereco}
            onChange={(e) => mudar("endereco", e.target.value)}
            rows={2}
            required
          />
        </Campo>

        <Campo rotulo="Horário de atendimento">
          <Entrada
            value={valores.horario}
            onChange={(e) => mudar("horario", e.target.value)}
            placeholder="Seg a Sex: 8h30 às 18h30 | Sáb: 8h30 às 12h"
          />
        </Campo>

        <Campo rotulo="Instagram" dica="URL completa do perfil.">
          <Entrada
            value={valores.instagram}
            onChange={(e) => mudar("instagram", e.target.value)}
            placeholder="https://instagram.com/zhinformatica"
          />
        </Campo>

        <Campo rotulo="E-mail" dica="Opcional.">
          <Entrada
            type="email"
            value={valores.email}
            onChange={(e) => mudar("email", e.target.value)}
            placeholder="contato@zhinformatica.com"
          />
        </Campo>

        {erro && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={salvando}
          className={`flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition disabled:opacity-60 ${
            salvo ? "bg-emerald-600" : "bg-zh-azul-600 hover:bg-zh-azul-700"
          }`}
        >
          {salvando ? (
            <Loader2 className="size-4 animate-spin" />
          ) : salvo ? (
            <Check className="size-4" />
          ) : (
            <Save className="size-4" />
          )}
          {salvo ? "Salvo!" : "Salvar configurações"}
        </button>
      </div>
    </form>
  );
}

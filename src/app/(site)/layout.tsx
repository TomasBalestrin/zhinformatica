import { Cabecalho } from "@/componentes/Cabecalho";
import { Rodape } from "@/componentes/Rodape";
import { BotaoZap } from "@/componentes/BotaoZap";
import { buscarCategorias, buscarConfig } from "@/lib/dados";

export default async function LayoutSite({
  children,
}: {
  children: React.ReactNode;
}) {
  const [categorias, config] = await Promise.all([
    buscarCategorias(),
    buscarConfig(),
  ]);

  return (
    <>
      <Cabecalho
        categorias={categorias}
        whatsapp={config.whatsapp}
        logo={config.logo || null}
      />
      <main className="min-h-[60vh]">{children}</main>
      <Rodape categorias={categorias} config={config} />
      <BotaoZap whatsapp={config.whatsapp} />
    </>
  );
}

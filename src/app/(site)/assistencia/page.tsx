import {
  BatteryCharging,
  Cpu,
  HardDrive,
  Printer,
  ShieldCheck,
  Smartphone,
  Wifi,
  Wrench,
} from "lucide-react";
import { buscarConfig } from "@/lib/dados";
import { linkWhatsApp } from "@/lib/formato";

export const revalidate = 300;
export const metadata = { title: "Assistência técnica" };

const SERVICOS = [
  {
    icone: Smartphone,
    titulo: "Troca de tela",
    texto: "iPhone, Xiaomi, Samsung e Motorola, com peças de qualidade.",
  },
  {
    icone: BatteryCharging,
    titulo: "Troca de bateria",
    texto: "Celulares e notebooks com bateria viciada ou inchada.",
  },
  {
    icone: Cpu,
    titulo: "Formatação e limpeza",
    texto: "Reinstalação do sistema, remoção de vírus e limpeza interna.",
  },
  {
    icone: HardDrive,
    titulo: "Upgrade de SSD e memória",
    texto: "Seu notebook fica muito mais rápido com SSD e mais RAM.",
  },
  {
    icone: Printer,
    titulo: "Manutenção de impressoras",
    texto: "Limpeza de cabeçote, reparo e abastecimento de tanque.",
  },
  {
    icone: Wifi,
    titulo: "Redes e internet",
    texto: "Instalação de Starlink, roteadores e configuração de rede.",
  },
  {
    icone: ShieldCheck,
    titulo: "Recuperação de dados",
    texto: "Resgate de arquivos de HDs, SSDs e cartões de memória.",
  },
  {
    icone: Wrench,
    titulo: "Montagem de PCs",
    texto: "Montamos seu setup gamer ou de trabalho sob medida.",
  },
];

export default async function PaginaAssistencia() {
  const config = await buscarConfig();
  const zap = linkWhatsApp(
    config.whatsapp,
    "Olá! Gostaria de um orçamento de assistência técnica."
  );

  return (
    <>
      <section className="bg-zh-azul-800">
        <div className="mx-auto max-w-[1226px] px-4 py-20 text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.12em] text-zh-laranja-400">
            Assistência técnica
          </p>
          <h1 className="mx-auto mt-4 max-w-2xl text-[32px] font-medium leading-tight text-white sm:text-[42px]">
            Conserto rápido, honesto e com garantia.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-white/70">
            Celulares, notebooks, computadores, impressoras e consoles. O
            diagnóstico é gratuito e o orçamento sai antes do conserto — você só
            aprova se concordar com o valor.
          </p>
          <a
            href={zap}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-block bg-zh-laranja-500 px-7 py-3 text-[14px] font-medium text-white transition hover:bg-zh-laranja-600"
          >
            Pedir orçamento
          </a>
        </div>
      </section>

      <section className="faixa-cinza">
        <div className="mx-auto max-w-[1226px] px-4 py-10">
          <h2 className="mb-5 text-[22px] font-medium text-zinc-900">
            O que fazemos
          </h2>
          <div className="grid grid-cols-2 gap-px bg-zinc-100 lg:grid-cols-4">
            {SERVICOS.map((s) => (
              <div key={s.titulo} className="bg-white px-6 py-9">
                <s.icone className="size-7 text-zh-laranja-500" />
                <h3 className="mt-5 text-[15px] font-medium text-zinc-900">
                  {s.titulo}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-500">
                  {s.texto}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1226px] px-4 py-16 text-center">
        <h2 className="text-[24px] font-medium text-zinc-900">
          Não achou o serviço que precisa?
        </h2>
        <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-zinc-600">
          Descreva o problema no WhatsApp. Um técnico responde no horário
          comercial.
        </p>
        <a
          href={zap}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-block bg-zh-laranja-500 px-7 py-3 text-[14px] font-medium text-white transition hover:bg-zh-laranja-600"
        >
          Falar com um técnico
        </a>
      </section>
    </>
  );
}

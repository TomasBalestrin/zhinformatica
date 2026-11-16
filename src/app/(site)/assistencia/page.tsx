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
    texto: "iPhone, Xiaomi, Samsung e Motorola com peças de qualidade.",
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
    texto: "Deixe seu notebook muito mais rápido com SSD e mais RAM.",
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
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-zh-azul-700 to-zh-azul-950 p-8 sm:p-14">
        <span className="inline-flex items-center gap-2 rounded-full bg-zh-laranja-500/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-zh-laranja-300">
          <Wrench className="size-3.5" /> Assistência técnica
        </span>
        <h1 className="mt-4 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
          Conserto rápido, honesto e com garantia.
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/75">
          Trabalhamos com celulares, notebooks, computadores, impressoras e
          consoles. Diagnóstico e orçamento sem compromisso — você só aprova se
          concordar com o valor.
        </p>
        <a
          href={zap}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-block rounded-full bg-zap px-6 py-3 text-sm font-bold text-white transition hover:bg-zap-escuro"
        >
          Pedir orçamento no WhatsApp
        </a>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICOS.map((s) => (
          <div
            key={s.titulo}
            className="rounded-2xl border border-zh-azul-100 bg-white p-5 transition hover:-translate-y-1 hover:shadow-md"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-zh-azul-50 text-zh-azul-600">
              <s.icone className="size-5" />
            </span>
            <h2 className="mt-4 text-sm font-bold text-zh-azul-950">
              {s.titulo}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-zh-azul-900/60">
              {s.texto}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-zh-azul-100 bg-white p-8 text-center">
        <h2 className="text-xl font-extrabold text-zh-azul-950">
          Não achou o serviço que precisa?
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-zh-azul-900/60">
          Chame no WhatsApp e descreva o problema. Respondemos rápido no horário
          comercial.
        </p>
        <a
          href={zap}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block rounded-full bg-zap px-6 py-3 text-sm font-bold text-white transition hover:bg-zap-escuro"
        >
          Falar com um técnico
        </a>
      </div>
    </div>
  );
}

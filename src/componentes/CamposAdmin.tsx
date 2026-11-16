"use client";

export function Campo({
  rotulo,
  dica,
  children,
}: {
  rotulo: string;
  dica?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wider text-zh-azul-400">
        {rotulo}
      </span>
      {children}
      {dica && <span className="text-[11px] text-zh-azul-900/45">{dica}</span>}
    </label>
  );
}

const BASE =
  "rounded-xl border border-zh-azul-100 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-zh-azul-400";

export function Entrada(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${BASE} ${props.className ?? ""}`} />;
}

export function AreaTexto(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`${BASE} resize-y ${props.className ?? ""}`}
    />
  );
}

export function Selecao(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${BASE} ${props.className ?? ""}`} />;
}

export function Interruptor({
  rotulo,
  marcado,
  aoMudar,
}: {
  rotulo: string;
  marcado: boolean;
  aoMudar: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={marcado}
      onClick={() => aoMudar(!marcado)}
      className="flex items-center gap-3"
    >
      <span
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          marcado ? "bg-zh-azul-600" : "bg-zh-azul-200"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
            marcado ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
      <span className="text-sm font-semibold text-zh-azul-950">{rotulo}</span>
    </button>
  );
}

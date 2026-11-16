import Image from "next/image";

/**
 * Marca ZH Informática.
 * Se uma logo foi enviada no painel (`src`), ela é usada; caso contrário,
 * desenhamos o símbolo padrão em SVG — círculo azul com "ZH" laranja.
 */
export function Logo({
  tamanho = 44,
  mostrarTexto = true,
  claro = false,
  src = null,
}: {
  tamanho?: number;
  mostrarTexto?: boolean;
  claro?: boolean;
  src?: string | null;
}) {
  return (
    <span className="flex items-center gap-2.5">
      {src ? (
        <Image
          src={src}
          alt="ZH Informática"
          width={tamanho}
          height={tamanho}
          className="shrink-0 rounded-full object-contain"
          style={{ width: tamanho, height: tamanho }}
          priority
        />
      ) : (
      <svg
        width={tamanho}
        height={tamanho}
        viewBox="0 0 100 100"
        aria-hidden="true"
        className="shrink-0"
      >
        <circle cx="50" cy="50" r="48" fill="#2338db" />
        {/* arcos técnicos */}
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="#ffffff"
          strokeWidth="2"
          strokeDasharray="30 12"
          opacity="0.75"
        />
        <circle cx="50" cy="50" r="37" fill="#2338db" />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          fontSize="30"
          fontWeight="800"
          fill="#f25c15"
          fontFamily="var(--font-sans), sans-serif"
        >
          ZH
        </text>
        <text
          x="50"
          y="68"
          textAnchor="middle"
          fontSize="10.5"
          fontWeight="600"
          fill="#f25c15"
          fontFamily="var(--font-sans), sans-serif"
        >
          informática
        </text>
      </svg>
      )}

      {mostrarTexto && (
        <span className="leading-tight">
          <span
            className={`block text-[17px] font-extrabold tracking-tight ${
              claro ? "text-white" : "text-zh-azul-950"
            }`}
          >
            ZH Informática
          </span>
          <span
            className={`block text-[11px] font-medium ${
              claro ? "text-white/70" : "text-zh-azul-600"
            }`}
          >
            Faxinal dos Guedes · SC
          </span>
        </span>
      )}
    </span>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Banner } from "@/lib/tipos";

export function Carrossel({ banners }: { banners: Banner[] }) {
  const [indice, setIndice] = useState(0);
  const total = banners.length;

  const ir = useCallback(
    (passo: number) => setIndice((i) => (i + passo + total) % total),
    [total]
  );

  useEffect(() => {
    if (total <= 1) return;
    const t = setInterval(() => ir(1), 6000);
    return () => clearInterval(t);
  }, [ir, total]);

  if (total === 0) return null;

  return (
    <section className="relative mx-auto max-w-7xl px-4 pt-6">
      <div className="relative aspect-[16/7] overflow-hidden rounded-3xl bg-zh-azul-900 sm:aspect-[21/8]">
        {banners.map((b, i) => {
          const conteudo = (
            <>
              <Image
                src={b.imagem_url}
                alt={b.titulo ?? "Banner ZH Informática"}
                fill
                priority={i === 0}
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-cover"
              />
              {(b.titulo || b.subtitulo) && (
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zh-azul-950/85 via-zh-azul-950/25 to-transparent p-5 sm:p-10">
                  {b.titulo && (
                    <h2 className="max-w-xl text-xl font-extrabold leading-tight text-white sm:text-4xl">
                      {b.titulo}
                    </h2>
                  )}
                  {b.subtitulo && (
                    <p className="mt-2 max-w-lg text-xs text-white/85 sm:text-base">
                      {b.subtitulo}
                    </p>
                  )}
                </div>
              )}
            </>
          );

          return (
            <div
              key={b.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === indice ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={i !== indice}
            >
              {b.link ? (
                <Link href={b.link} className="block h-full w-full">
                  {conteudo}
                </Link>
              ) : (
                conteudo
              )}
            </div>
          );
        })}

        {total > 1 && (
          <>
            <button
              onClick={() => ir(-1)}
              aria-label="Banner anterior"
              className="absolute left-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-zh-azul-900 shadow transition hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => ir(1)}
              aria-label="Próximo banner"
              className="absolute right-3 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-zh-azul-900 shadow transition hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
              {banners.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => setIndice(i)}
                  aria-label={`Ir para o banner ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === indice ? "w-6 bg-white" : "w-1.5 bg-white/55"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Images,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Tags,
} from "lucide-react";
import { Logo } from "./Logo";
import { obterClienteNavegador } from "@/lib/supabase-browser";

const ITENS = [
  { href: "/admin", rotulo: "Painel", icone: LayoutDashboard },
  { href: "/admin/produtos", rotulo: "Produtos", icone: Package },
  { href: "/admin/banners", rotulo: "Banners", icone: Images },
  { href: "/admin/categorias", rotulo: "Categorias", icone: Tags },
  { href: "/admin/configuracoes", rotulo: "Configurações", icone: Settings },
];

export function NavAdmin({
  email,
  logo = null,
}: {
  email: string;
  logo?: string | null;
}) {
  const caminho = usePathname();
  const router = useRouter();

  async function sair() {
    const supabase = await obterClienteNavegador();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex shrink-0 flex-col gap-1 border-b border-zh-azul-100 bg-white p-4 lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <Link href="/" className="mb-5 hidden lg:block">
        <Logo tamanho={38} src={logo} />
      </Link>

      <nav className="sem-barra flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {ITENS.map((item) => {
          const ativo =
            item.href === "/admin"
              ? caminho === "/admin"
              : caminho.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                ativo
                  ? "bg-zh-azul-600 text-white"
                  : "text-zh-azul-900/70 hover:bg-zh-azul-50"
              }`}
            >
              <item.icone className="size-4" />
              {item.rotulo}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto hidden border-t border-zh-azul-100 pt-4 lg:block">
        <p className="truncate px-1 text-[11px] text-zh-azul-900/50">{email}</p>
        <button
          onClick={sair}
          className="mt-2 flex w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="size-4" />
          Sair
        </button>
      </div>

      <button
        onClick={sair}
        className="ml-auto shrink-0 rounded-xl p-2.5 text-red-600 lg:hidden"
        aria-label="Sair"
      >
        <LogOut className="size-4" />
      </button>
    </aside>
  );
}

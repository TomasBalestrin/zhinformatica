import { criarClienteServidor } from "@/lib/supabase-server";
import { NavAdmin } from "@/componentes/NavAdmin";

export const metadata = { title: "Administração" };

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await criarClienteServidor();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: logoLinha } = await supabase
    .from("configuracoes")
    .select("valor")
    .eq("chave", "logo")
    .maybeSingle();

  // A página de login usa este mesmo layout; sem usuário, renderiza só o conteúdo.
  if (!user) return <>{children}</>;

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <NavAdmin email={user.email ?? ""} logo={logoLinha?.valor || null} />
      <div className="flex-1 overflow-x-hidden bg-[#f6f7fb] p-4 sm:p-8">
        {children}
      </div>
    </div>
  );
}

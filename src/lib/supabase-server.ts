import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { chaveSupabase, urlSupabase } from "./ambiente";

/** Cliente Supabase para Server Components / Route Handlers. */
export async function criarClienteServidor() {
  const cookieStore = await cookies();

  return createServerClient(
    urlSupabase(),
    chaveSupabase(),
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado de um Server Component — o proxy cuida da renovação.
          }
        },
      },
    }
  );
}

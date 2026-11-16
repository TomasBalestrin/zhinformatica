"use client";

import { createBrowserClient } from "@supabase/ssr";
import { chaveSupabase, urlSupabase } from "./ambiente";

export function criarClienteNavegador() {
  return createBrowserClient(
    urlSupabase(),
    chaveSupabase()
  );
}

-- ============================================================
-- Banner com imagem separada para celular
-- ============================================================
-- Rode no SQL Editor do Supabase. Seguro para rodar mais de uma vez.
--
-- A imagem larga (desktop) fica em imagem_url, como já era.
-- A imagem vertical do celular vai em imagem_mobile_url.
-- Banner sem imagem de celular continua usando a de desktop.
-- ============================================================

alter table public.banners
  add column if not exists imagem_mobile_url text;

-- Conferindo: deve listar as duas colunas de imagem
select column_name
from information_schema.columns
where table_schema = 'public'
  and table_name   = 'banners'
  and column_name in ('imagem_url', 'imagem_mobile_url');

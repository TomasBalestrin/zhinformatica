-- ============================================================
-- ZH Informática — schema do banco (Supabase / Postgres)
-- Rode este arquivo inteiro no SQL Editor do Supabase.
-- ============================================================

-- ---------- CATEGORIAS ----------
create table if not exists public.categorias (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  slug        text not null unique,
  ordem       int  not null default 0,
  criado_em   timestamptz not null default now()
);

-- ---------- PRODUTOS ----------
create table if not exists public.produtos (
  id           uuid primary key default gen_random_uuid(),
  nome         text not null,
  descricao    text,
  preco        numeric(10,2),              -- NULL = "Consulte o valor"
  imagem_url   text,
  categoria_id uuid references public.categorias(id) on delete set null,
  destaque     boolean not null default false,
  ativo        boolean not null default true,
  ordem        int not null default 0,
  criado_em    timestamptz not null default now()
);

create index if not exists produtos_categoria_idx on public.produtos(categoria_id);
create index if not exists produtos_ativo_idx     on public.produtos(ativo);

-- ---------- BANNERS ----------
create table if not exists public.banners (
  id          uuid primary key default gen_random_uuid(),
  titulo      text,
  subtitulo   text,
  imagem_url  text not null,
  link        text,                        -- opcional: destino ao clicar
  ativo       boolean not null default true,
  ordem       int not null default 0,
  criado_em   timestamptz not null default now()
);

-- ---------- CONFIGURAÇÕES DO SITE ----------
create table if not exists public.configuracoes (
  chave  text primary key,
  valor  text
);

insert into public.configuracoes (chave, valor) values
  ('logo',      ''),
  ('whatsapp',  '554934360215'),
  ('endereco',  'R. Sete de Setembro, N° 245 - Centro, Faxinal dos Guedes - SC, 89694-000'),
  ('instagram', 'https://instagram.com/zhinformatica'),
  ('email',     ''),
  ('horario',   'Seg a Sex: 8h30 às 18h30 | Sáb: 8h30 às 12h')
on conflict (chave) do nothing;

-- ---------- CATEGORIAS INICIAIS ----------
insert into public.categorias (nome, slug, ordem) values
  ('Celulares & iPhones',   'celulares',     1),
  ('Notebooks',             'notebooks',     2),
  ('Fones de Ouvido',       'fones',         3),
  ('Caixas de Som',         'caixas-de-som', 4),
  ('Periféricos',           'perifericos',   5),
  ('PS5 & Gamer',           'gamer',         6),
  ('Starlink & Internet',   'starlink',      7),
  ('Impressoras',           'impressoras',   8),
  ('Relógios Smart',        'relogios',      9),
  ('Móveis p/ Escritório',  'escritorio',   10)
on conflict (slug) do nothing;

-- ============================================================
-- SEGURANÇA (RLS): leitura pública, escrita só autenticado
-- ============================================================
alter table public.categorias    enable row level security;
alter table public.produtos      enable row level security;
alter table public.banners       enable row level security;
alter table public.configuracoes enable row level security;

drop policy if exists "leitura publica categorias"    on public.categorias;
drop policy if exists "leitura publica produtos"      on public.produtos;
drop policy if exists "leitura publica banners"       on public.banners;
drop policy if exists "leitura publica configuracoes" on public.configuracoes;

create policy "leitura publica categorias"    on public.categorias    for select using (true);
create policy "leitura publica produtos"      on public.produtos      for select using (true);
create policy "leitura publica banners"       on public.banners       for select using (true);
create policy "leitura publica configuracoes" on public.configuracoes for select using (true);

drop policy if exists "admin escreve categorias"    on public.categorias;
drop policy if exists "admin escreve produtos"      on public.produtos;
drop policy if exists "admin escreve banners"       on public.banners;
drop policy if exists "admin escreve configuracoes" on public.configuracoes;

create policy "admin escreve categorias"    on public.categorias    for all to authenticated using (true) with check (true);
create policy "admin escreve produtos"      on public.produtos      for all to authenticated using (true) with check (true);
create policy "admin escreve banners"       on public.banners       for all to authenticated using (true) with check (true);
create policy "admin escreve configuracoes" on public.configuracoes for all to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE: bucket público "midia" para imagens
-- ============================================================
insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do nothing;

drop policy if exists "midia leitura publica" on storage.objects;
drop policy if exists "midia upload admin"    on storage.objects;
drop policy if exists "midia update admin"    on storage.objects;
drop policy if exists "midia delete admin"    on storage.objects;

create policy "midia leitura publica" on storage.objects
  for select using (bucket_id = 'midia');

create policy "midia upload admin" on storage.objects
  for insert to authenticated with check (bucket_id = 'midia');

create policy "midia update admin" on storage.objects
  for update to authenticated using (bucket_id = 'midia');

create policy "midia delete admin" on storage.objects
  for delete to authenticated using (bucket_id = 'midia');

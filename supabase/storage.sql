-- ============================================================
-- Bucket de imagens "midia"
-- ============================================================
-- Rode este arquivo APENAS se o bucket não aparecer em Storage.
-- Em alguns projetos o SQL Editor não tem permissão para gravar em
-- storage.buckets; nesse caso crie o bucket pela interface:
--   Storage → New bucket → nome "midia" → marque "Public bucket" → Save
-- e depois rode somente as políticas abaixo.
-- ============================================================

insert into storage.buckets (id, name, public)
values ('midia', 'midia', true)
on conflict (id) do update set public = true;

-- ---------- POLÍTICAS ----------
-- Leitura pública: as imagens precisam abrir para os visitantes do site.
-- Escrita apenas para quem está logado no painel.

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

-- ---------- CONFERINDO ----------
-- Deve retornar uma linha com public = true
select id, name, public from storage.buckets where id = 'midia';

# Colocar o site no ar — passo a passo

Tempo estimado: 10 minutos. Tudo é feito no painel do Supabase do cliente.

---

## 1. Criar as tabelas

1. Abra o projeto no <https://supabase.com/dashboard>.
2. Menu lateral → **SQL Editor** → botão **New query**.
3. Abra o arquivo [`supabase/schema.sql`](supabase/schema.sql) deste projeto,
   copie **todo** o conteúdo e cole no editor.
4. Clique em **Run** (ou `Ctrl/Cmd + Enter`).

Deve aparecer **Success. No rows returned** — é o resultado esperado.

O script é seguro para rodar mais de uma vez: ele usa `if not exists` e
`on conflict do nothing`, então não duplica nem apaga nada se for executado
de novo.

O que ele cria:

- Tabelas `produtos`, `banners`, `categorias` e `configuracoes`
- As 10 categorias iniciais (Celulares, Notebooks, Fones, Gamer, Starlink…)
- Os dados de contato da loja já preenchidos
- O bucket de imagens `midia`
- As regras de segurança: **qualquer um lê, só quem está logado escreve**

### Conferindo

Menu lateral → **Table Editor**. Devem aparecer as 4 tabelas, e `categorias`
deve ter 10 linhas.

---

## 2. Criar o login do dono

1. Menu lateral → **Authentication** → **Users**.
2. Botão **Add user** → **Create new user**.
3. Preencha o e-mail e a senha que o dono vai usar.
4. **Marque a opção `Auto Confirm User`.**

> O passo 4 é o mais importante: sem ele o Supabase envia um e-mail de
> confirmação e o login falha até alguém clicar no link. Marcando a caixa, a
> senha funciona na hora.

Não existe tela de cadastro público no site — só quem for criado aqui entra no
painel. Para dar acesso a outra pessoa depois, repita este passo.

---

## 3. Pegar as credenciais

1. Menu lateral → **Project Settings** (engrenagem) → **API**.
2. Copie os dois valores:
   - **Project URL**
   - **Project API keys → `anon` `public`**

Cole no arquivo `.env.local`, na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
```

⚠️ Use a chave **`anon public`**. Nunca a `service_role` — essa ignora todas as
regras de segurança e não pode ficar em código que roda no navegador.

A chave `anon` ser pública é normal e esperado: a proteção real vem das regras
criadas no passo 1.

---

## 4. Rodar

```bash
npm run dev
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

Entre no painel com o e-mail e a senha do passo 2.

---

## 5. Primeiro cadastro (ordem sugerida)

1. **Configurações** → envie a **logo** da loja (PNG quadrado, fundo
   transparente) e confira o WhatsApp e o endereço.
2. **Produtos** → **Novo produto**: foto, nome, preço (pode deixar vazio para
   exibir "Consulte o valor") e categoria. Marque **Mostrar em destaque** nos
   que devem aparecer na página inicial.
3. **Banners** → **Novo banner**: imagem de **1600×600 px** para o carrossel da
   home.

> As páginas públicas têm cache de 60 segundos. Depois de cadastrar, pode levar
> até um minuto para o produto aparecer no site — o painel mostra na hora.

---

## 6. Publicar na Vercel

As mesmas duas variáveis do `.env.local` vão para a Vercel. O arquivo
`.env.local` **não** é enviado — ele está no `.gitignore` e serve só para a sua
máquina.

### 6.1 Subir o código para o GitHub

```bash
git add .
git commit -m "Site ZH Informática"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/zh-informatica.git
git push -u origin main
```

### 6.2 Importar na Vercel

1. Acesse <https://vercel.com> e entre com a conta do GitHub.
2. **Add New → Project** → selecione o repositório → **Import**.
3. **Não clique em Deploy ainda** — primeiro as variáveis (passo 6.3).

A Vercel detecta Next.js sozinha. Não mude Build Command nem Output Directory.

### 6.3 Variáveis de ambiente (o passo que não pode faltar)

Ainda na tela de importação, abra **Environment Variables** e adicione as duas:

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxxxxxxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` |

São os mesmos valores do `.env.local` — copie de **Project Settings → API** no
Supabase. Use a chave **`anon public`**, nunca a `service_role`.

Deixe as três caixas marcadas: **Production**, **Preview** e **Development**.

> ⚠️ Ao colar, confira que não entrou espaço ou quebra de linha no fim do valor.
> É o erro mais comum e o sintoma é confuso: o site sobe, mas aparece sem
> produto nenhum, como se o banco estivesse vazio.

Agora sim: **Deploy**. Em 1–2 minutos o site está no ar.

### 6.4 Se esquecer as variáveis

O deploy funciona e o site aparece — só que vazio, sem produtos nem categorias.
Nesse caso: **Settings → Environment Variables**, adicione as duas, e então
**Deployments → ... → Redeploy**.

> Adicionar variável **não** republica sozinho. O redeploy é obrigatório para
> ela valer.

### 6.5 Domínio próprio

**Settings → Domains** → adicione `zhinformatica.com.br` e siga as instruções de
DNS que a Vercel mostrar. O certificado HTTPS é emitido automaticamente.

### Depois de publicar

O painel funciona igual no site publicado: `https://seu-site.vercel.app/admin`,
com o mesmo e-mail e senha do passo 2. O dono não precisa de nada instalado —
cadastra produto pelo celular, se quiser.

---

## Se algo der errado

| Sintoma | Causa provável |
| --- | --- |
| Login recusa a senha certa | O usuário foi criado sem **Auto Confirm**. Apague e refaça o passo 2. |
| Páginas levam ~7 segundos | `.env.local` ainda com valores de exemplo. Refaça o passo 3 e reinicie o `npm run dev`. |
| Site sem produtos nem categorias | O `schema.sql` não rodou. Volte ao passo 1. |
| Erro ao enviar imagem | O bucket `midia` não existe — rode o `schema.sql` de novo. |
| Imagem não carrega depois de enviada | Reinicie o `npm run dev`: o domínio do Supabase é lido na inicialização. Na Vercel, faça **Redeploy**. |
| Na Vercel o site sobe vazio | Variáveis faltando, com espaço no fim, ou adicionadas sem **Redeploy**. Veja o passo 6.4. |

# ZH Informática — site + painel administrativo

Site institucional e catálogo da ZH Informática (Faxinal dos Guedes/SC), com
área administrativa para cadastrar banners e produtos. **Todos os botões de
compra levam para o WhatsApp — o site não processa pagamentos.**

Stack: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Supabase
(banco, autenticação e armazenamento de imagens).

---

## 1. Criar o projeto no Supabase

1. Acesse <https://supabase.com> e crie uma conta (plano gratuito serve).
2. Clique em **New project**, escolha um nome (ex.: `zh-informatica`), defina
   uma senha para o banco e selecione a região **South America (São Paulo)**.
3. Aguarde o provisionamento (1–2 minutos).

## 2. Criar as tabelas

1. No painel do Supabase, abra **SQL Editor** → **New query**.
2. Cole todo o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) e
   clique em **Run**.

Isso cria as tabelas `produtos`, `banners`, `categorias` e `configuracoes`,
aplica as regras de segurança (leitura pública, escrita só para administradores
logados), cria o bucket de imagens `midia` e já insere as categorias iniciais e
os dados de contato da loja.

## 3. Criar o usuário administrador

1. No Supabase, vá em **Authentication** → **Users** → **Add user** →
   **Create new user**.
2. Informe o e-mail e a senha do responsável pela loja.
3. Marque **Auto Confirm User** para que o login funcione de imediato.

> Repita o passo para cada pessoa que precisar acessar o painel. Não existe
> cadastro público: só quem for criado aqui consegue entrar.

## 4. Configurar as credenciais

No Supabase, abra **Project Settings** → **API** e copie os dois valores para o
arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

A chave `anon` é pública por natureza — a proteção real vem das regras de
segurança (RLS) criadas no passo 2. **Nunca** use a chave `service_role` aqui.

## 5. Rodar localmente

```bash
npm install
npm run dev
```

- Site: <http://localhost:3000>
- Painel: <http://localhost:3000/admin>

## 6. Publicar na Vercel

1. Suba o projeto para um repositório no GitHub.
2. Em <https://vercel.com>, clique em **Add New → Project** e importe o
   repositório.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do
   `.env.local`.
4. Clique em **Deploy**.

Para usar um domínio próprio (ex.: `zhinformatica.com.br`), vá em
**Settings → Domains** no projeto da Vercel e siga as instruções de DNS.

---

## Usando o painel administrativo

Acesse `/admin` e entre com o e-mail e a senha criados no passo 3.

| Seção | O que faz |
| --- | --- |
| **Painel** | Resumo de quantos produtos, banners e categorias existem. |
| **Produtos** | Cadastra, edita e exclui produtos com foto, preço e categoria. |
| **Banners** | Gerencia as imagens do carrossel da página inicial. |
| **Categorias** | Cria e ordena as categorias do menu. |
| **Configurações** | Envia a **logo** e atualiza WhatsApp, endereço, horário, Instagram e e-mail. |

### Detalhes importantes

- **Preço é opcional.** Deixando o campo vazio, o card exibe
  "Consulte o valor" — útil para produtos com preço que muda com frequência.
- **Produto oculto.** Desligue "Visível no site" para tirar um produto do ar
  sem perder o cadastro.
- **Destaque.** Produtos marcados como destaque aparecem na página inicial. Se
  nenhum estiver marcado, a home mostra os cadastrados mais recentes.
- **Ordem.** Número menor aparece primeiro na listagem.
- **Banners.** Cada banner aceita **duas imagens**: uma para computador
  (deitada, ~1600×600 px) e outra para celular (em pé, ~900×1100 px). A de
  celular é opcional — sem ela, o telefone usa a de computador. O campo
  "Link ao clicar" aceita caminhos internos, como `/produtos?categoria=gamer`.
- **O banner nunca é cortado.** A moldura se ajusta à proporção da imagem
  enviada, então ele aparece inteiro, seja qual for o formato.
- **Imagens.** Até 5 MB por arquivo, em JPG, PNG ou WEBP.
- **Logo.** Enviada em Configurações. Use PNG com fundo transparente e formato
  quadrado (ex.: 512×512 px). Ela aparece no topo do site, no rodapé e no
  painel. Enquanto nenhuma logo for enviada, o site mostra um símbolo padrão
  desenhado nas cores da marca — ou seja, o site nunca fica sem identidade.
- **WhatsApp.** Ao alterar o número em Configurações, todos os botões do site
  passam a usar o novo número automaticamente, com a mensagem já preenchida
  com o nome do produto.

### Cache

As páginas públicas são atualizadas a cada 60 segundos. Depois de cadastrar um
produto, ele pode levar até um minuto para aparecer no site — o painel sempre
mostra o estado atual.

---

## Estrutura do código

```
src/
├── app/
│   ├── (site)/          páginas públicas (home, produtos, assistência, contato)
│   └── admin/           painel administrativo protegido por login
├── componentes/         componentes de interface reutilizáveis
├── lib/                 clientes Supabase, consultas, tipos e formatação
└── proxy.ts             protege /admin e mantém a sessão ativa
supabase/schema.sql      script de criação do banco
```

Cores da marca (`src/app/globals.css`): azul `#2338db` e laranja `#f25c15`,
retirados da logo.

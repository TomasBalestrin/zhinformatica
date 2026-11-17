export type Categoria = {
  id: string;
  nome: string;
  slug: string;
  ordem: number;
  criado_em?: string;
};

export type Produto = {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number | null;
  imagem_url: string | null;
  categoria_id: string | null;
  destaque: boolean;
  ativo: boolean;
  ordem: number;
  criado_em?: string;
};

export type Banner = {
  id: string;
  titulo: string | null;
  subtitulo: string | null;
  imagem_url: string;
  imagem_mobile_url: string | null;
  link: string | null;
  ativo: boolean;
  ordem: number;
  criado_em?: string;
};

export type Config = Record<string, string>;

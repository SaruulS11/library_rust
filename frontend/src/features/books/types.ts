export type Book = {
  id: number;
  title: string;
  author: string;
  publication_year: number | null;
};

export type CreateBook = {
  title: string;
  author: string;
  publication_year: number | null;
};
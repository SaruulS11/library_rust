export type CopySummary = {
  id: number;
  book_id: number;
  inventory_code: string;
  title: string;
  author: string;
};

export type CopyInput = {
  book_id: number;
  inventory_code: string;
};
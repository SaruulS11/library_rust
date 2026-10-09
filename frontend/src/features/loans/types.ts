export type LoanSummary = {
  id: number;
  copy_id: number;
  member_id: number;
  inventory_code: string;
  book_title: string;
  member_code: string;
  member_name: string;
  borrowed_at: string;
  due_at: string;
  returned_at: string | null;
};

export type BorrowInput = {
  copy_id: number;
  member_id: number;
};
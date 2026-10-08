"use client";

import { useActionState } from "react";
import type { Book } from "@/features/books/types";
import { registerCopy } from "./actions";

type CopyFormProps = {
  books: Book[];
};

export function CopyForm({ books }: CopyFormProps) {
  const [state, formAction, pending] = useActionState(registerCopy, {
    message: "",
  });

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Register copy</h2>

      <div>
        <label htmlFor="copy-book" className="block font-medium">
          Book
        </label>

        <select
          id="copy-book"
          name="book_id"
          defaultValue=""
          required
          className="mt-1 w-full rounded border p-2"
        >
          <option value="" disabled>
            Select a book
          </option>

          {books.map((book) => (
            <option key={book.id} value={book.id}>
              {book.title} — {book.author} (ID: {book.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="copy-code" className="block font-medium">
          Inventory code
        </label>

        <input
          id="copy-code"
          name="inventory_code"
          placeholder="LIB-0005"
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending || books.length === 0}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Register copy"}
      </button>

      {books.length === 0 && (
        <p>Register a book before adding its copies.</p>
      )}

      <p role="status">{state.message}</p>
    </form>
  );
}
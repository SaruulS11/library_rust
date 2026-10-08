"use client";

import { useActionState } from "react";
import { editBook, registerBook } from "./actions";
import type { Book } from "./types";

type BookFormProps = {
  book?: Book;
};

export function BookForm({ book }: BookFormProps) {
  const action = book
    ? editBook.bind(null, book.id)
    : registerBook;

  const [state, formAction, pending] = useActionState(action, {
    message: "",
  });

  const fieldPrefix = book ? `book-${book.id}` : "new-book";

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-xl font-semibold">
        {book ? "Edit book" : "Register book"}
      </h2>

      <div>
        <label htmlFor={`${fieldPrefix}-title`} className="block font-medium">
          Title
        </label>
        <input
          id={`${fieldPrefix}-title`}
          name="title"
          defaultValue={book?.title ?? ""}
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label htmlFor={`${fieldPrefix}-author`} className="block font-medium">
          Author
        </label>
        <input
          id={`${fieldPrefix}-author`}
          name="author"
          defaultValue={book?.author ?? ""}
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label htmlFor={`${fieldPrefix}-year`} className="block font-medium">
          Publication year (optional)
        </label>
        <input
          id={`${fieldPrefix}-year`}
          name="publication_year"
          type="number"
          defaultValue={book?.publication_year ?? ""}
          min="1"
          max="9999"
          step="1"
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : book ? "Save changes" : "Register book"}
      </button>

      <p role="status">{state.message}</p>
    </form>
  );
}
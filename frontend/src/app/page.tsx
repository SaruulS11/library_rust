import { getBooks } from "@/features/books/api";
import { BookForm } from "@/features/books/book-form";
import Link from "next/link";
import { CopyForm } from "@/features/copies/copy-form";

export default async function HomePage() {
  const books = await getBooks();

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold">Library books</h1>
        <Link href="/copies" className="mt-2 inline-block text-blue-700 underline">
          View physical copies
        </Link>
        <Link
          href="/members"
          className="ml-4 inline-block text-blue-700 underline"
        >
          View members
        </Link>
        <Link
          href="/loans"
          className="ml-4 inline-block text-blue-700 underline"
        >
          View loans
        </Link>

        <BookForm />

        <p className="mt-6 text-slate-600">
          Showing {books.length} books. Up to 100 are displayed.
        </p>

        {books.length === 0 ? (
          <p className="mt-6">No books registered yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-lg bg-white p-4 shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="p-3">ID</th>
                  <th scope="col" className="p-3">Title</th>
                  <th scope="col" className="p-3">Author</th>
                  <th scope="col" className="p-3">Year</th>
                  <th scope="col" className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-b">
                    <td className="p-3">{book.id}</td>
                    <td className="p-3">{book.title}</td>
                    <td className="p-3">{book.author}</td>
                    <td className="p-3">
                      {book.publication_year ?? "Unknown"}
                    </td>
                    <td className="p-3">
                      <details>
                        <summary className="cursor-pointer text-blue-700">
                          Edit
                        </summary>

                        <BookForm book={book} />
                      </details>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
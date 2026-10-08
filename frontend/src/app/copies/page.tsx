import Link from "next/link";
import { getCopies } from "@/features/copies/api";
import { getBooks } from "@/features/books/api";
import { CopyForm } from "@/features/copies/copy-form";

export default async function CopiesPage() {
  const [copies, books] = await Promise.all([
    getCopies(),
    getBooks(),
  ]);

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-blue-700 underline">
          Back to books
        </Link>

        <h1 className="mt-4 text-3xl font-bold">Physical copies</h1>
        <CopyForm books={books} />

        <p className="mt-2 text-slate-600">
          Showing {copies.length} copies. Up to 100 are displayed.
        </p>

        {copies.length === 0 ? (
          <p className="mt-6">No copies registered yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-lg bg-white p-4 shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="p-3">Inventory code</th>
                  <th scope="col" className="p-3">Book title</th>
                  <th scope="col" className="p-3">Author</th>
                </tr>
              </thead>

              <tbody>
                {copies.map((copy) => (
                  <tr key={copy.id} className="border-b">
                    <td className="p-3 font-medium">
                      {copy.inventory_code}
                    </td>
                    <td className="p-3">{copy.title}</td>
                    <td className="p-3">{copy.author}</td>
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
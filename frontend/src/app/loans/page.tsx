import Link from "next/link";
import { getCopies } from "@/features/copies/api";
import { getMembers } from "@/features/members/api";
import { getLoans } from "@/features/loans/api";
import { BorrowForm } from "@/features/loans/borrow-form";
import { ReturnButton } from "@/features/loans/return-button";

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ulaanbaatar",
  }).format(new Date(value));
}

export default async function LoansPage() {
  const [loans, copies, members] = await Promise.all([
    getLoans(),
    getCopies(),
    getMembers(),
  ]);

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="text-blue-700 underline">
          Back to books
        </Link>

        <h1 className="mt-4 text-3xl font-bold">Library loans</h1>

        <BorrowForm copies={copies} members={members} />

        <p className="mt-6 text-slate-600">
          Showing the latest {loans.length} loans, up to 100.
          Times are shown in Ulaanbaatar time.
        </p>

        {loans.length === 0 ? (
          <p className="mt-6">No loans yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-lg bg-white p-4 shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="p-3">Copy / Book</th>
                  <th scope="col" className="p-3">Member</th>
                  <th scope="col" className="p-3">Borrowed</th>
                  <th scope="col" className="p-3">Due</th>
                  <th scope="col" className="p-3">Return</th>
                </tr>
              </thead>

              <tbody>
                {loans.map((loan) => (
                  <tr key={loan.id} className="border-b">
                    <td className="p-3">
                      <p className="font-medium">{loan.inventory_code}</p>
                      <p>{loan.book_title}</p>
                    </td>
                    <td className="p-3">
                      <p>{loan.member_name}</p>
                      <p className="text-sm text-slate-600">
                        {loan.member_code}
                      </p>
                    </td>
                    <td className="p-3">{formatDate(loan.borrowed_at)}</td>
                    <td className="p-3">{formatDate(loan.due_at)}</td>
                    <td className="p-3">
                      {loan.returned_at === null ? (
                        <ReturnButton loanId={loan.id} />
                      ) : (
                        <span>Returned {formatDate(loan.returned_at)}</span>
                      )}
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
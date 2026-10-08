import Link from "next/link";
import { getMembers } from "@/features/members/api";
import { MemberForm } from "@/features/members/member-form";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <main className="min-h-screen bg-slate-100 p-8 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-blue-700 underline">
          Back to books
        </Link>

        <h1 className="mt-4 text-3xl font-bold">Library members</h1>

        <MemberForm />

        <p className="mt-6 text-slate-600">
          Showing {members.length} members. Up to 100 are displayed.
        </p>

        {members.length === 0 ? (
          <p className="mt-6">No members registered yet.</p>
        ) : (
          <div className="mt-6 overflow-x-auto rounded-lg bg-white p-4 shadow">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="p-3">Member code</th>
                  <th scope="col" className="p-3">Full name</th>
                </tr>
              </thead>

              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b">
                    <td className="p-3 font-medium">
                      {member.member_code}
                    </td>
                    <td className="p-3">{member.full_name}</td>
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
"use client";

import { useActionState } from "react";
import type { CopySummary } from "@/features/copies/types";
import type { Member } from "@/features/members/types";
import { borrowAction } from "./actions";

type BorrowFormProps = {
  copies: CopySummary[];
  members: Member[];
};

export function BorrowForm({ copies, members }: BorrowFormProps) {
  const [state, formAction, pending] = useActionState(borrowAction, {
    message: "",
  });

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Borrow a copy</h2>

      <div>
        <label htmlFor="loan-copy" className="block font-medium">
          Physical copy
        </label>
        <select
          id="loan-copy"
          name="copy_id"
          defaultValue=""
          required
          className="mt-1 w-full rounded border p-2"
        >
          <option value="" disabled>Select a copy</option>
          {copies.map((copy) => (
            <option key={copy.id} value={copy.id}>
              {copy.inventory_code} — {copy.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="loan-member" className="block font-medium">
          Member
        </label>
        <select
          id="loan-member"
          name="member_id"
          defaultValue=""
          required
          className="mt-1 w-full rounded border p-2"
        >
          <option value="" disabled>Select a member</option>
          {members.map((member) => (
            <option key={member.id} value={member.id}>
              {member.member_code} — {member.full_name}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-slate-600">
        Loans are due in 14 days. Availability is checked when you submit.
      </p>

      <button
        type="submit"
        disabled={pending || copies.length === 0 || members.length === 0}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Borrowing..." : "Borrow copy"}
      </button>

      <p role="status">{state.message}</p>
    </form>
  );
}
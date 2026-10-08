"use client";

import { useActionState } from "react";
import { registerMember } from "./actions";

export function MemberForm() {
  const [state, formAction, pending] = useActionState(registerMember, {
    message: "",
  });

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4 rounded-lg bg-white p-6 shadow"
    >
      <h2 className="text-xl font-semibold">Register member</h2>

      <div>
        <label htmlFor="member-code" className="block font-medium">
          Member code
        </label>
        <input
          id="member-code"
          name="member_code"
          placeholder="MEM-0004"
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <div>
        <label htmlFor="member-name" className="block font-medium">
          Full name
        </label>
        <input
          id="member-name"
          name="full_name"
          required
          className="mt-1 w-full rounded border p-2"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded bg-blue-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Saving..." : "Register member"}
      </button>

      <p role="status">{state.message}</p>
    </form>
  );
}
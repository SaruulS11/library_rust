"use client";

import { useActionState } from "react";
import { returnAction } from "./actions";

export function ReturnButton({ loanId }: { loanId: number }) {
  const action = returnAction.bind(null, loanId);

  const [state, formAction, pending] = useActionState(action, {
    message: "",
  });

  return (
    <form action={formAction}>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-green-700 px-3 py-2 text-white disabled:opacity-50"
      >
        {pending ? "Returning..." : "Return"}
      </button>

      <p role="status" className="mt-1 text-sm">
        {state.message}
      </p>
    </form>
  );
}
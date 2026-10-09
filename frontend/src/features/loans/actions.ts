"use server";

import { revalidatePath } from "next/cache";
import { borrowCopy, returnLoan } from "./api";

type FormState = {
  message: string;
};

function isValidId(value: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= 2147483647;
}

export async function borrowAction(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const copyValue = formData.get("copy_id");
  const memberValue = formData.get("member_id");

  if (
    typeof copyValue !== "string" ||
    typeof memberValue !== "string"
  ) {
    return { message: "Select a copy and member." };
  }

  const copyId = Number(copyValue);
  const memberId = Number(memberValue);

  if (!isValidId(copyId) || !isValidId(memberId)) {
    return { message: "Select a valid copy and member." };
  }

  try {
    const response = await borrowCopy({
      copy_id: copyId,
      member_id: memberId,
    });

    if (response.status === 400 || response.status === 409) {
      return { message: await response.text() };
    }

    if (!response.ok) {
      return { message: "Could not borrow the copy." };
    }
  } catch (error) {
    console.error("Borrow request failed:", error);
    return { message: "Could not reach the library API." };
  }

  revalidatePath("/loans");
  return { message: "Copy borrowed successfully." };
}

export async function returnAction(
  loanId: number,
  _previousState: FormState,
  _formData: FormData,
): Promise<FormState> {
  if (!isValidId(loanId)) {
    return { message: "Invalid loan ID." };
  }

  try {
    const response = await returnLoan(loanId);

    if (response.status === 400 || response.status === 404) {
      return { message: await response.text() };
    }

    if (!response.ok) {
      return { message: "Could not return the copy." };
    }
  } catch (error) {
    console.error("Return request failed:", error);
    return { message: "Could not reach the library API." };
  }

  revalidatePath("/loans");
  return { message: "Copy returned successfully." };
}
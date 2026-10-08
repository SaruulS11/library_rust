"use server";

import { revalidatePath } from "next/cache";
import { createMember } from "./api";

type FormState = {
  message: string;
};

export async function registerMember(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const memberCode = formData.get("member_code");
  const fullName = formData.get("full_name");

  if (
    typeof memberCode !== "string" ||
    typeof fullName !== "string"
  ) {
    return { message: "Invalid form data." };
  }

  try {
    const response = await createMember({
      member_code: memberCode,
      full_name: fullName,
    });

    if (response.status === 400 || response.status === 409) {
      return { message: await response.text() };
    }

    if (!response.ok) {
      return { message: "Could not register the member. Please try again." };
    }
  } catch (error) {
    console.error("Member registration request failed:", error);
    return { message: "Could not reach the library API." };
  }

  revalidatePath("/members");

  return { message: "Member registered successfully." };
}
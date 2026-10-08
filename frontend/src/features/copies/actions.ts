"use server";

import { revalidatePath } from "next/cache";
import { createCopy } from "./api";

type FormState = {
  message: string;
};

export async function registerCopy(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  const bookIdText = formData.get("book_id");
  const inventoryCode = formData.get("inventory_code");

  if (
    typeof bookIdText !== "string" ||
    typeof inventoryCode !== "string"
  ) {
    return { message: "Invalid form data." };
  }

  const bookId = Number(bookIdText);

  if (
    !Number.isInteger(bookId) ||
    bookId < 1 ||
    bookId > 2147483647
  ) {
    return { message: "Select a valid book." };
  }

  try {
    const response = await createCopy({
      book_id: bookId,
      inventory_code: inventoryCode,
    });

    if (
      response.status === 400 ||
      response.status === 404 ||
      response.status === 409
    ) {
      return { message: await response.text() };
    }

    if (!response.ok) {
      return { message: "Could not register the copy. Please try again." };
    }
  } catch (error) {
    console.error("Copy registration request failed:", error);
    return { message: "Could not reach the library API." };
  }

  revalidatePath("/copies");

  return { message: "Copy registered successfully." };
}
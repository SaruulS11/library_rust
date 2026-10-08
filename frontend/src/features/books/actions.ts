"use server";

import { revalidatePath } from "next/cache";
import { createBook, updateBook } from "./api";

type FormState = {
  message: string;
};

async function saveBook(
  formData: FormData,
  id?: number,
): Promise<FormState> {
  const title = formData.get("title");
  const author = formData.get("author");
  const yearText = formData.get("publication_year");

  if (
    typeof title !== "string" ||
    typeof author !== "string" ||
    typeof yearText !== "string"
  ) {
    return { message: "Invalid form data." };
  }

  const year = yearText.trim() === "" ? null : Number(yearText);

  if (year !== null && !Number.isInteger(year)) {
    return { message: "Year must be a whole number." };
  }

  const input = {
    title,
    author,
    publication_year: year,
  };

  try {
    const response =
      id === undefined
        ? await createBook(input)
        : await updateBook(id, input);

    if (response.status === 400 || response.status === 404) {
      return { message: await response.text() };
    }

    if (!response.ok) {
      return { message: "Could not save the book. Please try again." };
    }
  } catch (error) {
    console.error("Book save request failed:", error);
    return { message: "Could not reach the library API." };
  }

  revalidatePath("/");

  return {
    message:
      id === undefined
        ? "Book registered successfully."
        : "Book updated successfully.",
  };
}

export async function registerBook(
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  return saveBook(formData);
}

export async function editBook(
  id: number,
  _previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  if (!Number.isInteger(id) || id < 1) {
    return { message: "Invalid book ID." };
  }

  return saveBook(formData, id);
}
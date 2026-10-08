import type { Book, CreateBook } from "./types";

export async function getBooks(): Promise<Book[]> {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is missing");
  }

  const response = await fetch(`${baseUrl}/books`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load books: HTTP ${response.status}`);
  }

  return response.json();
}

export async function createBook(input: CreateBook): Promise<Response> {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is missing");
  }

  return fetch(`${baseUrl}/books`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function updateBook(
  id: number,
  input: CreateBook,
): Promise<Response> {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is missing");
  }

  return fetch(`${baseUrl}/books/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}
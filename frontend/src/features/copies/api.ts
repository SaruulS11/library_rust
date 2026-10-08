import type { CopyInput, CopySummary } from "./types";

export async function getCopies(): Promise<CopySummary[]> {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is missing");
  }

  const response = await fetch(`${baseUrl}/copies`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load copies: HTTP ${response.status}`);
  }

  return response.json();
}

export async function createCopy(input: CopyInput): Promise<Response> {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is missing");
  }

  return fetch(`${baseUrl}/copies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}
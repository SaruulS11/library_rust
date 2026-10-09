import type { BorrowInput, LoanSummary } from "./types";

function getBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is missing");
  }

  return baseUrl;
}

export async function getLoans(): Promise<LoanSummary[]> {
  const response = await fetch(`${getBaseUrl()}/loans`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load loans: HTTP ${response.status}`);
  }

  return response.json();
}

export async function borrowCopy(input: BorrowInput): Promise<Response> {
  return fetch(`${getBaseUrl()}/loans`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}

export async function returnLoan(id: number): Promise<Response> {
  return fetch(`${getBaseUrl()}/loans/${id}/return`, {
    method: "POST",
  });
}
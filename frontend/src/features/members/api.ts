import type { Member, MemberInput } from "./types";

function getBaseUrl(): string {
  const baseUrl = process.env.API_BASE_URL;

  if (!baseUrl) {
    throw new Error("API_BASE_URL is missing");
  }

  return baseUrl;
}

export async function getMembers(): Promise<Member[]> {
  const response = await fetch(`${getBaseUrl()}/members`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Could not load members: HTTP ${response.status}`);
  }

  return response.json();
}

export async function createMember(
  input: MemberInput,
): Promise<Response> {
  return fetch(`${getBaseUrl()}/members`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
}
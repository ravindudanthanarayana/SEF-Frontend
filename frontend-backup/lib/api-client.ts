const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export function apiUrl(path: string) {
  return `${BASE_URL}${path}`;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export class ApiRequestError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
      ...options,
      headers: {
        ...(options?.body ? { "Content-Type": "application/json" } : {}),
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
        ...options?.headers,
      },
    });
  } catch {
    throw new ApiRequestError("Network error. Please check your connection and try again.", 0);
  }

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    // no body
  }

  if (!res.ok) {
    const message =
      (data as { error?: string } | null)?.error ?? "Something went wrong. Please try again.";
    throw new ApiRequestError(message, res.status);
  }
  return data as T;
}

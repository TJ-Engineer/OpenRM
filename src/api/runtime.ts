import { resolveApiBaseUrl, sessionHeaders } from "./client";

const DEFAULT_ORGANIZATION = "00000000-0000-4000-8000-000000000001";
const DEFAULT_PROJECT = "00000000-0000-4000-8000-000000000101";
const DEFAULT_TOKEN = "dev:local-user";
const DEFAULT_REVIEWER_TOKEN = "dev:local-reviewer";

export function runtimeConfig() {
  return {
    baseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
    organizationId: import.meta.env.VITE_OPENRM_ORGANIZATION_ID || DEFAULT_ORGANIZATION,
    projectId: import.meta.env.VITE_OPENRM_PROJECT_ID || DEFAULT_PROJECT,
    token: import.meta.env.VITE_OPENRM_TOKEN || DEFAULT_TOKEN,
    reviewerToken: import.meta.env.VITE_OPENRM_REVIEWER_TOKEN || DEFAULT_REVIEWER_TOKEN,
    reviewerSubject: import.meta.env.VITE_OPENRM_REVIEWER_SUBJECT || "local-reviewer",
  };
}

export async function apiRequestAs<T>(path: string, token: string, init: RequestInit = {}): Promise<T> {
  const config = runtimeConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: {
      ...sessionHeaders(token, config.organizationId),
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null) as
      | { error?: { message?: string } }
      | null;
    throw new Error(payload?.error?.message || `Request failed with status ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  return apiRequestAs(path, runtimeConfig().token, init);
}

export function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

import createClient from "openapi-fetch";

import type { paths } from "./generated";

export const LOCAL_API_BASE_URL = "http://127.0.0.1:8080";

export function resolveApiBaseUrl(configuredUrl?: string): string {
  const value = configuredUrl?.trim();
  return value ? value.replace(/\/$/, "") : LOCAL_API_BASE_URL;
}

export function sessionHeaders(token: string, organizationId: string): Record<string, string> {
  return {
    Authorization: `Bearer ${token}`,
    "X-OpenCM-Organization": organizationId,
  };
}

export const apiClient = createClient<paths>({
  baseUrl: resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
});


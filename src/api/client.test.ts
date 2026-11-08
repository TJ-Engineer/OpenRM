import { describe, expect, it } from "vitest";

import { LOCAL_API_BASE_URL, resolveApiBaseUrl, sessionHeaders } from "./client";

describe("API client configuration", () => {
  it("uses the local API when no override is configured", () => {
    expect(resolveApiBaseUrl()).toBe(LOCAL_API_BASE_URL);
  });

  it("normalizes a configured API URL", () => {
    expect(resolveApiBaseUrl(" https://api.opencm.example/ ")).toBe("https://api.opencm.example");
  });

  it("builds explicit tenant-scoped session headers", () => {
    expect(sessionHeaders("dev:ci-user", "00000000-0000-4000-8000-000000000001")).toEqual({
      Authorization: "Bearer dev:ci-user",
      "X-OpenCM-Organization": "00000000-0000-4000-8000-000000000001",
    });
  });
});


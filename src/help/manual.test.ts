import { describe, expect, it } from "vitest";
import manualSource from "../../docs/user/USER_MANUAL.md?raw";
import { parseManual } from "./manual";

describe("OpenRM user manual", () => {
  const manual = parseManual(manualSource);

  it("provides a substantial, uniquely anchored product guide", () => {
    const anchors = manual.sections.flatMap((section) => [
      section.id,
      ...section.blocks
        .filter((block) => block.type === "subheading")
        .map((block) => block.id),
    ]);

    expect(manual.title).toBe("OpenRM user manual");
    expect(manual.sections.length).toBeGreaterThanOrEqual(20);
    expect(anchors.every(Boolean)).toBe(true);
    expect(new Set(anchors).size).toBe(anchors.length);
    expect(manual.sections.map((section) => section.id)).toEqual(expect.arrayContaining([
      "table-of-contents",
      "requirements-authoring",
      "traceability-and-suspect-links",
      "reviews-and-approvals",
      "verification-and-gate-readiness",
      "troubleshooting",
    ]));
  });

  it("keeps every table-of-contents link aligned with a rendered section", () => {
    const sectionIds = new Set(manual.sections.map((section) => section.id));
    const links = [...manualSource.matchAll(/\]\(#([^)]+)\)/g)].map((match) => match[1]);
    expect(links.length).toBeGreaterThanOrEqual(19);
    expect(links.filter((link) => !sectionIds.has(link))).toEqual([]);
  });
});

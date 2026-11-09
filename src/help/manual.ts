export type ManualBlock =
  | { type: "paragraph"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "note"; text: string }
  | { type: "code"; text: string }
  | { type: "subheading"; id: string; title: string };

export type ManualSection = {
  id: string;
  title: string;
  blocks: ManualBlock[];
};

export type ManualDocument = {
  title: string;
  intro: ManualBlock[];
  sections: ManualSection[];
};

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function isBlockStart(line: string) {
  return /^###\s+/.test(line)
    || /^```/.test(line)
    || /^-\s+/.test(line)
    || /^\d+\.\s+/.test(line)
    || /^>\s?/.test(line);
}

function parseBlocks(lines: string[], sectionId: string): ManualBlock[] {
  const blocks: ManualBlock[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line || line === "---") {
      index += 1;
      continue;
    }

    if (line.startsWith("### ")) {
      const title = line.slice(4).trim();
      blocks.push({ type: "subheading", id: `${sectionId}-${slugifyHeading(title)}`, title });
      index += 1;
      continue;
    }

    if (line.startsWith("```")) {
      const code: string[] = [];
      index += 1;
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        code.push(lines[index]);
        index += 1;
      }
      index += 1;
      blocks.push({ type: "code", text: code.join("\n") });
      continue;
    }

    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2).trim());
        index += 1;
      }
      blocks.push({ type: "unordered-list", items });
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      blocks.push({ type: "ordered-list", items });
      continue;
    }

    if (line.startsWith(">")) {
      const note: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith(">")) {
        note.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      blocks.push({ type: "note", text: note.join(" ") });
      continue;
    }

    const paragraph = [line];
    index += 1;
    while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index].trim())) {
      paragraph.push(lines[index].trim());
      index += 1;
    }
    blocks.push({ type: "paragraph", text: paragraph.join(" ") });
  }

  return blocks;
}

export function parseManual(source: string): ManualDocument {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  let title = "OpenRM user manual";
  const introLines: string[] = [];
  const rawSections: Array<{ title: string; lines: string[] }> = [];
  let currentSection: { title: string; lines: string[] } | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line.startsWith("# ") && !line.startsWith("## ")) {
      title = line.slice(2).trim();
      continue;
    }
    if (line.startsWith("## ") && !line.startsWith("### ")) {
      if (currentSection) rawSections.push(currentSection);
      currentSection = { title: line.slice(3).trim(), lines: [] };
      continue;
    }
    if (currentSection) currentSection.lines.push(rawLine);
    else introLines.push(rawLine);
  }
  if (currentSection) rawSections.push(currentSection);

  const sections = rawSections.map((section) => {
    const id = slugifyHeading(section.title);
    return { id, title: section.title, blocks: parseBlocks(section.lines, id) };
  });

  return {
    title,
    intro: parseBlocks(introLines, "manual-introduction"),
    sections,
  };
}

export function sectionSearchText(section: ManualSection) {
  const blockText = section.blocks.map((block) => {
    if ("items" in block) return block.items.join(" ");
    if (block.type === "subheading") return block.title;
    return block.text;
  });
  return [section.title, ...blockText].join(" ").toLowerCase();
}

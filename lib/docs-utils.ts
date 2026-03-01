"use server";

import { readFileSync, readdirSync, lstatSync } from "fs";
import { join, relative, extname, sep } from "path";

export interface DocSection {
  id: string;
  title: string;
  slug: string;
  category?: string;
}

export interface DocContent {
  id: string;
  title: string;
  slug: string;
  content: string;
  category?: string;
  previous?: DocSection;
  next?: DocSection;
}

const DOCS_DIR = join(process.cwd(), "docs");

function getFilesRecursively(
  dir: string,
  baseDir: string = DOCS_DIR,
): string[] {
  const files: string[] = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    if (lstatSync(fullPath).isDirectory()) {
      files.push(...getFilesRecursively(fullPath, baseDir));
    } else if (extname(fullPath) === ".md") {
      files.push(fullPath);
    }
  }

  return files;
}

function getTitleFromContent(content: string, fallback: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : fallback;
}

export async function getDocSections(): Promise<DocSection[]> {
  const files = getFilesRecursively(DOCS_DIR);

  return files.map((file) => {
    const relPath = relative(DOCS_DIR, file);
    const slug = relPath.replace(/\.md$/, "").split(sep).join("/");
    const content = readFileSync(file, "utf-8");
    const title = getTitleFromContent(content, slug.split("/").pop() || slug);
    const category = relPath.includes(sep) ? relPath.split(sep)[0] : "General";

    return {
      id: slug,
      title,
      slug,
      category:
        category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, " "),
    };
  });
}

export async function getCategorizedDocs(): Promise<
  Record<string, DocSection[]>
> {
  const allSections = await getDocSections();
  const sections = allSections.filter((s) => s.slug !== "changelog");
  const categorized: Record<string, DocSection[]> = {};

  sections.forEach((section) => {
    const cat = section.category || "General";
    if (!categorized[cat]) categorized[cat] = [];
    categorized[cat].push(section);
  });

  // Predefined order for items within specific categories
  const subTopicOrder: Record<string, string[]> = {
    "Getting started": [
      "introduction",
      "installation",
      "quick-start",
      "comparison",
    ],
    Core: [
      "headless-engine",
      "radix-trie",
      "logic-guards",
      "navigation-lifecycle",
      "data-loaders",
    ],
  };

  // Sort categories based on requested order
  const order = ["Getting started", "Core", "Adapters", "Advanced"];
  const sorted: Record<string, DocSection[]> = {};

  order.forEach((cat) => {
    if (categorized[cat]) {
      // Sort items within this category if we have a defined order
      const items = [...categorized[cat]];
      const catOrder = subTopicOrder[cat];

      if (catOrder) {
        items.sort((a, b) => {
          const indexA = catOrder.indexOf(a.id.split("/").pop() || "");
          const indexB = catOrder.indexOf(b.id.split("/").pop() || "");

          if (indexA === -1 && indexB === -1) return 0;
          if (indexA === -1) return 1;
          if (indexB === -1) return -1;
          return indexA - indexB;
        });
      }

      sorted[cat] = items;
    }
  });

  // Add any categories not in the predefined order
  Object.keys(categorized).forEach((cat) => {
    if (!order.includes(cat)) {
      sorted[cat] = categorized[cat];
    }
  });

  return sorted;
}

export async function getDocBySlug(slug: string): Promise<DocContent | null> {
  const rawSections = await getDocSections();
  const section = rawSections.find((s) => s.slug === slug);
  if (!section) return null;

  const filePath = join(DOCS_DIR, `${slug.split("/").join(sep)}.md`);
  let content: string;
  try {
    content = readFileSync(filePath, "utf-8");
  } catch (e) {
    return null;
  }

  // Build prev/next using sorted order (same as sidebar)
  const categorized = await getCategorizedDocs();
  const sortedSections = Object.values(categorized).flat();

  const index = sortedSections.findIndex((s) => s.slug === slug);
  const previous = index > 0 ? sortedSections[index - 1] : undefined;
  const next =
    index < sortedSections.length - 1 ? sortedSections[index + 1] : undefined;

  return {
    ...section,
    content,
    previous,
    next,
  };
}

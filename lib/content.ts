import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const contentRoot = path.join(process.cwd(), "content", "units");

export type SandboxMeta = {
  enabled?: boolean;
  dataset?: string;
};

export type UnitMeta = {
  title: string;
  slug: string;
  summary: string;
  order: number;
  references: string[];
};

export type TopicMeta = {
  title: string;
  slug: string;
  unit: string;
  summary: string;
  order: number;
  references: string[];
  sandbox?: SandboxMeta;
};

export type ContentPage<T> = {
  meta: T;
  content: string;
  path: string;
};

function readMdx(filePath: string) {
  const raw = fs.readFileSync(filePath, "utf8");
  return matter(raw);
}

function assertFields(data: Record<string, unknown>, fields: string[], filePath: string) {
  for (const field of fields) {
    if (data[field] === undefined || data[field] === null || data[field] === "") {
      throw new Error(`Missing frontmatter "${field}" in ${filePath}`);
    }
  }
}

export function getUnits(): ContentPage<UnitMeta>[] {
  if (!fs.existsSync(contentRoot)) return [];
  return fs.readdirSync(contentRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const filePath = path.join(contentRoot, entry.name, "index.mdx");
      const parsed = readMdx(filePath);
      assertFields(parsed.data, ["title", "slug", "summary", "order"], filePath);
      return {
        meta: {
          title: parsed.data.title,
          slug: parsed.data.slug,
          summary: parsed.data.summary,
          order: parsed.data.order,
          references: parsed.data.references ?? []
        },
        content: parsed.content,
        path: filePath
      };
    })
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function getTopics(unitSlug?: string): ContentPage<TopicMeta>[] {
  return getUnits()
    .filter((unit) => !unitSlug || unit.meta.slug === unitSlug)
    .flatMap((unit) => {
      const unitDir = path.join(contentRoot, unit.meta.slug);
      return fs.readdirSync(unitDir)
        .filter((file) => file.endsWith(".mdx") && file !== "index.mdx")
        .map((file) => {
          const filePath = path.join(unitDir, file);
          const parsed = readMdx(filePath);
          assertFields(parsed.data, ["title", "slug", "unit", "summary", "order"], filePath);
          if (parsed.data.unit !== unit.meta.slug) {
            throw new Error(`Topic ${filePath} declares unit "${parsed.data.unit}" but is in "${unit.meta.slug}"`);
          }
          return {
            meta: {
              title: parsed.data.title,
              slug: parsed.data.slug,
              unit: parsed.data.unit,
              summary: parsed.data.summary,
              order: parsed.data.order,
              references: parsed.data.references ?? [],
              sandbox: parsed.data.sandbox
            },
            content: parsed.content,
            path: filePath
          };
        })
        .sort((a, b) => a.meta.order - b.meta.order);
    });
}

export function getUnit(slug: string) {
  return getUnits().find((unit) => unit.meta.slug === slug);
}

export function getTopic(unitSlug: string, topicSlug: string) {
  return getTopics(unitSlug).find((topic) => topic.meta.slug === topicSlug);
}

export function getNavigation() {
  return getUnits().map((unit) => ({
    ...unit.meta,
    topics: getTopics(unit.meta.slug).map((topic) => topic.meta)
  }));
}

export function getLinearDocsPages() {
  return getUnits().flatMap((unit) => [
    { title: unit.meta.title, href: `/${unit.meta.slug}` },
    ...getTopics(unit.meta.slug).map((topic) => ({
      title: topic.meta.title,
      href: `/${unit.meta.slug}/${topic.meta.slug}`
    }))
  ]);
}

export function getSurroundNavigation(href: string) {
  const pages = getLinearDocsPages();
  const index = pages.findIndex((page) => page.href === href);
  return {
    previous: index > 0 ? pages[index - 1] : null,
    next: index >= 0 && index < pages.length - 1 ? pages[index + 1] : null
  };
}

export function getHeadings(content: string) {
  const seen = new Map<string, number>();
  return content
    .split("\n")
    .map((line) => /^(#{2,3})\s+(.+)$/.exec(line))
    .filter(Boolean)
    .map((match) => {
      const depth = match![1].length;
      const title = match![2].trim();
      const base = slugify(title);
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      return {
        depth,
        title,
        id: count === 0 ? base : `${base}-${count + 1}`
      };
    });
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

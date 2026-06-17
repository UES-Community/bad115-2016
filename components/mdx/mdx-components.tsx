import { SQLSandbox } from "@/components/sandbox/sql-sandbox";
import { slugify } from "@/lib/content";

function Heading({ level, children }: { level: 2 | 3; children: React.ReactNode }) {
  const text = String(children);
  const id = slugify(text);
  const Tag = `h${level}` as "h2" | "h3";
  return <Tag id={id}>{children}</Tag>;
}

export const mdxComponents = {
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={2}>{props.children}</Heading>,
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => <Heading level={3}>{props.children}</Heading>,
  Callout: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <aside className="callout">
      <strong>{title}</strong>
      <div>{children}</div>
    </aside>
  ),
  ExerciseBlock: ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="exercise">
      <strong>{title}</strong>
      <div>{children}</div>
    </section>
  ),
  SQLSandbox
};

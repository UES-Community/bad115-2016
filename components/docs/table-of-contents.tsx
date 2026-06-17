import type { getHeadings } from "@/lib/content";

type Heading = ReturnType<typeof getHeadings>[number];

export function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null;

  return (
    <nav className="toc" aria-label="Tabla de contenido">
      <strong>Indice</strong>
      {headings.map((heading) => (
        <a className={`depth-${heading.depth}`} href={`#${heading.id}`} key={heading.id}>
          {heading.title}
        </a>
      ))}
    </nav>
  );
}

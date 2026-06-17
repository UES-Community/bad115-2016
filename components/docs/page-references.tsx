import Link from "next/link";
import type { Reference } from "@/lib/references";

export function PageReferences({ references }: { references: Reference[] }) {
  if (references.length === 0) return null;

  return (
    <section className="references" aria-labelledby="referencias-de-pagina">
      <h2 id="referencias-de-pagina">Referencias utilizadas</h2>
      {references.map((reference) => (
        <p key={reference.id}>
          <Link href={`/referencias#${reference.id}`}>
            <strong>{reference.author}</strong>. {reference.title}. {reference.year}.
          </Link>
        </p>
      ))}
    </section>
  );
}

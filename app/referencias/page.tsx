import type { Metadata } from "next";
import Link from "next/link";
import { getNavigation, getTopics } from "@/lib/content";
import { getReferences } from "@/lib/references";

export const metadata: Metadata = {
  title: "Referencias",
  description: "Indice global de referencias usadas en BAD115-2016."
};

export default function ReferencesPage() {
  const references = getReferences();
  const topics = getTopics();
  const navigation = getNavigation();

  return (
    <main className="container section">
      <header className="doc-header">
        <span className="badge">Fuentes</span>
        <h1>Referencias</h1>
        <p className="lead">Indice global de libros, documentacion y recursos tecnicos citados por el sitio.</p>
      </header>
      <div className="grid">
        {references.map((reference) => {
          const backlinks = [
            ...navigation.filter((unit) => unit.references.includes(reference.id)).map((unit) => ({
              title: unit.title,
              href: `/${unit.slug}`
            })),
            ...topics.filter((topic) => topic.meta.references.includes(reference.id)).map((topic) => ({
              title: topic.meta.title,
              href: `/${topic.meta.unit}/${topic.meta.slug}`
            }))
          ];

          return (
            <article className="card" id={reference.id} key={reference.id}>
              <span className="badge">{reference.type}</span>
              <h2>{reference.title}</h2>
              <p>{reference.author}. {reference.year}. {reference.publisher ?? reference.site}</p>
              {reference.url && <p><a href={reference.url}>Abrir fuente</a></p>}
              <strong>Usada en</strong>
              {backlinks.map((link) => (
                <p key={link.href}><Link href={link.href}>{link.title}</Link></p>
              ))}
            </article>
          );
        })}
      </div>
    </main>
  );
}

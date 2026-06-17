import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs/docs-shell";
import { PageReferences } from "@/components/docs/page-references";
import { SurroundNavigation } from "@/components/docs/surround-navigation";
import { MDXRenderer } from "@/components/mdx/mdx-renderer";
import { getHeadings, getNavigation, getSurroundNavigation, getTopics, getUnit, getUnits } from "@/lib/content";
import { getReferencesByIds } from "@/lib/references";

export function generateStaticParams() {
  return getUnits().map((unit) => ({ unit: unit.meta.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string }> }): Promise<Metadata> {
  const { unit: unitSlug } = await params;
  const unit = getUnit(unitSlug);
  return {
    title: unit?.meta.title ?? "Unidad",
    description: unit?.meta.summary
  };
}

export default async function UnitPage({ params }: { params: Promise<{ unit: string }> }) {
  const { unit: unitSlug } = await params;
  const unit = getUnit(unitSlug);
  if (!unit) notFound();

  const topics = getTopics(unit.meta.slug);
  const headings = getHeadings(unit.content);
  const references = getReferencesByIds(unit.meta.references);
  const surround = getSurroundNavigation(`/${unit.meta.slug}`);

  return (
    <DocsShell navigation={getNavigation()} headings={headings}>
      <header className="doc-header">
        <span className="badge">Unidad {unit.meta.order}</span>
        <h1>{unit.meta.title}</h1>
        <p className="lead">{unit.meta.summary}</p>
      </header>
      <MDXRenderer source={unit.content} />
      <section className="references">
        <h2>Temas</h2>
        {topics.length > 0 ? topics.map((topic) => (
          <p key={topic.meta.slug}>
            <Link href={`/${unit.meta.slug}/${topic.meta.slug}`}>
              <strong>{topic.meta.title}</strong> · {topic.meta.summary}
            </Link>
          </p>
        )) : <p>Esta unidad todavia no tiene temas publicados.</p>}
      </section>
      <PageReferences references={references} />
      <SurroundNavigation previous={surround.previous} next={surround.next} />
    </DocsShell>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DocsShell } from "@/components/docs/docs-shell";
import { PageReferences } from "@/components/docs/page-references";
import { SurroundNavigation } from "@/components/docs/surround-navigation";
import { MDXRenderer } from "@/components/mdx/mdx-renderer";
import { getHeadings, getNavigation, getSurroundNavigation, getTopic, getTopics, getUnits } from "@/lib/content";
import { getReferencesByIds } from "@/lib/references";

export function generateStaticParams() {
  return getUnits().flatMap((unit) =>
    getTopics(unit.meta.slug).map((topic) => ({
      unit: unit.meta.slug,
      topic: topic.meta.slug
    }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ unit: string; topic: string }> }): Promise<Metadata> {
  const { unit, topic: topicSlug } = await params;
  const topic = getTopic(unit, topicSlug);
  return {
    title: topic?.meta.title ?? "Tema",
    description: topic?.meta.summary
  };
}

export default async function TopicPage({ params }: { params: Promise<{ unit: string; topic: string }> }) {
  const { unit, topic: topicSlug } = await params;
  const topic = getTopic(unit, topicSlug);
  if (!topic) notFound();

  const headings = getHeadings(topic.content);
  const references = getReferencesByIds(topic.meta.references);
  const surround = getSurroundNavigation(`/${topic.meta.unit}/${topic.meta.slug}`);

  return (
    <DocsShell navigation={getNavigation()} headings={headings}>
      <header className="doc-header">
        <span className="badge">Tema</span>
        <h1>{topic.meta.title}</h1>
        <p className="lead">{topic.meta.summary}</p>
      </header>
      <MDXRenderer source={topic.content} />
      <PageReferences references={references} />
      <SurroundNavigation previous={surround.previous} next={surround.next} />
    </DocsShell>
  );
}

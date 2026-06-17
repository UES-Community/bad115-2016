import { DocsSidebar } from "@/components/docs/docs-sidebar";
import { TableOfContents } from "@/components/docs/table-of-contents";
import type { getHeadings, getNavigation } from "@/lib/content";

type Navigation = ReturnType<typeof getNavigation>;
type Headings = ReturnType<typeof getHeadings>;

export function DocsShell({
  children,
  navigation,
  headings
}: {
  children: React.ReactNode;
  navigation: Navigation;
  headings: Headings;
}) {
  return (
    <main className="container doc-shell">
      <DocsSidebar navigation={navigation} />
      <article className="doc-content">{children}</article>
      <TableOfContents headings={headings} />
    </main>
  );
}

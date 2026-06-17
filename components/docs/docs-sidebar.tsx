"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { getNavigation } from "@/lib/content";

type Navigation = ReturnType<typeof getNavigation>;

export function DocsSidebar({ navigation }: { navigation: Navigation }) {
  const pathname = usePathname().replace(/\/$/, "");

  return (
    <aside className="docs-sidebar" aria-label="Documentacion">
      {navigation.map((unit) => {
        const unitHref = `/${unit.slug}`;
        return (
          <div className="sidebar-unit" key={unit.slug}>
            <Link className={pathname === unitHref ? "is-active" : ""} href={unitHref}>
              {unit.title}
            </Link>
            {unit.topics.map((topic) => {
              const topicHref = `/${unit.slug}/${topic.slug}`;
              return (
                <Link
                  className={`sidebar-topic ${pathname === topicHref ? "is-active" : ""}`}
                  href={topicHref}
                  key={topic.slug}
                >
                  {topic.title}
                </Link>
              );
            })}
          </div>
        );
      })}
    </aside>
  );
}

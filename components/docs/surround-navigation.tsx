import Link from "next/link";

type PageLink = {
  title: string;
  href: string;
} | null;

export function SurroundNavigation({ previous, next }: { previous: PageLink; next: PageLink }) {
  return (
    <nav className="surround" aria-label="Navegacion relacionada">
      {previous ? (
        <Link href={previous.href}>
          <small>Anterior</small>
          <br />
          <strong>{previous.title}</strong>
        </Link>
      ) : <span />}
      {next ? (
        <Link href={next.href}>
          <small>Siguiente</small>
          <br />
          <strong>{next.title}</strong>
        </Link>
      ) : <span />}
    </nav>
  );
}

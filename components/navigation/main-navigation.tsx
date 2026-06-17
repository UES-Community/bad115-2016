import Link from "next/link";

export function MainNavigation() {
  return (
    <header className="container top-nav">
      <Link className="brand" href="/">BAD115-2016</Link>
      <nav className="nav-links" aria-label="Principal">
        <Link href="/modelo-relacional">Unidades</Link>
        <Link href="/referencias">Referencias</Link>
        <Link href="/terms-and-conditions">Terminos</Link>
        <Link className="pill-link primary-action" href="/modelo-relacional/algebra-relacional">Empezar</Link>
      </nav>
    </header>
  );
}

import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>BAD115-2016 · Base de Datos</span>
        <nav className="footer-links" aria-label="Pie de pagina">
          <Link href="/referencias">Referencias</Link>
          <Link href="/cookies-policy">Cookies</Link>
          <Link href="/terms-and-conditions">Terminos</Link>
        </nav>
      </div>
    </footer>
  );
}

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminos y condiciones",
  description: "Terminos de uso de BAD115-2016."
};

export default function TermsPage() {
  return (
    <main className="container section">
      <article className="doc-content">
        <header className="doc-header">
          <span className="badge">Legal</span>
          <h1>Terminos y condiciones</h1>
          <p className="lead">Ultima actualizacion: 17 de junio de 2026.</p>
        </header>
        <div className="prose">
          <h2>Uso permitido</h2>
          <p>El contenido se ofrece con fines academicos y puede usarse como material de estudio y referencia.</p>
          <h2>Responsabilidad academica</h2>
          <p>Los ejemplos son demostrativos. Deben revisarse y adaptarse antes de usarse en evaluaciones o sistemas reales.</p>
          <h2>Disponibilidad</h2>
          <p>El sitio se publica como exportacion estatica y puede cambiar mientras el proyecto evoluciona.</p>
        </div>
      </article>
    </main>
  );
}

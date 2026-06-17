import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politica de cookies",
  description: "Politica de cookies de BAD115-2016."
};

export default function CookiesPolicyPage() {
  return (
    <main className="container section">
      <article className="doc-content">
        <header className="doc-header">
          <span className="badge">Legal</span>
          <h1>Politica de cookies</h1>
          <p className="lead">Ultima actualizacion: 17 de junio de 2026.</p>
        </header>
        <div className="prose">
          <h2>Uso actual</h2>
          <p>Esta version inicial no utiliza cookies propias para autenticacion, seguimiento ni personalizacion.</p>
          <h2>Servicios de terceros</h2>
          <p>Si en el futuro se agregan analiticas o servicios externos, esta pagina indicara su finalidad y forma de gestion.</p>
          <h2>Gestion</h2>
          <p>El usuario puede administrar cookies desde la configuracion de su navegador.</p>
        </div>
      </article>
    </main>
  );
}

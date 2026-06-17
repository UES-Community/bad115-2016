import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container section">
      <div className="dark-panel">
        <span className="badge">404</span>
        <h1>Pagina no encontrada</h1>
        <p>La ruta no existe o el contenido todavia no ha sido publicado.</p>
        <Link className="pill-link primary-action" href="/">Volver al inicio</Link>
      </div>
    </main>
  );
}

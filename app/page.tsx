import Link from "next/link";
import { getNavigation, getTopics } from "@/lib/content";

export default function HomePage() {
  const navigation = getNavigation();
  const featured = getTopics().slice(0, 3);

  return (
    <main>
      <section className="container hero">
        <div>
          <span className="eyebrow">Base de Datos · documentacion educativa</span>
          <h1>BAD115-2016 para aprender <span>datos</span> con ejemplos claros.</h1>
        </div>
        <div className="hero-panel">
          <p className="lead">
            Un sitio estatico con unidades, temas MDX, referencias academicas, navegacion contextual y practicas SQL en navegador.
          </p>
          <Link className="pill-link primary-action" href={`/${navigation[0]?.slug ?? "modelo-relacional"}`}>
            Explorar unidades
          </Link>
        </div>
      </section>

      <section className="container section">
        <h2>Objetivos de aprendizaje</h2>
        <div className="grid">
          {["Modelar informacion relacional", "Consultar datos con SQL", "Normalizar esquemas iniciales"].map((goal) => (
            <div className="card" key={goal}>
              <span className="badge">Objetivo</span>
              <h3>{goal}</h3>
              <p className="lead">Contenido de ejemplo preparado para crecer con materiales reales del curso.</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container section">
        <h2>Unidades</h2>
        <div className="grid">
          {navigation.map((unit) => (
            <Link className="muted-card" href={`/${unit.slug}`} key={unit.slug}>
              <span className="badge">Unidad {unit.order}</span>
              <h3>{unit.title}</h3>
              <p>{unit.summary}</p>
              <small>{unit.topics.length} tema(s)</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="container section dark-panel">
        <h2>Temas destacados</h2>
        <div className="grid">
          {featured.map((topic) => (
            <Link href={`/${topic.meta.unit}/${topic.meta.slug}`} key={topic.meta.slug}>
              <span className="badge">Tema</span>
              <h3>{topic.meta.title}</h3>
              <p>{topic.meta.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

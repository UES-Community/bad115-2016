"use client";

import { useMemo, useState } from "react";
import initSqlJs, { type Database } from "sql.js";

const datasets: Record<string, { setup: string; query: string; examples: string[] }> = {
  biblioteca: {
    setup: `
CREATE TABLE libros (id INTEGER PRIMARY KEY, titulo TEXT, autor TEXT, anio INTEGER);
CREATE INDEX idx_libros_anio ON libros(anio);
INSERT INTO libros (titulo, autor, anio) VALUES
  ('Database System Concepts', 'Silberschatz', 2019),
  ('Fundamentals of Database Systems', 'Elmasri', 2016),
  ('SQLite Guide', 'SQLite', 2024);
`,
    query: "SELECT titulo, autor, anio FROM libros WHERE anio >= 2019;",
    examples: [
      "SELECT * FROM libros;",
      "SELECT autor, COUNT(*) AS total FROM libros GROUP BY autor;",
      "EXPLAIN QUERY PLAN SELECT titulo FROM libros WHERE anio >= 2019;"
    ]
  },
  universidad: {
    setup: `
CREATE TABLE estudiantes (id INTEGER PRIMARY KEY, nombre TEXT, ciudad TEXT, edad INTEGER);
CREATE TABLE cursos (id INTEGER PRIMARY KEY, nombre TEXT, creditos INTEGER);
CREATE TABLE inscripciones (estudiante_id INTEGER, curso_id INTEGER,
  PRIMARY KEY (estudiante_id, curso_id),
  FOREIGN KEY (estudiante_id) REFERENCES estudiantes(id),
  FOREIGN KEY (curso_id) REFERENCES cursos(id));
INSERT INTO estudiantes (nombre, ciudad, edad) VALUES
  ('Ana', 'San Salvador', 22),
  ('Luis', 'Santa Ana', 24),
  ('Marta', 'San Salvador', 21);
INSERT INTO cursos (nombre, creditos) VALUES
  ('Bases de Datos', 4),
  ('Algebra Relacional', 3);
INSERT INTO inscripciones VALUES (1, 1), (1, 2), (2, 1);
`,
    query: "SELECT e.nombre, c.nombre AS curso FROM estudiantes e INNER JOIN inscripciones i ON e.id = i.estudiante_id INNER JOIN cursos c ON c.id = i.curso_id;",
    examples: [
      "SELECT * FROM estudiantes WHERE edad > 21;",
      "SELECT ciudad, COUNT(*) AS total FROM estudiantes GROUP BY ciudad;",
      "SELECT nombre FROM estudiantes WHERE id NOT IN (SELECT estudiante_id FROM inscripciones WHERE curso_id = 2);"
    ]
  },
  empleados: {
    setup: `
CREATE TABLE departamentos (id INTEGER PRIMARY KEY, nombre TEXT NOT NULL UNIQUE);
CREATE TABLE empleados (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  salario REAL CHECK (salario > 0),
  departamento_id INTEGER NOT NULL,
  FOREIGN KEY (departamento_id) REFERENCES departamentos(id)
);
INSERT INTO departamentos (nombre) VALUES ('TI'), ('Finanzas');
INSERT INTO empleados (nombre, salario, departamento_id) VALUES
  ('Carla', 1200, 1),
  ('Pedro', 1500, 2),
  ('Sofia', 1100, 1);
`,
    query: "SELECT e.nombre, d.nombre AS departamento FROM empleados e JOIN departamentos d ON e.departamento_id = d.id;",
    examples: [
      "INSERT INTO empleados (nombre, salario, departamento_id) VALUES ('Nuevo', 900, 1);",
      "UPDATE empleados SET salario = salario * 1.1 WHERE departamento_id = 1; SELECT * FROM empleados;",
      "DELETE FROM empleados WHERE nombre = 'Pedro';"
    ]
  }
};

async function createDatabase(setup: string): Promise<Database> {
  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`
  });
  const db = new SQL.Database();
  db.run(setup);
  return db;
}

export function SQLSandbox({ dataset = "biblioteca" }: { dataset?: string }) {
  const config = datasets[dataset] ?? datasets.biblioteca;
  const [query, setQuery] = useState(config.query);
  const [rows, setRows] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [message, setMessage] = useState("Listo para ejecutar consultas en SQLite.");
  const schema = useMemo(() => config.setup.trim(), [config.setup]);

  async function run(currentQuery = query) {
    try {
      const db = await createDatabase(config.setup);
      const results = db.exec(currentQuery);
      const last = results.at(-1);
      setColumns(last?.columns ?? []);
      setRows(last ? last.values.map((values) => Object.fromEntries(last.columns.map((column, index) => [column, values[index]]))) : []);
      setMessage(last ? `${last.values.length} fila(s) devueltas.` : "Consulta ejecutada sin filas de resultado.");
      db.close();
    } catch (error) {
      setColumns([]);
      setRows([]);
      setMessage(error instanceof Error ? error.message : "No se pudo ejecutar la consulta.");
    }
  }

  return (
    <section className="sandbox" aria-label="Sandbox SQL">
      <h2>Sandbox SQL</h2>
      <p>Ejecuta consultas en una base SQLite local del navegador. Los datos se reinician en cada ejecucion.</p>
      <textarea value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Editor SQL" />
      <div className="sandbox-toolbar">
        <button type="button" onClick={() => run()}>Ejecutar</button>
        <button type="button" onClick={() => setQuery(config.query)}>Resetear consulta</button>
        <button type="button" onClick={() => navigator.clipboard.writeText(query)}>Copiar</button>
      </div>
      <details>
        <summary>Ejemplos</summary>
        <div className="sandbox-toolbar">
          {config.examples.map((example) => (
            <button type="button" key={example} onClick={() => setQuery(example)}>
              Cargar ejemplo
            </button>
          ))}
        </div>
      </details>
      <details>
        <summary>Esquema inicial</summary>
        <pre>{schema}</pre>
      </details>
      <p role="status">{message}</p>
      {columns.length > 0 && (
        <div className="scroll-table">
          <table>
            <thead>
              <tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((column) => <td key={column}>{String(row[column] ?? "")}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

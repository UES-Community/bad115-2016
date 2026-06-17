"use client";

import { useMemo, useState } from "react";
import initSqlJs, { type Database } from "sql.js";

const datasets: Record<string, { setup: string; query: string; examples: string[] }> = {
  biblioteca: {
    setup: `
CREATE TABLE libros (id INTEGER PRIMARY KEY, titulo TEXT, autor TEXT, anio INTEGER);
INSERT INTO libros (titulo, autor, anio) VALUES
  ('Database System Concepts', 'Silberschatz', 2019),
  ('Fundamentals of Database Systems', 'Elmasri', 2016),
  ('SQLite Guide', 'SQLite', 2024);
`,
    query: "SELECT titulo, autor, anio FROM libros WHERE anio >= 2019;",
    examples: [
      "SELECT * FROM libros;",
      "SELECT autor, COUNT(*) AS total FROM libros GROUP BY autor;",
      "INSERT INTO libros (titulo, autor, anio) VALUES ('Ejemplo BAD115', 'Equipo', 2026); SELECT * FROM libros;"
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

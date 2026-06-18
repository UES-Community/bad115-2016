import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd());
const DOCS_DIR = path.join(ROOT, "docs");
const CONTENT_DIR = path.join(ROOT, "content", "units");
const PUBLIC_CONTENT = path.join(ROOT, "public", "content");
const REFERENCES_PATH = path.join(ROOT, "content", "references.json");

type UnitConfig = {
  order: number;
  slug: string;
  docFile: string;
  title: string;
  summary: string;
  learningOutcomes: string[];
  topicSlugs: string[];
};

const UNITS: UnitConfig[] = [
  {
    order: 1,
    slug: "modelo-relacional",
    docFile: "Unidad I - Modelo y Álgebra Relacional.md",
    title: "Modelo y álgebra relacional",
    summary: "Fundamentos del modelo relacional, álgebra, DML y optimización de consultas.",
    learningOutcomes: [
      "Identificar dominios, atributos, tuplas y restricciones de integridad.",
      "Aplicar operadores del álgebra relacional y su equivalencia con SQL.",
      "Describir operaciones DML y estrategias de optimización de consultas."
    ],
    topicSlugs: [
      "fundamentos-modelo-relacional",
      "algebra-relacional",
      "operaciones-algebraicas",
      "dml-manipulacion",
      "optimizacion-consultas"
    ]
  },
  {
    order: 2,
    slug: "sql-avanzado",
    docFile: "Unidad II - Investigación Integral de SQL.md",
    title: "SQL avanzado",
    summary: "Del álgebra relacional a SQL: procesamiento lógico, DML, DDL y objetos de servidor.",
    learningOutcomes: [
      "Traducir operaciones algebraicas a sentencias SQL.",
      "Explicar el orden lógico de procesamiento de una consulta.",
      "Diseñar vistas, funciones, procedimientos y paquetes almacenados."
    ],
    topicSlugs: [
      "algebra-a-sql",
      "procesamiento-logico-sql",
      "operaciones-bd",
      "ldd",
      "vistas-rutinas-paquetes"
    ]
  },
  {
    order: 3,
    slug: "integridad-seguridad",
    docFile: "Unidad III - Integridad y Seguridad de Datos.md",
    title: "Integridad y seguridad",
    summary: "Restricciones, integridad referencial, triggers, autorización y seguridad avanzada.",
    learningOutcomes: [
      "Clasificar restricciones de integridad y su implementación en SQL.",
      "Diferenciar políticas referenciales y el uso de triggers.",
      "Evaluar mecanismos de seguridad como RLS y VPD."
    ],
    topicSlugs: [
      "fundamentos-integridad",
      "restricciones-integridad",
      "integridad-referencial",
      "triggers",
      "seguridad-dcl",
      "rls-vpd"
    ]
  },
  {
    order: 4,
    slug: "indexacion-sql",
    docFile: "Unidad IV - Investigación Sobre Indexación SQL.md",
    title: "Indexación SQL",
    summary: "Estructuras de índices, organización física, DDL y estrategias de optimización.",
    learningOutcomes: [
      "Comparar estructuras B-Tree, hash y extensiones avanzadas.",
      "Definir índices en SQL y analizar planes de ejecución.",
      "Aplicar reglas de diseño como prefijo izquierdo y covering indexes."
    ],
    topicSlugs: [
      "intro-indexacion",
      "fundamentos-indexacion",
      "estructuras-indices",
      "organizacion-fisica",
      "ddl-indices-sql",
      "diseno-optimizador",
      "mantenimiento-indices"
    ]
  },
  {
    order: 5,
    slug: "xml-datos",
    docFile: "Unidad V - Research Report.md",
    title: "Datos XML",
    summary: "Manipulación, consulta y transformación de documentos XML con XPath, XQuery y XSLT.",
    learningOutcomes: [
      "Contrastar modelos DOM, SAX y StAX para procesar XML.",
      "Formular consultas con XPath y XQuery.",
      "Aplicar transformaciones con XSLT."
    ],
    topicSlugs: ["manipulacion-xml", "xpath-xquery-xslt", "conclusiones-xml"]
  },
  {
    order: 6,
    slug: "inteligencia-negocios",
    docFile: "Unidad VI - Investigación Inteligencia de Negocios.md",
    title: "Inteligencia de negocios",
    summary: "Almacenes de datos, modelos analíticos, vistas materializadas y minería de datos.",
    learningOutcomes: [
      "Diferenciar OLTP y OLAP y los enfoques Inmon vs Kimball.",
      "Modelar esquemas en estrella y copo de nieve.",
      "Describir procesos KDD, SEMMA y CRISP-DM."
    ],
    topicSlugs: [
      "almacenes-datos",
      "modelos-analiticos",
      "vistas-materializadas",
      "mineria-datos",
      "conclusion-bi"
    ]
  }
];

const CANONICAL_REFS = ["silberschatz-2019", "elmasri-2016", "sqlite-docs"];

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function cleanHeader(line: string) {
  return line
    .replace(/^#{1,6}\s+/, "")
    .replace(/^\*\*(.+)\*\*$/, "$1")
    .replace(/\\([._])/g, "$1")
    .replace(/^\d+(\.\d+)?\.?\s*/, "")
    .trim();
}

function removeInlineCitations(text: string) {
  return text.replace(/(?<=[\p{L}\)])(\d{1,2})(?=\s|$|[.,;:])/gu, "");
}

function extractImages(content: string, unitSlug: string) {
  const imageDir = path.join(PUBLIC_CONTENT, unitSlug);
  fs.mkdirSync(imageDir, { recursive: true });

  const imageMap = new Map<string, string>();
  const pattern = /^\[(image\d+)\]:\s*<data:image\/[^;]+;base64,([^>]+)>/gm;
  let cleaned = content;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content)) !== null) {
    const [, ref, base64] = match;
    const fileName = `${ref}.png`;
    const filePath = path.join(imageDir, fileName);
    fs.writeFileSync(filePath, Buffer.from(base64, "base64"));
    imageMap.set(ref, `/content/${unitSlug}/${fileName}`);
  }

  cleaned = cleaned.replace(pattern, "").trimEnd();
  return { cleaned, imageMap };
}

function replaceImageRefs(content: string, imageMap: Map<string, string>) {
  return content.replace(/!\[\]\[(image\d+)\]/g, (_, ref) => {
    const src = imageMap.get(ref);
    return src ? `![Notación algebraica](${src})` : "";
  });
}

type ParsedReference = {
  id: string;
  type: string;
  author: string;
  title: string;
  year: string;
  url: string;
};

function parseBibliography(section: string, unitOrder: number): ParsedReference[] {
  const refs: ParsedReference[] = [];
  const lines = section.split("\n").filter((line) => /^\d+\.\s+/.test(line.trim()));

  for (const line of lines) {
    const numMatch = line.match(/^(\d+)\.\s+(.+)/);
    if (!numMatch) continue;
    const num = numMatch[1].padStart(2, "0");
    const rest = numMatch[2];
    const urlMatch = rest.match(/\[(https?:\/\/[^\]]+)\]/);
    const url = urlMatch?.[1] ?? "";
    const beforeUrl = rest.replace(/,?\s*\[https?:\/\/[^\]]+\].*$/, "").trim();
    const parts = beforeUrl.split(" - ");
    const title = (parts[0] ?? beforeUrl).replace(/\\/g, "").trim();
    const author = parts.length > 1 ? parts[parts.length - 1].trim() : new URL(url || "https://example.com").hostname;

    refs.push({
      id: `unidad-${unitOrder}-ref-${num}`,
      type: "article",
      author,
      title,
      year: "2024",
      url
    });
  }

  return refs;
}

function stripBibliography(content: string) {
  const marker = /####\s+\*?\*?Obras citadas\*?\*?/i;
  const idx = content.search(marker);
  if (idx === -1) return { body: content, bibliography: "" };
  return {
    body: content.slice(0, idx).trimEnd(),
    bibliography: content.slice(idx)
  };
}

function cleanBody(content: string) {
  let body = content;
  body = body.replace(/^#+\s+\*\*.+\*\*\s*$/m, "").trimStart();
  body = body.replace(/^(#{1,6})\s+\*\*(.+)\*\*\s*$/gm, (_, hashes, title) => {
    return `${hashes} ${cleanHeader(title)}`;
  });
  body = body.replace(/\\([._*[\]()#+\-])/g, "$1");
  body = removeInlineCitations(body);
  body = body.replace(/(!\[[^\]]*\]\([^)]+\))\d+/g, "$1");
  return body.trim();
}

function firstSentence(text: string, maxLen = 140) {
  const plain = text.replace(/\s+/g, " ").trim();
  const match = plain.match(/^(.+?[.!?])(\s|$)/);
  const sentence = match?.[1] ?? plain.slice(0, maxLen);
  return sentence.length > maxLen ? `${sentence.slice(0, maxLen - 1)}…` : sentence;
}

function splitTopics(content: string) {
  const lines = content.split("\n");
  const topics: { title: string; body: string }[] = [];
  const intro: string[] = [];
  let currentTitle = "";
  let currentBody: string[] = [];
  let seenH2 = false;

  for (const line of lines) {
    const h2Match = line.match(/^##\s+\*\*(.+)\*\*\s*$/);
    if (h2Match) {
      if (seenH2 && currentTitle) {
        topics.push({ title: currentTitle, body: currentBody.join("\n") });
        currentBody = [];
      }
      seenH2 = true;
      currentTitle = cleanHeader(h2Match[0]);
      continue;
    }

    if (!seenH2) {
      if (!line.match(/^#\s+\*\*/)) intro.push(line);
    } else {
      currentBody.push(line);
    }
  }

  if (seenH2 && currentTitle) {
    topics.push({ title: currentTitle, body: currentBody.join("\n") });
  }

  return {
    intro: intro.join("\n").trim(),
    topics
  };
}

function yamlString(value: string) {
  if (/[:#\n'"]/.test(value)) return JSON.stringify(value);
  return value;
}

function writeMdx(filePath: string, frontmatter: Record<string, unknown>, body: string) {
  const lines = ["---"];
  for (const [key, value] of Object.entries(frontmatter)) {
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - ${item}`);
    } else if (typeof value === "object" && value !== null) {
      lines.push(`${key}:`);
      for (const [k, v] of Object.entries(value)) lines.push(`  ${k}: ${v}`);
    } else {
      lines.push(`${key}: ${yamlString(String(value))}`);
    }
  }
  lines.push("---", "", body, "");
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, lines.join("\n"), "utf8");
}

function migrateUnit(config: UnitConfig) {
  const docPath = path.join(DOCS_DIR, config.docFile);
  if (!fs.existsSync(docPath)) {
    throw new Error(`Missing doc file: ${docPath}`);
  }

  const raw = fs.readFileSync(docPath, "utf8");
  const { cleaned: withoutImages, imageMap } = extractImages(raw, config.slug);
  const { body: withoutBib, bibliography } = stripBibliography(withoutImages);
  const unitRefs = parseBibliography(bibliography, config.order).slice(0, 8);
  const unitRefIds = unitRefs.map((r) => r.id);

  const { intro, topics } = splitTopics(withoutBib);

  if (topics.length !== config.topicSlugs.length) {
    console.warn(
      `  Warning: ${config.slug} expected ${config.topicSlugs.length} topics, found ${topics.length}`
    );
  }

  const unitDir = path.join(CONTENT_DIR, config.slug);
  fs.mkdirSync(unitDir, { recursive: true });

  const indexBody = [
    "## Panorama",
    "",
    firstSentence(intro.replace(/^#.*\n/m, ""), 500) || config.summary,
    "",
    "## Resultados de aprendizaje",
    "",
    ...config.learningOutcomes.map((o) => `- ${o}`),
    "",
    "## Temas de la unidad",
    "",
    `Esta unidad desarrolla ${topics.length} temas sobre ${config.title.toLowerCase()}.`
  ].join("\n");

  writeMdx(path.join(unitDir, "index.mdx"), {
    title: config.title,
    slug: config.slug,
    summary: config.summary,
    order: config.order,
    references: [...CANONICAL_REFS, ...unitRefIds.slice(0, 3)]
  }, indexBody);

  topics.forEach((topic, index) => {
    const slug = config.topicSlugs[index] ?? slugify(topic.title);
    let body = cleanBody(topic.body);
    body = replaceImageRefs(body, imageMap);
    body = stripBibliography(body).body;

    writeMdx(path.join(unitDir, `${slug}.mdx`), {
      title: topic.title,
      slug,
      unit: config.slug,
      summary: firstSentence(body),
      order: index + 1,
      references: [...CANONICAL_REFS, ...(unitRefIds[index] ? [unitRefIds[index]] : [])]
    }, body);
  });

  return unitRefs;
}

function mergeReferences(newRefs: ParsedReference[]) {
  const existing = JSON.parse(fs.readFileSync(REFERENCES_PATH, "utf8")) as ParsedReference[];
  const byId = new Map(existing.map((r) => [r.id, r]));
  for (const ref of newRefs) {
    if (!byId.has(ref.id)) byId.set(ref.id, ref);
  }
  const merged = [...byId.values()].sort((a, b) => a.id.localeCompare(b.id));
  fs.writeFileSync(REFERENCES_PATH, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
}

function main() {
  console.log("Migrating docs → content/units/\n");
  const allRefs: ParsedReference[] = [];

  for (const unit of UNITS) {
    console.log(`→ ${unit.title} (${unit.slug})`);
    const refs = migrateUnit(unit);
    allRefs.push(...refs);
  }

  mergeReferences(allRefs);
  console.log(`\nDone. ${allRefs.length} unit references merged into references.json`);
}

main();

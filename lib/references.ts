import references from "@/content/references.json";

export type Reference = {
  id: string;
  type: string;
  author: string;
  title: string;
  year: string;
  publisher?: string;
  site?: string;
  url?: string;
  accessed?: string;
};

export function getReferences() {
  return references as Reference[];
}

export function getReferencesByIds(ids: string[] = []) {
  const all = getReferences();
  return ids.map((id) => {
    const match = all.find((reference) => reference.id === id);
    if (!match) {
      throw new Error(`Reference "${id}" is declared in content but missing from content/references.json`);
    }
    return match;
  });
}

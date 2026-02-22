export type Locale = "en" | "hi" | "ml";

/**
 * Resolve a translatable field from a document by language.
 * doc.title -> doc; field "title" -> for "hi" use titleHi, for "ml" use titleMl, else title.
 */
export function resolveField<T extends Record<string, unknown>>(
  doc: T | null | undefined,
  field: string,
  lang: Locale
): string | undefined {
  if (!doc) return undefined;
  if (lang === "hi") {
    const hi = doc[`${field}Hi` as keyof T];
    if (hi != null && String(hi).trim() !== "") return String(hi);
  }
  if (lang === "ml") {
    const ml = doc[`${field}Ml` as keyof T];
    if (ml != null && String(ml).trim() !== "") return String(ml);
  }
  const en = doc[field as keyof T];
  return en != null ? String(en) : undefined;
}

/**
 * Resolve multiple fields and return an object with the same keys but resolved values.
 */
export function resolveFields<T extends Record<string, unknown>>(
  doc: T | null | undefined,
  fields: string[],
  lang: Locale
): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const field of fields) {
    out[field] = resolveField(doc, field, lang);
  }
  return out;
}

/**
 * Get lang from request: query param ?lang= or cookie NEXT_LANG. Default "en".
 */
export function getLangFromRequest(request: Request): Locale {
  const url = new URL(request.url);
  const q = url.searchParams.get("lang");
  if (q === "hi" || q === "ml") return q;
  if (q === "en") return "en";
  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/\bNEXT_LANG=([^;]+)/);
  if (match) {
    const v = decodeURIComponent(match[1]).trim().toLowerCase();
    if (v === "hi" || v === "ml" || v === "en") return v;
  }
  return "en";
}

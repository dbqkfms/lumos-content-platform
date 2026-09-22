/** Preserve editorial text. These helpers never select a collection or grant rights. */
export function firstText(...values: unknown[]): string {
  return values.find((value): value is string => typeof value === "string" && value.trim().length > 0) ?? "";
}
export function editorialTags(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.every(tag => typeof tag === "string") ? [...value] : fallback;
}

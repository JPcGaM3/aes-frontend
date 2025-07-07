/**
 * Translates an enum value using a translation map.
 *
 * @param value - The enum value to translate.
 * @param translationMap - The map containing translations for each enum value.
 * @returns The translated value, or the original value if no translation is found.
 */
export function translateEnumValue<T extends string>(
  value: T,
  translationMap: Record<string, string>
): string {
  return translationMap[value] || value;
}

/**
 * Retrieves a nested value from an object using a dot-separated path.
 *
 * @param obj - The object to retrieve the value from.
 * @param path - The dot-separated path to the desired value.
 * @returns The value at the specified path, or undefined if not found.
 */
export function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

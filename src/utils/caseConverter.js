/**
 * Converts snake_case to camelCase
 * @param {string} str - The snake_case string
 * @returns {string} The camelCase string
 */
export function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * Converts snake_case to PascalCase
 * @param {string} str - The snake_case string
 * @returns {string} The PascalCase string
 */
export function snakeToPascal(str) {
  const camel = snakeToCamel(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

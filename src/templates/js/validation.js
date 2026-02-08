/**
 * Get JavaScript validation template (empty)
 * @returns {string} Template content
 */
export function getValidationTemplate() {
  return `import { z } from "zod";
`;
}

/**
 * Get JavaScript CRUD validation template
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} pascalName - Service name in PascalCase
 * @returns {string} Template content
 */
export function getCrudValidationTemplate(name, camelName, pascalName) {
  return `import { z } from "zod";

export const create${pascalName}Schema = z.object({
    name: z.string().min(2).max(100).trim().toUpperCase()
});

export const getAll${pascalName}sSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).default(20),
    sort_by: z.enum(["name", "createdAt"]).default("createdAt"),
    sort_order: z.enum(["asc", "desc"]).default("desc"),
    search: z.string().trim().optional(), //note: search by name
});

export const get${pascalName}ByIdSchema = z.object({
    id: z.string().uuid(),
});
`;
}

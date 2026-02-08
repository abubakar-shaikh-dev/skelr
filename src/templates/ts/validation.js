/**
 * Get TypeScript validation template (empty)
 * @returns {string} Template content
 */
export function getValidationTemplateTS() {
  return `import { z } from "zod";

// Example validation schema
// export const createSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email format"),
// });

// Infer types from schemas
// export type CreateInput = z.infer<typeof createSchema>;
`;
}

/**
 * Get TypeScript CRUD validation template
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} pascalName - Service name in PascalCase
 * @returns {string} Template content
 */
export function getCrudValidationTemplateTS(name, camelName, pascalName) {
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

//Types inferred from schemas
export type Create${pascalName}Input = z.infer<typeof create${pascalName}Schema>;
export type GetAll${pascalName}sInput = z.infer<typeof getAll${pascalName}sSchema>;
export type Get${pascalName}ByIdInput = z.infer<typeof get${pascalName}ByIdSchema>;
`;
}

/**
 * Get TypeScript service template (empty)
 * @param {string} folderStructure - "current" or "modular"
 * @returns {string} Template content
 */
export function getServiceTemplateTS(folderStructure) {
  const dbImportPath =
    folderStructure === "current" ? "../config/db" : "../../config/db";
  return `import createHttpError from "http-errors";

//Configs
import db from "${dbImportPath}";

// Define your service types here
// export interface ServiceResponse<T> {
//   success: boolean;
//   data?: T;
//   message?: string;
// }
`;
}

/**
 * Get TypeScript CRUD service template
 * @param {string} folderStructure - "current" or "modular"
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} pascalName - Service name in PascalCase
 * @param {string} modelName - Prisma model name
 * @param {string} softDeleteApproach - "timestamp" or "boolean"
 * @returns {string} Template content
 */
export function getCrudServiceTemplateTS(
  folderStructure,
  name,
  camelName,
  pascalName,
  modelName,
  softDeleteApproach,
) {
  const dbImportPath =
    folderStructure === "current" ? "../config/db" : "../../config/db";
  const paginationImportPath =
    folderStructure === "current"
      ? "../utils/pagination.util"
      : "../../utils/pagination.util";

  const softDeleteCheck =
    softDeleteApproach === "timestamp" ? "deleted_at: null" : "is_deleted: false";
  const softDeleteUpdate =
    softDeleteApproach === "timestamp"
      ? "deleted_at: new Date()"
      : "is_deleted: true";

  return `import createHttpError from "http-errors";

//Configs
import db from "${dbImportPath}";

//Utils
import { paginateQuery } from "${paginationImportPath}";

//Types
export interface Create${pascalName}Data {
    name: string;
}

export interface GetAll${pascalName}sQueries {
    page: number;
    limit: number;
    sort_by: string;
    sort_order: "asc" | "desc";
    search?: string;
}

export const create = async (data: Create${pascalName}Data) => {
    //duplicate: fetch the existing ${camelName}
    const existing_${camelName} = await db.${modelName}.findFirst({
        where: {
            name: data.name,
            ${softDeleteCheck},
        },
    });

    //error: if ${camelName} with this name already exists, throw error
    if (existing_${camelName}) {
        throw createHttpError(409, "${pascalName} with this name already exists");
    }

    //create: ${camelName}
    const new_${camelName} = await db.${modelName}.create({
        data,
    });

    //return: the created ${camelName}
    return new_${camelName};
};

export const getAll = async (queries: GetAll${pascalName}sQueries) => {
    //fetch: get all ${camelName} data with pagination
    const data = await paginateQuery(db.${modelName}, {
        page: queries.page,
        limit: queries.limit,
        order_by: {
            [queries.sort_by]: queries.sort_order,
        },
        where: {
            ${softDeleteCheck},
            ...(queries.search && {
                OR: [
                    { name: { contains: queries.search } }
                ],
            }),
        },
    });

    //return: the paginated ${camelName} data
    return data;
};

export const getById = async (id: string) => {
    //fetch: get ${camelName} by id
    const data = await db.${modelName}.findUnique({
        where: {
            id,
            ${softDeleteCheck},
        },
    });

    //error: if ${camelName} not found, throw error
    if (!data) {
        throw createHttpError(404, "${pascalName} not found");
    }

    //return: the ${camelName}
    return data;
};

export const update = async (id: string, data: Create${pascalName}Data) => {
    //fetch: get ${camelName} by id
    const existing_${camelName} = await db.${modelName}.findUnique({
        where: {
            id,
            ${softDeleteCheck},
        },
    });

    //error: if ${camelName} not found, throw error
    if (!existing_${camelName}) {
        throw createHttpError(404, "${pascalName} not found");
    }

    //check: for duplicate name
    const duplicate_name = await db.${modelName}.findFirst({
        where: {
            name: data.name,
            id: {
                not: id,
            },
            ${softDeleteCheck},
        },
    });

    //error: if ${camelName} with this name already exists, throw error
    if (duplicate_name) {
        throw createHttpError(409, "${pascalName} with this name already exists");
    }

    //update: ${camelName}
    const updated_${camelName} = await db.${modelName}.update({
        where: {
            id,
        },
        data,
    });

    //return: the updated ${camelName}
    return updated_${camelName};
};

export const remove = async (id: string): Promise<void> => {
    //fetch: get ${camelName} by id
    const existing_${camelName} = await db.${modelName}.findUnique({
        where: {
            id,
        },
    });

    //error: if ${camelName} not found, throw error
    if (!existing_${camelName} || ${softDeleteApproach === "timestamp" ? `existing_${camelName}.deleted_at` : `existing_${camelName}.is_deleted`}) {
        throw createHttpError(404, "${pascalName} not found");
    }

    //delete: ${camelName}
    await db.${modelName}.update({
        where: {
            id,
        },
        data: {
            ${softDeleteUpdate},
        },
    });
};
`;
}

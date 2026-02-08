/**
 * Get JavaScript service template (empty)
 * @param {string} folderStructure - "current" or "modular"
 * @returns {string} Template content
 */
export function getServiceTemplate(folderStructure) {
  const dbImportPath =
    folderStructure === "current" ? "../config/db.js" : "../../config/db.js";
  return `import createHttpError from "http-errors";

//Configs
import db from "${dbImportPath}";
`;
}

/**
 * Get JavaScript CRUD service template
 * @param {string} folderStructure - "current" or "modular"
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} pascalName - Service name in PascalCase
 * @param {string} modelName - Prisma model name
 * @param {string} softDeleteApproach - "timestamp" or "boolean"
 * @returns {string} Template content
 */
export function getCrudServiceTemplate(
  folderStructure,
  name,
  camelName,
  pascalName,
  modelName,
  softDeleteApproach,
) {
  const dbImportPath =
    folderStructure === "current" ? "../config/db.js" : "../../config/db.js";
  const paginationImportPath =
    folderStructure === "current"
      ? "../utils/pagination.util.js"
      : "../../utils/pagination.util.js";

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

export const create = async (data) => {
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

export const getAll = async (queries) => {
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

export const getById = async (id) => {
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

export const update = async (id, data) => {
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

export const remove = async (id) => {
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

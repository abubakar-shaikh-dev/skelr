/**
 * Get JavaScript controller template (empty)
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} folderStructure - "current" or "modular"
 * @returns {string} Template content
 */
export function getControllerTemplate(name, camelName, folderStructure) {
  const serviceImportPath =
    folderStructure === "current"
      ? `../services/${name}.service.js`
      : `./${name}.service.js`;
  const validationImportPath =
    folderStructure === "current"
      ? `../validations/${name}.validation.js`
      : `./${name}.validation.js`;

  return `//Services
import * as ${camelName}Service from "${serviceImportPath}";

//Validations 
import * as ${camelName}Validation from "${validationImportPath}";
`;
}

/**
 * Get JavaScript CRUD controller template
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} pascalName - Service name in PascalCase
 * @param {string} folderStructure - "current" or "modular"
 * @returns {string} Template content
 */
export function getCrudControllerTemplate(
  name,
  camelName,
  pascalName,
  folderStructure,
) {
  const serviceImportPath =
    folderStructure === "current"
      ? `../services/${name}.service.js`
      : `./${name}.service.js`;
  const validationImportPath =
    folderStructure === "current"
      ? `../validations/${name}.validation.js`
      : `./${name}.validation.js`;

  return `//Services
import * as ${camelName}Service from "${serviceImportPath}";

//Validations
import * as ${camelName}Validation from "${validationImportPath}";

export const create${pascalName} = async (req, res, next) => {
    try {
        //validation: parse the request body
        const valid_data = await ${camelName}Validation.create${pascalName}Schema.parseAsync(req.body);

        //service: create ${camelName}
        const data = await ${camelName}Service.create(valid_data);

        //response: return the created ${camelName}
        res.status(201).json({
            status: true,
            message: "${pascalName} created successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const getAll${pascalName}s = async (req, res, next) => {
    try {
        //validation: parse the request query
        const valid_data = await ${camelName}Validation.getAll${pascalName}sSchema.parseAsync(req.query);

        //service: get all ${camelName}s
        const data = await ${camelName}Service.getAll(valid_data);

        //response: return the list of ${camelName}s
        res.status(200).json({
            status: true,
            message: "${pascalName}s retrieved successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const get${pascalName}ById = async (req, res, next) => {
    try {
        //validation: parse the request params
        const valid_params = await ${camelName}Validation.get${pascalName}ByIdSchema.parseAsync(req.params);

        //service: get ${camelName} by id
        const data = await ${camelName}Service.getById(valid_params.id);

        //response: return the ${camelName}
        res.status(200).json({
            status: true,
            message: "${pascalName} retrieved successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const update${pascalName} = async (req, res, next) => {
    try {
        //validation: parse the request params
        const valid_params = await ${camelName}Validation.get${pascalName}ByIdSchema.parseAsync(req.params);

        //validation: parse the request body
        const valid_data = await ${camelName}Validation.create${pascalName}Schema.parseAsync(req.body);

        //service: update ${camelName}
        const data = await ${camelName}Service.update(valid_params.id, valid_data);

        //response: return the updated ${camelName}
        res.status(200).json({
            status: true,
            message: "${pascalName} updated successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const delete${pascalName} = async (req, res, next) => {
    try {
        //validation: parse the request params
        const valid_params = await ${camelName}Validation.get${pascalName}ByIdSchema.parseAsync(req.params);

        //service: delete ${camelName}
        await ${camelName}Service.remove(valid_params.id);

        //response: return success message
        res.status(200).json({
            status: true,
            message: "${pascalName} deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
`;
}

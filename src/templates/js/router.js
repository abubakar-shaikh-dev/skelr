/**
 * Get JavaScript router template (empty)
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} folderStructure - "current" or "modular"
 * @returns {string} Template content
 */
export function getRouterTemplate(name, camelName, folderStructure) {
  const controllerImportPath =
    folderStructure === "current"
      ? `../../controllers/${name}.controller.js`
      : `./${name}.controller.js`;
  const middlewareImportPath =
    folderStructure === "current"
      ? "../../middlewares/token.middleware.js"
      : "../../middlewares/token.middleware.js";
  const constantsImportPath =
    folderStructure === "current"
      ? "../../constants/user.constant.js"
      : "../../constants/user.constant.js";

  return `import express from "express";

//Controllers
import * as ${camelName}Controller from "${controllerImportPath}";

//Middlewares
import * as tokenMiddleware from "${middlewareImportPath}";

//Constants
import { ROLES } from "${constantsImportPath}";

const router = express.Router();

export default router;
`;
}

/**
 * Get JavaScript CRUD router template
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} pascalName - Service name in PascalCase
 * @param {string} folderStructure - "current" or "modular"
 * @returns {string} Template content
 */
export function getCrudRouterTemplate(
  name,
  camelName,
  pascalName,
  folderStructure,
) {
  const controllerImportPath =
    folderStructure === "current"
      ? `../../controllers/${name}.controller.js`
      : `./${name}.controller.js`;
  const middlewareImportPath =
    folderStructure === "current"
      ? "../../middlewares/token.middleware.js"
      : "../../middlewares/token.middleware.js";
  const constantsImportPath =
    folderStructure === "current"
      ? "../../constants/user.constant.js"
      : "../../constants/user.constant.js";

  return `import express from "express";

//Controllers
import * as ${camelName}Controller from "${controllerImportPath}";

//Middlewares
import * as tokenMiddleware from "${middlewareImportPath}";

//Constants
import { ROLES } from "${constantsImportPath}";

const router = express.Router();

//POST: Create ${camelName}
router.post("/", ${camelName}Controller.create${pascalName});

//GET: Get all ${camelName}s
router.get("/", ${camelName}Controller.getAll${pascalName}s);

//GET: Get ${camelName} by id
router.get("/:id", ${camelName}Controller.get${pascalName}ById);

//PUT: Update ${camelName} by id
router.put("/:id", ${camelName}Controller.update${pascalName});

//DELETE: Delete ${camelName} by id
router.delete("/:id", ${camelName}Controller.delete${pascalName});

export default router;
`;
}

/**
 * Get TypeScript router template (empty)
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} folderStructure - "current" or "modular"
 * @returns {string} Template content
 */
export function getRouterTemplateTS(name, camelName, folderStructure) {
  const controllerImportPath =
    folderStructure === "current"
      ? `../../controllers/${name}.controller`
      : `./${name}.controller`;
  const middlewareImportPath =
    folderStructure === "current"
      ? "../../middlewares/token.middleware"
      : "../../middlewares/token.middleware";
  const constantsImportPath =
    folderStructure === "current"
      ? "../../constants/user.constant"
      : "../../constants/user.constant";

  return `import express, { Router } from "express";

//Controllers
import * as ${camelName}Controller from "${controllerImportPath}";

//Middlewares
import * as tokenMiddleware from "${middlewareImportPath}";

//Constants
import { ROLES } from "${constantsImportPath}";

const router: Router = express.Router();

// Define your routes here
// router.get("/", ${camelName}Controller.getAll);
// router.post("/", ${camelName}Controller.create);

export default router;
`;
}

/**
 * Get TypeScript CRUD router template
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} pascalName - Service name in PascalCase
 * @param {string} folderStructure - "current" or "modular"
 * @returns {string} Template content
 */
export function getCrudRouterTemplateTS(
  name,
  camelName,
  pascalName,
  folderStructure,
) {
  const controllerImportPath =
    folderStructure === "current"
      ? `../../controllers/${name}.controller`
      : `./${name}.controller`;
  const middlewareImportPath =
    folderStructure === "current"
      ? "../../middlewares/token.middleware"
      : "../../middlewares/token.middleware";
  const constantsImportPath =
    folderStructure === "current"
      ? "../../constants/user.constant"
      : "../../constants/user.constant";

  return `import express, { Router } from "express";

//Controllers
import * as ${camelName}Controller from "${controllerImportPath}";

//Middlewares
import * as tokenMiddleware from "${middlewareImportPath}";

//Constants
import { ROLES } from "${constantsImportPath}";

const router: Router = express.Router();

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

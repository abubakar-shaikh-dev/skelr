import fs from "fs/promises";
import path from "path";
import { c, snakeToPascal, printSuccess, printInfo } from "../utils/index.js";
import {
  getServiceTemplate,
  getCrudServiceTemplate,
  getValidationTemplate,
  getCrudValidationTemplate,
  getControllerTemplate,
  getCrudControllerTemplate,
  getRouterTemplate,
  getCrudRouterTemplate,
  getServiceTemplateTS,
  getCrudServiceTemplateTS,
  getValidationTemplateTS,
  getCrudValidationTemplateTS,
  getControllerTemplateTS,
  getCrudControllerTemplateTS,
  getRouterTemplateTS,
  getCrudRouterTemplateTS,
} from "../templates/index.js";

/**
 * Generate service files based on configuration
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} folderStructure - "current" for separate, "modular" for modular
 * @param {string} language - "js" or "ts"
 * @param {Object|null} crudConfig - CRUD configuration
 * @returns {Promise<string[]>} Array of created file paths
 */
export async function generateFiles(
  name,
  camelName,
  folderStructure,
  language = "js",
  crudConfig = null,
) {
  const ext = language === "ts" ? ".ts" : ".js";
  const pascalName = snakeToPascal(name);

  console.log(
    c.bold.white("Step 6") +
      " " +
      c.dim("→") +
      " " +
      c.white("Generating Files"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");

  const filesCreated = [];

  if (folderStructure === "current") {
    // SEPARATE FOLDER STRUCTURE
    const servicesFolder = "src/services";
    const validationsFolder = "src/validations";
    const controllersFolder = "src/controllers";
    const routesFolder = "src/routes/v1";

    // Create folders
    await fs.mkdir(servicesFolder, { recursive: true });
    await fs.mkdir(validationsFolder, { recursive: true });
    await fs.mkdir(controllersFolder, { recursive: true });
    await fs.mkdir(routesFolder, { recursive: true });

    // Service file
    const serviceFile = path.join(servicesFolder, `${name}.service${ext}`);
    let serviceContent;
    if (crudConfig && crudConfig.enabled) {
      serviceContent =
        language === "ts"
          ? getCrudServiceTemplateTS(
              folderStructure,
              name,
              camelName,
              pascalName,
              crudConfig.modelName,
              crudConfig.softDeleteApproach,
            )
          : getCrudServiceTemplate(
              folderStructure,
              name,
              camelName,
              pascalName,
              crudConfig.modelName,
              crudConfig.softDeleteApproach,
            );
    } else {
      serviceContent =
        language === "ts"
          ? getServiceTemplateTS(folderStructure)
          : getServiceTemplate(folderStructure);
    }
    await fs.writeFile(serviceFile, serviceContent);
    printSuccess(`Created: ${c.cyan(serviceFile)}`);
    filesCreated.push(serviceFile);

    // Validation file
    const validationFile = path.join(
      validationsFolder,
      `${name}.validation${ext}`,
    );
    let validationContent;
    if (crudConfig && crudConfig.enabled) {
      validationContent =
        language === "ts"
          ? getCrudValidationTemplateTS(name, camelName, pascalName)
          : getCrudValidationTemplate(name, camelName, pascalName);
    } else {
      validationContent =
        language === "ts" ? getValidationTemplateTS() : getValidationTemplate();
    }
    await fs.writeFile(validationFile, validationContent);
    printSuccess(`Created: ${c.cyan(validationFile)}`);
    filesCreated.push(validationFile);

    // Controller file
    const controllerFile = path.join(
      controllersFolder,
      `${name}.controller${ext}`,
    );
    let controllerContent;
    if (crudConfig && crudConfig.enabled) {
      controllerContent =
        language === "ts"
          ? getCrudControllerTemplateTS(
              name,
              camelName,
              pascalName,
              folderStructure,
            )
          : getCrudControllerTemplate(
              name,
              camelName,
              pascalName,
              folderStructure,
            );
    } else {
      controllerContent =
        language === "ts"
          ? getControllerTemplateTS(name, camelName, folderStructure)
          : getControllerTemplate(name, camelName, folderStructure);
    }
    await fs.writeFile(controllerFile, controllerContent);
    printSuccess(`Created: ${c.cyan(controllerFile)}`);
    filesCreated.push(controllerFile);

    // Router file
    const routerFile = path.join(routesFolder, `${name}.routes${ext}`);
    let routerContent;
    if (crudConfig && crudConfig.enabled) {
      routerContent =
        language === "ts"
          ? getCrudRouterTemplateTS(
              name,
              camelName,
              pascalName,
              folderStructure,
            )
          : getCrudRouterTemplate(
              name,
              camelName,
              pascalName,
              folderStructure,
            );
    } else {
      routerContent =
        language === "ts"
          ? getRouterTemplateTS(name, camelName, folderStructure)
          : getRouterTemplate(name, camelName, folderStructure);
    }
    await fs.writeFile(routerFile, routerContent);
    printSuccess(`Created: ${c.cyan(routerFile)}`);
    filesCreated.push(routerFile);
  } else {
    // MODULAR FOLDER STRUCTURE
    const moduleFolder = path.join("src/modules", name);

    await fs.mkdir(moduleFolder, { recursive: true });
    printInfo(`Creating module folder: ${c.cyan(moduleFolder)}`);
    console.log("");

    // Service file
    const serviceFile = path.join(moduleFolder, `${name}.service${ext}`);
    let serviceContent;
    if (crudConfig && crudConfig.enabled) {
      serviceContent =
        language === "ts"
          ? getCrudServiceTemplateTS(
              folderStructure,
              name,
              camelName,
              pascalName,
              crudConfig.modelName,
              crudConfig.softDeleteApproach,
            )
          : getCrudServiceTemplate(
              folderStructure,
              name,
              camelName,
              pascalName,
              crudConfig.modelName,
              crudConfig.softDeleteApproach,
            );
    } else {
      serviceContent =
        language === "ts"
          ? getServiceTemplateTS(folderStructure)
          : getServiceTemplate(folderStructure);
    }
    await fs.writeFile(serviceFile, serviceContent);
    printSuccess(`Created: ${c.cyan(serviceFile)}`);
    filesCreated.push(serviceFile);

    // Validation file
    const validationFile = path.join(moduleFolder, `${name}.validation${ext}`);
    let validationContent;
    if (crudConfig && crudConfig.enabled) {
      validationContent =
        language === "ts"
          ? getCrudValidationTemplateTS(name, camelName, pascalName)
          : getCrudValidationTemplate(name, camelName, pascalName);
    } else {
      validationContent =
        language === "ts" ? getValidationTemplateTS() : getValidationTemplate();
    }
    await fs.writeFile(validationFile, validationContent);
    printSuccess(`Created: ${c.cyan(validationFile)}`);
    filesCreated.push(validationFile);

    // Controller file
    const controllerFile = path.join(moduleFolder, `${name}.controller${ext}`);
    let controllerContent;
    if (crudConfig && crudConfig.enabled) {
      controllerContent =
        language === "ts"
          ? getCrudControllerTemplateTS(
              name,
              camelName,
              pascalName,
              folderStructure,
            )
          : getCrudControllerTemplate(
              name,
              camelName,
              pascalName,
              folderStructure,
            );
    } else {
      controllerContent =
        language === "ts"
          ? getControllerTemplateTS(name, camelName, folderStructure)
          : getControllerTemplate(name, camelName, folderStructure);
    }
    await fs.writeFile(controllerFile, controllerContent);
    printSuccess(`Created: ${c.cyan(controllerFile)}`);
    filesCreated.push(controllerFile);

    // Router file
    const routerFile = path.join(moduleFolder, `${name}.routes${ext}`);
    let routerContent;
    if (crudConfig && crudConfig.enabled) {
      routerContent =
        language === "ts"
          ? getCrudRouterTemplateTS(
              name,
              camelName,
              pascalName,
              folderStructure,
            )
          : getCrudRouterTemplate(
              name,
              camelName,
              pascalName,
              folderStructure,
            );
    } else {
      routerContent =
        language === "ts"
          ? getRouterTemplateTS(name, camelName, folderStructure)
          : getRouterTemplate(name, camelName, folderStructure);
    }
    await fs.writeFile(routerFile, routerContent);
    printSuccess(`Created: ${c.cyan(routerFile)}`);
    filesCreated.push(routerFile);
  }

  return filesCreated;
}

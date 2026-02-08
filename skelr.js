#!/usr/bin/env node
// skelr - Service scaffolding CLI
// Author: Abubakar Shaikh (github.com/abubakar-shaikh-dev)

import chalk from "chalk";
import * as p from "@clack/prompts";
import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";

// ═══════════════════════════════════════════════════════════════════════════
// CLI ARGUMENT PARSING
// ═══════════════════════════════════════════════════════════════════════════
function parseCliArgs(argv) {
  const args = {
    name: null,
    structure: null,
    typescript: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    // Help flag
    if (arg === "-h" || arg === "--help") {
      args.help = true;
    }
    // TypeScript flag
    else if (arg === "-ts" || arg === "--typescript") {
      args.typescript = true;
    }
    // Name argument
    else if (arg === "-n" || arg === "--name") {
      args.name = argv[++i];
    } else if (arg.startsWith("--name=")) {
      args.name = arg.split("=")[1];
    }
    // Structure argument
    else if (arg === "-s" || arg === "--structure") {
      args.structure = argv[++i];
    } else if (arg.startsWith("--structure=")) {
      args.structure = arg.split("=")[1];
    }
  }

  return args;
}

function printHelp() {
  console.log("");
  console.log(
    chalk.bold.white("  skelr") +
      chalk.dim(" - Service scaffolding CLI"),
  );
  console.log("");
  console.log(chalk.bold.white("  USAGE"));
  console.log(
    chalk.dim("  ─────────────────────────────────────────────────────────"),
  );
  console.log("    $ skelr [options]");
  console.log("");
  console.log(chalk.bold.white("  OPTIONS"));
  console.log(
    chalk.dim("  ─────────────────────────────────────────────────────────"),
  );
  console.log(
    "    " +
      chalk.cyan("-n, --name <name>") +
      "        " +
      chalk.dim("Service name (snake_case)"),
  );
  console.log(
    "    " +
      chalk.cyan("-s, --structure <type>") +
      "   " +
      chalk.dim("Folder structure: separate | modular"),
  );
  console.log(
    "    " +
      chalk.cyan("-ts, --typescript") +
      "        " +
      chalk.dim("Generate TypeScript files (.ts)"),
  );
  console.log(
    "    " +
      chalk.cyan("-h, --help") +
      "               " +
      chalk.dim("Show this help message"),
  );
  console.log("");
  console.log(chalk.bold.white("  EXAMPLES"));
  console.log(
    chalk.dim("  ─────────────────────────────────────────────────────────"),
  );
  console.log(
    "    " +
      chalk.dim("$") +
      " skelr " +
      chalk.cyan("--name=payment --structure=modular"),
  );
  console.log(
    "    " +
      chalk.dim("$") +
      " skelr " +
      chalk.cyan("-n user_profile -s separate -ts"),
  );
  console.log("");
}

function validateCliArgs(args) {
  const errors = [];

  if (args.name) {
    const snakeCaseRegex = /^[a-z]+(_[a-z]+)*$/;
    if (!snakeCaseRegex.test(args.name)) {
      errors.push(
        "Service name must be in snake_case or a single lowercase word",
      );
    }
  }

  if (args.structure) {
    const validStructures = ["separate", "modular", "current"];
    if (!validStructures.includes(args.structure.toLowerCase())) {
      errors.push("Structure must be 'separate' or 'modular'");
    }
  }

  return errors;
}

// Parse CLI arguments
const cliArgs = parseCliArgs(process.argv.slice(2));

// Minimal color palette
const c = {
  dim: chalk.dim,
  bold: chalk.bold,
  cyan: chalk.cyan,
  green: chalk.green,
  red: chalk.red,
  yellow: chalk.yellow,
  white: chalk.white,
};

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════
// Utility functions
function errorExit(message) {
  console.log();
  console.log(c.red("✗"), message);
  console.log();
  process.exit(1);
}

function printSuccess(message) {
  console.log(c.green("  ✓"), message);
}

function printInfo(message) {
  console.log(c.dim("  ›"), message);
}

console.clear();

function printBanner() {
  console.log();
  console.log(c.bold("skelr") + c.dim(" v2.1.0"));
  console.log(c.dim("Service scaffolding CLI"));
  console.log();
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG FILE LOADING
// ═══════════════════════════════════════════════════════════════════════════
const CONFIG_FILE = ".skelrrc.json";

function loadConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILE);
  
  if (!existsSync(configPath)) {
    return null;
  }
  
  try {
    const content = require("fs").readFileSync(configPath, "utf-8");
    const config = JSON.parse(content);
    
    console.log(c.green("✓") + c.dim(` Config file detected: ${CONFIG_FILE}`));
    console.log();
    
    return {
      structure: config.structure === "modular" ? "modular" : config.structure === "separate" ? "current" : null,
      language: config.language === "ts" ? "ts" : config.language === "js" ? "js" : null,
      crud: config.crud ? {
        enabled: config.crud.enabled === true,
        softDelete: config.crud.soft_delete === "boolean" ? "boolean" : "timestamp"
      } : null
    };
  } catch (error) {
    console.log(c.yellow("⚠") + c.dim(` Invalid config file: ${CONFIG_FILE}`));
    console.log();
    return null;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// FOLDER STRUCTURE SELECTION
// ═══════════════════════════════════════════════════════════════════════════
async function selectFolderStructure() {
  console.log(
    c.bold.white("Step 1") +
      " " +
      c.dim("→") +
      " " +
      c.white("Folder Structure"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");

  console.log(
    c.cyan(`  › `) +
      c.white("Select folder structure type"),
  );
  console.log("");
  console.log(
    "    " +
      c.bold.white("[1]") +
      " " +
      c.cyan("Separate Folder Structure") +
      " " +
      c.dim("(Distributed across folders)"),
  );
  console.log(
    "        " +
      c.dim("├─ src/services/") +
      c.dim("name") +
      c.dim(".service.js"),
  );
  console.log(
    "        " +
      c.dim("├─ src/validations/") +
      c.dim("name") +
      c.dim(".validation.js"),
  );
  console.log(
    "        " +
      c.dim("├─ src/controllers/") +
      c.dim("name") +
      c.dim(".controller.js"),
  );
  console.log(
    "        " +
      c.dim("└─ src/routes/v1/") +
      c.dim("name") +
      c.dim(".routes.js"),
  );
  console.log("");
  console.log(
    "    " +
      c.bold.white("[2]") +
      " " +
      c.cyan("Modular Folder Structure") +
      " " +
      c.dim("(All-in-one folder)"),
  );
  console.log(
    "        " +
      c.dim("└─ src/modules/") +
      c.dim("name") +
      c.dim("/"),
  );
  console.log(
    "            " +
      c.dim("├─ ") +
      c.dim("name") +
      c.dim(".service.js"),
  );
  console.log(
    "            " +
      c.dim("├─ ") +
      c.dim("name") +
      c.dim(".validation.js"),
  );
  console.log(
    "            " +
      c.dim("├─ ") +
      c.dim("name") +
      c.dim(".controller.js"),
  );
  console.log(
    "            " +
      c.dim("└─ ") +
      c.dim("name") +
      c.dim(".routes.js"),
  );
  console.log("");

  const choice = await p.select({
    message: c.bold.white("Select folder structure:"),
    options: [
      {
        value: "1",
        label:
          c.cyan("Separate Folder Structure") +
          " " +
          c.dim("(Distributed across folders)"),
      },
      {
        value: "2",
        label:
          c.cyan("Modular Folder Structure") +
          " " +
          c.dim("(All-in-one folder)"),
      },
    ],
  });

  if (p.isCancel(choice)) {
    console.log(
      c.yellow(`\n  ⚠ Operation cancelled by user.`),
    );
    process.exit(0);
  }

  const folderStructure = choice === "1" ? "current" : "modular";
  const structureName =
    choice === "1" ? "Separate Folder Structure" : "Modular Folder Structure";

  console.log(
    c.green(`    ✓ Selected: `) +
      c.bold.white(structureName),
  );
  console.log("");

  return folderStructure;
}

// ═══════════════════════════════════════════════════════════════════════════
// LANGUAGE SELECTION
// ═══════════════════════════════════════════════════════════════════════════
async function selectLanguage() {
  const choice = await p.select({
    message: c.bold.white("Select programming language:"),
    options: [
      {
        value: "1",
        label: c.cyan("JavaScript") + " " + c.dim("(.js files)"),
      },
      {
        value: "2",
        label:
          c.cyan("TypeScript") +
          " " +
          c.dim("(.ts files with type annotations)"),
      },
    ],
  });

  if (p.isCancel(choice)) {
    console.log(
      c.yellow(`\n  ⚠ Operation cancelled by user.`),
    );
    process.exit(0);
  }

  const language = choice === "1" ? "js" : "ts";
  const languageName = choice === "1" ? "JavaScript" : "TypeScript";

  console.log(
    c.green(`    ✓ Selected: `) +
      c.bold.white(languageName),
  );
  console.log("");

  return language;
}

// ═══════════════════════════════════════════════════════════════════════════
// CRUD API SELECTION
// ═══════════════════════════════════════════════════════════════════════════
async function askForCrudApis() {
  console.log(
    c.bold.white("Step 3") +
      " " +
      c.dim("→") +
      " " +
      c.white("Pre-made CRUD APIs"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");

  console.log(
    c.cyan(`  › `) +
      c.white("Would you like pre-made CRUD APIs?"),
  );
  console.log(
    c.dim(
      "    This generates complete Create, Read, Update, Delete operations",
    ),
  );
  console.log("");
  console.log(
    "    " +
      c.bold.white("APIs included:") +
      " " +
      c.dim("POST, GET (all), GET (by id), PUT (by id), DELETE (by id)"),
  );
  console.log("");

  const choice = await p.confirm({
    message: c.bold.white("Generate pre-made CRUD APIs?"),
    initialValue: false,
  });

  if (p.isCancel(choice)) {
    console.log(
      c.yellow(`\n  ⚠ Operation cancelled by user.`),
    );
    process.exit(0);
  }

  console.log(
    c.green(`    ✓ Selected: `) +
      c.bold.white(choice ? "Yes - Generate CRUD APIs" : "No - Empty templates"),
  );
  console.log("");

  return choice;
}

// ═══════════════════════════════════════════════════════════════════════════
// PRISMA MODEL NAME INPUT
// ═══════════════════════════════════════════════════════════════════════════
async function getPrismaModelName() {
  console.log(
    c.bold.white("Step 3.1") +
      " " +
      c.dim("→") +
      " " +
      c.white("Prisma Model Name"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");

  console.log(
    c.cyan(`  › `) +
      c.white("Enter Prisma model name ") +
      c.dim("(exact name from prisma schema file)"),
  );
  console.log(
    c.dim("    Examples: ") +
      c.cyan("users") +
      c.dim(", ") +
      c.cyan("products") +
      c.dim(", ") +
      c.cyan("orders"),
  );
  console.log(
    c.yellow(`    ⚠ `) +
      c.dim("Must match exactly as defined in your schema.prisma file"),
  );
  console.log("");

  const modelName = await p.text({
    message: c.bold.white("Enter Prisma model name:"),
    placeholder: "e.g., users, products, orders",
    validate: (input) => {
      if (!input || input.trim() === "") {
        return c.red(`✗ Model name cannot be empty`);
      }
    },
  });

  if (p.isCancel(modelName)) {
    console.log(
      c.yellow(`\n  ⚠ Operation cancelled by user.`),
    );
    process.exit(0);
  }

  console.log(
    c.green(`    ✓ Model name: `) +
      c.bold.white(modelName),
  );
  console.log("");

  return modelName;
}

// ═══════════════════════════════════════════════════════════════════════════
// SOFT DELETE APPROACH SELECTION
// ═══════════════════════════════════════════════════════════════════════════
async function selectSoftDeleteApproach() {
  const choice = await p.select({
    message: c.bold.white("Select soft delete approach:"),
    options: [
      {
        value: "timestamp",
        label:
          c.cyan("Timestamp") +
          " " +
          c.dim("(deleted_at: null | Date)"),
      },
      {
        value: "boolean",
        label:
          c.cyan("Boolean") +
          " " +
          c.dim("(is_deleted: false | true)"),
      },
    ],
  });

  if (p.isCancel(choice)) {
    console.log(
      c.yellow(`\n  ⚠ Operation cancelled by user.`),
    );
    process.exit(0);
  }

  const approachName = choice === "timestamp" ? "Timestamp (deleted_at)" : "Boolean (is_deleted)";

  console.log(
    c.green(`    ✓ Selected: `) +
      c.bold.white(approachName),
  );
  console.log("");

  return choice;
}

// ═══════════════════════════════════════════════════════════════════════════
// SERVICE NAME INPUT
// ═══════════════════════════════════════════════════════════════════════════
async function getServiceName() {
  console.log(
    c.bold.white("Step 3") +
      " " +
      c.dim("→") +
      " " +
      c.white("Service Name"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");

  console.log(
    c.cyan(`  › `) +
      c.white("Enter service name ") +
      c.dim("(snake_case or single lowercase word)"),
  );
  console.log(
    c.dim("    Examples: ") +
      c.cyan("payment") +
      c.dim(", ") +
      c.cyan("user_profile") +
      c.dim(", ") +
      c.cyan("order_item"),
  );
  console.log("");

  const name = await p.text({
    message: c.bold.white("Enter service name:"),
    placeholder: "e.g., payment, user_profile, order_item",
    validate: (input) => {
      if (!input || input.trim() === "") {
        return c.red(`✗ Service name cannot be empty`);
      }

      // Validate the input name (snake_case or single lowercase word)
      const snakeCaseRegex = /^[a-z]+(_[a-z]+)*$/;
      if (!snakeCaseRegex.test(input)) {
        return c.red(
          `✗ Service name must be in snake_case or a single lowercase word`,
        );
      }
    },
  });

  if (p.isCancel(name)) {
    console.log(
      c.yellow(`\n  ⚠ Operation cancelled by user.`),
    );
    process.exit(0);
  }

  console.log(
    c.green(`    ✓ Service name: `) +
      c.bold.white(name),
  );
  console.log("");

  return name;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVERT SNAKE_CASE TO CAMELCASE
// ═══════════════════════════════════════════════════════════════════════════
function snakeToCamel(str) {
  return str.replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

// ═══════════════════════════════════════════════════════════════════════════
// CONVERT SNAKE_CASE TO PASCALCASE
// ═══════════════════════════════════════════════════════════════════════════
function snakeToPascal(str) {
  const camel = snakeToCamel(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIGURATION PREVIEW
// ═══════════════════════════════════════════════════════════════════════════
async function showConfigurationPreview(
  name,
  camelName,
  folderStructure,
  language,
  crudConfig = null,
) {
  console.log(
    c.bold.white("Step 5") +
      " " +
      c.dim("→") +
      " " +
      c.white("Configuration Preview"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");
  console.log(
    c.cyan(
      "  ╭───────────────────────────────────────────────────────────╮",
    ),
  );
  console.log(
    c.dim("  │  ") +
      c.bold.white("📊  Service Configuration") +
      "                                " +
      c.dim("│"),
  );
  console.log(
    c.dim(
      "  ╰───────────────────────────────────────────────────────────╯",
    ),
  );
  console.log("");
  console.log(
    "    " + c.dim("Service Name") + "       " + c.cyan(name),
  );
  console.log(
    "    " + c.dim("Camel Case") + "         " + c.cyan(camelName),
  );
  console.log(
    "    " +
      c.dim("Language") +
      "           " +
      c.cyan(language === "ts" ? "TypeScript" : "JavaScript"),
  );

  // Show CRUD configuration if enabled
  if (crudConfig && crudConfig.enabled) {
    console.log(
      "    " +
        c.dim("CRUD APIs") +
        "          " +
        c.green("Enabled"),
    );
    console.log(
      "    " +
        c.dim("Prisma Model") +
        "       " +
        c.cyan(crudConfig.modelName),
    );
    console.log(
      "    " +
        c.dim("Soft Delete") +
        "        " +
        c.cyan(
          crudConfig.softDeleteApproach === "timestamp"
            ? "Timestamp (deleted_at)"
            : "Boolean (is_deleted)"
        ),
    );
  } else {
    console.log(
      "    " +
        c.dim("CRUD APIs") +
        "          " +
        c.dim("Disabled (Empty templates)"),
    );
  }

  if (folderStructure === "current") {
    console.log(
      "    " +
        c.dim("Structure") +
        "          " +
        c.white("Separate (Distributed folders)"),
    );
    console.log("");
    console.log("    " + c.dim("Files to create:"));
    console.log(
      "      " +
        c.dim("├─") +
        " " +
        c.cyan(`src/services/${name}.service.js`),
    );
    console.log(
      "      " +
        c.dim("├─") +
        " " +
        c.cyan(`src/validations/${name}.validation.js`),
    );
    console.log(
      "      " +
        c.dim("├─") +
        " " +
        c.cyan(`src/controllers/${name}.controller.js`),
    );
    console.log(
      "      " +
        c.dim("└─") +
        " " +
        c.cyan(`src/routes/v1/${name}.routes.js`),
    );
  } else {
    console.log(
      "    " +
        c.dim("Structure") +
        "          " +
        c.white("Modular (All-in-one folder)"),
    );
    console.log("");
    console.log("    " + c.dim("Files to create:"));
    console.log(
      "      " + c.dim("└─") + " " + c.cyan(`src/modules/${name}/`),
    );
    console.log(
      "          " + c.dim("├─") + " " + c.cyan(`${name}.service.js`),
    );
    console.log(
      "          " +
        c.dim("├─") +
        " " +
        c.cyan(`${name}.validation.js`),
    );
    console.log(
      "          " +
        c.dim("├─") +
        " " +
        c.cyan(`${name}.controller.js`),
    );
    console.log(
      "          " + c.dim("└─") + " " + c.cyan(`${name}.routes.js`),
    );
  }

  console.log("");
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");

  const proceed = await p.confirm({
    message: c.bold.white("Proceed with scaffolding?"),
    initialValue: false,
  });

  if (p.isCancel(proceed) || !proceed) {
    console.log(
      c.yellow(`\n  ⚠ Operation cancelled by user.`),
    );
    process.exit(0);
  }

  console.log("");
}

// ═══════════════════════════════════════════════════════════════════════════
// FILE TEMPLATES
// ═══════════════════════════════════════════════════════════════════════════
function getServiceTemplate(folderStructure) {
  const dbImportPath =
    folderStructure === "current" ? "../config/db.js" : "../../config/db.js";
  return `import createHttpError from "http-errors";

//Configs
import db from "${dbImportPath}";
`;
}

function getValidationTemplate() {
  return `import { z } from "zod";
`;
}

function getControllerTemplate(name, camelName, folderStructure) {
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

function getRouterTemplate(name, camelName, folderStructure) {
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

// ═══════════════════════════════════════════════════════════════════════════
// CRUD FILE TEMPLATES (JavaScript)
// ═══════════════════════════════════════════════════════════════════════════
function getCrudServiceTemplate(folderStructure, name, camelName, pascalName, modelName, softDeleteApproach) {
  const dbImportPath =
    folderStructure === "current" ? "../config/db.js" : "../../config/db.js";
  const paginationImportPath =
    folderStructure === "current" ? "../utils/pagination.util.js" : "../../utils/pagination.util.js";
  
  const softDeleteCheck = softDeleteApproach === "timestamp" ? "deleted_at: null" : "is_deleted: false";
  const softDeleteUpdate = softDeleteApproach === "timestamp" 
    ? "deleted_at: new Date()" 
    : "is_deleted: true";
  const softDeleteExistingCheck = softDeleteApproach === "timestamp"
    ? "existing_${camelName}.deleted_at"
    : "existing_${camelName}.is_deleted";

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

function getCrudValidationTemplate(name, camelName, pascalName) {
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

function getCrudControllerTemplate(name, camelName, pascalName, folderStructure) {
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

function getCrudRouterTemplate(name, camelName, pascalName, folderStructure) {
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

// ═══════════════════════════════════════════════════════════════════════════
function getServiceTemplateTS(folderStructure) {
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

function getValidationTemplateTS() {
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

function getControllerTemplateTS(name, camelName, folderStructure) {
  const serviceImportPath =
    folderStructure === "current"
      ? `../services/${name}.service`
      : `./${name}.service`;
  const validationImportPath =
    folderStructure === "current"
      ? `../validations/${name}.validation`
      : `./${name}.validation`;

  return `import { Request, Response } from "express";

//Services
import * as ${camelName}Service from "${serviceImportPath}";

//Validations 
import * as ${camelName}Validation from "${validationImportPath}";

// Example controller method
// export const getAll = async (req: Request, res: Response): Promise<void> => {
//   try {
//     // Your logic here
//     res.status(200).json({ success: true, data: [] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// export const getById = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const { id } = req.params;
//     // Your logic here
//     res.status(200).json({ success: true, data: null });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };
`;
}

function getRouterTemplateTS(name, camelName, folderStructure) {
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

// ═══════════════════════════════════════════════════════════════════════════
// CRUD FILE TEMPLATES (TypeScript)
// ═══════════════════════════════════════════════════════════════════════════
function getCrudServiceTemplateTS(folderStructure, name, camelName, pascalName, modelName, softDeleteApproach) {
  const dbImportPath =
    folderStructure === "current" ? "../config/db" : "../../config/db";
  const paginationImportPath =
    folderStructure === "current" ? "../utils/pagination.util" : "../../utils/pagination.util";
  
  const softDeleteCheck = softDeleteApproach === "timestamp" ? "deleted_at: null" : "is_deleted: false";
  const softDeleteUpdate = softDeleteApproach === "timestamp" 
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

function getCrudValidationTemplateTS(name, camelName, pascalName) {
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

function getCrudControllerTemplateTS(name, camelName, pascalName, folderStructure) {
  const serviceImportPath =
    folderStructure === "current"
      ? `../services/${name}.service`
      : `./${name}.service`;
  const validationImportPath =
    folderStructure === "current"
      ? `../validations/${name}.validation`
      : `./${name}.validation`;

  return `import { Request, Response, NextFunction } from "express";

//Services
import * as ${camelName}Service from "${serviceImportPath}";

//Validations
import * as ${camelName}Validation from "${validationImportPath}";

export const create${pascalName} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const getAll${pascalName}s = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const get${pascalName}ById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const update${pascalName} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const delete${pascalName} = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

function getCrudRouterTemplateTS(name, camelName, pascalName, folderStructure) {
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

// ═══════════════════════════════════════════════════════════════════════════
// FILE GENERATION
// ═══════════════════════════════════════════════════════════════════════════
async function generateFiles(
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
    // ═══════════════════════════════════════════════════════════════════════════
    // CURRENT FOLDER STRUCTURE (Separate folders)
    // ═══════════════════════════════════════════════════════════════════════════

    const servicesFolder = "src/services";
    const validationsFolder = "src/validations";
    const controllersFolder = "src/controllers";
    const routesFolder = "src/routes/v1";

    // Create the necessary folders if they don't exist
    await fs.mkdir(servicesFolder, { recursive: true });
    await fs.mkdir(validationsFolder, { recursive: true });
    await fs.mkdir(controllersFolder, { recursive: true });
    await fs.mkdir(routesFolder, { recursive: true });

    // Create the service file
    const serviceFile = path.join(servicesFolder, `${name}.service${ext}`);
    let serviceContent;
    if (crudConfig && crudConfig.enabled) {
      serviceContent = language === "ts"
        ? getCrudServiceTemplateTS(folderStructure, name, camelName, pascalName, crudConfig.modelName, crudConfig.softDeleteApproach)
        : getCrudServiceTemplate(folderStructure, name, camelName, pascalName, crudConfig.modelName, crudConfig.softDeleteApproach);
    } else {
      serviceContent = language === "ts"
        ? getServiceTemplateTS(folderStructure)
        : getServiceTemplate(folderStructure);
    }
    await fs.writeFile(serviceFile, serviceContent);
    printSuccess(`Created: ${c.cyan(serviceFile)}`);
    filesCreated.push(serviceFile);

    // Create the validation file
    const validationFile = path.join(
      validationsFolder,
      `${name}.validation${ext}`,
    );
    let validationContent;
    if (crudConfig && crudConfig.enabled) {
      validationContent = language === "ts"
        ? getCrudValidationTemplateTS(name, camelName, pascalName)
        : getCrudValidationTemplate(name, camelName, pascalName);
    } else {
      validationContent = language === "ts" ? getValidationTemplateTS() : getValidationTemplate();
    }
    await fs.writeFile(validationFile, validationContent);
    printSuccess(`Created: ${c.cyan(validationFile)}`);
    filesCreated.push(validationFile);

    // Create the controller file
    const controllerFile = path.join(
      controllersFolder,
      `${name}.controller${ext}`,
    );
    let controllerContent;
    if (crudConfig && crudConfig.enabled) {
      controllerContent = language === "ts"
        ? getCrudControllerTemplateTS(name, camelName, pascalName, folderStructure)
        : getCrudControllerTemplate(name, camelName, pascalName, folderStructure);
    } else {
      controllerContent = language === "ts"
        ? getControllerTemplateTS(name, camelName, folderStructure)
        : getControllerTemplate(name, camelName, folderStructure);
    }
    await fs.writeFile(controllerFile, controllerContent);
    printSuccess(`Created: ${c.cyan(controllerFile)}`);
    filesCreated.push(controllerFile);

    // Create the router file
    const routerFile = path.join(routesFolder, `${name}.routes${ext}`);
    let routerContent;
    if (crudConfig && crudConfig.enabled) {
      routerContent = language === "ts"
        ? getCrudRouterTemplateTS(name, camelName, pascalName, folderStructure)
        : getCrudRouterTemplate(name, camelName, pascalName, folderStructure);
    } else {
      routerContent = language === "ts"
        ? getRouterTemplateTS(name, camelName, folderStructure)
        : getRouterTemplate(name, camelName, folderStructure);
    }
    await fs.writeFile(routerFile, routerContent);
    printSuccess(`Created: ${c.cyan(routerFile)}`);
    filesCreated.push(routerFile);
  } else {
    // ═══════════════════════════════════════════════════════════════════════════
    // MODULAR FOLDER STRUCTURE (All-in-one folder)
    // ═══════════════════════════════════════════════════════════════════════════

    const moduleFolder = path.join("src/modules", name);

    // Create the module folder
    await fs.mkdir(moduleFolder, { recursive: true });

    printInfo(`Creating module folder: ${c.cyan(moduleFolder)}`);
    console.log("");

    // Create the service file
    const serviceFile = path.join(moduleFolder, `${name}.service${ext}`);
    let serviceContent;
    if (crudConfig && crudConfig.enabled) {
      serviceContent = language === "ts"
        ? getCrudServiceTemplateTS(folderStructure, name, camelName, pascalName, crudConfig.modelName, crudConfig.softDeleteApproach)
        : getCrudServiceTemplate(folderStructure, name, camelName, pascalName, crudConfig.modelName, crudConfig.softDeleteApproach);
    } else {
      serviceContent = language === "ts"
        ? getServiceTemplateTS(folderStructure)
        : getServiceTemplate(folderStructure);
    }
    await fs.writeFile(serviceFile, serviceContent);
    printSuccess(`Created: ${c.cyan(serviceFile)}`);
    filesCreated.push(serviceFile);

    // Create the validation file
    const validationFile = path.join(moduleFolder, `${name}.validation${ext}`);
    let validationContent;
    if (crudConfig && crudConfig.enabled) {
      validationContent = language === "ts"
        ? getCrudValidationTemplateTS(name, camelName, pascalName)
        : getCrudValidationTemplate(name, camelName, pascalName);
    } else {
      validationContent = language === "ts" ? getValidationTemplateTS() : getValidationTemplate();
    }
    await fs.writeFile(validationFile, validationContent);
    printSuccess(`Created: ${c.cyan(validationFile)}`);
    filesCreated.push(validationFile);

    // Create the controller file
    const controllerFile = path.join(moduleFolder, `${name}.controller${ext}`);
    let controllerContent;
    if (crudConfig && crudConfig.enabled) {
      controllerContent = language === "ts"
        ? getCrudControllerTemplateTS(name, camelName, pascalName, folderStructure)
        : getCrudControllerTemplate(name, camelName, pascalName, folderStructure);
    } else {
      controllerContent = language === "ts"
        ? getControllerTemplateTS(name, camelName, folderStructure)
        : getControllerTemplate(name, camelName, folderStructure);
    }
    await fs.writeFile(controllerFile, controllerContent);
    printSuccess(`Created: ${c.cyan(controllerFile)}`);
    filesCreated.push(controllerFile);

    // Create the router file
    const routerFile = path.join(moduleFolder, `${name}.routes${ext}`);
    let routerContent;
    if (crudConfig && crudConfig.enabled) {
      routerContent = language === "ts"
        ? getCrudRouterTemplateTS(name, camelName, pascalName, folderStructure)
        : getCrudRouterTemplate(name, camelName, pascalName, folderStructure);
    } else {
      routerContent = language === "ts"
        ? getRouterTemplateTS(name, camelName, folderStructure)
        : getRouterTemplate(name, camelName, folderStructure);
    }
    await fs.writeFile(routerFile, routerContent);
    printSuccess(`Created: ${c.cyan(routerFile)}`);
    filesCreated.push(routerFile);
  }

  return filesCreated;
}

// ═══════════════════════════════════════════════════════════════════════════
// SUCCESS SUMMARY
// ═══════════════════════════════════════════════════════════════════════════
function printSuccessSummary(name, folderStructure, filesCreated) {
  const serviceFile = filesCreated[0];
  const validationFile = filesCreated[1];
  const controllerFile = filesCreated[3];

  console.log("");
  console.log("");
  console.log(
    c.cyan(
      "╔═══════════════════════════════════════════════════════════════╗",
    ),
  );
  console.log(
    c.dim(
      "║                                                               ║",
    ),
  );
  console.log(
    c.dim("║             ") +
      c.bold.green(
        `✓  O P E R A T I O N   S U C C E S S`,
      ) +
      "              " +
      c.dim("║"),
  );
  console.log(
    c.dim(
      "║                                                               ║",
    ),
  );
  console.log(
    c.cyan(
      "╚═══════════════════════════════════════════════════════════════╝",
    ),
  );
  console.log("");
  console.log(
    "  " +
      c.dim("›") +
      " " +
      c.dim("Service Name") +
      "         " +
      c.bold(c.cyan(name)),
  );
  console.log(
    "  " +
      c.dim("›") +
      " " +
      c.dim("Folder Structure") +
      "     " +
      c.bold.cyan(
        folderStructure === "current"
          ? "Separate (Distributed)"
          : "Modular (All-in-one)",
      ),
  );
  console.log(
    "  " +
      c.dim("›") +
      " " +
      c.dim("Files Created") +
      "        " +
      c.bold.white(`${filesCreated.length} files`),
  );
  console.log("");
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log(c.bold.white("  Files Created"));
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");

  for (const file of filesCreated) {
    console.log(
      "  " +
        c.cyan("🔸") +
        " " +
        c.dim(file),
    );
  }

  console.log("");
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log(c.bold.white("  Next Steps"));
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");
  console.log(
    "  " +
      c.bold.white("1.") +
      " " +
      c.dim("Import and register the route in"),
  );
  console.log("     " + c.cyan("src/routes/index.js"));
  console.log("");
  console.log(
    "  " +
      c.bold.white("2.") +
      " " +
      c.dim("Implement your service logic in"),
  );
  console.log("     " + c.cyan(serviceFile));
  console.log("");
  console.log(
    "  " +
      c.bold.white("3.") +
      " " +
      c.dim("Add validation schemas in"),
  );
  console.log("     " + c.cyan(validationFile));
  console.log("");
  console.log(
    "  " +
      c.bold.white("4.") +
      " " +
      c.dim("Create controller methods in"),
  );
  console.log("     " + c.cyan(controllerFile));
  console.log("");
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log(
    c.dim("  Tool: ") +
      c.cyan("skelr") +
      c.dim(" v2.0.0 | ") +
      c.dim("© 2026 Abubakar Shaikh"),
  );
  console.log(
    c.dim("  Repo: ") +
      c.cyan("github.com/abubakar-shaikh-dev/skelr.git"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FUNCTION
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  try {
    // Handle --help flag
    if (cliArgs.help) {
      printHelp();
      process.exit(0);
    }

    // Validate CLI arguments if provided
    const validationErrors = validateCliArgs(cliArgs);
    if (validationErrors.length > 0) {
      for (const error of validationErrors) {
        console.log(c.red(`  ✗ ${error}`));
      }
      console.log("");
      printHelp();
      process.exit(1);
    }

    // Non-interactive mode: skip banner if all args provided
    const isNonInteractive = cliArgs.name && cliArgs.structure;

    // Load config file
    let config = null;
    if (!isNonInteractive) {
      // Print banner only in interactive mode
      printBanner();
      config = loadConfig();
    } else {
      console.log("");
      console.log(
        c.cyan(`  ⚡ `) +
          c.bold.white("Quick Mode") +
          c.dim(" - Generating service files..."),
      );
      console.log("");
      config = loadConfig();
    }

    // Step 1: Select folder structure (skip if provided via CLI or config)
    let folderStructure;
    if (cliArgs.structure) {
      // Normalize structure value
      const structureMap = {
        separate: "current",
        modular: "modular",
        current: "current",
      };
      folderStructure =
        structureMap[cliArgs.structure.toLowerCase()] || "current";
      if (!isNonInteractive) {
        const structureName =
          folderStructure === "current"
            ? "Separate Folder Structure"
            : "Modular Folder Structure";
        console.log(
          c.green(`  ✓ Structure: `) +
            c.bold.white(structureName) +
            c.dim(" (from CLI)"),
        );
      }
    } else if (config && config.structure) {
      folderStructure = config.structure;
      const structureName =
        folderStructure === "current"
          ? "Separate Folder Structure"
          : "Modular Folder Structure";
      console.log(
        c.green(`  ✓ Structure: `) +
          c.bold.white(structureName) +
          c.dim(" (from config)"),
      );
    } else {
      folderStructure = await selectFolderStructure();
    }

    // Step 2: Select language (skip if --typescript provided via CLI or config)
    let language;
    if (cliArgs.typescript) {
      language = "ts";
      if (!isNonInteractive) {
        console.log(
          c.green(`  ✓ Language: `) +
            c.bold.white("TypeScript") +
            c.dim(" (from CLI)"),
        );
      }
    } else if (config && config.language) {
      language = config.language;
      const langName = language === "ts" ? "TypeScript" : "JavaScript";
      console.log(
        c.green(`  ✓ Language: `) +
          c.bold.white(langName) +
          c.dim(" (from config)"),
      );
    } else if (isNonInteractive) {
      // Default to JS in non-interactive mode if --typescript not specified
      language = "js";
    } else {
      language = await selectLanguage();
    }

    // Step 3: Ask for CRUD APIs (only in interactive mode and for JavaScript)
    let crudConfig = null;
    if (!isNonInteractive) {
      const wantsCrud = await askForCrudApis();
      
      if (wantsCrud) {
        // Step 3.1: Get Prisma model name
        const modelName = await getPrismaModelName();
        
        // Step 3.2: Select soft delete approach
        const softDeleteApproach = await selectSoftDeleteApproach();
        
        crudConfig = {
          enabled: true,
          modelName,
          softDeleteApproach,
        };
      } else {
        crudConfig = {
          enabled: false,
          modelName: null,
          softDeleteApproach: null,
        };
      }
    }

    // Step 4: Get service name (skip if provided via CLI)
    let name;
    if (cliArgs.name) {
      name = cliArgs.name.toLowerCase();
      if (!isNonInteractive) {
        console.log(
          c.green(`  ✓ Service name: `) +
            c.bold.white(name) +
            c.dim(" (from CLI)"),
        );
        console.log("");
      }
    } else {
      name = await getServiceName();
    }
    const lowerName = name.toLowerCase();
    const camelName = snakeToCamel(lowerName);

    // Step 5: Show configuration preview and confirm (skip in non-interactive mode)
    if (!isNonInteractive) {
      await showConfigurationPreview(
        lowerName,
        camelName,
        folderStructure,
        language,
        crudConfig,
      );
    }

    // Step 6: Generate files
    const filesCreated = await generateFiles(
      lowerName,
      camelName,
      folderStructure,
      language,
      crudConfig,
    );

    // Print success summary
    printSuccessSummary(lowerName, folderStructure, filesCreated);
  } catch (error) {
    if (error.isTtyError) {
      errorExit("Prompt couldn't be rendered in the current environment");
    } else if (error.name === "ExitPromptError") {
      console.log(
        c.yellow(
          `\n  ⚠ Operation cancelled by user.`,
        ),
      );
      process.exit(0);
    } else {
      errorExit(error.message);
    }
  }
}

// Run the main function
main();

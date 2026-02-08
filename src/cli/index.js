import { c, snakeToCamel, errorExit } from "../utils/index.js";
import { parseCliArgs, validateCliArgs } from "./args.js";
import { printHelp } from "./help.js";
import { loadConfig } from "../config/loader.js";
import { printBanner, showConfigurationPreview, printSuccessSummary } from "../ui/index.js";
import {
  selectFolderStructure,
  selectLanguage,
  askForCrudApis,
  getPrismaModelName,
  selectSoftDeleteApproach,
  getServiceName,
} from "../prompts/index.js";
import { generateFiles } from "../generators/index.js";

/**
 * Main CLI entry point
 */
export async function main() {
  try {
    // Parse CLI arguments
    const cliArgs = parseCliArgs(process.argv.slice(2));

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
      console.clear();
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

    // Step 1: Select folder structure
    let folderStructure;
    if (cliArgs.structure) {
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

    // Step 2: Select language
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
      language = "js";
    } else {
      language = await selectLanguage();
    }

    // Step 3: Ask for CRUD APIs (only in interactive mode)
    let crudConfig = null;
    if (!isNonInteractive) {
      const wantsCrud = await askForCrudApis();

      if (wantsCrud) {
        const modelName = await getPrismaModelName();
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

    // Step 4: Get service name
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

    // Step 5: Show configuration preview (skip in non-interactive mode)
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
      console.log(c.yellow(`\n  ⚠ Operation cancelled by user.`));
      process.exit(0);
    } else {
      errorExit(error.message);
    }
  }
}

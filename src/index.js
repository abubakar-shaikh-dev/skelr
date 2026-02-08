// CLI exports
export { main } from "./cli/index.js";
export { parseCliArgs, validateCliArgs } from "./cli/args.js";
export { printHelp } from "./cli/help.js";

// Config exports
export { loadConfig, CONFIG_FILE } from "./config/loader.js";

// Prompts exports
export {
  selectFolderStructure,
  selectLanguage,
  askForCrudApis,
  getPrismaModelName,
  selectSoftDeleteApproach,
  getServiceName,
} from "./prompts/index.js";

// Generators exports
export { generateFiles } from "./generators/index.js";

// UI exports
export { printBanner, showConfigurationPreview, printSuccessSummary } from "./ui/index.js";

// Utils exports
export { c, snakeToCamel, snakeToPascal, errorExit, printSuccess, printInfo } from "./utils/index.js";

// Templates exports
export * from "./templates/index.js";

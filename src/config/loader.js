import { existsSync, readFileSync } from "fs";
import path from "path";
import { c } from "../utils/colors.js";

export const CONFIG_FILE = ".skelrrc.json";

/**
 * Load configuration from .skelrrc.json file
 * @returns {Object|null} Parsed configuration or null if not found/invalid
 */
export function loadConfig() {
  const configPath = path.join(process.cwd(), CONFIG_FILE);

  if (!existsSync(configPath)) {
    return null;
  }

  try {
    const content = readFileSync(configPath, "utf-8");
    const config = JSON.parse(content);

    console.log(c.green("✓") + c.dim(` Config file detected: ${CONFIG_FILE}`));
    console.log();

    return {
      structure:
        config.structure === "modular"
          ? "modular"
          : config.structure === "separate"
            ? "current"
            : null,
      language:
        config.language === "ts"
          ? "ts"
          : config.language === "js"
            ? "js"
            : null,
      crud: config.crud
        ? {
            enabled: config.crud.enabled === true,
            softDelete:
              config.crud.soft_delete === "boolean" ? "boolean" : "timestamp",
          }
        : null,
    };
  } catch (error) {
    console.log(c.yellow("⚠") + c.dim(` Invalid config file: ${CONFIG_FILE}`));
    console.log();
    return null;
  }
}

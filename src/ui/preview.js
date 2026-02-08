import * as p from "@clack/prompts";
import { c } from "../utils/colors.js";

/**
 * Show configuration preview and ask for confirmation
 * @param {string} name - Service name in snake_case
 * @param {string} camelName - Service name in camelCase
 * @param {string} folderStructure - "current" for separate, "modular" for modular
 * @param {string} language - "js" or "ts"
 * @param {Object|null} crudConfig - CRUD configuration or null
 */
export async function showConfigurationPreview(
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
  console.log("    " + c.dim("Service Name") + "       " + c.cyan(name));
  console.log("    " + c.dim("Camel Case") + "         " + c.cyan(camelName));
  console.log(
    "    " +
      c.dim("Language") +
      "           " +
      c.cyan(language === "ts" ? "TypeScript" : "JavaScript"),
  );

  // Show CRUD configuration if enabled
  if (crudConfig && crudConfig.enabled) {
    console.log(
      "    " + c.dim("CRUD APIs") + "          " + c.green("Enabled"),
    );
    console.log(
      "    " + c.dim("Prisma Model") + "       " + c.cyan(crudConfig.modelName),
    );
    console.log(
      "    " +
        c.dim("Soft Delete") +
        "        " +
        c.cyan(
          crudConfig.softDeleteApproach === "timestamp"
            ? "Timestamp (deleted_at)"
            : "Boolean (is_deleted)",
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
      "      " + c.dim("├─") + " " + c.cyan(`src/services/${name}.service.js`),
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
    console.log("      " + c.dim("└─") + " " + c.cyan(`src/modules/${name}/`));
    console.log(
      "          " + c.dim("├─") + " " + c.cyan(`${name}.service.js`),
    );
    console.log(
      "          " + c.dim("├─") + " " + c.cyan(`${name}.validation.js`),
    );
    console.log(
      "          " + c.dim("├─") + " " + c.cyan(`${name}.controller.js`),
    );
    console.log("          " + c.dim("└─") + " " + c.cyan(`${name}.routes.js`));
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
    console.log(c.yellow(`\n  ⚠ Operation cancelled by user.`));
    process.exit(0);
  }

  console.log("");
}

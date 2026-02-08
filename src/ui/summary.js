import { c } from "../utils/colors.js";

/**
 * Print success summary after file generation
 * @param {string} name - Service name in snake_case
 * @param {string} folderStructure - "current" for separate, "modular" for modular
 * @param {string[]} filesCreated - Array of created file paths
 */
export function printSuccessSummary(name, folderStructure, filesCreated) {
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
      c.bold.green(`✓  O P E R A T I O N   S U C C E S S`) +
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
    console.log("  " + c.cyan("🔸") + " " + c.dim(file));
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
    "  " + c.bold.white("2.") + " " + c.dim("Implement your service logic in"),
  );
  console.log("     " + c.cyan(serviceFile));
  console.log("");
  console.log(
    "  " + c.bold.white("3.") + " " + c.dim("Add validation schemas in"),
  );
  console.log("     " + c.cyan(validationFile));
  console.log("");
  console.log(
    "  " + c.bold.white("4.") + " " + c.dim("Create controller methods in"),
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
      c.dim(" v2.1.0 | ") +
      c.dim("© 2026 Abubakar Shaikh"),
  );
  console.log(
    c.dim("  Repo: ") + c.cyan("github.com/abubakar-shaikh-dev/skelr.git"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");
}

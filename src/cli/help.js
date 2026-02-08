import chalk from "chalk";

/**
 * Print CLI help message
 */
export function printHelp() {
  console.log("");
  console.log(
    chalk.bold.white("  skelr") + chalk.dim(" - Service scaffolding CLI"),
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

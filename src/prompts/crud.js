import * as p from "@clack/prompts";
import { c } from "../utils/colors.js";

/**
 * Ask if user wants pre-made CRUD APIs
 * @returns {Promise<boolean>} true if user wants CRUD APIs
 */
export async function askForCrudApis() {
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
    c.cyan(`  › `) + c.white("Would you like pre-made CRUD APIs?"),
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
    console.log(c.yellow(`\n  ⚠ Operation cancelled by user.`));
    process.exit(0);
  }

  console.log(
    c.green(`    ✓ Selected: `) +
      c.bold.white(choice ? "Yes - Generate CRUD APIs" : "No - Empty templates"),
  );
  console.log("");

  return choice;
}

/**
 * Prompt user for Prisma model name
 * @returns {Promise<string>} Model name
 */
export async function getPrismaModelName() {
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
    console.log(c.yellow(`\n  ⚠ Operation cancelled by user.`));
    process.exit(0);
  }

  console.log(c.green(`    ✓ Model name: `) + c.bold.white(modelName));
  console.log("");

  return modelName;
}

/**
 * Prompt user to select soft delete approach
 * @returns {Promise<string>} "timestamp" or "boolean"
 */
export async function selectSoftDeleteApproach() {
  const choice = await p.select({
    message: c.bold.white("Select soft delete approach:"),
    options: [
      {
        value: "timestamp",
        label: c.cyan("Timestamp") + " " + c.dim("(deleted_at: null | Date)"),
      },
      {
        value: "boolean",
        label: c.cyan("Boolean") + " " + c.dim("(is_deleted: false | true)"),
      },
    ],
  });

  if (p.isCancel(choice)) {
    console.log(c.yellow(`\n  ⚠ Operation cancelled by user.`));
    process.exit(0);
  }

  const approachName =
    choice === "timestamp"
      ? "Timestamp (deleted_at)"
      : "Boolean (is_deleted)";

  console.log(c.green(`    ✓ Selected: `) + c.bold.white(approachName));
  console.log("");

  return choice;
}

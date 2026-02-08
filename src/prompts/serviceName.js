import * as p from "@clack/prompts";
import { c } from "../utils/colors.js";

/**
 * Prompt user for service name
 * @returns {Promise<string>} Service name in snake_case
 */
export async function getServiceName() {
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
    console.log(c.yellow(`\n  ⚠ Operation cancelled by user.`));
    process.exit(0);
  }

  console.log(c.green(`    ✓ Service name: `) + c.bold.white(name));
  console.log("");

  return name;
}

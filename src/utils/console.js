import { c } from "./colors.js";

/**
 * Print error message and exit the process
 * @param {string} message - Error message to display
 */
export function errorExit(message) {
  console.log();
  console.log(c.red("✗"), message);
  console.log();
  process.exit(1);
}

/**
 * Print success message with green checkmark
 * @param {string} message - Success message to display
 */
export function printSuccess(message) {
  console.log(c.green("  ✓"), message);
}

/**
 * Print info message with dim arrow
 * @param {string} message - Info message to display
 */
export function printInfo(message) {
  console.log(c.dim("  ›"), message);
}

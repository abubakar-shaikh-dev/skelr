import { c } from "../utils/colors.js";

/**
 * Print CLI banner
 */
export function printBanner() {
  console.log();
  console.log(c.bold("skelr") + c.dim(" v2.1.0"));
  console.log(c.dim("Service scaffolding CLI"));
  console.log();
}

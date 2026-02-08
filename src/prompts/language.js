import * as p from "@clack/prompts";
import { c } from "../utils/colors.js";

/**
 * Prompt user to select programming language
 * @returns {Promise<string>} "js" or "ts"
 */
export async function selectLanguage() {
  const choice = await p.select({
    message: c.bold.white("Select programming language:"),
    options: [
      {
        value: "1",
        label: c.cyan("JavaScript") + " " + c.dim("(.js files)"),
      },
      {
        value: "2",
        label:
          c.cyan("TypeScript") + " " + c.dim("(.ts files with type annotations)"),
      },
    ],
  });

  if (p.isCancel(choice)) {
    console.log(c.yellow(`\n  ⚠ Operation cancelled by user.`));
    process.exit(0);
  }

  const language = choice === "1" ? "js" : "ts";
  const languageName = choice === "1" ? "JavaScript" : "TypeScript";

  console.log(c.green(`    ✓ Selected: `) + c.bold.white(languageName));
  console.log("");

  return language;
}

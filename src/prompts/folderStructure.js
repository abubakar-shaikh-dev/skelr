import * as p from "@clack/prompts";
import { c } from "../utils/colors.js";

/**
 * Prompt user to select folder structure
 * @returns {Promise<string>} "current" for separate, "modular" for modular
 */
export async function selectFolderStructure() {
  console.log(
    c.bold.white("Step 1") +
      " " +
      c.dim("→") +
      " " +
      c.white("Folder Structure"),
  );
  console.log(
    c.dim.gray(
      "───────────────────────────────────────────────────────────────",
    ),
  );
  console.log("");

  console.log(c.cyan(`  › `) + c.white("Select folder structure type"));
  console.log("");
  console.log(
    "    " +
      c.bold.white("[1]") +
      " " +
      c.cyan("Separate Folder Structure") +
      " " +
      c.dim("(Distributed across folders)"),
  );
  console.log(
    "        " + c.dim("├─ src/services/") + c.dim("name") + c.dim(".service.js"),
  );
  console.log(
    "        " +
      c.dim("├─ src/validations/") +
      c.dim("name") +
      c.dim(".validation.js"),
  );
  console.log(
    "        " +
      c.dim("├─ src/controllers/") +
      c.dim("name") +
      c.dim(".controller.js"),
  );
  console.log(
    "        " + c.dim("└─ src/routes/v1/") + c.dim("name") + c.dim(".routes.js"),
  );
  console.log("");
  console.log(
    "    " +
      c.bold.white("[2]") +
      " " +
      c.cyan("Modular Folder Structure") +
      " " +
      c.dim("(All-in-one folder)"),
  );
  console.log("        " + c.dim("└─ src/modules/") + c.dim("name") + c.dim("/"));
  console.log(
    "            " + c.dim("├─ ") + c.dim("name") + c.dim(".service.js"),
  );
  console.log(
    "            " + c.dim("├─ ") + c.dim("name") + c.dim(".validation.js"),
  );
  console.log(
    "            " + c.dim("├─ ") + c.dim("name") + c.dim(".controller.js"),
  );
  console.log(
    "            " + c.dim("└─ ") + c.dim("name") + c.dim(".routes.js"),
  );
  console.log("");

  const choice = await p.select({
    message: c.bold.white("Select folder structure:"),
    options: [
      {
        value: "1",
        label:
          c.cyan("Separate Folder Structure") +
          " " +
          c.dim("(Distributed across folders)"),
      },
      {
        value: "2",
        label:
          c.cyan("Modular Folder Structure") + " " + c.dim("(All-in-one folder)"),
      },
    ],
  });

  if (p.isCancel(choice)) {
    console.log(c.yellow(`\n  ⚠ Operation cancelled by user.`));
    process.exit(0);
  }

  const folderStructure = choice === "1" ? "current" : "modular";
  const structureName =
    choice === "1" ? "Separate Folder Structure" : "Modular Folder Structure";

  console.log(c.green(`    ✓ Selected: `) + c.bold.white(structureName));
  console.log("");

  return folderStructure;
}

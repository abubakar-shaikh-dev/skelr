/**
 * Parse CLI arguments from process.argv
 * @param {string[]} argv - Command line arguments (process.argv.slice(2))
 * @returns {Object} Parsed arguments object
 */
export function parseCliArgs(argv) {
  const args = {
    name: null,
    structure: null,
    typescript: false,
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    // Help flag
    if (arg === "-h" || arg === "--help") {
      args.help = true;
    }
    // TypeScript flag
    else if (arg === "-ts" || arg === "--typescript") {
      args.typescript = true;
    }
    // Name argument
    else if (arg === "-n" || arg === "--name") {
      args.name = argv[++i];
    } else if (arg.startsWith("--name=")) {
      args.name = arg.split("=")[1];
    }
    // Structure argument
    else if (arg === "-s" || arg === "--structure") {
      args.structure = argv[++i];
    } else if (arg.startsWith("--structure=")) {
      args.structure = arg.split("=")[1];
    }
  }

  return args;
}

/**
 * Validate CLI arguments
 * @param {Object} args - Parsed CLI arguments
 * @returns {string[]} Array of validation error messages
 */
export function validateCliArgs(args) {
  const errors = [];

  if (args.name) {
    const snakeCaseRegex = /^[a-z]+(_[a-z]+)*$/;
    if (!snakeCaseRegex.test(args.name)) {
      errors.push(
        "Service name must be in snake_case or a single lowercase word",
      );
    }
  }

  if (args.structure) {
    const validStructures = ["separate", "modular", "current"];
    if (!validStructures.includes(args.structure.toLowerCase())) {
      errors.push("Structure must be 'separate' or 'modular'");
    }
  }

  return errors;
}

#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════
# Service Scaffolder Tool v2.0.0
# ═══════════════════════════════════════════════════════════════════════════
# Author    : ABUBAKAR SHAIKH
# Github    : https://github.com/abubakar-shaikh-dev
# Repo      : github.com/abubakar-shaikh-dev/scaffold-service.git
# Tool      : scaffold-service
# Purpose   : Quickly scaffold new service boilerplate code
# Year      : 2025-2026
# Note      : Tampering with the author information does not break the script, but it does summon a mild sense of professional shame
# ═══════════════════════════════════════════════════════════════════════════

# Navigate to project root (parent directory of scripts)
cd "$(dirname "$0")/../.." || exit 1

set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════
# COLOR PALETTE
# ═══════════════════════════════════════════════════════════════════════════
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly GRAY='\033[0;90m'
readonly BOLD='\033[1m'
readonly DIM='\033[2m'
readonly NC='\033[0m'

# Modern gradient colors
readonly GRADIENT_1='\033[38;5;39m'   # Electric Blue
readonly GRADIENT_2='\033[38;5;51m'   # Cyan Blue
readonly GRADIENT_3='\033[38;5;87m'   # Sky Blue
readonly ACCENT='\033[38;5;213m'      # Pink Accent

# ═══════════════════════════════════════════════════════════════════════════
# UTILITY FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════════

# Error handler with modern styling
error_exit() {
  echo ""
  echo -e "${RED}${BOLD}╭─────────────────────────────────────────────────────────╮${NC}"
  echo -e "${RED}${BOLD}│  ⚠️  ERROR                                              │${NC}"
  echo -e "${RED}${BOLD}╰─────────────────────────────────────────────────────────╯${NC}"
  echo -e "${RED}  $1${NC}"
  echo ""
  exit 1
}

# Success message helper
print_success() {
  echo -e "${GREEN}  ✓ ${NC}${WHITE}$1${NC}"
}

# Info message helper
print_info() {
  echo -e "${CYAN}  ▸ ${NC}${DIM}$1${NC}"
}

# Warning message helper
print_warning() {
  echo -e "${YELLOW}  ⚠ ${NC}$1"
}

clear

# ═══════════════════════════════════════════════════════════════════════════
# MODERN BANNER - 2025 Design
# ═══════════════════════════════════════════════════════════════════════════
echo ""
echo -e "${GRADIENT_1}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GRADIENT_2}║                                                               ║${NC}"
echo -e "${GRADIENT_2}║         ${BOLD}${WHITE}🏗️   S E R V I C E   S C A F F O L D E R${NC}   ${GRADIENT_2}🏗️${NC}           ${GRADIENT_2}║${NC}"
echo -e "${GRADIENT_2}║                                                               ║${NC}"
echo -e "${GRADIENT_3}╠═══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GRADIENT_3}║      ${DIM}Quickly scaffold new service boilerplate code${NC}            ${GRADIENT_3}║${NC}"
echo -e "${GRADIENT_3}╠═══════════════════════════════════════════════════════════════╣${NC}"
echo -e "${GRADIENT_3}║  ${GRAY}Author${NC}  ${WHITE}ABUBAKAR SHAIKH${NC}                                      ${GRADIENT_3}║${NC}"
echo -e "${GRADIENT_3}║  ${GRAY}Github${NC}  ${CYAN}github.com/abubakar-shaikh-dev${NC}                       ${GRADIENT_3}║${NC}"
echo -e "${GRADIENT_3}║  ${GRAY}Tool${NC}    ${ACCENT}scaffold-service${NC}                                     ${GRADIENT_3}║${NC}"
echo -e "${GRADIENT_3}║  ${GRAY}Version${NC} ${WHITE}2.0.0${NC} ${DIM}${NC}                                               ${GRADIENT_3}║${NC}"
echo -e "${GRADIENT_1}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo ""

# ═══════════════════════════════════════════════════════════════════════════
# FOLDER STRUCTURE SELECTION
# ═══════════════════════════════════════════════════════════════════════════
echo -e "${BOLD}${WHITE}Step 1${NC} ${GRAY}→${NC} ${WHITE}Folder Structure${NC}"
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo ""

echo -e "${CYAN}  ▸ ${NC}${WHITE}Select folder structure type${NC}"
echo ""
echo -e "    ${BOLD}${WHITE}[1]${NC} ${ACCENT}Separate Folder Structure${NC} ${DIM}(Distributed across folders)${NC}"
echo -e "        ${DIM}├─ src/services/${NC}${GRAY}name${NC}${DIM}.service.js${NC}"
echo -e "        ${DIM}├─ src/validations/${NC}${GRAY}name${NC}${DIM}.validation.js${NC}"
echo -e "        ${DIM}├─ src/controllers/${NC}${GRAY}name${NC}${DIM}.controller.js${NC}"
echo -e "        ${DIM}└─ src/routes/v1/${NC}${GRAY}name${NC}${DIM}.routes.js${NC}"
echo ""
echo -e "    ${BOLD}${WHITE}[2]${NC} ${ACCENT}Modular Folder Structure${NC} ${DIM}(All-in-one folder)${NC}"
echo -e "        ${DIM}└─ src/modules/${NC}${GRAY}name${NC}${DIM}/${NC}"
echo -e "            ${DIM}├─ ${NC}${GRAY}name${NC}${DIM}.service.js${NC}"
echo -e "            ${DIM}├─ ${NC}${GRAY}name${NC}${DIM}.validation.js${NC}"
echo -e "            ${DIM}├─ ${NC}${GRAY}name${NC}${DIM}.controller.js${NC}"
echo -e "            ${DIM}└─ ${NC}${GRAY}name${NC}${DIM}.routes.js${NC}"
echo ""

while true; do
  echo -ne "${BOLD}${WHITE}  → Enter choice [1/2]: ${NC}"
  read STRUCTURE_CHOICE
  
  case "$STRUCTURE_CHOICE" in
    1)
      FOLDER_STRUCTURE="current"
      echo -e "${GREEN}    ✓ Selected: ${BOLD}${WHITE}Separate Folder Structure${NC}"
      break
      ;;
    2)
      FOLDER_STRUCTURE="modular"
      echo -e "${GREEN}    ✓ Selected: ${BOLD}${WHITE}Modular Folder Structure${NC}"
      break
      ;;
    *)
      echo -e "${RED}    ✗ Invalid choice. Please enter 1 or 2${NC}"
      ;;
  esac
done

echo ""

# ═══════════════════════════════════════════════════════════════════════════
# SERVICE NAME INPUT
# ═══════════════════════════════════════════════════════════════════════════
echo -e "${BOLD}${WHITE}Step 2${NC} ${GRAY}→${NC} ${WHITE}Service Name${NC}"
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo ""

while true; do
  echo -e "${CYAN}  ▸ ${NC}${WHITE}Enter service name ${DIM}(snake_case or single lowercase word)${NC}"
  echo -e "${DIM}    Examples: ${ACCENT}payment${NC}${DIM}, ${ACCENT}user_profile${NC}${DIM}, ${ACCENT}order_item${NC}"
  echo ""
  echo -ne "${BOLD}${WHITE}  → ${NC}"
  read name
  
  if [ -z "$name" ]; then
    echo -e "${RED}    ✗ Service name cannot be empty${NC}"
    echo ""
    continue
  fi
  
  # Validate the input name
  if [[ ! "$name" =~ ^[a-z]+(_[a-z]+)*$ ]]; then
    echo -e "${RED}    ✗ Service name must be in snake_case or a single lowercase word${NC}"
    echo ""
    continue
  fi
  
  echo -e "${GREEN}    ✓ Service name: ${BOLD}${WHITE}$name${NC}"
  echo ""
  break
done

# Convert the name to lowercase for file naming consistency
lower_name=$(echo "$name" | tr '[:upper:]' '[:lower:]')

# Convert snake_case to camelCase for use in imports
camel_name=$(echo "$lower_name" | sed -r 's/_([a-z])/\U\1/g')

# ═══════════════════════════════════════════════════════════════════════════
# CONFIGURATION PREVIEW
# ═══════════════════════════════════════════════════════════════════════════
echo -e "${BOLD}${WHITE}Step 3${NC} ${GRAY}→${NC} ${WHITE}Configuration Preview${NC}"
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo ""
echo -e "${GRADIENT_1}  ╭───────────────────────────────────────────────────────────╮${NC}"
echo -e "${GRADIENT_2}  │  ${BOLD}${WHITE}📊  Service Configuration${NC}                                ${GRADIENT_2}│${NC}"
echo -e "${GRADIENT_3}  ╰───────────────────────────────────────────────────────────╯${NC}"
echo ""
echo -e "    ${GRAY}Service Name${NC}       ${CYAN}$name${NC}"
echo -e "    ${GRAY}Camel Case${NC}         ${ACCENT}$camel_name${NC}"

if [ "$FOLDER_STRUCTURE" = "current" ]; then
  echo -e "    ${GRAY}Structure${NC}          ${WHITE}Separate (Distributed folders)${NC}"
  echo ""
  echo -e "    ${GRAY}Files to create:${NC}"
  echo -e "      ${DIM}├─${NC} ${CYAN}src/services/${lower_name}.service.js${NC}"
  echo -e "      ${DIM}├─${NC} ${CYAN}src/validations/${lower_name}.validation.js${NC}"
  echo -e "      ${DIM}├─${NC} ${CYAN}src/controllers/${lower_name}.controller.js${NC}"
  echo -e "      ${DIM}└─${NC} ${CYAN}src/routes/v1/${lower_name}.routes.js${NC}"
else
  echo -e "    ${GRAY}Structure${NC}          ${WHITE}Modular (All-in-one folder)${NC}"
  echo ""
  echo -e "    ${GRAY}Files to create:${NC}"
  echo -e "      ${DIM}└─${NC} ${CYAN}src/modules/${lower_name}/${NC}"
  echo -e "          ${DIM}├─${NC} ${CYAN}${lower_name}.service.js${NC}"
  echo -e "          ${DIM}├─${NC} ${CYAN}${lower_name}.validation.js${NC}"
  echo -e "          ${DIM}├─${NC} ${CYAN}${lower_name}.controller.js${NC}"
  echo -e "          ${DIM}└─${NC} ${CYAN}${lower_name}.routes.js${NC}"
fi

echo ""
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo ""

read -r -p "$(echo -e ${BOLD}${WHITE}  Proceed with scaffolding? ${NC}${DIM}[y/N]${NC} )" yn
case "$yn" in
  [Yy]* ) echo "";;
  * ) echo -e "${YELLOW}\n  ⚠ Operation cancelled by user.${NC}"; exit 0 ;;
esac

# ═══════════════════════════════════════════════════════════════════════════
# FILE GENERATION
# ═══════════════════════════════════════════════════════════════════════════
echo -e "${BOLD}${WHITE}Step 4${NC} ${GRAY}→${NC} ${WHITE}Generating Files${NC}"
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo ""

if [ "$FOLDER_STRUCTURE" = "current" ]; then
  # ═══════════════════════════════════════════════════════════════════════════
  # CURRENT FOLDER STRUCTURE (Separate folders)
  # ═══════════════════════════════════════════════════════════════════════════
  
  # Paths to folders
  services_folder="src/services"
  validations_folder="src/validations"
  controllers_folder="src/controllers"
  routes_folder="src/routes/v1"

  # Create the necessary folders if they don't exist
  mkdir -p "$services_folder" "$validations_folder" "$controllers_folder" "$routes_folder"

  # Create the service file
  service_file="$services_folder/$lower_name.service.js"
  cat <<EOL > "$service_file"
import createHttpError from "http-errors";

//Configs
import db from "../config/db.js";
EOL

  print_success "Created: ${CYAN}$service_file${NC}"

  # Create the validation file
  validation_file="$validations_folder/$lower_name.validation.js"
  cat <<EOL > "$validation_file"
import { z } from "zod";
EOL

  print_success "Created: ${CYAN}$validation_file${NC}"

  # Create the controller file
  controller_file="$controllers_folder/$lower_name.controller.js"
  cat <<EOL > "$controller_file"
//Services
import * as ${camel_name}Service from "../services/${lower_name}.service.js";

//Validations 
import * as ${camel_name}Validation from "../validations/${lower_name}.validation.js";
EOL

  print_success "Created: ${CYAN}$controller_file${NC}"

  # Create the router file
  router_file="$routes_folder/$lower_name.routes.js"
  cat <<EOL > "$router_file"
import express from "express";

//Controllers
import * as ${camel_name}Controller from "../../controllers/${lower_name}.controller.js";

//Middlewares
import * as tokenMiddleware from "../../middlewares/token.middleware.js";

//Constants
import { ROLES } from "../../constants/user.constant.js";

const router = express.Router();

export default router;
EOL

  print_success "Created: ${CYAN}$router_file${NC}"

  # Store file paths for summary
  FILES_CREATED=(
    "$service_file"
    "$validation_file"
    "$controller_file"
    "$router_file"
  )

else
  # ═══════════════════════════════════════════════════════════════════════════
  # MODULAR FOLDER STRUCTURE (All-in-one folder)
  # ═══════════════════════════════════════════════════════════════════════════
  
  # Path to module folder
  module_folder="src/modules/$lower_name"

  # Create the module folder
  mkdir -p "$module_folder"

  print_info "Creating module folder: ${CYAN}$module_folder${NC}"
  echo ""

  # Create the service file
  service_file="$module_folder/$lower_name.service.js"
  cat <<EOL > "$service_file"
import createHttpError from "http-errors";

//Configs
import db from "../../config/db.js";
EOL

  print_success "Created: ${CYAN}$service_file${NC}"

  # Create the validation file
  validation_file="$module_folder/$lower_name.validation.js"
  cat <<EOL > "$validation_file"
import { z } from "zod";
EOL

  print_success "Created: ${CYAN}$validation_file${NC}"

  # Create the controller file
  controller_file="$module_folder/$lower_name.controller.js"
  cat <<EOL > "$controller_file"
//Services
import * as ${camel_name}Service from "./${lower_name}.service.js";

//Validations 
import * as ${camel_name}Validation from "./${lower_name}.validation.js";
EOL

  print_success "Created: ${CYAN}$controller_file${NC}"

  # Create the router file
  router_file="$module_folder/$lower_name.routes.js"
  cat <<EOL > "$router_file"
import express from "express";

//Controllers
import * as ${camel_name}Controller from "./${lower_name}.controller.js";

//Middlewares
import * as tokenMiddleware from "../../middlewares/token.middleware.js";

//Constants
import { ROLES } from "../../constants/user.constant.js";

const router = express.Router();

export default router;
EOL

  print_success "Created: ${CYAN}$router_file${NC}"

  # Store file paths for summary
  FILES_CREATED=(
    "$service_file"
    "$validation_file"
    "$controller_file"
    "$router_file"
  )
fi

echo ""
echo ""
echo -e "${GRADIENT_1}╔═══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GRADIENT_2}║                                                               ║${NC}"
echo -e "${GRADIENT_2}║             ${BOLD}${GREEN}✓  O P E R A T I O N   S U C C E S S${NC}              ${GRADIENT_2}║${NC}"
echo -e "${GRADIENT_2}║                                                               ║${NC}"
echo -e "${GRADIENT_1}╚═══════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${GRADIENT_3}▸${NC} ${GRAY}Service Name${NC}         ${BOLD}${ACCENT}$name${NC}"
echo -e "  ${GRADIENT_3}▸${NC} ${GRAY}Folder Structure${NC}     ${BOLD}${CYAN}$([ "$FOLDER_STRUCTURE" = "current" ] && echo "Separate (Distributed)" || echo "Modular (All-in-one)")${NC}"
echo -e "  ${GRADIENT_3}▸${NC} ${GRAY}Files Created${NC}        ${BOLD}${WHITE}${#FILES_CREATED[@]} files${NC}"
echo ""
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo -e "${BOLD}${WHITE}  Files Created${NC}"
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo ""
for file in "${FILES_CREATED[@]}"; do
  echo -e "  ${CYAN}•${NC} ${DIM}$file${NC}"
done
echo ""
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo -e "${BOLD}${WHITE}  Next Steps${NC}"
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo ""
echo -e "  ${BOLD}${WHITE}1.${NC} ${GRAY}Import and register the route in${NC}"
echo -e "     ${CYAN}src/routes/index.js${NC}"
echo ""
echo -e "  ${BOLD}${WHITE}2.${NC} ${GRAY}Implement your service logic in${NC}"
echo -e "     ${CYAN}${service_file}${NC}"
echo ""
echo -e "  ${BOLD}${WHITE}3.${NC} ${GRAY}Add validation schemas in${NC}"
echo -e "     ${CYAN}${validation_file}${NC}"
echo ""
echo -e "  ${BOLD}${WHITE}4.${NC} ${GRAY}Create controller methods in${NC}"
echo -e "     ${CYAN}${controller_file}${NC}"
echo ""
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo -e "${DIM}  Tool: ${ACCENT}scaffold-service${NC} ${DIM}v2.0.0 | ${GRAY}© 2026 Abubakar Shaikh${NC}"
echo -e "${DIM}  Repo: ${CYAN}github.com/abubakar-shaikh-dev/scaffold-service.git${NC}"
echo -e "${DIM}${GRAY}───────────────────────────────────────────────────────────────${NC}"
echo ""

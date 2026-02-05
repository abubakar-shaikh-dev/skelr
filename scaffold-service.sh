#!/bin/bash
# Author: ABUBAKAR SHAIKH
# Github: https://github.com/abubakar-shaikh-dev

# Navigate to project root (parent directory of scripts)
cd "$(dirname "$0")/../.." || exit 1

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m' # No Color

clear

# Cool banner
echo -e "${PURPLE}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                  🏗️  SERVICE SCAFFOLDER 🏗️                     ║"
echo "║         Quickly scaffold new service boilerplate code        ║"
echo "╠══════════════════════════════════════════════════════════════╣"
echo "║ Author: ABUBAKAR SHAIKH                                      ║"
echo "║ Github: github.com/abubakar-shaikh-dev                       ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Prompt the user for the name of the service
echo -e "${CYAN}📝 Enter the name of the service ${NC} ${YELLOW}(Format: snake_case or single lowercase word)${NC} ${CYAN}: ${NC}"
read -p "Service name: " name

# Validate the input name
if [[ ! "$name" =~ ^[a-z]+(_[a-z]+)*$ ]]; then
  echo -e "${RED}❌ Error: Service name must be in snake_case or a single lowercase word.${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Valid service name: ${CYAN}$name${NC}"
echo ""

# Convert the name to lowercase for file naming consistency
lower_name=$(echo "$name" | tr '[:upper:]' '[:lower:]')

# Convert snake_case to camelCase for use in imports
camel_name=$(echo "$lower_name" | sed -r 's/_([a-z])/\U\1/g')

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

echo -e "${GREEN}✅ Created: ${CYAN}$service_file${NC}"

# Create the validation file
validation_file="$validations_folder/$lower_name.validation.js"
cat <<EOL > "$validation_file"
import { z } from "zod";
EOL

echo -e "${GREEN}✅ Created: ${CYAN}$validation_file${NC}"

# Create the controller file
controller_file="$controllers_folder/$lower_name.controller.js"
cat <<EOL > "$controller_file"
//Services
import * as ${camel_name}Service from "../services/${lower_name}.service.js";

//Validations 
import * as ${camel_name}Validation from "../validations/${lower_name}.validation.js";
EOL

echo -e "${GREEN}✅ Created: ${CYAN}$controller_file${NC}"

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

echo -e "${GREEN}✅ Created: ${CYAN}$router_file${NC}"

echo ""
echo -e "${GREEN}"
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                        🎉 SUCCESS! 🎉                        ║"
echo "║               Service scaffolded successfully!               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${WHITE}📦 Service: ${CYAN}$name${NC}"
echo -e "${WHITE}📁 Files created:${NC}"
echo -e "   ${CYAN}• $service_file${NC}"
echo -e "   ${CYAN}• $validation_file${NC}"
echo -e "   ${CYAN}• $controller_file${NC}"
echo -e "   ${CYAN}• $router_file${NC}"
echo ""
echo -e "${YELLOW}💡 Next steps:${NC}"
echo -e "   ${WHITE}1. Import and register the route in src/routes/index.js${NC}"
echo -e "   ${WHITE}2. Implement your service logic${NC}"
echo -e "   ${WHITE}3. Add validation schemas${NC}"
echo -e "   ${WHITE}4. Create controller methods${NC}"

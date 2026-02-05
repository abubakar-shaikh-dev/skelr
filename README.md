# scaffold-service

> Quickly scaffold service boilerplate code with organized folder structures

[![npm version](https://img.shields.io/npm/v/scaffold-service.svg)](https://www.npmjs.com/package/scaffold-service)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/node/v/scaffold-service.svg)](https://nodejs.org)

A CLI tool to generate Node.js service components with two folder structure options: **Separate Folder Structure** (normal way) or **Modular Folder Structure** (all-in-one).

## ✨ Features

- 🚀 **Two Structure Options** - Choose between separate or modular organization
- 🎨 **Interactive CLI** - Beautiful command-line interface with color-coded output
- 📦 **Consistent Naming** - Generates service, controller, validation, and route files
- ⚡ **ES6+ Ready** - Modern JavaScript with import/export syntax
- 🔧 **Validation Included** - Pre-configured request validation structure

## 📋 Prerequisites

- Node.js >= 18.0.0
- npm or yarn

## 📦 Installation

### Global Installation (Recommended)

```bash
npm install -g scaffold-service
```

### Use with npx (No Installation)

```bash
npx scaffold-service
```

## 🚀 Usage

Navigate to your project's root directory and run:

```bash
scaffold-service
```

Or if using npx:

```bash
npx scaffold-service
```

Follow the interactive prompts:

1. **Choose folder structure type** - Separate or Modular
2. **Enter service name** - Use snake_case (e.g., `user_profile`, `payment`)
3. **Confirm configuration** - Review and confirm
4. **Done!** - Files are created in your project

## 📁 Folder Structure Options

### Option 1: Separate Folder Structure (Normal Way)

Files are distributed across different folders by type:

```
src/
├── services/
│   └── user_profile.service.js       # Business logic
├── validations/
│   └── user_profile.validation.js    # Request validation
├── controllers/
│   └── user_profile.controller.js    # Route handlers
└── routes/
    └── v1/
        └── user_profile.routes.js    # API routes
```

**Best for:** Traditional projects, larger teams, separation of concerns

### Option 2: Modular Folder Structure (All-in-One)

All related files are grouped in one module folder:

```
src/
└── modules/
    └── user_profile/
        ├── user_profile.service.js
        ├── user_profile.validation.js
        ├── user_profile.controller.js
        └── user_profile.routes.js
```

**Best for:** Feature-based organization, microservices, easier navigation

## 📝 Generated Files

Each scaffold creates 4 files:

- \*\*� Examples

### Example 1: Creating a User Profile Service (Separate Structure)

```bash
$ scaffold-service

Step 1 → Folder Structure
  ▸ Select folder structure type

    [1] Separate Folder Structure (Distributed across folders)
    [2] Modular Folder Structure (All-in-one folder)

→ Enter choice [1/2]: 1
    ✓ Selected: Separate Folder Structure

Step 2 → Service Name
  ▸ Enter service name (snake_case or single lowercase word)
    Examples: payment, user_profile, order_item

→ user_profile
    ✓ Service name: user_profile

Step 3 → Configuration Preview
  ╭───────────────────────────────────────────────────────╮
  │  📊  Service Configuration                            │
  ╰───────────────────────────────────────────────────────╯
    Service Name (snake_case):  user_profile
    CamelCase Name:             userProfile
    Folder Structure:           Separate Folder Structure

    Files to be created:
      ✓ src/services/user_profile.service.js
      ✓ src/validations/user_profile.validation.js
      ✓ src/controllers/user_profile.controller.js
      ✓ src/routes/v1/user_profile.routes.js

✓ Proceed with creation? (Y/n): Y

✅ Se� Naming Convention

- **Service name:** Use `snake_case` (e.g., `user_profile`, `payment`, `order_item`)
- **Function names:** Automatically converted to `camelCase` in code
- **File names:** Follow the pattern `{service_name}.{type}.js`

## 🤝 Contributing

Contributions and issues are welcome! Visit the [GitHub repository](https://github.com/abubakar-shaikh-dev/scaffold-service

Step 1 → Folder Structure
→ Enter choice [1/2]: 2
    ✓ Selected: Modular Folder Structure

Step 2 → Service Name
→ payment
    ✓ Service name: payment

Step 3 → Configuration Preview
    Service Name (snake_case):  payment
    CamelCase Name:             payment
    Folder Structure:           Modular Folder Structure

    Files to be created:
      ✓ src/modules/payment/payment.service.js
      ✓ src/modules/payment/payment.validation.js
      ✓ src/modules/payment/payment.controller.js
      ✓ src/modules/payment/payment.routes.js

✓ Proceed with creation? (Y/n): Y

✅ Service 'payment' created successfully!
```

## 📋 File Templates

### Service File (`.service.js`)

```javascript
// Business logic functions
const getAll = async () => {
  /* ... */
};
const getById = async (id) => {
  /* ... */
};
const create = async (data) => {
  /* ... */
};
const update = async (id, data) => {
  /* ... */
};
const remove = async (id) => {
  /* ... */
};

export default { getAll, getById, create, update, remove };
```

### Controller File (`.controller.js`)

```javascript
// HTTP request handlers
const getAll = async (req, res) => {
  /* ... */
};
const getById = async (req, res) => {
  /* ... */
};
const create = async (req, res) => {
  /* ... */
};
const update = async (req, res) => {
  /* ... */
};
const remove = async (req, res) => {
  /* ... */
};

export default { getAll, getById, create, update, remove };
```

### Routes File (`.routes.js`)

```javascript
import express from 'express';
const router = express.Router();

router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/', validate, controller.create);
router.patch('/:id', validate, controller.update);
router.delete('/:id', controller.remove);

export default router;
# Start development server
npm run dev

# Start production server
npm start
```

## 📚 Documentation

For more detailed documentation, visit the [GitHub repository](https://github.com/abubakar-shaikh-dev/scaffold-service).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/abubakar-shaikh-dev/scaffold-service/issues).

## 📄 License

This project is [MIT](LICENSE) licensed.

## 👤 Author

**ABUBAKAR SHAIKH**

- GitHub: [@abubakar-shaikh-dev](https://github.com/abubakar-shaikh-dev)
- Repository: [scaffold-service](https://github.com/abubakar-shaikh-dev/scaffold-service)

## ⭐ Show your support

Give a ⭐️ if this project helped you!

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.

---

Created by [ABUBAKAR SHAIKH](https://github.com/abubakar-shaikh-dev)

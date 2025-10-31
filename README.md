# AI-Powered Test Case Generator for Kiwi TCMS

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Architecture](#architecture)
4. [Prerequisites](#prerequisites)
5. [Project Structure](#project-structure)
6. [Installation](#installation)
7. [Environment Configuration](#environment-configuration)
8. [Template Files](#template-files)
9. [Usage](#usage)
10. [Kiwi TCMS Integration](#kiwi-tcms-integration)
11. [Output Files](#output-files)
12. [AI Integration Details](#ai-integration-details)
13. [Document Generation](#document-generation)
14. [Development](#development)
15. [Scripts](#scripts)
16. [Troubleshooting](#troubleshooting)
17. [Contributing](#contributing)
18. [License](#license)

## Overview

An intelligent TypeScript application that leverages **Groq AI** to automatically generate comprehensive test cases from Excel requirements and seamlessly integrates with **Kiwi TCMS** (Test Case Management System). The system analyzes business requirements and produces structured test cases in Gherkin format, supporting both TCMS integration and professional Word document generation.

**What it does:**

- Reads requirements from Excel files
- Uses AI to generate comprehensive test cases (Happy Path, Edge Cases, Negative scenarios)
- Automatically uploads test cases to Kiwi TCMS
- Generates professional Word documents with formatted test case tables
- Exports JSON files for further processing

**Target Users:** QA Engineers, Test Managers, and QA Teams working in agile environments who need to rapidly convert business requirements into executable test cases.

## Key Features

- 🤖 **AI-Powered Generation**: Uses Groq AI (GPT-OSS-20B) with specialized QA prompts
- 📊 **Excel Integration**: Parses structured requirements from Excel files
- 🥒 **Gherkin Format**: BDD-style test cases (Given/When/Then)
- 🔄 **Kiwi TCMS Integration**: Automatic authentication and test case upload
- 📝 **Dual Output**: TCMS-ready and documentation-ready formats
- 📄 **Professional Documentation**: Formatted Word documents with tables
- 🔐 **Secure Authentication**: Handles CSRF tokens and session management
- 🎯 **Comprehensive Coverage**: Minimum 10 test cases per requirement
- 🌐 **Spanish Language Support**: All content generated in Spanish
- ♻️ **Retry Mechanism**: Automatic retry with exponential backoff
- 📦 **JSON Export**: Saves test cases in structured JSON format

## Architecture

```
┌──────────────────┐
│  requirements.   │
│     xlsx         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐     ┌──────────────────┐
│  Excel Parser    │────▶│   Groq AI API    │
│  (XLSX Reader)   │     │  (GPT-OSS-20B)   │
└──────────────────┘     └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │  Test Cases      │
                         │  (Gherkin)       │
                         └────────┬─────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    ▼                           ▼
         ┌──────────────────┐        ┌──────────────────┐
         │  Kiwi TCMS       │        │  Word Document   │
         │  (HTTP Upload)   │        │  Generator       │
         └──────────────────┘        └──────────────────┘
                    │                           │
                    ▼                           ▼
         ┌──────────────────┐        ┌──────────────────┐
         │  testcases.json  │        │ final_document.  │
         │  data.json       │        │     docx         │
         └──────────────────┘        └──────────────────┘
```

## Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

| Software           | Version | Purpose                            | Installation Link                                                                          |
| ------------------ | ------- | ---------------------------------- | ------------------------------------------------------------------------------------------ |
| **Node.js**        | ≥ 18.x  | JavaScript runtime                 | [Download Node.js](https://nodejs.org/)                                                    |
| **npm**            | ≥ 9.x   | Package manager                    | Included with Node.js                                                                      |
| **Kiwi TCMS**      | Latest  | Test Case Management System        | [Kiwi TCMS Docker Guide](https://kiwitcms.readthedocs.io/en/latest/installing_docker.html) |
| **Docker**         | Latest  | Container platform (for Kiwi TCMS) | [Get Docker](https://docs.docker.com/get-docker/)                                          |
| **Docker Compose** | Latest  | Multi-container orchestration      | [Install Docker Compose](https://docs.docker.com/compose/install/)                         |

### Kiwi TCMS Setup

👉 **Official Installation Guide**: [Kiwi TCMS Docker Installation](https://kiwitcms.readthedocs.io/en/latest/installing_docker.html)

**Quick Setup:**

```bash
# Clone Kiwi TCMS
git clone https://github.com/kiwitcms/Kiwi.git
cd Kiwi

# Start Kiwi TCMS with Docker Compose
docker-compose up -d

# Access Kiwi TCMS at https://localhost
# Default credentials: admin / admin (change immediately!)
```

### API Requirements

- **Groq API Key**: Sign up at [Groq Console](https://console.groq.com/) to get your API key

## Project Structure

```
generate-testcases-and-docs/
├── src/
│   ├── common/
│   │   ├── utils/
│   │   │   ├── doc-utils.ts         # Word document generation
│   │   │   ├── groq-utls.ts         # AI integration with Groq
│   │   │   ├── import-test-cases.ts # Kiwi TCMS upload
│   │   │   ├── read-requirements.ts # Excel parsing
│   │   │   └── utils.ts             # Login & utilities
│   │   ├── constants.ts             # Application constants
│   │   └── types.ts                 # TypeScript definitions
│   ├── data/
│   │   ├── data.ts                  # Sample test case data
│   │   ├── prompts.ts               # AI prompt templates
│   │   └── testcases.ts             # Static examples
│   └── index.ts                     # Main entry point
├── requirements.xlsx                # INPUT: Your requirements
├── template_requirements_example.xlsx # Template reference
├── original.docx                   # Optional: Base document
├── final_document.docx             # OUTPUT: Generated docs
├── testcases.json                  # OUTPUT: TCMS format
├── data.json                       # OUTPUT: Doc format
├── .env                           # Environment variables
├── .env.example                   # Environment template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
└── README.md                      # This file
```

## Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/Strako/Generate-testcases-and-docs.git
cd Generate-testcases-and-docs
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Project

```bash
npm run build
```

This compiles TypeScript to JavaScript and creates `index.js`.

## Environment Configuration

### Create .env File

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

### Environment Variables

Edit `.env` with your configuration:

```env
# ============================================
# GROQ AI CONFIGURATION
# ============================================
# Your Groq API key from https://console.groq.com/
GROQ_API_KEY=gsk_your_actual_groq_api_key_here

# ============================================
# KIWI TCMS CONFIGURATION
# ============================================
# Kiwi TCMS username (default: admin)
TCMS_USER=admin

# Kiwi TCMS password (change from default!)
TCMS_PASSWORD=your_secure_password

# Default tester username for test case assignment
DEFAULT_TESTER=admin
```

### Variable Descriptions

| Variable         | Required | Default | Description                                         |
| ---------------- | -------- | ------- | --------------------------------------------------- |
| `GROQ_API_KEY`   | ✅ Yes   | -       | API key from Groq Console for AI generation         |
| `TCMS_USER`      | ✅ Yes   | -       | Kiwi TCMS username for authentication               |
| `TCMS_PASSWORD`  | ✅ Yes   | -       | Kiwi TCMS password for authentication               |
| `DEFAULT_TESTER` | ✅ Yes   | -       | Username to assign as default tester for test cases |

### Security Notes

⚠️ **Important:**

- Never commit `.env` to version control (already in `.gitignore`)
- Change default Kiwi TCMS credentials immediately after installation
- Use strong passwords for production environments
- Rotate API keys regularly

## Template Files

### 1. Requirements Excel File

**Filename:** `requirements.xlsx`

**Location:** Project root directory

**Purpose:** Contains business requirements that will be converted to test cases

**Structure:**

| Column             | Type   | Required | Description                                   | Example                     |
| ------------------ | ------ | -------- | --------------------------------------------- | --------------------------- |
| **Module**         | String | Yes      | Module/feature name (creates section headers) | "User Management"           |
| **Description**    | String | Yes      | Brief functionality description               | "User registration process" |
| **Requirement ID** | String | Yes      | Unique requirement identifier                 | "REQ-001"                   |
| **Requirement**    | String | Yes      | Detailed requirement description              | "The system must allow..."  |
| **Consideration**  | String | Optional | Additional constraints or notes               | "Validate email format"     |

**Example Content:**

```
| Module              | Description                  | Requirement ID   | Requirement                                        | Consideration                    |
|---------------------|------------------------------|------------------|----------------------------------------------------|----------------------------------|
| User Management     | User registration process    | REQ-001          | The system must allow registration with email      | Validate format and uniqueness   |
| User Management     | User login functionality     | REQ-002          | The system must authenticate users with credentials| Maximum 3 failed attempts       |
| Product Management  | Create new product           | REQ-003          | Allow creating products with name and price        | Price must be greater than 0     |
```

**Template File:** Use `template_requirements_example.xlsx` as a reference (columns are in English)

### 2. Original Document (Optional)

**Filename:** `original.docx`

**Location:** Project root directory

**Purpose:** Base Word document to merge new test cases into

**When to use:**

- You have existing documentation you want to append to
- You want to maintain consistent formatting across documents
- You're adding test cases to an existing test plan

**If not present:**

- System creates a new document from scratch
- No merging occurs, only new content is generated

### 3. Environment Template

**Filename:** `.env.example`

**Location:** Project root directory

**Purpose:** Template for environment variables

**Content:**

```env
# Groq AI API Key
GROQ_API_KEY=your_groq_api_key_here

# Kiwi TCMS Credentials
TCMS_USER=admin
TCMS_PASSWORD=your_password
DEFAULT_TESTER=admin
```

## Usage

### Basic Execution

Run the complete workflow with required parameters:

```bash
npm start -- --product=1 --category=1
```

**Parameters:**

- `--product=<id>`: Product ID in Kiwi TCMS (required)
- `--category=<id>`: Category ID in Kiwi TCMS (required)

### What Happens When You Run

1. ✅ **Validates** environment variables and parameters
2. 🔐 **Authenticates** with Kiwi TCMS (obtains session tokens)
3. 📖 **Parses** `requirements.xlsx` file
4. 🤖 **Sends** each requirement to Groq AI for test case generation
5. 📝 **Processes** AI responses and extracts structured test cases
6. 💾 **Saves** JSON files (`testcases.json`, `data.json`)
7. ⬆️ **Uploads** test cases to Kiwi TCMS
8. 📄 **Generates** Word document (`final_document.docx`)

### Development Mode

For development with auto-rebuild on file changes:

```bash
npm run watch
```

This watches for TypeScript changes and automatically rebuilds.

### Finding Product and Category IDs

**In Kiwi TCMS:**

1. Navigate to **Management** → **Products**
2. Click on your product
3. Check the URL: `https://localhost/admin/management/product/<ID>/change/`
4. The number is your Product ID

For Category ID:

1. Go to **Management** → **Categories**
2. Click on your category
3. Check the URL for the Category ID

### Example Commands

```bash
# Standard execution
npm start -- --product=1 --category=2

# Different product/category
npm start -- --product=5 --category=3

# Build before running
npm run build && npm start -- --product=1 --category=1
```

## Kiwi TCMS Integration

### Overview

The application integrates with Kiwi TCMS through HTTP API calls, handling authentication, session management, and test case creation automatically.

### Authentication Flow

```
1. GET /accounts/login/
   └─> Extract CSRF token from HTML

2. POST /accounts/login/
   └─> Submit credentials
   └─> Receive session cookies (csrftoken, sessionid)

3. GET /cases/new/
   └─> Extract updated CSRF middleware token

4. POST /cases/new/ (for each test case)
   └─> Create test case with all tokens
```

### Connection Details

**Base URL:** `https://localhost` (default Kiwi TCMS Docker setup)

**Endpoints Used:**

- `/accounts/login/` - Authentication
- `/cases/new/` - Test case creation

**Authentication Method:**

- Form-based login with CSRF protection
- Session cookies (csrftoken, sessionid)
- CSRF middleware token for POST requests

### Test Case Upload

Each test case is uploaded with:

```typescript
{
  summary: "[REQ-001] - Test case title",
  text: "Feature: ...\nScenario: ...\nGiven: ...",
  product: "1",
  category: "1",
  default_tester: "admin",
  case_status: "2",  // Confirmed
  priority: "1",     // High
  author: "2"        // System user
}
```

### SSL Configuration

⚠️ **Development Only:**

The application disables SSL verification for local development:

```typescript
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
```

**For Production:**

- Remove this setting
- Use valid SSL certificates
- Configure proper HTTPS

### Kiwi TCMS Resources

- 📚 [Official Documentation](https://kiwitcms.readthedocs.io/)
- 🐳 [Docker Installation Guide](https://kiwitcms.readthedocs.io/en/latest/installing_docker.html)
- 🔌 [API Documentation](https://kiwitcms.readthedocs.io/en/latest/api/index.html)

## Test cases objects and Output file

### 1. TCMS test cases object

**Format:** TCMS-ready test cases

**Purpose:** Direct upload to Kiwi TCMS

**Structure:**

```json
[
  {
    "title": "[REQ-001] - Registrar usuario con email válido",
    "content": "Feature: Registro de usuarios\nScenario: Registro exitoso con datos válidos\nGiven: El usuario tiene un email válido\nWhen: Envía el formulario de registro\nThen: El sistema crea la cuenta exitosamente\nAnd: Envía email de confirmación\nTipo de test case: Happy Path"
  },
  {
    "title": "[REQ-001] - Error al registrar con email inválido",
    "content": "Feature: Registro de usuarios\nScenario: Intento de registro con email inválido\nGiven: El usuario ingresa un email con formato inválido\nWhen: Envía el formulario de registro\nThen: El sistema rechaza el registro\nAnd: Muestra mensaje de error\nTipo de test case: Validación Negativa"
  }
]
```

### 2. Word test cases object

**Format:** Documentation-ready test cases

**Purpose:** Word document generation

**Structure:**

```json
[
  {
    "title": "[REQ-001] - Registrar usuario con email válido",
    "description": "Feature: Registro de usuarios\nScenario: Registro exitoso con datos válidos",
    "test_case": "Given: El usuario tiene un email válido\nWhen: Envía el formulario de registro\nThen: El sistema crea la cuenta exitosamente\nAnd: Envía email de confirmación",
    "test_type": "Happy Path",
    "isFirst": true
  },
  {
    "title": "[REQ-001] - Error al registrar con email inválido",
    "description": "Feature: Registro de usuarios\nScenario: Intento de registro con email inválido",
    "test_case": "Given: El usuario ingresa un email con formato inválido\nWhen: Envía el formulario de registro\nThen: El sistema rechaza el registro\nAnd: Muestra mensaje de error",
    "test_type": "Validación Negativa",
    "isFirst": false
  }
]
```

### 3. final_document.docx

**Format:** Microsoft Word document

**Purpose:** Professional test case documentation

**Features:**

- Formatted tables with blue headers
- Sequential test case IDs
- Module-based sections with headings
- Professional styling

**Table Structure:**

| Field          | Content                                     |
| -------------- | ------------------------------------------- |
| **ID – 1228**  | Blue header with white text                 |
| Título         | Test case title with requirement prefix     |
| Descripción    | Feature and scenario description            |
| Caso de prueba | Gherkin steps (Given/When/Then/And)         |
| Tipo de test   | Test category (Happy Path, Edge Case, etc.) |

## AI Integration Details

### Groq AI Configuration

**Model:** `openai/gpt-oss-20b`

**Settings:**

```typescript
{
  model: "openai/gpt-oss-20b",
  temperature: 1,
  max_completion_tokens: 8192,
  top_p: 1,
  reasoning_effort: "medium",
  tool_choice: "auto"
}
```

### AI Prompt Engineering

The system uses a specialized QA Engineer profile that:

✅ **Language:** All outputs in Spanish
✅ **Format:** Gherkin BDD (Given/When/Then)
✅ **Coverage:** Happy Path + Edge Cases + Negative scenarios
✅ **Minimum:** 10 test cases per requirement
✅ **Structure:** Dual JSON output (TCMS + Documentation)

### Prompt Structure

```
Role: Quality Assurance Engineer
Task: Generate comprehensive test cases in Gherkin format
Input: Business requirement (JSON)
Output: Structured test cases via function calling

Requirements:
- Use Spanish for all content
- Follow Gherkin keywords (Given/When/Then/And)
- Generate minimum 10 test cases
- Cover all scenarios (positive, negative, edge cases)
- Use tool "saveTestCases" to return structured data
```

### Retry Mechanism

**Configuration:**

- **Retries:** 3 attempts
- **Delay:** 1000ms between attempts
- **Backoff:** Linear delay
- **Error Handling:** Detailed logging and graceful exit

**Flow:**

```
Attempt 1 → Success ✅
         ↓ Failure
Attempt 2 (wait 1s) → Success ✅
                   ↓ Failure
Attempt 3 (wait 1s) → Success ✅
                   ↓ Failure
Exit with error ❌
```

### Function Calling

The AI uses structured function calling to return data:

**Function:** `saveTestCases`

**Parameters:**

```typescript
{
  testCaseDoc: TestCaseDoc[],  // For documentation
  testCaseTCMS: TestCaseTCMS[] // For TCMS upload
}
```

## Document Generation

### Word Document Features

- **Professional Styling:** Blue headers (#0E4CB2) with white text
- **Structured Tables:** Each test case in formatted table
- **Sequential Numbering:** Auto-incrementing IDs (starts at 1228)
- **Section Organization:** Module-based grouping with H1 headings
- **Merge Capability:** Combines with existing `original.docx`
- **Page Breaks:** Automatic page breaks between sections

### Document Merging Process

1. **Check for original.docx**
   - If exists: Merge mode
   - If not: Create new document

2. **Generate new content**
   - Create tables for each test case
   - Add module headings

3. **Merge documents** (if original exists)
   - Extract XML from both documents
   - Insert page break
   - Combine content
   - Preserve formatting

4. **Save output**
   - Write to `final_document.docx`

### Customization

**Change starting ID:**

Edit `src/common/utils/doc-utils.ts`:

```typescript
let TEST_ID = 1228; // Change this value
```

**Change header color:**

```typescript
shading: {
  fill: "0E4CB2", // Change hex color
  type: ShadingType.CLEAR,
  color: "auto",
}
```

## Development

### Code Quality Tools

- **ESLint:** Linting with TypeScript support
- **Prettier:** Code formatting
- **TypeScript:** Strict type checking
- **Modern ES Modules:** Latest JavaScript features

### Build Process

**Tool:** esbuild (fast bundler)

**Configuration:**

```javascript
{
  bundle: true,
  platform: "node",
  format: "esm",
  external: ["fs", "path", "pizzip", "docx", "groq-sdk", "node-fetch", "dotenv"]
}
```

### Project Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode (watch)
npm run watch

# Run application
npm start -- --product=1 --category=1

# Lint code
npm run lint

# Format code
npm run format
```

### TypeScript Configuration

**Target:** ES2020
**Module:** Preserve (ESM)
**Strict Mode:** Enabled
**Output:** `./js` directory

### Adding New Features

1. **Create feature branch**

   ```bash
   git checkout -b feature/new-feature
   ```

2. **Implement changes**
   - Add types in `src/common/types.ts`
   - Add constants in `src/common/constants.ts`
   - Create utility functions in `src/common/utils/`

3. **Build and test**

   ```bash
   npm run build
   npm start -- --product=1 --category=1
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   git push origin feature/new-feature
   ```

## Scripts

| Script    | Command                                 | Description                         |
| --------- | --------------------------------------- | ----------------------------------- |
| **start** | `npm start -- --product=X --category=Y` | Run the application with parameters |
| **build** | `npm run build`                         | Build TypeScript to JavaScript      |
| **watch** | `npm run watch`                         | Development mode with auto-rebuild  |
| **test**  | `npm test`                              | Run test suite (placeholder)        |

### Script Details

**start:**

```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 node index.js
```

- Disables SSL verification (development only)
- Runs compiled JavaScript

**build:**

```bash
esbuild src/index.ts --bundle --outfile=index.js --platform=node --format=esm [externals]
```

- Bundles TypeScript to single JavaScript file
- Excludes Node.js built-ins and large dependencies

**watch:**

```bash
esbuild src/index.ts --bundle --outfile=index.js --watch [options]
```

- Same as build but watches for changes
- Auto-rebuilds on file save

## Troubleshooting

### Common Issues and Solutions

#### 1. Missing Environment Variables

**Error:**

```
Missing credentials: TCMS_USER or TCMS_PASSWORD missing in .env
```

**Solution:**

- Ensure `.env` file exists in project root
- Verify all required variables are set:
  ```env
  GROQ_API_KEY=your_key
  TCMS_USER=admin
  TCMS_PASSWORD=your_password
  DEFAULT_TESTER=admin
  ```

#### 2. Missing Command Line Parameters

**Error:**

```
Missing params: -- --product=x --category=y
```

**Solution:**

- Always provide product and category IDs:
  ```bash
  npm start -- --product=1 --category=1
  ```
- Find IDs in Kiwi TCMS admin panel

#### 3. Kiwi TCMS Connection Failed

**Error:**

```
❌ Login failed: Missing: csrftoken sessionid
```

**Solutions:**

- Verify Kiwi TCMS is running:
  ```bash
  docker ps | grep kiwi
  ```
- Check credentials in `.env`
- Ensure Kiwi TCMS is accessible at `https://localhost`
- Try accessing Kiwi TCMS in browser first

#### 4. Requirements File Not Found

**Error:**

```
File ./requirements.xlsx wont exist
```

**Solution:**

- Create `requirements.xlsx` in project root
- Use `template_requirements_example.xlsx` as reference
- Ensure file has correct structure (see Template Files section)

#### 5. Groq API Errors

**Error:**

```
Error while fetching GROQ: [error details]
```

**Solutions:**

- Verify API key is correct in `.env`
- Check Groq API status: [https://status.groq.com/](https://status.groq.com/)
- Ensure you have API credits/quota
- Check internet connection

#### 6. CSRF Token Mismatch

**Error:**

```
❌ csrfmiddlewaretoken not found in /cases/new page
```

**Solutions:**

- Clear browser cookies for Kiwi TCMS
- Restart Kiwi TCMS Docker container:
  ```bash
  docker-compose restart
  ```
- Check if Kiwi TCMS version is compatible

#### 7. SSL Certificate Errors

**Error:**

```
UNABLE_TO_VERIFY_LEAF_SIGNATURE
```

**Solution:**

- For development, SSL verification is already disabled
- For production, use valid SSL certificates
- Configure proper HTTPS in Kiwi TCMS

#### 8. Build Errors

**Error:**

```
Cannot find module 'xyz'
```

**Solution:**

- Reinstall dependencies:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Ensure Node.js version ≥ 18.x

#### 9. Document Generation Fails

**Error:**

```
❌ Error merging documents
```

**Solutions:**

- Check if `original.docx` is corrupted
- Remove `original.docx` to create new document
- Ensure write permissions in project directory

#### 10. Test Cases Not Uploading

**Error:**

```
❌ Error at creating test case: [title]
```

**Solutions:**

- Verify product and category IDs exist in Kiwi TCMS
- Check user permissions in Kiwi TCMS
- Ensure `DEFAULT_TESTER` user exists
- Review Kiwi TCMS logs:
  ```bash
  docker-compose logs -f
  ```

### Debug Mode

Enable detailed logging:

```bash
# Add to your command
DEBUG=* npm start -- --product=1 --category=1
```

### Getting Help

If issues persist:

1. Check [Kiwi TCMS Documentation](https://kiwitcms.readthedocs.io/)
2. Review [Groq API Documentation](https://console.groq.com/docs)
3. Open an issue: [GitHub Issues](https://github.com/Strako/Generate-testcases-and-docs/issues)
4. Include:
   - Error message
   - Steps to reproduce
   - Environment details (Node version, OS)
   - Relevant logs

## Contributing

### Development Setup

1. **Fork the repository**

   ```bash
   git clone https://github.com/YOUR_USERNAME/Generate-testcases-and-docs.git
   cd Generate-testcases-and-docs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment**

   ```bash
   cp .env.example .env
   # Edit .env with your credentials
   ```

4. **Create feature branch**

   ```bash
   git checkout -b feature/amazing-feature
   ```

5. **Make changes and test**

   ```bash
   npm run build
   npm start -- --product=1 --category=1
   ```

6. **Commit changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

7. **Push and create PR**
   ```bash
   git push origin feature/amazing-feature
   ```

### Code Standards

- **TypeScript:** Use strict typing
- **ESLint:** Follow linting rules
- **Prettier:** Format code before commit
- **Commits:** Use conventional commits (feat:, fix:, docs:, etc.)
- **Documentation:** Update README for new features

### Pull Request Guidelines

✅ **Before submitting:**

- Code builds without errors
- All existing functionality works
- New features are documented
- Code follows project style
- No sensitive data in commits

📝 **PR Description should include:**

- What changes were made
- Why the changes were needed
- How to test the changes
- Screenshots (if UI changes)

### Areas for Contribution

- 🐛 Bug fixes
- ✨ New features
- 📚 Documentation improvements
- 🧪 Test coverage
- 🎨 UI/UX improvements
- 🌐 Internationalization
- ⚡ Performance optimizations

## License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2024

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## Quick Start Summary

```bash
# 1. Clone and install
git clone https://github.com/Strako/Generate-testcases-and-docs.git
cd Generate-testcases-and-docs
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your credentials

# 3. Prepare requirements
# Create requirements.xlsx with your requirements

# 4. Build
npm run build

# 5. Run
npm start -- --product=1 --category=1
```

---

## Links and Resources

- 📦 **Repository:** [GitHub](https://github.com/Strako/Generate-testcases-and-docs)
- 🐛 **Issues:** [Report Bugs](https://github.com/Strako/Generate-testcases-and-docs/issues)
- 🥝 **Kiwi TCMS:** [Official Site](https://kiwitcms.org/)
- 🐳 **Kiwi Docker:** [Installation Guide](https://kiwitcms.readthedocs.io/en/latest/installing_docker.html)
- 🤖 **Groq AI:** [Console](https://console.groq.com/)
- 📚 **Documentation:** [Kiwi TCMS Docs](https://kiwitcms.readthedocs.io/)

---

**Made with ❤️ for QA Engineers**

_Automate your test case generation and focus on what matters: quality assurance._

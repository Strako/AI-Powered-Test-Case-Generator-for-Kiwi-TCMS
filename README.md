# AI-Powered Test Case Generator

## Table of Contents

1. [Overview](#overview)
2. [Key Features](#key-features)
3. [Architecture](#architecture)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Configuration](#configuration)
7. [Usage](#usage)
8. [Input Requirements](#input-requirements)
9. [AI Integration](#ai-integration)
10. [Output Formats](#output-formats)
11. [Document Generation](#document-generation)
12. [Development](#development)
13. [Scripts](#scripts)
14. [Dependencies](#dependencies)
15. [Contributing](#contributing)

## Overview

An intelligent TypeScript application that leverages AI to automatically generate comprehensive test cases from Excel requirements. The system uses **Groq AI** to analyze requirements and produce structured test cases in Gherkin format, supporting both TCMS integration and professional Word document generation.

This tool is specifically designed for QA Engineers working in agile environments who need to rapidly convert business requirements into executable test cases with complete coverage.

## Key Features

- **🤖 AI-Powered Generation**: Uses Groq AI (GPT-OSS-20B) to intelligently create test cases from requirements
- **📊 Excel Integration**: Reads requirements directly from Excel files with structured parsing
- **🥒 Gherkin Format**: Generates BDD-style test cases with Given/When/Then structure
- **📝 Dual Output**: Creates both TCMS-ready and documentation-ready formats
- **📄 Documentation**: Generates formatted Word documents with tables and styling
- **🔄 Document Merging**: Combines new test cases with existing documentation
- **🛠️ TCMS Integration**: Direct upload capability to Test Case Management Systems
- **🎯 Comprehensive Coverage**: Ensures Happy Path, Edge Cases, and Negative scenarios
- **🌐 Spanish Language Support**: All generated content in Spanish for localized teams

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Excel File    │───▶│   AI Processor  │───▶│  Test Cases     │
│ (Requirements)  │    │   (Groq API)    │    │ (Gherkin Format)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   TCMS Upload   │◀───│   Dual Output   │───▶│  Word Document  │
│   (HTTP API)    │    │   Generator     │    │ (Documentation) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Project Structure

```
├── src/
│   ├── common/
│   │   ├── utils/
│   │   │   ├── doc-utils.ts         # Word document generation
│   │   │   ├── groq-utils.ts        # AI integration with Groq
│   │   │   ├── import-test-cases.ts # TCMS upload functionality
│   │   │   ├── read-requirements.ts # Excel parsing utilities
│   │   │   └── utils.ts             # General utilities
│   │   ├── constants.ts             # Application constants
│   │   └── types.ts                 # TypeScript type definitions
│   ├── data/
│   │   ├── data.ts                  # Sample test case data
│   │   ├── prompts.ts               # AI prompt templates
│   │   └── testcases.ts             # Static test case examples
│   └── index.ts                     # Main application entry point
├── requirements.xlsx                # Input requirements file
├── template_requirements_example.xlsx # Template for requirements
├── original.docx                   # Base document for merging
├── final_document.docx             # Generated output document
├── .env                           # Environment variables (API keys)
├── package.json                   # Dependencies and scripts
└── tsconfig.json                  # TypeScript configuration
```

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Strako/Generate-testcases-and-docs.git
   cd Generate-testcases-and-docs
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   ```bash
   cp .env.example .env
   # Edit .env and add your Groq API key
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

## Configuration

### Environment Variables

Create a `.env` file with your Groq API credentials:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Requirements File

Place your requirements in `requirements.xlsx` following this structure:

| Módulo          | Descripción            | ID Requerimiento | Requerimiento                        | Consideración             |
| --------------- | ---------------------- | ---------------- | ------------------------------------ | ------------------------- |
| User Management | User registration flow | REQ-001          | Users must register with valid email | Email validation required |

### Command Line Arguments

The application supports command line arguments for TCMS integration:

```bash
npm start -- --product=1 --category=2
```

## Usage

### Basic Execution

Run the complete workflow:

```bash
npm start
```

This will:

1. Parse requirements from `requirements.xlsx`
2. Send each requirement to Groq AI for test case generation
3. Process AI responses and extract structured test cases
4. Generate Word documentation (when enabled)
5. Upload to TCMS (when configured)

### Development Mode

For development with auto-rebuild:

```bash
npm run watch
```

### Custom Requirements File

Specify a different requirements file:

```bash
# Modify REQUIREMENTS_PATH in src/common/constants.ts
export const REQUIREMENTS_PATH = "./custom-requirements.xlsx";
```

## Input Requirements

### Excel File Format

The system expects an Excel file with the following columns:

- **Módulo**: Module or feature name (creates section headers)
- **Descripción**: Brief description of the functionality
- **ID Requerimiento**: Unique requirement identifier
- **Requerimiento**: Detailed requirement description
- **Consideración**: Additional considerations or constraints

### Example Requirement

```
Módulo: Gestión de Usuarios
Descripción: Registro de nuevos usuarios
ID Requerimiento: REQ-001
Requerimiento: El sistema debe permitir el registro de usuarios con email válido
Consideración: Validar formato de email y unicidad
```

## AI Integration

### Groq AI Configuration

The system uses Groq's GPT-OSS-20B model with the following settings:

```typescript
{
  model: "openai/gpt-oss-20b",
  temperature: 1,
  max_completion_tokens: 8192,
  reasoning_effort: "medium",
  tool_choice: "auto"
}
```

### AI Prompt Engineering

The AI is configured with a specialized QA Engineer profile that:

- Generates test cases exclusively in Spanish
- Follows Gherkin BDD format (Given/When/Then)
- Creates comprehensive coverage (Happy Path + Edge Cases + Negative scenarios)
- Produces dual output formats for different use cases
- Ensures minimum 10 test cases per requirement for thorough coverage

### Retry Mechanism

Built-in retry logic with exponential backoff:

- **Default retries**: 3 attempts
- **Delay**: 2000ms between attempts
- **Error handling**: Detailed logging and graceful degradation

## Output Formats

### Format 1: TCMS Integration

```json
[
  {
    "title": "[REQ-001] - Registrar usuario con email válido",
    "content": "Feature: Registro de usuarios\nScenario: Registro exitoso\nGiven: Usuario con datos válidos\nWhen: Envía formulario de registro\nThen: Usuario se registra exitosamente\nTipo de test case: Happy Path"
  }
]
```

### Format 2: Documentation

```json
[
  {
    "title": "[REQ-001] - Registrar usuario con email válido",
    "description": "Feature: Registro de usuarios\nScenario: Registro exitoso",
    "test_case": "Given: Usuario con datos válidos\nWhen: Envía formulario de registro\nThen: Usuario se registra exitosamente",
    "test_type": "Happy Path",
    "isFirst": true
  }
]
```

## Document Generation

### Word Document Features

- **Professional Styling**: Blue headers with white text
- **Structured Tables**: Each test case in a formatted table
- **Sequential Numbering**: Auto-incrementing test case IDs
- **Section Organization**: Module-based grouping with headings
- **Merge Capability**: Combines with existing documentation

### Document Structure

Each test case table includes:

| Field              | Description                                 |
| ------------------ | ------------------------------------------- |
| **ID**             | Sequential identifier with blue header      |
| **Título**         | Test case title with requirement prefix     |
| **Descripción**    | Feature and scenario description            |
| **Caso de prueba** | Gherkin steps (Given/When/Then)             |
| **Tipo de test**   | Test category (Happy Path, Edge Case, etc.) |

## Development

### Code Quality Tools

- **ESLint**: Comprehensive linting with TypeScript support
- **Prettier**: Consistent code formatting
- **TypeScript**: Strict type checking enabled
- **Modern ES Modules**: Latest JavaScript features

### Architecture Patterns

- **Modular Design**: Separated utilities and concerns
- **Type Safety**: Comprehensive TypeScript interfaces
- **Error Handling**: Robust error management with retries
- **Async/Await**: Modern asynchronous programming patterns

### Testing Considerations

The application includes:

- Input validation for Excel files
- AI response validation
- Document generation error handling
- Network request retry mechanisms

## Scripts

| Script    | Command         | Description                        |
| --------- | --------------- | ---------------------------------- |
| **Start** | `npm start`     | Run the compiled application       |
| **Build** | `npm run build` | Build for production with esbuild  |
| **Watch** | `npm run watch` | Development mode with auto-rebuild |
| **Test**  | `npm test`      | Run test suite (placeholder)       |

## Dependencies

### Production Dependencies

| Package      | Purpose                                   |
| ------------ | ----------------------------------------- |
| **groq-sdk** | AI integration with Groq API              |
| **docx**     | Word document generation and manipulation |
| **pizzip**   | ZIP file handling for DOCX operations     |
| **xlsx**     | Excel file reading and parsing            |
| **dotenv**   | Environment variable management           |
| **minimist** | Command line argument parsing             |

### Development Dependencies

| Package                 | Purpose                           |
| ----------------------- | --------------------------------- |
| **typescript**          | Type checking and compilation     |
| **esbuild**             | Fast bundling and compilation     |
| **eslint**              | Code linting and quality          |
| **prettier**            | Code formatting                   |
| **@typescript-eslint/** | TypeScript-specific linting rules |

## Contributing

### Development Setup

1. **Fork and clone** the repository
2. **Install dependencies**: `npm install`
3. **Set up environment**: Copy `.env.example` to `.env`
4. **Add API key**: Get Groq API key and add to `.env`
5. **Run in development**: `npm run watch`

### Code Standards

- Follow TypeScript best practices
- Use ESLint and Prettier configurations
- Include comprehensive type annotations
- Write descriptive commit messages
- Test with sample requirements files

### Pull Request Process

1. Create feature branch from main
2. Implement changes with proper typing
3. Test with sample Excel files
4. Update documentation if needed
5. Submit PR with detailed description

---

**Repository**: [Generate-testcases-and-docs](https://github.com/Strako/Generate-testcases-and-docs)

**Issues**: [Report bugs or request features](https://github.com/Strako/Generate-testcases-and-docs/issues)

**License**: ISC License

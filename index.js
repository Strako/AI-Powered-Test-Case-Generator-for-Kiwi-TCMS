var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/minimist/index.js
var require_minimist = __commonJS({
  "node_modules/minimist/index.js"(exports, module) {
    "use strict";
    function hasKey(obj, keys) {
      var o = obj;
      keys.slice(0, -1).forEach(function(key2) {
        o = o[key2] || {};
      });
      var key = keys[keys.length - 1];
      return key in o;
    }
    function isNumber(x) {
      if (typeof x === "number") {
        return true;
      }
      if (/^0x[0-9a-f]+$/i.test(x)) {
        return true;
      }
      return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x);
    }
    function isConstructorOrProto(obj, key) {
      return key === "constructor" && typeof obj[key] === "function" || key === "__proto__";
    }
    module.exports = function(args2, opts) {
      if (!opts) {
        opts = {};
      }
      var flags = {
        bools: {},
        strings: {},
        unknownFn: null
      };
      if (typeof opts.unknown === "function") {
        flags.unknownFn = opts.unknown;
      }
      if (typeof opts.boolean === "boolean" && opts.boolean) {
        flags.allBools = true;
      } else {
        [].concat(opts.boolean).filter(Boolean).forEach(function(key2) {
          flags.bools[key2] = true;
        });
      }
      var aliases = {};
      function aliasIsBoolean(key2) {
        return aliases[key2].some(function(x) {
          return flags.bools[x];
        });
      }
      Object.keys(opts.alias || {}).forEach(function(key2) {
        aliases[key2] = [].concat(opts.alias[key2]);
        aliases[key2].forEach(function(x) {
          aliases[x] = [key2].concat(aliases[key2].filter(function(y) {
            return x !== y;
          }));
        });
      });
      [].concat(opts.string).filter(Boolean).forEach(function(key2) {
        flags.strings[key2] = true;
        if (aliases[key2]) {
          [].concat(aliases[key2]).forEach(function(k) {
            flags.strings[k] = true;
          });
        }
      });
      var defaults = opts.default || {};
      var argv2 = { _: [] };
      function argDefined(key2, arg2) {
        return flags.allBools && /^--[^=]+$/.test(arg2) || flags.strings[key2] || flags.bools[key2] || aliases[key2];
      }
      function setKey(obj, keys, value2) {
        var o = obj;
        for (var i2 = 0; i2 < keys.length - 1; i2++) {
          var key2 = keys[i2];
          if (isConstructorOrProto(o, key2)) {
            return;
          }
          if (o[key2] === void 0) {
            o[key2] = {};
          }
          if (o[key2] === Object.prototype || o[key2] === Number.prototype || o[key2] === String.prototype) {
            o[key2] = {};
          }
          if (o[key2] === Array.prototype) {
            o[key2] = [];
          }
          o = o[key2];
        }
        var lastKey = keys[keys.length - 1];
        if (isConstructorOrProto(o, lastKey)) {
          return;
        }
        if (o === Object.prototype || o === Number.prototype || o === String.prototype) {
          o = {};
        }
        if (o === Array.prototype) {
          o = [];
        }
        if (o[lastKey] === void 0 || flags.bools[lastKey] || typeof o[lastKey] === "boolean") {
          o[lastKey] = value2;
        } else if (Array.isArray(o[lastKey])) {
          o[lastKey].push(value2);
        } else {
          o[lastKey] = [o[lastKey], value2];
        }
      }
      function setArg(key2, val, arg2) {
        if (arg2 && flags.unknownFn && !argDefined(key2, arg2)) {
          if (flags.unknownFn(arg2) === false) {
            return;
          }
        }
        var value2 = !flags.strings[key2] && isNumber(val) ? Number(val) : val;
        setKey(argv2, key2.split("."), value2);
        (aliases[key2] || []).forEach(function(x) {
          setKey(argv2, x.split("."), value2);
        });
      }
      Object.keys(flags.bools).forEach(function(key2) {
        setArg(key2, defaults[key2] === void 0 ? false : defaults[key2]);
      });
      var notFlags = [];
      if (args2.indexOf("--") !== -1) {
        notFlags = args2.slice(args2.indexOf("--") + 1);
        args2 = args2.slice(0, args2.indexOf("--"));
      }
      for (var i = 0; i < args2.length; i++) {
        var arg = args2[i];
        var key;
        var next;
        if (/^--.+=/.test(arg)) {
          var m = arg.match(/^--([^=]+)=([\s\S]*)$/);
          key = m[1];
          var value = m[2];
          if (flags.bools[key]) {
            value = value !== "false";
          }
          setArg(key, value, arg);
        } else if (/^--no-.+/.test(arg)) {
          key = arg.match(/^--no-(.+)/)[1];
          setArg(key, false, arg);
        } else if (/^--.+/.test(arg)) {
          key = arg.match(/^--(.+)/)[1];
          next = args2[i + 1];
          if (next !== void 0 && !/^(-|--)[^-]/.test(next) && !flags.bools[key] && !flags.allBools && (aliases[key] ? !aliasIsBoolean(key) : true)) {
            setArg(key, next, arg);
            i += 1;
          } else if (/^(true|false)$/.test(next)) {
            setArg(key, next === "true", arg);
            i += 1;
          } else {
            setArg(key, flags.strings[key] ? "" : true, arg);
          }
        } else if (/^-[^-]+/.test(arg)) {
          var letters = arg.slice(1, -1).split("");
          var broken = false;
          for (var j = 0; j < letters.length; j++) {
            next = arg.slice(j + 2);
            if (next === "-") {
              setArg(letters[j], next, arg);
              continue;
            }
            if (/[A-Za-z]/.test(letters[j]) && next[0] === "=") {
              setArg(letters[j], next.slice(1), arg);
              broken = true;
              break;
            }
            if (/[A-Za-z]/.test(letters[j]) && /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
              setArg(letters[j], next, arg);
              broken = true;
              break;
            }
            if (letters[j + 1] && letters[j + 1].match(/\W/)) {
              setArg(letters[j], arg.slice(j + 2), arg);
              broken = true;
              break;
            } else {
              setArg(letters[j], flags.strings[letters[j]] ? "" : true, arg);
            }
          }
          key = arg.slice(-1)[0];
          if (!broken && key !== "-") {
            if (args2[i + 1] && !/^(-|--)[^-]/.test(args2[i + 1]) && !flags.bools[key] && (aliases[key] ? !aliasIsBoolean(key) : true)) {
              setArg(key, args2[i + 1], arg);
              i += 1;
            } else if (args2[i + 1] && /^(true|false)$/.test(args2[i + 1])) {
              setArg(key, args2[i + 1] === "true", arg);
              i += 1;
            } else {
              setArg(key, flags.strings[key] ? "" : true, arg);
            }
          }
        } else {
          if (!flags.unknownFn || flags.unknownFn(arg) !== false) {
            argv2._.push(flags.strings._ || !isNumber(arg) ? arg : Number(arg));
          }
          if (opts.stopEarly) {
            argv2._.push.apply(argv2._, args2.slice(i + 1));
            break;
          }
        }
      }
      Object.keys(defaults).forEach(function(k) {
        if (!hasKey(argv2, k.split("."))) {
          setKey(argv2, k.split("."), defaults[k]);
          (aliases[k] || []).forEach(function(x) {
            setKey(argv2, x.split("."), defaults[k]);
          });
        }
      });
      if (opts["--"]) {
        argv2["--"] = notFlags.slice();
      } else {
        notFlags.forEach(function(k) {
          argv2._.push(k);
        });
      }
      return argv2;
    };
  }
});

// src/common/constants.ts
var REQUIREMENTS_PATH = "./requirements.xlsx";
var ATTEMPT_MESSAGE = "Attempt";
var FAILED_MESSAGE = "failed: ";
var RETYING_MESSAGE = "Retrying after";
var RETRY_FAILED = "All retries failed.";
var FINISHED_MESSAGE = "Finished successfully";
var FETCHING_ERROR_MESSAGE = "Error while fetching GROQ:";
var NUMBER_OF_RETRIES = 3;
var DELAY_FETCH_TIME = 1e3;
var TOOLS = [
  {
    type: "function",
    function: {
      name: "saveTestCases",
      description: "Save structured test cases",
      parameters: {
        type: "object",
        properties: {
          testCaseDoc: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                description: { type: "string" },
                test_case: { type: "string" },
                test_type: { type: "string" },
                isFirst: { type: "boolean" }
              },
              required: [
                "title",
                "description",
                "test_case",
                "test_type",
                "isFirst"
              ]
            }
          },
          testCaseTCMS: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" }
              },
              required: ["title", "content"]
            }
          }
        },
        required: ["testCaseDoc", "testCaseTCMS"]
      }
    }
  }
];
var MESSAGE_PROP_PRESENT = "\u2705 Message recived";
var MISSING_MESSAGE_PROP = "\u274C No message is present";
var TCMS_CREATE_ERROR = "\u274C Error at creating test case:";
var ERROR_EXTRACT_XML = "Could not extract document.xml from one of the files";
var MISSING_CLOSING_TAG = "Could not find closing body tag in original document";
var SUCCESS_MERGE = "\u2705 Documents merged successfully:";
var FAILED_MERGE = "\u274C Error merging documents:";
var MISSING_ORIGINAL_DOC = "\u2705 New document created (no original to merge)";
var GENERIC_ERROR = "\u274C Error:";
var SUCCESSFULLY_GENERATED_JSON = "\u2705 JSON files generated successfully:";
var ERROR_GENERATING_JSON = "\u274C Error writing JSON files:";
var NO_DEFAULT_USER = "No default user provided add 'DEFAULT_TESTER' to .env";
var MISSING_PARAMS = "Missing params: -- --product=x --category=y";
var MISSING_CREDENTIALS = "Missing credentials: TCMS_USER or TCMS_PASSWORD missing in .env";
var MISSING_REQUIREMENTS_FILE = "File ./requirements.xlsx wont exist";
var LOGIN_FAILED = "\u274C Login failed: Missing:";
var CSRF_MISSMATCH = "\u274C csrfmiddlewaretoken not found in /cases/new page (possible session or CSRF mismatch)";
var LOGIN_SUCCESSFULLY = "\u2705 Login successfully !";

// src/common/utils/doc-utils.ts
import {
  AlignmentType,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  ShadingType
} from "docx";
import * as fs from "node:fs";
import PizZip from "pizzip";
function createTestCaseTable(testId, tc) {
  const headerCell = new TableCell({
    children: [
      new Paragraph({
        children: [
          new TextRun({
            text: `ID \u2013 ${testId}`,
            bold: true,
            color: "FFFFFF"
          })
        ],
        alignment: AlignmentType.CENTER
      })
    ],
    shading: {
      fill: "0E4CB2",
      type: ShadingType.CLEAR,
      color: "auto"
    },
    columnSpan: 2
  });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: [headerCell] }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("T\xEDtulo")] }),
          new TableCell({ children: [new Paragraph(tc.title)] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Descripci\xF3n")] }),
          new TableCell({ children: [new Paragraph(tc.description)] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Caso de prueba")] }),
          new TableCell({ children: [new Paragraph(tc.test_case)] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Tipo de test")] }),
          new TableCell({ children: [new Paragraph(tc.test_type)] })
        ]
      })
    ]
  });
}
async function generateNewTestCasesDoc(titles, data) {
  const testCasesData = data;
  const titlesData = titles;
  let TEST_ID = 1228;
  let TITLE_IDX = 0;
  const newParagraphs = [];
  for (const tc of testCasesData) {
    if (tc.isFirst) {
      newParagraphs.push(
        new Paragraph({ children: [new TextRun({ break: 1 })] }),
        new Paragraph({
          text: titlesData[TITLE_IDX],
          heading: HeadingLevel.HEADING_1
        })
      );
      TITLE_IDX++;
    }
    const table = createTestCaseTable(TEST_ID, tc);
    newParagraphs.push(
      new Paragraph({ text: "" }),
      table,
      new Paragraph({ text: "" })
    );
    TEST_ID++;
  }
  const doc = new Document({
    sections: [
      {
        children: newParagraphs
      }
    ]
  });
  return await Packer.toBuffer(doc);
}
async function mergeDocxFiles(originalPath, newContentBuffer, outputPath) {
  try {
    const originalContent = fs.readFileSync(originalPath);
    const originalZip = new PizZip(originalContent);
    const newZip = new PizZip(newContentBuffer);
    const originalDocXml = originalZip.file("word/document.xml")?.asText();
    const newDocXml = newZip.file("word/document.xml")?.asText();
    if (!originalDocXml || !newDocXml) {
      throw new Error(ERROR_EXTRACT_XML);
    }
    const bodyEndTag = "</w:body>";
    const bodyEndIndex = originalDocXml.lastIndexOf(bodyEndTag);
    if (bodyEndIndex === -1) {
      throw new Error(MISSING_CLOSING_TAG);
    }
    const newBodyStart = newDocXml.indexOf("<w:body>") + "<w:body>".length;
    const newBodyEnd = newDocXml.lastIndexOf("</w:body>");
    const newContent = newDocXml.substring(newBodyStart, newBodyEnd);
    const pageBreak = '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
    const mergedDocXml = originalDocXml.substring(0, bodyEndIndex) + pageBreak + newContent + originalDocXml.substring(bodyEndIndex);
    originalZip.file("word/document.xml", mergedDocXml);
    const newMediaFiles = Object.keys(newZip.files).filter(
      (filename) => filename.startsWith("word/media/")
    );
    for (const mediaFile of newMediaFiles) {
      const file = newZip.file(mediaFile);
      if (file) {
        originalZip.file(mediaFile, file.asNodeBuffer());
      }
    }
    const mergedBuffer = originalZip.generate({
      type: "nodebuffer",
      compression: "DEFLATE"
    });
    fs.writeFileSync(outputPath, mergedBuffer);
    console.log(`${SUCCESS_MERGE} 
- ${outputPath}`);
  } catch (error) {
    throw new Error(`${FAILED_MERGE} ${error}`);
  }
}
async function generateDocWithAppend(titles, data) {
  const originalDocPath = "./original.docx";
  const outputPath = "./final_document.docx";
  try {
    console.log("\u{1F4DD} Generating new test cases...");
    const newContentBuffer = await generateNewTestCasesDoc(titles, data);
    if (!fs.existsSync(originalDocPath)) {
      fs.writeFileSync(outputPath, newContentBuffer);
      console.log(MISSING_ORIGINAL_DOC);
      return;
    }
    console.log("\u{1F517} Merging with original document...");
    await mergeDocxFiles(originalDocPath, newContentBuffer, outputPath);
  } catch (error) {
    console.error(GENERIC_ERROR, error);
    throw error;
  }
}

// src/common/utils/import-test-cases.ts
import fetch2 from "node-fetch";
import dotenv from "dotenv";
dotenv.config();
var default_tester = process.env.DEFAULT_TESTER;
var headers = (title, content, product_id2, category_id2, session) => ({
  headers: {
    accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    pragma: "no-cache",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    cookie: `NEXT_LOCALE=es; _fbp=fb.0.1757619907010.549046907627441429; _ga=GA1.1.1097585688.1757619907; __stripe_mid=e6e228bc-bbd1-4fec-8e40-ac6089c2fd6f1ef505; _ga_WE7JYK3W5B=GS2.1.s1757619907$o1$g1$t1757622540$j60$l0$h0; csrftoken=${session.csrftoken}; sessionid=${session.sessionid}; _dd_s=logs=1&id=6ad4b8c6-cb10-4c59-bcd0-666d90616351&created=1760546518282&expire=1760549321739`,
    Referer: "https://localhost/cases/new/"
  },
  body: `csrfmiddlewaretoken=${session.csrfmiddlewaretoken}&author=2&summary=${title}&default_tester=${default_tester}&product=${product_id2}&category=${category_id2}&case_status=2&priority=1&setup_duration=0&testing_duration=0&text=${content}&script=&arguments=&requirement=&extra_link=&notes=&email_settings-0-auto_to_case_author=on&email_settings-0-auto_to_run_manager=on&email_settings-0-auto_to_execution_assignee=on&email_settings-0-auto_to_case_tester=on&email_settings-0-auto_to_run_tester=on&email_settings-0-notify_on_case_update=on&email_settings-0-notify_on_case_delete=on&email_settings-0-cc_list=&email_settings-0-case=&email_settings-0-id=&email_settings-TOTAL_FORMS=1&email_settings-INITIAL_FORMS=0&email_settings-MIN_NUM_FORMS=0&email_settings-MAX_NUM_FORMS=1`,
  method: "POST"
});
var createTest = async (title, content, product_id2, category_id2, session) => {
  console.log(
    session,
    headers(title, content, product_id2, category_id2, session)
  );
  let response;
  try {
    response = await fetch2(
      "https://localhost/cases/new/",
      headers(title, content, product_id2, category_id2, session)
    );
    const status = response.status;
    console.log(`${response.ok ? "\u2705" : "\u274C"} ${status}`);
  } catch (error) {
    throw new Error(`${TCMS_CREATE_ERROR} ${title}
Error: ${error}`);
  }
};
async function importTestCases(arrayTCMS, product_id2, category_id2, session) {
  if (!default_tester) {
    throw new Error(NO_DEFAULT_USER);
  }
  for (const test of arrayTCMS) {
    await createTest(
      test.title,
      test.content,
      product_id2,
      category_id2,
      session
    );
  }
}

// src/index.ts
var import_minimist = __toESM(require_minimist(), 1);
import dotenv3 from "dotenv";

// src/common/utils/read-requirements.ts
import { existsSync as existsSync2 } from "fs";
import { createRequire } from "module";
var require2 = createRequire(import.meta.url);
var XLSX = require2("xlsx");
function parseRequirements(filePath) {
  const fileExist = existsSync2(filePath);
  if (!fileExist) {
    throw new Error(MISSING_REQUIREMENTS_FILE);
  }
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  const moduleTitles = [];
  const requirements = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0) continue;
    const [module, description, requirementId, requirement, consideration] = row;
    if (module && module !== "" && module !== null && module !== void 0) {
      moduleTitles.push(String(module).trim());
    }
    const currentModule = moduleTitles[moduleTitles.length - 1] || "No module";
    const requirementObject = {
      moduleTitle: currentModule,
      description: String(description || "").trim(),
      requirementId: String(requirementId || "").trim(),
      requirement: String(requirement || "").trim(),
      consideration: String(consideration || "").trim()
    };
    requirements.push(requirementObject);
  }
  return { moduleTitles, requirements };
}

// src/common/utils/groq-utls.ts
import { Groq } from "groq-sdk";

// src/data/prompts.ts
var testCasePrompt = {
  prompt: `# Rol: Quality Assurance Engineer

## Objetivo Principal
Generar casos de prueba completos en formato Gherkin y **SIEMPRE** utilizar la herramienta "saveTestCases" para guardar los resultados.

## Instrucciones Cr\xEDticas
**IMPORTANTE:** Debes SIEMPRE terminar tu respuesta llamando a la herramienta "saveTestCases" con los dos JSON generados. Esta es una acci\xF3n obligatoria y no opcional.

## Idioma
- **Todos los textos, t\xEDtulos, descripciones y contenido DEBEN estar en espa\xF1ol.**
- Las palabras clave de Gherkin (Feature, Scenario, Given, When, Then, And) permanecen en ingl\xE9s.

## Formato de T\xEDtulo
- Estructura: **[prefijo: issue_id] - Descripci\xF3n del caso**
- Variables "prefijo" e "issue_id" ser\xE1n proporcionadas en cada solicitud

## Estructura de Casos de Prueba (Gherkin)
\`\`\`
Feature: [Descripci\xF3n de la funcionalidad]
Scenario: [Descripci\xF3n del escenario espec\xEDfico]
Given [condici\xF3n inicial o precondici\xF3n]
When [acci\xF3n que ejecuta el usuario]
And [acciones adicionales si son necesarias]
Then [resultado esperado verificable]
And [resultados adicionales si son necesarios]
Tipo de test case: [Positivo|Negativo|Edge]
\`\`\`

## Tipos de Casos de Prueba

### 1. Positivos (Happy Path)
- Flujos principales con datos v\xE1lidos
- Comportamiento esperado del sistema
- Operaciones exitosas

### 2. Negativos
- Validaciones de permisos y accesos denegados
- Manejo de errores esperados
- Intentos de operaciones no permitidas

### 3. Edge (Casos Borde)
- Valores extremos y l\xEDmites
- Campos vac\xEDos u obligatorios
- Duplicados y conflictos
- Validaciones de formato y rango

## Estructura de los JSON Requeridos

### JSON 1 - Para TCMS (testCaseTCMS)
\`\`\`json
[
  {
    "title": "[prefijo: issue_id] - T\xEDtulo descriptivo del caso",
    "content": "Feature: descripci\xF3n\\nScenario: descripci\xF3n\\nGiven condici\xF3n inicial\\nWhen acci\xF3n ejecutada\\nThen resultado esperado\\nTipo de test case: tipo"
  }
]
\`\`\`

**Notas JSON 1:**
- "content" es una cadena de texto \xFAnica
- Usa \\n para saltos de l\xEDnea
- Incluye "Tipo de test case:" al final del content

### JSON 2 - Para Python (testCaseDoc)
\`\`\`json
[
  {
    "title": "[prefijo: issue_id] - T\xEDtulo descriptivo del caso (mismo que JSON 1)",
    "description": "Feature: descripci\xF3n\\nScenario: descripci\xF3n",
    "test_case": "Given condici\xF3n inicial\\nWhen acci\xF3n ejecutada\\nThen resultado esperado",
    "test_type": "Positivo|Negativo|Edge",
    "isFirst": true
  }
]
\`\`\`

**Notas JSON 2:**
- "isFirst": **true** solo para el primer caso de prueba en la lista
- "isFirst": **false** para todos los dem\xE1s casos
- "test_type" debe ser exactamente: "Positivo", "Negativo", o "Edge"
- "description" contiene solo Feature y Scenario
- "test_case" contiene los pasos Given/When/Then/And

## Requisitos de Cobertura

### Cantidad M\xEDnima
- **M\xEDnimo 10 casos de prueba** por funcionalidad
- Aumenta seg\xFAn la complejidad del requerimiento

### Distribuci\xF3n Sugerida
- **40-50%** Casos Positivos (happy path y flujos principales)
- **30-35%** Casos Negativos (validaciones, permisos, errores)
- **20-25%** Casos Edge (l\xEDmites, bordes, duplicados)

### \xC1reas a Cubrir
1. **Permisos y Roles:** Diferentes usuarios con distintos niveles de acceso
2. **Validaciones:** Campos obligatorios, formatos, rangos de valores
3. **Operaciones CRUD:** Crear, leer, actualizar, eliminar (si aplica)
4. **Casos L\xEDmite:** Valores m\xEDnimos, m\xE1ximos, vac\xEDos, duplicados
5. **Auditor\xEDa:** Registro de acciones (si aplica)
6. **Flujos Completos:** De inicio a fin con datos v\xE1lidos

## Flujo de Trabajo Obligatorio

1. **Analizar** el requerimiento o historia de usuario proporcionada
2. **Identificar** todos los escenarios a probar (positivos, negativos, edge)
3. **Generar** los casos de prueba en ambos formatos JSON
4. **Verificar** que:
   - Todos los t\xEDtulos coincidan entre JSON 1 y JSON 2
   - El primer caso tenga "isFirst": true
   - Los dem\xE1s casos tengan "isFirst": false
   - Todos los textos est\xE9n en espa\xF1ol
   - Haya al menos 10 casos de prueba
5. **OBLIGATORIO: Llamar a la herramienta "saveTestCases"** con:
   - Par\xE1metro "testCaseTCMS" = JSON 1
   - Par\xE1metro "testCaseDoc" = JSON 2

## Formato de Respuesta

Tu respuesta DEBE seguir esta estructura:

1. **Breve an\xE1lisis** del requerimiento (2-3 l\xEDneas)
2. **Lista de escenarios identificados** (bullet points cortos)
3. **Llamada OBLIGATORIA a saveTestCases** con ambos JSON

**NO incluyas** los JSON en texto plano en tu respuesta. P\xE1salos directamente a la herramienta.

## Ejemplo de Respuesta Esperada

"He analizado el requerimiento de programaci\xF3n de horarios. Identifiqu\xE9 10 escenarios que cubren: asignaci\xF3n de horarios por diferentes roles, validaciones de permisos, casos borde de horarios duplicados y validaciones de campos.

**Escenarios identificados:**
- 3 casos positivos de asignaci\xF3n exitosa
- 3 casos negativos de restricci\xF3n de permisos
- 3 casos edge de validaciones
- 1 caso de auditor\xEDa

Ahora guardar\xE9 los casos de prueba generados..."

[AQU\xCD LLAMAS A saveTestCases con los JSON]

## Recordatorio Final
**SIEMPRE debes terminar con la llamada a saveTestCases. Si no lo haces, la respuesta es in\xFAtil para el sistema.**`
};

// src/common/utils/groq-utls.ts
import dotenv2 from "dotenv";

// src/common/utils/utils.ts
import path from "node:path";
import { promises as fs2 } from "node:fs";
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function writeFiles(arrayTCMS, arrayDocs) {
  const testcasesPath = path.join(process.cwd(), "testcases.json");
  const dataPath = path.join(process.cwd(), "data.json");
  const formattedTCMS = JSON.stringify(arrayTCMS, null, 2);
  const formattedDocs = JSON.stringify(arrayDocs, null, 2);
  try {
    await fs2.writeFile(testcasesPath, formattedTCMS, "utf-8");
    await fs2.writeFile(dataPath, formattedDocs, "utf-8");
    console.log(SUCCESSFULLY_GENERATED_JSON);
    console.log(`- ${testcasesPath}`);
    console.log(`- ${dataPath}`);
  } catch (error) {
    console.error(ERROR_GENERATING_JSON, error);
    throw error;
  }
}
async function login(user2, password2) {
  const baseUrl = "https://localhost/accounts/login/";
  const newCaseUrl = "https://localhost/cases/new/";
  const getResp = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "Upgrade-Insecure-Requests": "1"
    }
  });
  const htmlLogin = await getResp.text();
  const loginTokenMatch = htmlLogin.match(
    /<input[^>]*name=["']csrfmiddlewaretoken["'][^>]*value=["']([^"']+)["']/
  );
  const csrfmiddlewaretokenLogin = loginTokenMatch ? loginTokenMatch[1] : null;
  if (!csrfmiddlewaretokenLogin) {
    throw new Error("csrfmiddlewaretoken not found in login page HTML");
  }
  const setCookies = getResp.headers.get("set-cookie") ?? "";
  const formBody = new URLSearchParams({
    csrfmiddlewaretoken: csrfmiddlewaretokenLogin,
    next: "",
    username: user2,
    password: password2
  }).toString();
  const postResp = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en",
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
      Pragma: "no-cache",
      Referer: baseUrl,
      Cookie: setCookies
    },
    body: formBody,
    redirect: "manual"
  });
  const postCookies = postResp.headers.get("set-cookie") || "";
  const sessionidMatch = postCookies.match(/sessionid=([^;]+)/);
  const newCsrftokenMatch = postCookies.match(/csrftoken=([^;]+)/);
  const sessionid = sessionidMatch ? sessionidMatch[1] : null;
  const csrftoken = newCsrftokenMatch ? newCsrftokenMatch[1] : null;
  if (!csrftoken || !sessionid) {
    throw new Error(
      `${LOGIN_FAILED} ${!csrftoken ? "csrftoken " : ""}${!sessionid ? "sessionid" : ""}`
    );
  }
  const getNewCaseResp = await fetch(newCaseUrl, {
    method: "GET",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en",
      Cookie: `csrftoken=${csrftoken}; sessionid=${sessionid}`
    }
  });
  const htmlCases = await getNewCaseResp.text();
  const newTokenMatch = htmlCases.match(
    /<input[^>]*name=["']csrfmiddlewaretoken["'][^>]*value=["']([^"']+)["']/
  );
  const csrfmiddlewaretokenNew = newTokenMatch ? newTokenMatch[1] : null;
  if (!csrfmiddlewaretokenNew) {
    throw new Error(CSRF_MISSMATCH);
  }
  console.log(LOGIN_SUCCESSFULLY);
  return {
    csrftoken,
    sessionid,
    csrfmiddlewaretoken: csrfmiddlewaretokenNew
  };
}

// src/common/utils/groq-utls.ts
import { exit } from "node:process";
dotenv2.config();
var prompt = testCasePrompt.prompt;
var options = {
  apiKey: process.env.GROQ_API_KEY
};
var groq = new Groq(options);
async function sendPrompt(message) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message }
    ],
    model: "openai/gpt-oss-20b",
    /*     model: "openai/gpt-oss-120b",
     */
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: false,
    reasoning_effort: "medium",
    stop: null,
    tool_choice: "auto",
    tools: TOOLS
  });
  return chatCompletion.choices;
}
async function fetchAI(message) {
  console.log(`${!!message ? MESSAGE_PROP_PRESENT : MISSING_MESSAGE_PROP} `);
  try {
    const choices = await sendPrompt(message);
    const data = choices.map((choice) => {
      const tool = choice?.message?.tool_calls?.[0].function.name;
      const input = JSON.parse(
        choice?.message?.tool_calls?.[0].function?.arguments ?? "{}"
      );
      if (tool && Object.entries(input).length) {
        const finalResponse = {
          thought: choice.message.reasoning,
          action: tool,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          input,
          finalAnswer: !tool ? FINISHED_MESSAGE : void 0
        };
        return finalResponse;
      } else {
        throw new Error("Tool or input missing");
      }
    });
    const result = data[0];
    const parsedResult = result;
    return parsedResult;
  } catch (error) {
    console.error(error);
    const httpError = new Error(
      `${FETCHING_ERROR_MESSAGE} ${String(error)}`
    );
    httpError.statusCode = 404;
    throw httpError;
  }
}
async function fetchWithRetry(message, retries = 3, delay = 2e3) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`${ATTEMPT_MESSAGE} ${attempt}...`);
      const response = await fetchAI(message);
      return response;
    } catch (error) {
      console.warn(`${ATTEMPT_MESSAGE} ${attempt} ${FAILED_MESSAGE} ${error}`);
      if (attempt < retries) {
        console.log(`${RETYING_MESSAGE} ${delay}ms...`);
        await sleep(delay);
      } else {
        console.error(RETRY_FAILED);
        exit(1);
      }
    }
  }
}

// src/index.ts
dotenv3.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var user = process.env.TCMS_USER;
var password = process.env.TCMS_PASSWORD;
var args = process.argv.slice(2);
var argv = (0, import_minimist.default)(args);
var product_id = argv.product;
var category_id = argv.category;
var missingParams = !product_id || !category_id;
var missingCredentials = !user || !password;
async function main(user2, password2) {
  const { moduleTitles, requirements } = parseRequirements(REQUIREMENTS_PATH);
  let arrayTCMS = [];
  let arrayDocs = [];
  const { csrftoken, sessionid, csrfmiddlewaretoken } = await login(
    user2,
    password2
  );
  for (const requirement of requirements) {
    const parsedRequirement = JSON.stringify(requirement);
    try {
      const response = await fetchWithRetry(
        parsedRequirement,
        NUMBER_OF_RETRIES,
        DELAY_FETCH_TIME
      );
      if (response) {
        const responseTCMS = response?.input.testCaseTCMS;
        const responseDocs = response?.input.testCaseDoc;
        arrayTCMS = arrayTCMS.concat(responseTCMS);
        arrayDocs = arrayDocs.concat(responseDocs);
      }
    } catch (err) {
      console.error(err);
    }
  }
  await writeFiles(arrayTCMS, arrayDocs);
  await importTestCases(arrayTCMS, String(product_id), String(category_id), {
    csrftoken,
    sessionid,
    csrfmiddlewaretoken
  });
  await generateDocWithAppend(moduleTitles, arrayDocs);
}
if (missingParams || missingCredentials) {
  const messages = [];
  if (missingParams) messages.push(MISSING_PARAMS);
  if (missingCredentials) messages.push(MISSING_CREDENTIALS);
  console.error(messages.join(" "));
} else {
  await main(user, password);
}

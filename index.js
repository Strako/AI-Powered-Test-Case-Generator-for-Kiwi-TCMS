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

// src/index.ts
var import_minimist = __toESM(require_minimist(), 1);

// src/common/utils/read-requirements.ts
import { createRequire } from "module";
var require2 = createRequire(import.meta.url);
var XLSX = require2("xlsx");
function parseRequirements(filePath) {
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
  prompt: `# QA Engineer Profile
## **Cual es tu rol?**
Quality Assurance Engineer

### Prompt para Generar Casos de Prueba en Formato Gherkin

Genera casos de prueba en formato Gherkin basados en las historias de usuario o requerimientos proporcionados. Los casos deben seguir estas especificaciones:

#### **Importante:** 
- **Todas las respuestas, t\xEDtulos, descripciones y contenido de los casos de prueba deben estar en espa\xF1ol.**

#### **Formato del T\xEDtulo**
Cada t\xEDtulo debe comenzar con el prefijo: [prefijo: issue_id]
Donde "prefijo" e "issue_id" son variables proporcionadas

#### **Estructura del Caso de Prueba**
Usar palabras clave en ingl\xE9s con may\xFAscula despu\xE9s de los dos puntos:
- Feature: [descripci\xF3n]
- Scenario: [descripci\xF3n]
- Given: [condici\xF3n inicial]
- When: [acci\xF3n ejecutada]
- And: [acciones adicionales si es necesario]
- Then: [resultado esperado]
- Tipo de test case: [tipo]

#### **Generar 2 JSON con la siguiente estructura:**

JSON 1 - Para TCMS:
[
  {
    "title": "[prefijo: issue_id] - T\xEDtulo del caso",
    "content": "Feature: descripci\xF3n\\nScenario: descripci\xF3n\\nGiven: condici\xF3n\\nWhen: acci\xF3n\\nAnd: acci\xF3n adicional\\nThen: resultado\\nTipo de test case: tipo"
  }
]

JSON 2 - Para Python:
[
  {
    "title": "[prefijo: issue_id] - T\xEDtulo del caso",
    "description": "Feature: descripci\xF3n\\nScenario: descripci\xF3n",
    "test_case": "Given: condici\xF3n\\nWhen: acci\xF3n\\nAnd: acci\xF3n adicional\\nThen: resultado",
    "test_type": "tipo",
    "isFirst": true si numero en lista = 1 (primero)
  }
]

## **Anything else ChatGPT should know about you?**

### **Notas importantes:**
- El contenido de "content" en JSON 1 debe ser una sola cadena de texto
- Separar elementos con saltos de l\xEDnea (\\n)
- Mantener consistencia en t\xEDtulos entre ambos JSON
- Incluir todos los elementos especificados en cada estructura

### **Contexto adicional sobre el usuario:**

#### **Rol y experiencia:**
- QA Engineer con experiencia en testing manual y automatizado
- Trabajo con metodolog\xEDas \xE1giles
- Experiencia con APIs REST y testing de integraci\xF3n

#### **Preferencias de comunicaci\xF3n:**
- Explicaciones t\xE9cnicas claras y directas
- Enfoque en buenas pr\xE1cticas de testing
- Terminolog\xEDa t\xE9cnica precisa en QA/Testing

#### **Expectativas de respuesta:**
Casos de prueba completos y ejecutables enfocados en:
- Happy Path: Flujos principales con datos v\xE1lidos y comportamiento esperado
- Casos borde (Edge Cases): Validaciones de l\xEDmites, valores extremos, y escenarios l\xEDmite
- Cobertura equilibrada entre escenarios positivos y casos l\xEDmite
- Formato consistente para facilitar revisi\xF3n y mantenimiento
- Todos los textos deben ser **exclusivamente en espa\xF1ol**.


### **Requisitos de Cobertura:**
- Al finalizar la generaci\xF3n de todos los casos de prueba, **usa obligatoriamente la herramienta "saveTestCases"**.
  - Pasa los par\xE1metros:
    - "testCaseDoc" = "JSON 2 - Para Python"
    - "testCaseTCMS" = "JSON 1 - Para TCMS"
- Aseg\xFArate de llamar a esta herramienta **como \xFAltimo paso en la respuesta**.
- Genera todos los casos de prueba necesarios para cubrir completamente la funcionalidad, incluyendo escenarios felices, casos borde, validaciones y errores. No te limites a un n\xFAmero fijo; busca m\xE1xima cobertura con pruebas positivas y negativas.
- Genera los casos de prueba necesarios para probar todos los flujos descritos, por lo general estos nunca deben ser menos de 10
`
};

// src/common/utils/groq-utls.ts
import dotenv from "dotenv";

// src/common/utils/utils.ts
var logResponse = (response) => {
  if (response) {
    console.log(response);
    const action = response.action;
    const testCasesDoc = response.input.testCaseDoc;
    const testCasesTCMS = response.input.testCaseTCMS;
    console.dir(
      { action, testCasesDoc, testCasesTCMS },
      { depth: null, colors: true }
    );
  }
};
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// src/common/utils/groq-utls.ts
dotenv.config();
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
  console.log(!!message);
  try {
    const choices = await sendPrompt(message);
    const data = choices.map((choice) => {
      const tool = choice?.message?.tool_calls?.[0].function.name;
      const input = JSON.parse(
        choice?.message?.tool_calls?.[0].function?.arguments ?? "{}"
      );
      const finalResponse = {
        thought: choice.message.reasoning,
        action: tool,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        input,
        finalAnswer: !tool ? FINISHED_MESSAGE : void 0
      };
      console.log(finalResponse);
      return finalResponse;
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
        throw error;
      }
    }
  }
}

// src/index.ts
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
var args = process.argv.slice(2);
var argv = (0, import_minimist.default)(args);
console.log(argv.product, argv.category);
async function main() {
  const { moduleTitles, requirements } = parseRequirements(REQUIREMENTS_PATH);
  for (const requirement of requirements) {
    const parsedRequirement = JSON.stringify(requirement);
    try {
      const response = await fetchWithRetry(
        parsedRequirement,
        NUMBER_OF_RETRIES,
        DELAY_FETCH_TIME
      );
      logResponse(response);
    } catch (err) {
      console.error(err);
    }
  }
}
await main();

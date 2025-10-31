import { ChatCompletionTool } from "groq-sdk/resources/chat/completions";

export const REQUIREMENTS_PATH = "./requirements.xlsx";

export const ATTEMPT_MESSAGE = "Attempt";

export const FAILED_MESSAGE = "failed: ";

export const RETYING_MESSAGE = "Retrying after";

export const RETRY_FAILED = "All retries failed.";

export const FINISHED_MESSAGE = "Finished successfully";

export const FETCHING_ERROR_MESSAGE = "Error while fetching GROQ:";

export const NUMBER_OF_RETRIES = 3;

export const DELAY_FETCH_TIME = 1000;

export const TOOLS: ChatCompletionTool[] = [
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
                isFirst: { type: "boolean" },
              },
              required: [
                "title",
                "description",
                "test_case",
                "test_type",
                "isFirst",
              ],
            },
          },
          testCaseTCMS: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                content: { type: "string" },
              },
              required: ["title", "content"],
            },
          },
        },
        required: ["testCaseDoc", "testCaseTCMS"],
      },
    },
  },
];

export const MESSAGE_PROP_PRESENT = "✅ Message recived";

export const MISSING_MESSAGE_PROP = "❌ No message is present";

export const TCMS_CREATE_ERROR = "❌ Error at creating test case:";

export const ERROR_EXTRACT_XML =
  "Could not extract document.xml from one of the files";

export const MISSING_CLOSING_TAG =
  "Could not find closing body tag in original document";

export const SUCCESS_MERGE = "✅ Documents merged successfully:";

export const FAILED_MERGE = "❌ Error merging documents:";

export const MISSING_ORIGINAL_DOC =
  "✅ New document created (no original to merge)";

export const GENERIC_ERROR = "❌ Error:";

export const SUCCESSFULLY_GENERATED_JSON =
  "✅ JSON files generated successfully:";

export const ERROR_GENERATING_JSON = "❌ Error writing JSON files:";

export const NO_DEFAULT_USER =
  "No default user provided add 'DEFAULT_TESTER' to .env";

export const MISSING_PARAMS = "Missing params: -- --product=x --category=y";

export const MISSING_CREDENTIALS =
  "Missing credentials: TCMS_USER or TCMS_PASSWORD missing in .env";

export const MISSING_REQUIREMENTS_FILE = "File ./requirements.xlsx wont exist";

export const LOGIN_FAILED = "❌ Login failed: Missing:";

export const CSRF_MISSMATCH =
  "❌ csrfmiddlewaretoken not found in /cases/new page (possible session or CSRF mismatch)";

export const LOGIN_SUCCESSFULLY = "✅ Login successfully !";

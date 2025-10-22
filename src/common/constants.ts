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

import { ChatCompletionTool } from "groq-sdk/resources/chat/completions";

export const REQUIREMENTS_PATH = "./requirements.xlsx";

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

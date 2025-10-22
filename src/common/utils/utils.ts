import { ACTION_TYPE, AgentResponseUnion } from "../types";

// ===============================
// Log object, action an params
// ===============================
export const logResponse = (response: AgentResponseUnion | undefined) => {
  if (response) {
    console.log(response);

    const action = response.action;
    const testCasesDoc = response.input.testCaseDoc;
    const testCasesTCMS = response.input.testCaseTCMS;

    console.dir(
      { action, testCasesDoc, testCasesTCMS },
      { depth: null, colors: true },
    );
  }
};

// ===============================
// Debounce function for fetching
// ===============================
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ===============================
// Execute related action function
// ===============================
export async function executeTool(response: AgentResponseUnion) {
  const action = response.action;

  if (action === ACTION_TYPE.SAVE_TEST_CASES) {
    console.log(response);

    const input = response.input;
    const result = "result here";

    return result;
  }
}

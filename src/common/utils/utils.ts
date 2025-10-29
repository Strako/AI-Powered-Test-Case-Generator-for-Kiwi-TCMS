import {
  ACTION_TYPE,
  AgentResponseUnion,
  TestCaseDoc,
  TestCaseTCMS,
} from "../types";
import path from "node:path";
import { promises as fs } from "node:fs";
import {
  ERROR_GENERATING_JSON,
  SUCCESSFULLY_GENERATED_JSON,
} from "../constants";

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
export async function writeFiles(
  arrayTCMS: TestCaseTCMS[],
  arrayDocs: TestCaseDoc[],
): Promise<void> {
  const testcasesPath = path.join(process.cwd(), "testcases.json");
  const dataPath = path.join(process.cwd(), "data.json");

  const formattedTCMS = JSON.stringify(arrayTCMS, null, 2);
  const formattedDocs = JSON.stringify(arrayDocs, null, 2);

  try {
    await fs.writeFile(testcasesPath, formattedTCMS, "utf-8");
    await fs.writeFile(dataPath, formattedDocs, "utf-8");

    console.log(SUCCESSFULLY_GENERATED_JSON);
    console.log(`- ${testcasesPath}`);
    console.log(`- ${dataPath}`);
  } catch (error) {
    console.error(ERROR_GENERATING_JSON, error);
    throw error;
  }
}

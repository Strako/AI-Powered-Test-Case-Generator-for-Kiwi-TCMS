export enum ACTION_TYPE {
  SAVE_TEST_CASES = "saveTestCases",
}

export type TestCaseDoc = {
  title: string;
  description: string;
  test_case: string;
  test_type: string;
  isFirst: boolean;
};

export type TestCaseTCMS = {
  title: string;
  content: string;
};

export type AgentResponseUnion = {
  action: ACTION_TYPE.SAVE_TEST_CASES;
  input: { testCaseDoc: TestCaseDoc[]; testCaseTCMS: TestCaseTCMS[] };
  thought: string;
  finalAnswer: string | undefined;
};

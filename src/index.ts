import { REQUIREMENTS_PATH } from "./common/constants";
import generateDocWithAppend from "./doc-utils";
/* import importTestCases from "./import-test-cases";
 */
import minimist from "minimist";
import { parseRequirements } from "./read-requirements";
import { fetchAI } from "./common/groq-utls";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const args = process.argv.slice(2);
const argv = minimist(args);

console.log(argv.product, argv.category);

async function main() {
  const { moduleTitles, requirements } = parseRequirements(REQUIREMENTS_PATH);

  const testCase = JSON.stringify(requirements[0]);

  const groqResponse = await fetchAI(testCase);

  const action = groqResponse.action;
  const testCasesDoc = groqResponse.input.testCaseDoc;
  const testCasesTCMS = groqResponse.input.testCaseTCMS;

  console.dir(
    { action, testCasesDoc, testCasesTCMS },
    { depth: null, colors: true },
  );

  /*   await importTestCases();
   */
  /*   await generateDocWithAppend(moduleTitles);
   */
}

await main();

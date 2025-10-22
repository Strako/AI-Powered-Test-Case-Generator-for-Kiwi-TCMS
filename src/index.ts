import {
  DELAY_FETCH_TIME,
  NUMBER_OF_RETRIES,
  REQUIREMENTS_PATH,
} from "./common/constants";
import generateDocWithAppend from "./common/utils/doc-utils";
/* import importTestCases from "./import-test-cases";
 */
import minimist from "minimist";
import { parseRequirements } from "./common/utils/read-requirements";
import { fetchWithRetry } from "./common/utils/groq-utls";
import { logResponse } from "./common/utils/utils";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const args = process.argv.slice(2);
const argv = minimist(args);

console.log(argv.product, argv.category);

async function main() {
  const { moduleTitles, requirements } = parseRequirements(REQUIREMENTS_PATH);

  for (const requirement of requirements) {
    const parsedRequirement = JSON.stringify(requirement);
    try {
      const response = await fetchWithRetry(
        parsedRequirement,
        NUMBER_OF_RETRIES,
        DELAY_FETCH_TIME,
      );
      logResponse(response);
    } catch (err) {
      console.error(err);
    }
  }

  /*   await importTestCases();
   */
  /*   await generateDocWithAppend(moduleTitles);
   */
}

await main();

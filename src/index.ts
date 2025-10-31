import {
  DELAY_FETCH_TIME,
  MISSING_CREDENTIALS,
  MISSING_PARAMS,
  NUMBER_OF_RETRIES,
  REQUIREMENTS_PATH,
} from "./common/constants";
import generateDocWithAppend from "./common/utils/doc-utils";
import importTestCases from "./common/utils/import-test-cases";
import dotenv from "dotenv";
dotenv.config();

import minimist from "minimist";
import { parseRequirements } from "./common/utils/read-requirements";
import { fetchWithRetry } from "./common/utils/groq-utls";
import { TestCaseDoc, TestCaseTCMS } from "./common/types";
import { login, writeFiles } from "./common/utils/utils";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const user = process.env.TCMS_USER;
const password = process.env.TCMS_PASSWORD;

const args = process.argv.slice(2);
const argv = minimist(args);

const product_id = argv.product;
const category_id = argv.category;

const missingParams = !product_id || !category_id;
const missingCredentials = !user || !password;

async function main(user: string, password: string) {
  const { moduleTitles, requirements } = parseRequirements(REQUIREMENTS_PATH);
  let arrayTCMS: TestCaseTCMS[] = [];
  let arrayDocs: TestCaseDoc[] = [];

  const { csrftoken, sessionid, csrfmiddlewaretoken } = await login(
    user,
    password,
  );

  for (const requirement of requirements) {
    const parsedRequirement = JSON.stringify(requirement);
    try {
      const response = await fetchWithRetry(
        parsedRequirement,
        NUMBER_OF_RETRIES,
        DELAY_FETCH_TIME,
      );
      if (response) {
        console.log(JSON.stringify(response, null, 2));

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
    csrfmiddlewaretoken,
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

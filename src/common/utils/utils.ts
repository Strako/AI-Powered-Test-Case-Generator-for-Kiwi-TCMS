import { AgentResponseUnion, TestCaseDoc, TestCaseTCMS } from "../types";
import path from "node:path";
import { promises as fs } from "node:fs";
import {
  CSRF_MISSMATCH,
  ERROR_GENERATING_JSON,
  LOGIN_FAILED,
  LOGIN_SUCCESSFULLY,
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

// =================================
// Obtain csrf tokens and session id
// =================================
export async function login(user: string, password: string) {
  const baseUrl = "https://localhost/accounts/login/";
  const newCaseUrl = "https://localhost/cases/new/";

  // STEP 1: GET login page → extract CSRF token and cookies
  const getResp = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en",
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
      "Upgrade-Insecure-Requests": "1",
    },
  });

  const htmlLogin = await getResp.text();

  const loginTokenMatch = htmlLogin.match(
    /<input[^>]*name=["']csrfmiddlewaretoken["'][^>]*value=["']([^"']+)["']/,
  );
  const csrfmiddlewaretokenLogin = loginTokenMatch ? loginTokenMatch[1] : null;

  if (!csrfmiddlewaretokenLogin) {
    throw new Error("csrfmiddlewaretoken not found in login page HTML");
  }

  const setCookies = getResp.headers.get("set-cookie") ?? "";

  // STEP 2: POST login with credentials
  const formBody = new URLSearchParams({
    csrfmiddlewaretoken: csrfmiddlewaretokenLogin,
    next: "",
    username: user,
    password: password,
  }).toString();

  const postResp = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en",
      "Cache-Control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded",
      Pragma: "no-cache",
      Referer: baseUrl,
      Cookie: setCookies,
    },
    body: formBody,
    redirect: "manual",
  });

  const postCookies = postResp.headers.get("set-cookie") || "";
  const sessionidMatch = postCookies.match(/sessionid=([^;]+)/);
  const newCsrftokenMatch = postCookies.match(/csrftoken=([^;]+)/);

  const sessionid = sessionidMatch ? sessionidMatch[1] : null;
  const csrftoken = newCsrftokenMatch ? newCsrftokenMatch[1] : null;

  if (!csrftoken || !sessionid) {
    throw new Error(
      `${LOGIN_FAILED} ${!csrftoken ? "csrftoken " : ""}${
        !sessionid ? "sessionid" : ""
      }`,
    );
  }

  // STEP 3: GET /cases/new to get updated csrfmiddlewaretoken
  const getNewCaseResp = await fetch(newCaseUrl, {
    method: "GET",
    headers: {
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en",
      Cookie: `csrftoken=${csrftoken}; sessionid=${sessionid}`,
    },
  });

  const htmlCases = await getNewCaseResp.text();

  const newTokenMatch = htmlCases.match(
    /<input[^>]*name=["']csrfmiddlewaretoken["'][^>]*value=["']([^"']+)["']/,
  );
  const csrfmiddlewaretokenNew = newTokenMatch ? newTokenMatch[1] : null;

  if (!csrfmiddlewaretokenNew) {
    throw new Error(CSRF_MISSMATCH);
  }

  console.log(LOGIN_SUCCESSFULLY);
  return {
    csrftoken,
    sessionid,
    csrfmiddlewaretoken: csrfmiddlewaretokenNew,
  };
}

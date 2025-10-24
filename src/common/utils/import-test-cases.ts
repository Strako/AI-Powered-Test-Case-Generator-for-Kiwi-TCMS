/* eslint-disable no-console */
import fetch from "node-fetch";
import { TestCaseTCMS } from "../types";

const csrfmiddlewaretoken =
  "nZe50CazrEeFyfGgVNQVhn0imLctKK7IuoQ2Utp7Mcp3RaQouZWB0w3xk7O8SkyC";
const csrftoken = "hzM741pIvIlyt5kiJmgQTjdp8wMPiKB4";
const default_tester = "armando";
const product_id = "1";
const category_id = "1";

const headers = (title: string, content: string) => ({
  headers: {
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-language": "en",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    pragma: "no-cache",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": "1",
    cookie: `NEXT_LOCALE=es; _fbp=fb.0.1757619907010.549046907627441429; _ga=GA1.1.1097585688.1757619907; __stripe_mid=e6e228bc-bbd1-4fec-8e40-ac6089c2fd6f1ef505; _ga_WE7JYK3W5B=GS2.1.s1757619907$o1$g1$t1757622540$j60$l0$h0; csrftoken=${csrftoken}; sessionid=2aoll3oczzvbbpq6r9jokq59kcpp55iq; _dd_s=logs=1&id=6ad4b8c6-cb10-4c59-bcd0-666d90616351&created=1760546518282&expire=1760549321739`,
    Referer: "https://localhost/cases/new/",
  },
  body: `csrfmiddlewaretoken=${csrfmiddlewaretoken}&author=2&summary=${title}&default_tester=${default_tester}&product=${product_id}&category=${category_id}&case_status=2&priority=1&setup_duration=0&testing_duration=0&text=${content}&script=&arguments=&requirement=&extra_link=&notes=&email_settings-0-auto_to_case_author=on&email_settings-0-auto_to_run_manager=on&email_settings-0-auto_to_execution_assignee=on&email_settings-0-auto_to_case_tester=on&email_settings-0-auto_to_run_tester=on&email_settings-0-notify_on_case_update=on&email_settings-0-notify_on_case_delete=on&email_settings-0-cc_list=&email_settings-0-case=&email_settings-0-id=&email_settings-TOTAL_FORMS=1&email_settings-INITIAL_FORMS=0&email_settings-MIN_NUM_FORMS=0&email_settings-MAX_NUM_FORMS=1`,
  method: "POST",
});

// ===============================
// Request create test cases
// ===============================
const createTest = async (title: string, content: string) => {
  let response;
  try {
    response = await fetch(
      "https://localhost/cases/new/",
      headers(title, content),
    );
    if (response.ok) {
      const status = await response.status;
      console.log(status);
    }
  } catch (error) {
    throw new Error(`Error at creating test case: ${title}\nError: ${error}`);
  }
};

// ===============================
// Upload each test case
// ===============================
export default async function importTestCases(arrayTCMS: TestCaseTCMS[]) {
  for (const test of arrayTCMS) {
    await createTest(test.title, test.content);
  }
}

import { ClientOptions, Groq } from "groq-sdk";
import { testCasePrompt } from "../../data/prompts";
import {
  ATTEMPT_MESSAGE,
  FAILED_MESSAGE,
  FETCHING_ERROR_MESSAGE,
  FINISHED_MESSAGE,
  RETRY_FAILED,
  RETYING_MESSAGE,
  TOOLS,
} from "../constants";
import { AgentResponseUnion } from "../types";
import dotenv from "dotenv";
import { sleep } from "./utils";
dotenv.config();

const prompt = testCasePrompt.prompt;

const options: ClientOptions = {
  apiKey: process.env.GROQ_API_KEY,
};

// ===============================
// Set up GROQ SDK and Tools
// ===============================
const groq = new Groq(options);

export async function sendPrompt(message: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: prompt },
      { role: "user", content: message },
    ],
    model: "openai/gpt-oss-20b",
    temperature: 1,
    max_completion_tokens: 8192,
    top_p: 1,
    stream: false,
    reasoning_effort: "medium",
    stop: null,
    tool_choice: "auto",
    tools: TOOLS,
  });

  return chatCompletion.choices;
}

// ===============================
// Retrive message completition
// ===============================
export async function fetchAI(message: string) {
  console.log(!!message);

  try {
    const choices = await sendPrompt(message);

    const data = choices.map((choice) => {
      const tool = choice?.message?.tool_calls?.[0].function.name;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const input = JSON.parse(
        choice?.message?.tool_calls?.[0].function?.arguments ?? "{}",
      );
      const finalResponse = {
        thought: choice.message.reasoning,
        action: tool,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        input,
        finalAnswer: !tool ? FINISHED_MESSAGE : undefined,
      };
      console.log(finalResponse);

      return finalResponse;
    });

    const result = data[0];

    const parsedResult = result as AgentResponseUnion;

    return parsedResult;
  } catch (error: unknown) {
    console.error(error);

    const httpError = new Error(
      `${FETCHING_ERROR_MESSAGE} ${String(error)}`,
    ) as Error & { statusCode: number };
    httpError.statusCode = 404;

    throw httpError;
  }
}

// ===============================
// Retry completition fetching
// ===============================
export async function fetchWithRetry(
  message: string,
  retries = 3,
  delay = 2000,
) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`${ATTEMPT_MESSAGE} ${attempt}...`);
      const response = await fetchAI(message);
      return response;
    } catch (error) {
      console.warn(`${ATTEMPT_MESSAGE} ${attempt} ${FAILED_MESSAGE} ${error}`);
      if (attempt < retries) {
        console.log(`${RETYING_MESSAGE} ${delay}ms...`);
        await sleep(delay);
      } else {
        console.error(RETRY_FAILED);
        throw error;
      }
    }
  }
}

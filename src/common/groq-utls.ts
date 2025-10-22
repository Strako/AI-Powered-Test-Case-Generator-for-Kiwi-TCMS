import { ClientOptions, Groq } from "groq-sdk";
import { testCasePrompt } from "../data/prompts";
import { TOOLS } from "./constants";
import { ACTION_TYPE, AgentResponseUnion } from "./types";
import dotenv from "dotenv";
dotenv.config();

const prompt = testCasePrompt.prompt;

const options: ClientOptions = {
  apiKey: process.env.GROQ_API_KEY,
};

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
        finalAnswer: !tool ? "Finished successfully" : undefined,
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
      `Error while fetching GROQ: ${String(error)}`,
    ) as Error & { statusCode: number };
    httpError.statusCode = 404;

    throw httpError;
  }
}

export async function executeTool(agentResponse: AgentResponseUnion) {
  const action = agentResponse.action;

  if (action === ACTION_TYPE.SAVE_TEST_CASES) {
    console.log(agentResponse);

    const input = agentResponse.input;
    const result = "result here";

    return result;
  }
}

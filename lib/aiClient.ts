import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";

export async function callAI(messages: any[]) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }
  // Use Gemini via OpenAI-compatible endpoint
  const { text } = await generateText({
    model: openai("gemini-1.5-flash", {
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    messages: messages,
  });

  return { content: text };
}
 
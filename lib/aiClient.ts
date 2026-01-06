import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { agentsConfig } from "./agentsConfig";

export async function callAI(prompt: string, agent: keyof typeof agentsConfig) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Missing GEMINI_API_KEY environment variable");
  }

  const selectedAgent = agentsConfig[agent];

  if (!selectedAgent) {
    throw new Error(`Agent "${agent}" not found`);
  }

  // Use Gemini via OpenAI-compatible endpoint
  const { text } = await generateText({
    model: openai("gemini-2.0-flash-exp", {
      baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
      apiKey: process.env.GEMINI_API_KEY,
    }),
    system: selectedAgent.systemPrompt,
    prompt: prompt,
  });

  return text;
}

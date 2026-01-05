import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { agentsConfig } from "./agentsConfig";

export async function callAI(prompt: string, agent: keyof typeof agentsConfig) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }

  const selectedAgent = agentsConfig[agent];

  if (!selectedAgent) {
    throw new Error(`Agent "${agent}" not found`);
  }

  const { text } = await generateText({
    model: openai("gpt-4o-mini"),
    system: selectedAgent.systemPrompt,
    prompt: prompt,
  });

  return text;
}
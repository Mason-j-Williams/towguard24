import OpenAI from "openai";
import { agentsConfig } from "./agentsConfig";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function callAI(prompt: string, agent: keyof typeof agentsConfig) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable");
  }
const selectedAgent = agentsConfig[agent];

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: selectedAgent.systemPrompt },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content;
}
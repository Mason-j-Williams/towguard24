import OpenAI from "openai"
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})
export async function callAI(prompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing OPENAI_API_KEY environment variable")
  }
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt }
    ]
  })

  return response.choices[0].message.content
}

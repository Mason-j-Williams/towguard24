import { consumeStream, convertToModelMessages, streamText, type UIMessage } from "ai"

export const maxDuration = 30

// System prompt for code assistant
const SYSTEM_PROMPT = `You are an expert code assistant specializing in helping developers with:
- Code review and best practices
- Debugging and troubleshooting
- Code optimization and refactoring
- Explaining complex programming concepts
- Suggesting improvements and alternatives

When reviewing code:
1. Identify potential issues or bugs
2. Suggest improvements for readability and performance
3. Recommend best practices
4. Explain your reasoning clearly

Format your responses to be clear and actionable. Use code blocks when showing examples.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  // Convert UI messages to model messages and add system prompt
  const prompt = convertToModelMessages([
    { id: "system", role: "system", parts: [{ type: "text", text: SYSTEM_PROMPT }] },
    ...messages,
  ])

  // Use Google's Gemini models through the AI Gateway
  const result = streamText({
    model: "google/gemini-3-flash", // Fast and efficient for code tasks
    prompt,
    maxOutputTokens: 8000,
    temperature: 0.3, // Lower temperature for more focused, deterministic responses
    abortSignal: req.signal,
  })

  return result.toUIMessageStreamResponse({
    onFinish: async ({ isAborted }) => {
      if (isAborted) {
        console.log("[v0] Request aborted")
      }
    },
    consumeSseStream: consumeStream,
  })
}

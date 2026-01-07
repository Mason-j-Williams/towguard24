import OpenAI from "openai";

const client = new OpenAI({
 apiKey: "YOUR_ACTUAL_KEY_HERE",
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

async function testGemini() {
  try {
    const completion = await client.chat.completions.create({
      model: "gemini-2.0-flash-exp",
      messages: [
        { role: "user", content: "Say hello!" }
      ]
    });
    console.log("✅ Gemini API works! Response:", completion.choices[0].message.content);
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
  }
}

testGemini();

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
Generative Language API Key
async function testGemini() {
  try {
    const result = await model.generateContent("Say hello!");
    const response = await result.response;
    const text = response.text();
    console.log("✅ Gemini API works! Response:", text);
  } catch (error) {
    console.error("❌ Gemini API error:", error.message);
  }
}

testGemini();

// app/api/agent/route.ts
import { NextRequest, NextResponse } from "next/server";
import { callAI } from "@/lib/aiClient";
import { getAgentById } from "@/lib/agentsConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentId, message, history } = body;

    if (!agentId || typeof agentId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'agentId'." },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid 'message'." },
        { status: 400 }
      );
    }

    const agent = getAgentById(agentId);
    if (!agent) {
      return NextResponse.json(
        { error: `Unknown agentId: ${agentId}` },
        { status: 400 }
      );
    }

    const messages = [
      {
        role: "system" as const,
        content: agent.systemPrompt,
      },
      ...(Array.isArray(history) ? history : []),
      {
        role: "user" as const,
        content: message,
      },
    ];

    const aiResponse = await callAI(messages);

    return NextResponse.json({
      agentId,
      reply: aiResponse.content,
    });
  } catch (err: any) {
    console.error("Agent API error:", err);
    return NextResponse.json(
      { error: "Agent API failed." },
      { status: 500 }
    );
  }
}

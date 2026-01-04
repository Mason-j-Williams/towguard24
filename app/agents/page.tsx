"use client";

import { useState } from "react";
import { AGENTS } from "@/lib/agentsConfig";

export default function AgentsPage() {
  const [agentId, setAgentId] = useState(AGENTS[0]?.id || "");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try:
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId,
          message: userMessage.content,
          history: messages,
        }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Error: No reply from agent.",
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Error contacting agent.",
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 20, maxWidth: 700, margin: "0 auto" }}>
      <h1>TowGuard24 AI Agents</h1>

      <label>Select an agent:</label>
      <select
        value={agentId}
        onChange={(e) => setAgentId(e.target.value)}
        style={{ display: "block", marginBottom: 20, padding: 8 }}
      >
        {AGENTS.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name}
          </option>
        ))}
      </select>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          height: 400,
          overflowY: "auto",
          marginBottom: 20,
          background: "#fafafa",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              marginBottom: 12,
              textAlign: m.role === "user" ? "right" : "left",
            }}
          >
            <strong>{m.role === "user" ? "You" : "Agent"}:</strong>{" "}
            {m.content}
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: 10 }}
        />
        <button onClick={sendMessage} disabled={loading}>
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

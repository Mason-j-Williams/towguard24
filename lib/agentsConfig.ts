import { marketingAgent } from "../app/agents/marketingAgent";
import { supportAgent } from "../app/agents/supportAgent";
import { salesAgent } from "../app/agents/salesAgent";

export const agentsConfig = {
  marketing: marketingAgent,
  support: supportAgent,
  sales: salesAgent,
};

export type AgentKey = keyof typeof agentsConfig;

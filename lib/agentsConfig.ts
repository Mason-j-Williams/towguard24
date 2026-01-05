import { marketingAgent } from "./agents/marketingAgent";
import { supportAgent } from "./agents/supportAgent";
import { salesAgent } from "./agents/salesAgent";

export const agentsConfig = {
  marketing: marketingAgent,
  support: supportAgent,
  sales: salesAgent,
};

export type AgentKey = keyof typeof agentsConfig;

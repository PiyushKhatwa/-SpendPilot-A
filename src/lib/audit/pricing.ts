import type { SupportedAiTool } from "@/types/audit";

export interface PlanPrice {
  name: string;
  monthlySeatPrice: number;
  bestForTeamSize: number;
  enterprise?: boolean;
}

export interface ToolPricing {
  category: "chat" | "coding" | "api";
  plans: PlanPrice[];
  defaultPlan: string;
  alternative?: SupportedAiTool;
  apiOptimizationRate?: number;
}

export const pricingCatalog: Record<SupportedAiTool, ToolPricing> = {
  Cursor: {
    category: "coding",
    defaultPlan: "Pro",
    alternative: "GitHub Copilot",
    plans: [
      { name: "Hobby", monthlySeatPrice: 0, bestForTeamSize: 1 },
      { name: "Pro", monthlySeatPrice: 20, bestForTeamSize: 10 },
      { name: "Business", monthlySeatPrice: 40, bestForTeamSize: 50 },
    ],
  },
  ChatGPT: {
    category: "chat",
    defaultPlan: "Team",
    alternative: "Claude",
    plans: [
      { name: "Free", monthlySeatPrice: 0, bestForTeamSize: 1 },
      { name: "Plus", monthlySeatPrice: 20, bestForTeamSize: 8 },
      { name: "Team", monthlySeatPrice: 30, bestForTeamSize: 75 },
      { name: "Enterprise", monthlySeatPrice: 60, bestForTeamSize: 250, enterprise: true },
    ],
  },
  Claude: {
    category: "chat",
    defaultPlan: "Team",
    alternative: "ChatGPT",
    plans: [
      { name: "Free", monthlySeatPrice: 0, bestForTeamSize: 1 },
      { name: "Pro", monthlySeatPrice: 20, bestForTeamSize: 8 },
      { name: "Team", monthlySeatPrice: 30, bestForTeamSize: 75 },
      { name: "Enterprise", monthlySeatPrice: 60, bestForTeamSize: 250, enterprise: true },
    ],
  },
  Gemini: {
    category: "chat",
    defaultPlan: "Business",
    alternative: "ChatGPT",
    plans: [
      { name: "Free", monthlySeatPrice: 0, bestForTeamSize: 1 },
      { name: "Advanced", monthlySeatPrice: 20, bestForTeamSize: 8 },
      { name: "Business", monthlySeatPrice: 30, bestForTeamSize: 75 },
      { name: "Enterprise", monthlySeatPrice: 60, bestForTeamSize: 250, enterprise: true },
    ],
  },
  "GitHub Copilot": {
    category: "coding",
    defaultPlan: "Business",
    alternative: "Cursor",
    plans: [
      { name: "Individual", monthlySeatPrice: 10, bestForTeamSize: 5 },
      { name: "Business", monthlySeatPrice: 19, bestForTeamSize: 75 },
      { name: "Enterprise", monthlySeatPrice: 39, bestForTeamSize: 250, enterprise: true },
    ],
  },
  "OpenAI API": {
    category: "api",
    defaultPlan: "Usage",
    alternative: "Anthropic API",
    apiOptimizationRate: 0.16,
    plans: [{ name: "Usage", monthlySeatPrice: 0, bestForTeamSize: 250 }],
  },
  "Anthropic API": {
    category: "api",
    defaultPlan: "Usage",
    alternative: "OpenAI API",
    apiOptimizationRate: 0.14,
    plans: [{ name: "Usage", monthlySeatPrice: 0, bestForTeamSize: 250 }],
  },
  Windsurf: {
    category: "coding",
    defaultPlan: "Pro",
    alternative: "Cursor",
    plans: [
      { name: "Free", monthlySeatPrice: 0, bestForTeamSize: 1 },
      { name: "Pro", monthlySeatPrice: 15, bestForTeamSize: 8 },
      { name: "Teams", monthlySeatPrice: 30, bestForTeamSize: 60 },
      { name: "Enterprise", monthlySeatPrice: 55, bestForTeamSize: 250, enterprise: true },
    ],
  },
};

export function getPlanNames(tool: SupportedAiTool) {
  return pricingCatalog[tool].plans.map((plan) => plan.name);
}

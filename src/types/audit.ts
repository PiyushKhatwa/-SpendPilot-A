export const supportedAiTools = [
  "Cursor",
  "ChatGPT",
  "Claude",
  "Gemini",
  "GitHub Copilot",
  "OpenAI API",
  "Anthropic API",
  "Windsurf",
] as const;

export type SupportedAiTool = (typeof supportedAiTools)[number];

export const primaryUseCases = [
  "General productivity",
  "Engineering",
  "Research",
  "Customer support",
  "Marketing",
  "Data analysis",
  "API automation",
] as const;

export type PrimaryUseCase = (typeof primaryUseCases)[number];

export interface SpendLineItem {
  id: string;
  tool: SupportedAiTool;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  primaryUseCase: PrimaryUseCase;
}

export type RecommendationType =
  | "downgrade"
  | "seat_reduction"
  | "alternative"
  | "usage_review"
  | "optimized";

export type RecommendationSeverity = "low" | "medium" | "high";

export interface AuditOpportunity {
  id: string;
  tool: SupportedAiTool;
  type: RecommendationType;
  severity: RecommendationSeverity;
  currentMonthlySpend: number;
  recommendedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  recommendedPlan?: string;
  alternativeTool?: SupportedAiTool;
  rationale: string;
  action: string;
}

export interface AuditTotals {
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  monthlySavings: number;
  annualSavings: number;
  savingsRate: number;
}

export interface AuditReport {
  id?: string;
  createdAt?: string;
  lineItems: SpendLineItem[];
  opportunities: AuditOpportunity[];
  totals: AuditTotals;
  summary?: string;
}

export interface LeadCaptureInput {
  email: string;
  companyName: string;
  role: string;
  teamSize: number;
  auditId?: string;
  website?: string;
}

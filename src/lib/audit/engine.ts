import type {
  AuditOpportunity,
  AuditReport,
  RecommendationSeverity,
  SpendLineItem,
  SupportedAiTool,
} from "@/types/audit";
import { auditInputSchema } from "@/lib/audit/schema";
import { pricingCatalog, type PlanPrice } from "@/lib/audit/pricing";

function money(value: number) {
  return Math.max(0, Math.round(value * 100) / 100);
}

function opportunityId(item: SpendLineItem, suffix: string) {
  return `${item.id}-${suffix}`;
}

function severityForSavings(monthlySavings: number): RecommendationSeverity {
  if (monthlySavings >= 150) {
    return "high";
  }

  if (monthlySavings >= 40) {
    return "medium";
  }

  return "low";
}

function planForName(tool: SupportedAiTool, planName: string) {
  const plans = pricingCatalog[tool].plans;
  return plans.find(
    (plan) => plan.name.toLowerCase() === planName.trim().toLowerCase(),
  );
}

function recommendedSeatPlan(tool: SupportedAiTool, teamSize: number) {
  const pricing = pricingCatalog[tool];
  const nonEnterprise = pricing.plans.filter((plan) => !plan.enterprise);

  return (
    nonEnterprise.find((plan) => teamSize <= plan.bestForTeamSize) ??
    nonEnterprise[nonEnterprise.length - 1] ??
    pricing.plans[0]
  );
}

function expectedSpend(plan: PlanPrice, item: SpendLineItem) {
  return money(plan.monthlySeatPrice * Math.min(item.seats, item.teamSize));
}

function optimizedOpportunity(
  item: SpendLineItem,
  recommendedMonthlySpend: number,
  suffix: string,
  details: Omit<
    AuditOpportunity,
    | "id"
    | "tool"
    | "currentMonthlySpend"
    | "recommendedMonthlySpend"
    | "monthlySavings"
    | "annualSavings"
    | "severity"
  >,
): AuditOpportunity | null {
  const currentMonthlySpend = money(item.monthlySpend);
  const monthlySavings = money(currentMonthlySpend - recommendedMonthlySpend);

  if (monthlySavings <= 0) {
    return null;
  }

  return {
    id: opportunityId(item, suffix),
    tool: item.tool,
    currentMonthlySpend,
    recommendedMonthlySpend: money(recommendedMonthlySpend),
    monthlySavings,
    annualSavings: money(monthlySavings * 12),
    severity: severityForSavings(monthlySavings),
    ...details,
  };
}

function itemCandidates(item: SpendLineItem): AuditOpportunity[] {
  const pricing = pricingCatalog[item.tool];
  const candidates: AuditOpportunity[] = [];
  const matchedPlan = planForName(item.tool, item.plan);
  const recommendedPlan = recommendedSeatPlan(item.tool, item.teamSize);
  const actualSeatsNeeded = Math.min(item.seats, item.teamSize);

  if (pricing.category === "api") {
    const optimizationRate = pricing.apiOptimizationRate ?? 0.12;
    const savings = item.monthlySpend >= 250 ? item.monthlySpend * optimizationRate : 0;
    const apiCandidate = optimizedOpportunity(
      item,
      item.monthlySpend - savings,
      "usage-review",
      {
        type: "usage_review",
        recommendedPlan: "Usage review",
        alternativeTool: pricing.alternative,
        rationale:
          "API spend is high enough to justify model routing, prompt caching, request batching, and budget alerts.",
        action:
          "Review high-volume endpoints, route simple tasks to cheaper models, and set monthly spend alerts.",
      },
    );

    if (apiCandidate) {
      candidates.push(apiCandidate);
    }

    return candidates;
  }

  if (item.seats > item.teamSize) {
    const currentPlan = matchedPlan ?? recommendedPlan;
    const reducedSeatSpend = money(currentPlan.monthlySeatPrice * actualSeatsNeeded);
    const seatCandidate = optimizedOpportunity(item, reducedSeatSpend, "seat-reduction", {
      type: "seat_reduction",
      recommendedPlan: currentPlan.name,
      rationale:
        "Purchased seats are higher than the stated team size, which usually indicates inactive or duplicated seats.",
      action: `Reduce paid seats from ${item.seats} to ${actualSeatsNeeded}.`,
    });

    if (seatCandidate) {
      candidates.push(seatCandidate);
    }
  }

  const currentPlan = matchedPlan;
  if (currentPlan?.enterprise && item.teamSize < 75) {
    const downgradeSpend = expectedSpend(recommendedPlan, item);
    const downgradeCandidate = optimizedOpportunity(
      item,
      downgradeSpend,
      "enterprise-downgrade",
      {
        type: "downgrade",
        recommendedPlan: recommendedPlan.name,
        rationale:
          "Enterprise-level pricing is rarely necessary for smaller teams unless procurement, compliance, or SSO requirements are strict.",
        action: `Move from ${currentPlan.name} to ${recommendedPlan.name} for this team size.`,
      },
    );

    if (downgradeCandidate) {
      candidates.push(downgradeCandidate);
    }
  }

  const benchmarkSpend = expectedSpend(recommendedPlan, item);
  if (item.monthlySpend > benchmarkSpend * 1.25 && benchmarkSpend > 0) {
    const benchmarkCandidate = optimizedOpportunity(
      item,
      benchmarkSpend,
      "benchmark",
      {
        type: "downgrade",
        recommendedPlan: recommendedPlan.name,
        rationale:
          "Reported spend is materially above the benchmark for the team size and plan family.",
        action: `Negotiate or resize to the ${recommendedPlan.name} benchmark.`,
      },
    );

    if (benchmarkCandidate) {
      candidates.push(benchmarkCandidate);
    }
  }

  return candidates;
}

function overlapCandidates(lineItems: SpendLineItem[]): AuditOpportunity[] {
  const byCategory = lineItems.reduce<Record<string, SpendLineItem[]>>((acc, item) => {
    const category = pricingCatalog[item.tool].category;
    acc[category] = [...(acc[category] ?? []), item];
    return acc;
  }, {});

  return Object.entries(byCategory).flatMap(([category, items]) => {
    if (category === "api" || items.length < 2) {
      return [];
    }

    const sorted = [...items].sort((a, b) => b.monthlySpend - a.monthlySpend);
    const keep = sorted[0];

    return sorted.slice(1).flatMap((item) => {
      const alternative = keep.tool;
      const reducedSpend = money(item.monthlySpend * 0.5);
      const candidate = optimizedOpportunity(item, reducedSpend, "overlap", {
        type: "alternative",
        alternativeTool: alternative,
        recommendedPlan: "Consolidated stack",
        rationale:
          "Multiple tools serve the same primary category, so part of this spend can usually be consolidated.",
        action: `Keep ${alternative} as the primary ${category} tool and trim overlapping ${item.tool} usage.`,
      });

      return candidate ? [candidate] : [];
    });
  });
}

function chooseBestByItem(opportunities: AuditOpportunity[]) {
  const best = new Map<string, AuditOpportunity>();

  for (const opportunity of opportunities) {
    const existing = best.get(opportunity.tool);
    if (!existing || opportunity.monthlySavings > existing.monthlySavings) {
      best.set(opportunity.tool, opportunity);
    }
  }

  return [...best.values()].sort((a, b) => b.monthlySavings - a.monthlySavings);
}

export function runAudit(lineItems: SpendLineItem[]): AuditReport {
  const parsed = auditInputSchema.parse({ lineItems });
  const itemOpportunities = parsed.lineItems.flatMap(itemCandidates);
  const overlapOpportunities = overlapCandidates(parsed.lineItems);
  const opportunities = chooseBestByItem([
    ...itemOpportunities,
    ...overlapOpportunities,
  ]);

  const currentMonthlySpend = money(
    parsed.lineItems.reduce((total, item) => total + item.monthlySpend, 0),
  );
  const monthlySavings = money(
    opportunities.reduce((total, item) => total + item.monthlySavings, 0),
  );
  const optimizedMonthlySpend = money(currentMonthlySpend - monthlySavings);
  const savingsRate =
    currentMonthlySpend > 0 ? money(monthlySavings / currentMonthlySpend) : 0;

  return {
    createdAt: new Date().toISOString(),
    lineItems: parsed.lineItems,
    opportunities,
    totals: {
      currentMonthlySpend,
      optimizedMonthlySpend,
      monthlySavings,
      annualSavings: money(monthlySavings * 12),
      savingsRate,
    },
  };
}

export function createFallbackSummary(report: AuditReport) {
  const savings = report.totals.monthlySavings;

  if (savings <= 0) {
    return "Your AI stack looks well sized for the inputs provided. The next best move is to keep seat ownership current, review API usage monthly, and rerun the audit after any hiring plan or vendor change.";
  }

  const top = report.opportunities[0];
  return `SpendPilot found ${formatCurrency(savings)} in estimated monthly savings, or ${formatCurrency(
    report.totals.annualSavings,
  )} annually. The strongest opportunity is ${top.tool}, where ${top.action.toLowerCase()} Keep the current stack stable while validating this change with active users before renewing annual contracts.`;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

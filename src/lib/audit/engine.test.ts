import { describe, expect, it } from "vitest";
import { runAudit } from "@/lib/audit/engine";
import type { SpendLineItem } from "@/types/audit";

function item(overrides: Partial<SpendLineItem> = {}): SpendLineItem {
  return {
    id: crypto.randomUUID(),
    tool: "ChatGPT",
    plan: "Team",
    monthlySpend: 300,
    seats: 10,
    teamSize: 10,
    primaryUseCase: "General productivity",
    ...overrides,
  };
}

describe("runAudit", () => {
  it("calculates monthly and annual savings from benchmark overspend", () => {
    const report = runAudit([item({ monthlySpend: 450, seats: 10, teamSize: 10 })]);

    expect(report.totals.currentMonthlySpend).toBe(450);
    expect(report.totals.monthlySavings).toBeGreaterThan(0);
    expect(report.totals.annualSavings).toBe(report.totals.monthlySavings * 12);
  });

  it("recommends downgrading unnecessary enterprise plans for small teams", () => {
    const report = runAudit([
      item({
        plan: "Enterprise",
        monthlySpend: 600,
        seats: 10,
        teamSize: 10,
      }),
    ]);

    expect(report.opportunities[0]?.type).toBe("downgrade");
    expect(report.opportunities[0]?.recommendedPlan).toBe("Team");
  });

  it("detects excess paid seats above team size", () => {
    const report = runAudit([
      item({
        plan: "Team",
        monthlySpend: 450,
        seats: 15,
        teamSize: 9,
      }),
    ]);

    expect(report.opportunities.some((opportunity) => opportunity.type === "seat_reduction")).toBe(
      true,
    );
  });

  it("creates alternative recommendations for overlapping chat tools", () => {
    const report = runAudit([
      item({ tool: "ChatGPT", plan: "Team", monthlySpend: 300 }),
      item({
        tool: "Claude",
        plan: "Team",
        monthlySpend: 240,
        primaryUseCase: "General productivity",
      }),
    ]);

    expect(report.opportunities.some((opportunity) => opportunity.type === "alternative")).toBe(
      true,
    );
  });

  it("returns optimized state when spend matches expected benchmark", () => {
    const report = runAudit([
      item({
        tool: "GitHub Copilot",
        plan: "Business",
        monthlySpend: 190,
        seats: 10,
        teamSize: 10,
        primaryUseCase: "Engineering",
      }),
    ]);

    expect(report.totals.monthlySavings).toBe(0);
    expect(report.opportunities).toHaveLength(0);
  });

  it("rejects invalid negative monthly spend", () => {
    expect(() =>
      runAudit([
        item({
          monthlySpend: -1,
        }),
      ]),
    ).toThrow();
  });
});

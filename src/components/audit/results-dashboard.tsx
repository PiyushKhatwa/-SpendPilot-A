"use client";

import { CheckCircle2, ExternalLink, Mail, Share2, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/audit/engine";
import type { AuditReport } from "@/types/audit";

interface ResultsDashboardProps {
  report: AuditReport | null;
  summary: string;
  auditId: string | null;
  isSummaryLoading: boolean;
  isSavingAudit: boolean;
  onGenerateSummary: () => Promise<void>;
  onCreateShareLink: () => Promise<string | null>;
}

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function ResultsDashboard({
  report,
  summary,
  auditId,
  isSummaryLoading,
  isSavingAudit,
  onGenerateSummary,
  onCreateShareLink,
}: ResultsDashboardProps) {
  if (!report) {
    return (
      <Card className="bg-card/70">
        <CardContent className="flex min-h-80 flex-col items-center justify-center text-center">
          <CheckCircle2 className="size-10 text-muted-foreground" aria-hidden />
          <h2 className="mt-4 text-xl font-semibold">Audit results will appear here</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Add your tools and run the audit to see savings, recommendations,
            and a shareable report.
          </p>
        </CardContent>
      </Card>
    );
  }

  const highSavings = report.totals.monthlySavings >= 150;
  const shareUrl =
    typeof window !== "undefined" && auditId
      ? `${window.location.origin}/audit/${auditId}`
      : "";

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden bg-card/90">
        <CardHeader className="border-b border-border">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <Badge variant={highSavings ? "default" : "secondary"}>
                {report.totals.monthlySavings > 0
                  ? highSavings
                    ? "High savings opportunity"
                    : "Savings opportunity"
                  : "Already optimized"}
              </Badge>
              <CardTitle className="mt-4 text-2xl sm:text-3xl">
                {report.totals.monthlySavings > 0
                  ? `${formatCurrency(report.totals.annualSavings)} annual savings`
                  : "Your AI stack looks efficient"}
              </CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                {report.totals.monthlySavings > 0
                  ? "Prioritize the largest vendor changes before renewals and confirm active users before reducing seats."
                  : "No meaningful savings were detected from the current inputs. Keep monitoring usage monthly."}
              </CardDescription>
            </div>
            <Button onClick={onCreateShareLink} disabled={isSavingAudit}>
              <Share2 aria-hidden />
              {isSavingAudit ? "Creating..." : auditId ? "Refresh link" : "Create share link"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Current monthly", report.totals.currentMonthlySpend],
            ["Optimized monthly", report.totals.optimizedMonthlySpend],
            ["Monthly savings", report.totals.monthlySavings],
            ["Savings rate", percent(report.totals.savingsRate)],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border bg-background/60 p-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {typeof value === "number" ? formatCurrency(value) : value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
        <Card>
          <CardHeader>
            <CardTitle>Tool-by-tool recommendations</CardTitle>
            <CardDescription>
              Savings are deterministic estimates based on pricing benchmarks,
              seats, plan fit, and stack overlap.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.opportunities.length > 0 ? (
              report.opportunities.map((opportunity) => {
                const width =
                  report.totals.monthlySavings > 0
                    ? Math.max(
                        8,
                        (opportunity.monthlySavings /
                          report.totals.monthlySavings) *
                          100,
                      )
                    : 0;

                return (
                  <div
                    key={opportunity.id}
                    className="rounded-lg border border-border bg-background/55 p-4"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{opportunity.tool}</h3>
                          <Badge variant="outline">{opportunity.type.replace("_", " ")}</Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {opportunity.rationale}
                        </p>
                      </div>
                      <div className="shrink-0 text-left sm:text-right">
                        <div className="text-lg font-semibold text-primary">
                          {formatCurrency(opportunity.monthlySavings)}
                        </div>
                        <div className="text-xs text-muted-foreground">monthly</div>
                      </div>
                    </div>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${width}%` }}
                      />
                    </div>
                    <p className="mt-3 flex items-start gap-2 text-sm text-foreground">
                      <TrendingDown className="mt-0.5 size-4 text-accent" aria-hidden />
                      {opportunity.action}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="rounded-lg border border-border bg-background/55 p-6 text-center">
                <CheckCircle2 className="mx-auto size-8 text-primary" aria-hidden />
                <h3 className="mt-3 font-semibold">You’re already optimized</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  The current plan, seat, and spend mix did not trigger a
                  savings recommendation.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>AI audit summary</CardTitle>
              <CardDescription>
                Generate a concise narrative from the deterministic audit.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSummaryLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-11/12" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              ) : summary ? (
                <p className="text-sm leading-7 text-muted-foreground">{summary}</p>
              ) : (
                <p className="text-sm leading-7 text-muted-foreground">
                  No AI summary yet. Generate one after reviewing the deterministic
                  recommendations.
                </p>
              )}
              <Button
                className="mt-4 w-full"
                variant="secondary"
                onClick={onGenerateSummary}
                disabled={isSummaryLoading}
              >
                {isSummaryLoading ? "Generating..." : "Generate summary"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shareable report</CardTitle>
              <CardDescription>
                Public reports hide lead-capture details and expose only audit
                findings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="share-url">Audit URL</Label>
                <Input
                  id="share-url"
                  value={shareUrl || "Create a share link to publish this audit"}
                  readOnly
                />
              </div>
              {shareUrl ? (
                <Button asChild variant="outline" className="w-full">
                  <a href={shareUrl} target="_blank" rel="noreferrer">
                    <ExternalLink aria-hidden />
                    Open public report
                  </a>
                </Button>
              ) : null}
            </CardContent>
          </Card>

          {highSavings ? (
            <Card className="border-primary/35 bg-primary/10">
              <CardContent className="pt-5">
                <Mail className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 font-semibold">High-impact follow-up</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Capture this report by email before changing vendor plans so
                  the finance owner has a clean record.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}

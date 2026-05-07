import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/audit/engine";
import { getAuditReport } from "@/lib/firebase/server";

interface PublicAuditPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PublicAuditPageProps): Promise<Metadata> {
  const { id } = await params;
  const report = await getAuditReport(id).catch(() => null);
  const title = report
    ? `${formatCurrency(report.totals.annualSavings)} annual AI savings audit`
    : "SpendPilot AI Audit";
  const description = report
    ? `Public SpendPilot AI report with ${formatCurrency(
        report.totals.monthlySavings,
      )} estimated monthly savings.`
    : "Public SpendPilot AI audit report.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      url: `/audit/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function PublicAuditPage({ params }: PublicAuditPageProps) {
  const { id } = await params;
  const report = await getAuditReport(id).catch(() => null);

  if (!report) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border surface-grid">
        <div className="container py-10">
          <Badge>Public audit report</Badge>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold tracking-normal sm:text-5xl">
            {report.totals.monthlySavings > 0
              ? `${formatCurrency(report.totals.annualSavings)} in annual AI savings`
              : "AI stack audit report"}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground">
            This public report excludes lead-capture details and contains only
            spend inputs, deterministic recommendations, and summary findings.
          </p>
        </div>
      </section>

      <section className="container grid gap-4 py-8 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Current monthly", report.totals.currentMonthlySpend],
          ["Optimized monthly", report.totals.optimizedMonthlySpend],
          ["Monthly savings", report.totals.monthlySavings],
          ["Annual savings", report.totals.annualSavings],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardContent className="pt-5">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-2xl font-semibold">
                {formatCurrency(Number(value))}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="container grid gap-5 pb-10 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Audit summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-7 text-muted-foreground">
              {report.summary ??
                "This report was generated from deterministic SpendPilot AI audit logic."}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {report.opportunities.length > 0 ? (
              report.opportunities.map((opportunity) => (
                <div
                  key={opportunity.id}
                  className="rounded-lg border border-border bg-background/55 p-4"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="font-semibold">{opportunity.tool}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {opportunity.rationale}
                      </p>
                    </div>
                    <Badge variant="outline">
                      {formatCurrency(opportunity.monthlySavings)}/mo
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm">{opportunity.action}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                No savings opportunities were detected for this audit.
              </p>
            )}
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

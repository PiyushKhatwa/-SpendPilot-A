"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeDollarSign } from "lucide-react";
import { LeadCaptureForm } from "@/components/audit/lead-capture-form";
import { ResultsDashboard } from "@/components/audit/results-dashboard";
import { SpendInputForm } from "@/components/audit/spend-input-form";
import { Button } from "@/components/ui/button";
import { runAudit } from "@/lib/audit/engine";
import { useAuditStore } from "@/store/audit-store";
import type { AuditReport } from "@/types/audit";

export function AuditWorkflow() {
  const {
    lineItems,
    report,
    summary,
    auditId,
    setLineItems,
    setReport,
    setSummary,
    setAuditId,
    reset,
  } = useAuditStore();
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);
  const [isSavingAudit, setIsSavingAudit] = useState(false);
  const [error, setError] = useState("");

  function handleRunAudit() {
    setError("");
    try {
      const nextReport = runAudit(lineItems);
      setReport(nextReport);
      setSummary("");
      setAuditId(null);
      requestAnimationFrame(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      });
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to run audit.");
    }
  }

  async function generateSummary() {
    if (!report) {
      return;
    }

    setIsSummaryLoading(true);
    setError("");
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems: report.lineItems }),
      });
      const data = (await response.json()) as { summary?: string; error?: string };
      if (!response.ok || !data.summary) {
        throw new Error(data.error ?? "Summary generation failed.");
      }

      setSummary(data.summary);
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Summary generation failed.");
    } finally {
      setIsSummaryLoading(false);
    }
  }

  async function createShareLink() {
    if (!report) {
      return null;
    }

    setIsSavingAudit(true);
    setError("");
    try {
      const response = await fetch("/api/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lineItems: report.lineItems, summary }),
      });
      const data = (await response.json()) as {
        id?: string;
        report?: AuditReport;
        error?: string;
      };
      if (!response.ok || !data.id || !data.report) {
        throw new Error(data.error ?? "Unable to create share link.");
      }

      setAuditId(data.id);
      setReport(data.report);
      return data.id;
    } catch (issue) {
      setError(issue instanceof Error ? issue.message : "Unable to create share link.");
      return null;
    } finally {
      setIsSavingAudit(false);
    }
  }

  function startFresh() {
    reset();
    setError("");
  }

  return (
    <main className="min-h-screen bg-background">
      <section className="border-b border-border surface-grid">
        <div className="container py-6 sm:py-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <BadgeDollarSign className="size-4" aria-hidden />
                SpendPilot AI
              </div>
              <h1 className="mt-3 text-3xl font-semibold tracking-normal sm:text-4xl">
                AI spend audit workspace
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                Enter your AI stack, generate deterministic savings, create an
                AI-written summary, and publish a clean report URL.
              </p>
            </div>
            <Button variant="outline" onClick={startFresh}>
              Start fresh
            </Button>
          </div>
        </div>
      </section>

      <div className="container grid gap-5 py-6 lg:grid-cols-[0.95fr_1.05fr] lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <SpendInputForm
            lineItems={lineItems}
            onChange={setLineItems}
            onSubmit={handleRunAudit}
          />
          {error ? (
            <p className="mt-4 rounded-lg border border-destructive/35 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              {error}
            </p>
          ) : null}
        </motion.div>

        <motion.div
          id="results"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <ResultsDashboard
            report={report}
            summary={summary}
            auditId={auditId}
            isSummaryLoading={isSummaryLoading}
            isSavingAudit={isSavingAudit}
            onGenerateSummary={generateSummary}
            onCreateShareLink={createShareLink}
          />
        </motion.div>
      </div>

      <div className="container pb-10">
        <LeadCaptureForm
          report={report}
          auditId={auditId}
          ensureAuditSaved={createShareLink}
        />
      </div>
    </main>
  );
}

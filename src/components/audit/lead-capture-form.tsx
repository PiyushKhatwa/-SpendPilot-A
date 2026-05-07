"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuditReport } from "@/types/audit";

interface LeadCaptureFormProps {
  report: AuditReport | null;
  auditId: string | null;
  ensureAuditSaved: () => Promise<string | null>;
}

export function LeadCaptureForm({
  report,
  auditId,
  ensureAuditSaved,
}: LeadCaptureFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submitLead(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!report) {
      setStatus("error");
      setMessage("Run an audit before capturing the report.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const form = new FormData(event.currentTarget);
    const savedAuditId = auditId ?? (await ensureAuditSaved());

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          companyName: form.get("companyName"),
          role: form.get("role"),
          teamSize: Number(form.get("teamSize")),
          website: form.get("website"),
          auditId: savedAuditId ?? undefined,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Unable to capture report.");
      }

      setStatus("success");
      setMessage("Report captured. Confirmation email queued.");
      event.currentTarget.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to capture report.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capture this audit</CardTitle>
        <CardDescription>
          Send the report to a finance or operations owner for follow-up.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitLead} className="grid gap-4 md:grid-cols-2" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Work email</Label>
            <Input id="email" name="email" type="email" required placeholder="you@company.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyName">Company</Label>
            <Input id="companyName" name="companyName" required placeholder="Acme AI Labs" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" required placeholder="Founder, Ops, Finance" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leadTeamSize">Team size</Label>
            <Input id="leadTeamSize" name="teamSize" type="number" min="1" required placeholder="12" />
          </div>
          <div className="hidden" aria-hidden="true">
            <Label htmlFor="website">Website</Label>
            <Input id="website" name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" disabled={status === "loading" || !report}>
              <Send aria-hidden />
              {status === "loading" ? "Sending..." : "Email audit report"}
            </Button>
            {message ? (
              <p
                className={`mt-3 text-sm ${
                  status === "error" ? "text-destructive-foreground" : "text-primary"
                }`}
                role="status"
              >
                {message}
              </p>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

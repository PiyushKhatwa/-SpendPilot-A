import type { Metadata } from "next";
import { AuditWorkflow } from "@/components/audit/audit-workflow";

export const metadata: Metadata = {
  title: "Run Audit",
  description:
    "Enter AI subscription and API spend to generate a deterministic SpendPilot AI savings audit.",
};

export default function NewAuditPage() {
  return <AuditWorkflow />;
}

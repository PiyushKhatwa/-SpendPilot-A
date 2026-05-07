"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuditReport, SpendLineItem } from "@/types/audit";

interface AuditState {
  lineItems: SpendLineItem[];
  report: AuditReport | null;
  summary: string;
  auditId: string | null;
  setLineItems: (lineItems: SpendLineItem[]) => void;
  setReport: (report: AuditReport | null) => void;
  setSummary: (summary: string) => void;
  setAuditId: (auditId: string | null) => void;
  reset: () => void;
}

export const useAuditStore = create<AuditState>()(
  persist(
    (set) => ({
      lineItems: [],
      report: null,
      summary: "",
      auditId: null,
      setLineItems: (lineItems) => set({ lineItems }),
      setReport: (report) => set({ report }),
      setSummary: (summary) => set({ summary }),
      setAuditId: (auditId) => set({ auditId }),
      reset: () =>
        set({
          lineItems: [],
          report: null,
          summary: "",
          auditId: null,
        }),
    }),
    {
      name: "spendpilot-audit-v1",
      partialize: (state) => ({
        lineItems: state.lineItems,
        report: state.report,
        summary: state.summary,
        auditId: state.auditId,
      }),
    },
  ),
);

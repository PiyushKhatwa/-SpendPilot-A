import { NextRequest, NextResponse } from "next/server";
import { auditInputSchema } from "@/lib/audit/schema";
import { createFallbackSummary, runAudit } from "@/lib/audit/engine";
import { saveAuditReport } from "@/lib/firebase/server";
import { checkRateLimit, getRequestKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(getRequestKey(request.headers, "audits"), 20, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many audit saves. Try again later." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = auditInputSchema.parse({ lineItems: body.lineItems });
    const report = runAudit(parsed.lineItems);
    const summary =
      typeof body.summary === "string" && body.summary.trim().length > 0
        ? body.summary.trim().slice(0, 1200)
        : createFallbackSummary(report);
    const reportToStore = { ...report, summary };
    const id = await saveAuditReport(reportToStore);

    return NextResponse.json({
      id,
      report: {
        ...reportToStore,
        id,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to save audit report.",
      },
      { status: 400 },
    );
  }
}

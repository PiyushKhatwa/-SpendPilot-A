import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { leadCaptureSchema } from "@/lib/audit/schema";
import { getRequiredEnv } from "@/lib/env";
import { saveLead } from "@/lib/firebase/server";
import { checkRateLimit, getRequestKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(getRequestKey(request.headers, "leads"), 6, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many report capture attempts. Try again later." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = leadCaptureSchema.parse(body);
    const leadId = await saveLead(parsed, request.headers.get("user-agent"));

    let emailSent = false;
    try {
      const resend = new Resend(getRequiredEnv("RESEND_API_KEY"));
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "SpendPilot AI <onboarding@resend.dev>",
        to: parsed.email,
        subject: "Your SpendPilot AI audit was captured",
        text: `Hi,\n\nYour SpendPilot AI report has been captured for ${parsed.companyName}.\n\n${parsed.auditId ? `Public report: ${request.nextUrl.origin}/audit/${parsed.auditId}\n\n` : ""}Use this as a starting point for vendor review and renewal planning.\n\nSpendPilot AI`,
      });
      emailSent = true;
    } catch {
      emailSent = false;
    }

    return NextResponse.json({ leadId, emailSent });
  } catch {
    return NextResponse.json({ error: "Invalid lead capture input." }, { status: 400 });
  }
}

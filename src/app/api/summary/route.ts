import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { runAudit, createFallbackSummary } from "@/lib/audit/engine";
import { auditInputSchema } from "@/lib/audit/schema";
import { getRequiredEnv } from "@/lib/env";
import { checkRateLimit, getRequestKey } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(getRequestKey(request.headers, "summary"), 8, 60 * 60 * 1000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many summary requests. Try again later." },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const parsed = auditInputSchema.parse(body);
    const report = runAudit(parsed.lineItems);
    const fallback = createFallbackSummary(report);

    try {
      const client = new OpenAI({ apiKey: getRequiredEnv("OPENAI_API_KEY") });
      const completion = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.3,
        max_tokens: 170,
        messages: [
          {
            role: "system",
            content:
              "You write concise SaaS finance audit summaries. Use plain English, no hype, around 100 words. Do not invent numbers beyond the provided audit.",
          },
          {
            role: "user",
            content: JSON.stringify({
              totals: report.totals,
              opportunities: report.opportunities,
            }),
          },
        ],
      });
      const summary = completion.choices[0]?.message.content?.trim();

      return NextResponse.json({
        summary: summary || fallback,
        fallback: !summary,
      });
    } catch {
      return NextResponse.json({ summary: fallback, fallback: true });
    }
  } catch {
    return NextResponse.json({ error: "Invalid audit input." }, { status: 400 });
  }
}

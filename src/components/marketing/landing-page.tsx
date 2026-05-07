"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeDollarSign,
  BarChart3,
  CheckCircle2,
  Gauge,
  LockKeyhole,
  MailCheck,
  ReceiptText,
  Share2,
  Sparkles,
  TrendingDown,
  WalletCards,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { supportedAiTools } from "@/types/audit";

const auditSteps = [
  {
    icon: WalletCards,
    title: "Enter AI stack",
    description: "Capture subscriptions, API spend, seats, and plan context.",
  },
  {
    icon: Gauge,
    title: "Run deterministic audit",
    description: "Score each line item against practical downgrade and overlap rules.",
  },
  {
    icon: Sparkles,
    title: "Generate executive summary",
    description: "Turn findings into a concise report users can email and share.",
  },
] as const;

const optimizationSignals = [
  "Duplicate chatbot subscriptions",
  "Unused seats and team overlap",
  "API spend review thresholds",
  "Plan mismatch recommendations",
] as const;

const metrics = [
  { label: "Projected monthly waste", value: "$740" },
  { label: "Tools reviewed", value: "8" },
  { label: "Potential savings", value: "31%" },
] as const;

export function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background">
      <section className="relative border-b border-border surface-grid">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.72),hsl(var(--background))_84%)]" />
        <div className="container relative flex min-h-screen flex-col py-5 sm:min-h-[92vh]">
          <header className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-sm font-semibold text-foreground"
              aria-label="SpendPilot AI home"
            >
              <span className="flex size-9 items-center justify-center rounded-md border border-primary/30 bg-primary/10">
                <BadgeDollarSign className="size-4 text-primary" aria-hidden />
              </span>
              SpendPilot AI
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a href="#tools" className="transition-colors hover:text-foreground">
                Tools
              </a>
              <a href="#workflow" className="transition-colors hover:text-foreground">
                Workflow
              </a>
              <a href="#security" className="transition-colors hover:text-foreground">
                Security
              </a>
            </nav>
            <Button asChild size="sm" variant="outline">
              <Link href="/audit/new">
                Start audit
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </header>

          <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.02fr_0.98fr] lg:py-20">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl"
            >
              <Badge className="mb-5">
                AI subscription audits for lean teams
              </Badge>
              <h1 className="text-balance text-4xl font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
                SpendPilot AI
              </h1>
              <p className="mt-5 max-w-2xl text-balance text-lg leading-8 text-muted-foreground">
                Find wasted AI spend across chatbot seats, coding assistants,
                and API usage, then turn the savings into a shareable audit
                report.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/audit/new">
                    Start spend audit
                    <ArrowRight aria-hidden />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="#workflow">View workflow</Link>
                </Button>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-lg border border-border bg-background/55 p-4 backdrop-blur"
                  >
                    <div className="text-2xl font-semibold text-foreground">
                      {metric.value}
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
              className="rounded-lg border border-border bg-card/92 p-3 shadow-2xl shadow-black/30 backdrop-blur"
              aria-label="Spend audit preview"
            >
              <div className="rounded-md border border-border bg-background/80 p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Audit summary
                    </p>
                    <h2 className="mt-1 text-xl font-semibold">
                      Q2 AI stack review
                    </h2>
                  </div>
                  <Badge variant="secondary">Draft</Badge>
                </div>

                <div className="mt-6 space-y-3">
                  {[
                    ["ChatGPT Team", "$300", "$180", "40%"],
                    ["Cursor", "$240", "$160", "33%"],
                    ["OpenAI API", "$920", "$790", "14%"],
                  ].map(([tool, current, optimized, percent]) => (
                    <div
                      key={tool}
                      className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border border-border bg-card p-4"
                    >
                      <div>
                        <div className="font-medium">{tool}</div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {current} current spend
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-primary">
                          {optimized}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <TrendingDown className="size-3.5" aria-hidden />
                          {percent}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-lg border border-primary/25 bg-primary/10 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <CheckCircle2 className="size-4" aria-hidden />
                    Estimated monthly savings
                  </div>
                  <div className="mt-2 text-3xl font-semibold">$430</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="tools" className="border-b border-border py-14 sm:py-18">
        <div className="container">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <Badge variant="outline">Supported tools</Badge>
              <h2 className="mt-4 text-2xl font-semibold tracking-normal sm:text-3xl">
                Built for the AI stack teams already use
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-muted-foreground">
              SpendPilot AI starts with high-signal tools and leaves room for
              custom line items as the product expands.
            </p>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
            {supportedAiTools.map((tool) => (
              <div
                key={tool}
                className="rounded-lg border border-border bg-card p-4 text-sm font-medium"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="workflow" className="border-b border-border py-14 sm:py-18">
        <div className="container">
          <div className="max-w-2xl">
            <Badge variant="outline">Audit workflow</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-normal sm:text-3xl">
              From spend inputs to board-ready savings report
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {auditSteps.map((step) => (
              <Card key={step.title}>
                <CardHeader>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-md bg-secondary">
                    <step.icon className="size-5 text-primary" aria-hidden />
                  </div>
                  <CardTitle>{step.title}</CardTitle>
                  <CardDescription>{step.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="audit" className="border-b border-border py-14 sm:py-18">
        <div className="container grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <Badge variant="outline">Optimization signals</Badge>
            <h2 className="mt-4 text-2xl font-semibold tracking-normal sm:text-3xl">
              Deterministic first, personalized second
            </h2>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              The audit engine will calculate savings with explicit rules
              before OpenAI turns the result into a readable summary.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {optimizationSignals.map((signal) => (
              <div
                key={signal}
                className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
              >
                <BarChart3 className="size-5 text-accent" aria-hidden />
                <span className="text-sm font-medium">{signal}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="security" className="py-14 sm:py-18">
        <div className="container grid gap-4 md:grid-cols-3">
          {[
            {
              icon: LockKeyhole,
              title: "Server-side API calls",
              description:
                "OpenAI and Resend calls stay behind secure App Router API routes.",
            },
            {
              icon: ReceiptText,
              title: "Firestore-ready",
              description:
                "Firebase is centralized so storage can move through server Admin SDK flows.",
            },
            {
              icon: MailCheck,
              title: "Shareable reports",
              description:
                "Email capture and public audit URLs are implemented as isolated feature slices.",
            },
          ].map((item) => (
            <Card key={item.title}>
              <CardContent className="pt-5">
                <item.icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <footer className="border-t border-border py-6">
        <div className="container flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <div>SpendPilot AI</div>
          <div className="flex items-center gap-2">
            <Share2 className="size-4" aria-hidden />
            Public audit reports ready to share
          </div>
        </div>
      </footer>
    </main>
  );
}

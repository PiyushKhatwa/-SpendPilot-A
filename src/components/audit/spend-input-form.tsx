"use client";

import { useEffect, useMemo } from "react";
import { Plus, Trash2, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { auditInputSchema } from "@/lib/audit/schema";
import { getPlanNames, pricingCatalog } from "@/lib/audit/pricing";
import {
  primaryUseCases,
  supportedAiTools,
  type SpendLineItem,
  type SupportedAiTool,
} from "@/types/audit";

interface SpendInputFormProps {
  lineItems: SpendLineItem[];
  onChange: (lineItems: SpendLineItem[]) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

function newLineItem(): SpendLineItem {
  return {
    id: crypto.randomUUID(),
    tool: "ChatGPT",
    plan: pricingCatalog.ChatGPT.defaultPlan,
    monthlySpend: 30,
    seats: 1,
    teamSize: 1,
    primaryUseCase: "General productivity",
  };
}

function fieldId(itemId: string, field: string) {
  return `${itemId}-${field}`;
}

export function SpendInputForm({
  lineItems,
  onChange,
  onSubmit,
  isSubmitting = false,
}: SpendInputFormProps) {
  const initialItem = useMemo(() => newLineItem(), []);
  const items = lineItems.length > 0 ? lineItems : [initialItem];

  useEffect(() => {
    if (lineItems.length === 0) {
      onChange([initialItem]);
    }
  }, [initialItem, lineItems.length, onChange]);

  const parsed = auditInputSchema.safeParse({ lineItems: items });
  const errors = parsed.success ? {} : parsed.error.flatten().fieldErrors;

  function updateItem(id: string, patch: Partial<SpendLineItem>) {
    onChange(
      items.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const nextTool = patch.tool ?? item.tool;
        const toolChanged = patch.tool && patch.tool !== item.tool;

        return {
          ...item,
          ...patch,
          plan: toolChanged
            ? pricingCatalog[nextTool as SupportedAiTool].defaultPlan
            : patch.plan ?? item.plan,
        };
      }),
    );
  }

  function addItem() {
    onChange([...items, newLineItem()]);
  }

  function removeItem(id: string) {
    onChange(items.length === 1 ? [newLineItem()] : items.filter((item) => item.id !== id));
  }

  function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auditInputSchema.safeParse({ lineItems: items }).success) {
      return;
    }

    onSubmit();
  }

  return (
    <Card className="bg-card/80">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle>AI spend inputs</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground">
            Add each paid AI subscription or API line item you want audited.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={addItem}>
          <Plus aria-hidden />
          Add tool
        </Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={submitForm} className="space-y-4" noValidate>
          {items.map((item, index) => {
            const planNames = getPlanNames(item.tool);

            return (
              <div
                key={item.id}
                className="rounded-lg border border-border bg-background/55 p-4"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <div className="text-sm font-semibold text-muted-foreground">
                    Tool {index + 1}
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeItem(item.id)}
                    aria-label={`Remove ${item.tool}`}
                  >
                    <Trash2 aria-hidden />
                  </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor={fieldId(item.id, "tool")}>Tool</Label>
                    <select
                      id={fieldId(item.id, "tool")}
                      value={item.tool}
                      onChange={(event) =>
                        updateItem(item.id, {
                          tool: event.target.value as SupportedAiTool,
                        })
                      }
                      className="h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm"
                    >
                      {supportedAiTools.map((tool) => (
                        <option key={tool} value={tool}>
                          {tool}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={fieldId(item.id, "plan")}>Plan</Label>
                    <select
                      id={fieldId(item.id, "plan")}
                      value={item.plan}
                      onChange={(event) =>
                        updateItem(item.id, { plan: event.target.value })
                      }
                      className="h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm"
                    >
                      {planNames.map((plan) => (
                        <option key={plan} value={plan}>
                          {plan}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={fieldId(item.id, "monthlySpend")}>
                      Monthly spend
                    </Label>
                    <Input
                      id={fieldId(item.id, "monthlySpend")}
                      type="number"
                      min="0"
                      step="1"
                      value={item.monthlySpend}
                      onChange={(event) =>
                        updateItem(item.id, {
                          monthlySpend: Number(event.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={fieldId(item.id, "seats")}>Seats</Label>
                    <Input
                      id={fieldId(item.id, "seats")}
                      type="number"
                      min="1"
                      step="1"
                      value={item.seats}
                      onChange={(event) =>
                        updateItem(item.id, { seats: Number(event.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={fieldId(item.id, "teamSize")}>Team size</Label>
                    <Input
                      id={fieldId(item.id, "teamSize")}
                      type="number"
                      min="1"
                      step="1"
                      value={item.teamSize}
                      onChange={(event) =>
                        updateItem(item.id, {
                          teamSize: Number(event.target.value),
                        })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={fieldId(item.id, "primaryUseCase")}>
                      Primary use case
                    </Label>
                    <select
                      id={fieldId(item.id, "primaryUseCase")}
                      value={item.primaryUseCase}
                      onChange={(event) =>
                        updateItem(item.id, {
                          primaryUseCase: event.target
                            .value as SpendLineItem["primaryUseCase"],
                        })
                      }
                      className="h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm"
                    >
                      {primaryUseCases.map((useCase) => (
                        <option key={useCase} value={useCase}>
                          {useCase}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}

          {!parsed.success ? (
            <p className="rounded-md border border-destructive/35 bg-destructive/10 p-3 text-sm text-destructive-foreground">
              {Object.values(errors).flat()[0] ?? "Please review your inputs."}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
            <WandSparkles aria-hidden />
            Run AI spend audit
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

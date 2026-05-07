import { z } from "zod";
import { primaryUseCases, supportedAiTools } from "@/types/audit";

export const spendLineItemSchema = z.object({
  id: z.string().min(1),
  tool: z.enum(supportedAiTools),
  plan: z.string().min(1, "Plan is required").max(60),
  monthlySpend: z.coerce
    .number({ invalid_type_error: "Monthly spend must be a number" })
    .min(0, "Monthly spend cannot be negative")
    .max(250000, "Monthly spend is above the supported audit range"),
  seats: z.coerce
    .number({ invalid_type_error: "Seats must be a number" })
    .int("Seats must be a whole number")
    .min(1, "At least one seat is required")
    .max(10000),
  teamSize: z.coerce
    .number({ invalid_type_error: "Team size must be a number" })
    .int("Team size must be a whole number")
    .min(1, "Team size is required")
    .max(10000),
  primaryUseCase: z.enum(primaryUseCases),
});

export const auditInputSchema = z.object({
  lineItems: z
    .array(spendLineItemSchema)
    .min(1, "Add at least one AI tool")
    .max(20, "Audit up to 20 tools at a time"),
});

export const leadCaptureSchema = z.object({
  email: z.string().email("Enter a valid work email").max(120),
  companyName: z.string().min(2, "Company name is required").max(100),
  role: z.string().min(2, "Role is required").max(80),
  teamSize: z.coerce.number().int().min(1).max(10000),
  auditId: z.string().max(120).optional(),
  website: z.string().max(0, "Spam protection triggered").optional(),
});

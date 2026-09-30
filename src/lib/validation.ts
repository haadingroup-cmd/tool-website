import { z } from "zod";
import { CHANGE_FIELD_KEYS } from "./vendor";

const email = z
  .string()
  .trim()
  .toLowerCase()
  .min(5, "Please enter a valid email address.")
  .max(254, "Email address is too long.")
  .email("Please enter a valid email address.");

// Removes control characters (except newlines/tabs in long text) to keep stored data clean.
const cleanLine = (max: number, min = 1, label = "This field") =>
  z
    .string()
    .trim()
    .transform((s) => s.replace(/[\u0000-\u001F\u007F]/g, ""))
    .pipe(z.string().min(min, `${label} is required.`).max(max, `${label} is too long.`));

const cleanText = (max: number, min: number, label: string) =>
  z
    .string()
    .trim()
    .transform((s) => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ""))
    .pipe(z.string().min(min, `${label} is too short.`).max(max, `${label} is too long.`));

// Honeypot: real users never see or fill this field.
// Accept any value here; the route silently discards the submission if it is non-empty.
const honeypot = z.string().max(500).optional().default("");
// Time the form was rendered (ms epoch) — bots submit instantly.
const startedAt = z.number().int().positive().optional();

export const subscribeSchema = z.object({
  email,
  source: z.string().trim().max(60).regex(/^[a-z0-9\-/]*$/i).optional().default("site"),
  website: honeypot,
  startedAt,
});

export const contactSchema = z.object({
  name: cleanLine(100, 2, "Name"),
  email,
  subject: z.enum(["general", "editorial", "correction", "partnership", "press"]),
  message: cleanText(5000, 20, "Message"),
  website: honeypot,
  startedAt,
});

export const submitToolSchema = z.object({
  toolName: cleanLine(100, 2, "Tool name"),
  toolUrl: z
    .string()
    .trim()
    .max(300)
    .url("Please enter a valid URL.")
    .refine((u) => /^https:\/\//i.test(u), "URL must start with https://"),
  category: cleanLine(60, 2, "Category"),
  contactName: cleanLine(100, 2, "Your name"),
  email,
  description: cleanText(2000, 30, "Description"),
  ukPricing: cleanLine(200, 0, "UK pricing").optional().default(""),
  website: honeypot,
  startedAt,
});

export const claimSchema = z.object({
  productSlug: z.string().trim().max(80).regex(/^[a-z0-9-]+$/, "Please choose a product."),
  contactName: cleanLine(100, 2, "Your name"),
  email,
  jobTitle: cleanLine(100, 2, "Job title"),
  companyDomain: z.string().trim().toLowerCase().max(120).regex(/^([a-z0-9-]+\.)+[a-z]{2,}$/, "Enter your company domain, e.g. example.com"),
  message: cleanText(2000, 0, "Message").optional().default(""),
  website: honeypot,
  startedAt,
});

export const searchSchema = z.object({
  q: z.string().trim().min(1).max(80),
});

export const loginSchema = z.object({
  email,
  next: z.string().max(200).optional(),
  website: honeypot,
  startedAt,
});

// Shown publicly next to reviews, so keep it to plain name characters.
export const profileSchema = z.object({
  displayName: cleanLine(50, 2, "Display name").pipe(
    z.string().regex(/^[\p{L}\p{N} .'\-]+$/u, "Use letters, numbers, spaces, dots, apostrophes or hyphens only."),
  ),
});

const slug = z.string().trim().max(80).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Unknown product.");
const stars = z.number().int().min(1, "Please choose a rating from 1 to 5.").max(5, "Please choose a rating from 1 to 5.");

export const reviewSchema = z.object({
  productSlug: slug,
  overall: stars,
  easeOfUse: stars.optional(),
  features: stars.optional(),
  valueForMoney: stars.optional(),
  support: stars.optional(),
  ukSuitability: stars.optional(),
  title: cleanText(120, 5, "Title").transform((s) => s.replace(/\s+/g, " ")),
  pros: cleanText(3000, 20, "What you like"),
  cons: cleanText(3000, 20, "What could be better"),
  useCase: cleanLine(200, 0).optional(),
  businessSize: z.enum(["solo", "2-9", "10-49", "50-249", "250+"]).optional(),
  durationOfUse: z.enum(["<6m", "6-12m", "1-2y", "2y+"], { error: "Please say how long you have used it." }),
  connection: z.enum(["none", "competitor", "partner"], { error: "Please declare any connection." }),
  honest: z.literal(true, { error: "Please confirm your review is honest and based on your own use." }),
  website: honeypot,
  startedAt,
});

export const reportSchema = z.object({
  reviewId: z.number().int().positive(),
  reason: cleanText(500, 10, "Reason"),
});

export const vendorClaimSchema = z.object({
  productSlug: slug,
  jobTitle: cleanLine(100, 2, "Job title"),
  evidence: cleanText(2000, 0, "Evidence").optional().default(""),
});

export const changeRequestSchema = z.object({
  productSlug: slug,
  field: z.enum(CHANGE_FIELD_KEYS, { error: "Please choose what should change." }),
  value: cleanText(3000, 5, "Proposed change"),
  evidenceUrl: z
    .string()
    .trim()
    .max(500)
    .refine((u) => u === "" || /^https:\/\/[^\s]+$/i.test(u), "Evidence must be an https:// link.")
    .optional()
    .default(""),
});

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ClaimInput = z.infer<typeof claimSchema>;
export type SubmitToolInput = z.infer<typeof submitToolSchema>;

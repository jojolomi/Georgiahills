import { defineCollection, z } from "astro:content";
import { MARKET_CODES } from "../../../packages/shared/src/contracts/market.js";

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string()
});

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(["en", "ar"]),
    intent: z.enum(["planning", "cost", "itinerary", "halal", "safety"]).optional(),
    market: z.array(z.enum(MARKET_CODES)).optional(),
    slug: z.string().optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    date: z.string().optional(),
    publish_date: z.string().optional(),
    locale: z.string().optional(),
    author: z.string().optional(),
    reviewer_name: z.string().optional(),
    reviewed_date: z.string().optional(),
    image: z.string().optional(),
    faq: z.array(faqItemSchema).optional()
  })
});

export const collections = { blog };

import { defineCollection, z } from "astro:content";

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
    market: z.array(z.enum(["sa", "ae", "qa", "kw", "eg"])).optional(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    date: z.string().optional(),
    author: z.string().optional(),
    reviewed_date: z.string().optional(),
    image: z.string().optional(),
    faq: z.array(faqItemSchema).optional()
  })
});

export const collections = { blog };

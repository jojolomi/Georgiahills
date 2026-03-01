import { defineCollection, z } from "astro:content";
import { MARKET_CODES } from "../../../packages/shared/src/contracts/market.js";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(["en", "ar"]),
    intent: z.enum(["planning", "cost", "itinerary", "halal", "safety"]),
    market: z.array(z.enum(MARKET_CODES))
  })
});

export const collections = { blog };

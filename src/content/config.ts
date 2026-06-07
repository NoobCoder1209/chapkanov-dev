import { defineCollection, z } from "astro:content";

const projects = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    pitch: z.string().max(200),
    repo: z.string().url(),
    category: z.enum(["devops", "ai", "terraform", "learning"]),
    skills: z.array(z.string()).min(1),
    techStack: z.array(z.string()).min(1),
    screenshots: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string(),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
        }),
      )
      .default([]),
    pinned: z.boolean().default(true),
    status: z.enum(["public", "private", "learning-notes", "draft"]).default("public"),
    order: z.number().int().min(1).max(99),
    updated: z.coerce.date().optional(),
  }),
});

export const collections = { projects };

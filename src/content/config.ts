import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    category: z.string(),
    role: z.string(),
    timeline: z.string(),
    heroImage: z.string(),
    heroAlt: z.string(),
  impact: z.string().optional(),
  draft: z.boolean().default(false).optional(),
    tags: z.array(z.string()).optional(),
    href: z.string().optional(),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          value: z.string(),
          hint: z.string().optional()
        })
      )
      .optional(),
    problem: z.string(),
    roleDetail: z.string(),
    process: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        media: z
          .array(
            z.object({
              src: z.string(),
              alt: z.string()
            })
          )
          .optional()
      })
    ),
    outcomes: z.array(z.string()),
  reflection: z.string(),
    gallery: z
      .array(
        z.object({
          src: z.string(),
          alt: z.string()
        })
      )
      .optional()
  })
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.date(),
    updatedAt: z.date().optional(),
    draft: z.boolean().default(false),
    readingTime: z.string().optional(),
    tags: z.array(z.string()).optional()
  })
});

export const collections = { projects, blog };

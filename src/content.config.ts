import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    cover: z.object({
      dark: z.string(),
      light: z.string().optional(),
      alt: z.string(),
    }).optional(),
    date: z.coerce.date(),
    draft: z.boolean().default(false),
    tags: z.array(z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)*$/)).default([]),
    series: reference('series').optional(),
    seriesOrder: z.number().optional(),
  }),
});

export const collections = { series, posts };

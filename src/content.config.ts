import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Natalie's research, one Markdown file per piece (src/content/research/<slug>.md → /onderzoek/<slug>).
const research = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/research' }),
  schema: z.object({
    /** The title's plain words; `accent` is its italic copper end. */
    title: z.string(),
    accent: z.string(),
    date: z.coerce.date(),
    /** One sentence for the list and the meta description. */
    summary: z.string(),
    /** Hidden from the list and the build until Natalie approves it. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { research };

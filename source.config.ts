import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { z } from 'zod';

const recipeFrontmatterSchema = frontmatterSchema.extend({
  rating: z.union([z.string(), z.number()]).optional(),
  author: z.string().optional(),
  date: z.string().optional(),
  category: z.string().optional(),
  cuisine: z.string().optional(),
  difficulty: z.string().optional(),
  servings: z.union([z.string(), z.number()]).optional(),
  prepTime: z.string().optional(),
  cookTime: z.string().optional(),
  totalTime: z.string().optional(),
  calories: z.union([z.string(), z.number()]).optional(),
  dietary: z.string().optional(),
  allergens: z.string().optional(),
  cost: z.string().optional(),
  tags: z.array(z.string()).optional(),
  source: z.string().optional(),
});

export const recipes = defineDocs({
  docs: {
    schema: recipeFrontmatterSchema,
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // optional MDX config
  },
});

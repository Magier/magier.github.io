import { getCollection } from 'astro:content';

// Drafts show up in `pnpm dev` but never in the build.
export async function getPosts() {
  const posts = await getCollection('posts', (p) => import.meta.env.DEV || !p.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const formatDate = (d: Date) => d.toISOString().slice(0, 10);

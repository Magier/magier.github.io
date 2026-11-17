import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://magier.github.io',
  integrations: [mdx(), sitemap()],
  redirects: {
    '/posts/hands-in-the-sandbox/': '/posts/50-shades-of-isolation/',
  },
});

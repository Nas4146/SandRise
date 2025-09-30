import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://sandrise.studio',
  integrations: [sitemap()],
  markdown: {
    syntaxHighlight: 'prism'
  }
});

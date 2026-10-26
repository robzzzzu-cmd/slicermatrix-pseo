import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE_URL = process.env.SITE_URL || 'https://slicermatrix.pages.dev';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  build: {
    format: 'directory',
  },
});

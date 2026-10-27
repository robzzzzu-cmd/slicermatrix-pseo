import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE_URL = process.env.SITE_URL || 'https://robzzzzu-cmd.github.io';
const BASE_PATH = process.env.BASE_PATH || '';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH || undefined,
  output: 'static',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  build: {
    format: 'directory',
  },
});

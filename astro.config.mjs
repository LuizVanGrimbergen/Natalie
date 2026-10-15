// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Absolute URL for canonical + Open Graph. Set SITE_URL once the domain is known.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

export default defineConfig({
  site,
  vite: {
    plugins: [tailwindcss()],
    // Never inline small scripts into the HTML: the Content-Security-Policy (vercel.json) only allows script files.
    build: { assetsInlineLimit: 0 },
  },
});

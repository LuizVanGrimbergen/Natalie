// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Absolute URL for canonical + Open Graph. Set SITE_URL once the domain is known.
// On Netlify, URL is the site's main address (e.g. https://<name>.netlify.app).
const site = process.env.SITE_URL || process.env.URL || 'http://localhost:4321';

export default defineConfig({
  site,
  vite: {
    plugins: [tailwindcss()],
    // Never inline small scripts into the HTML: the Content-Security-Policy (netlify.toml) only allows script files.
    build: { assetsInlineLimit: 0 },
  },
});

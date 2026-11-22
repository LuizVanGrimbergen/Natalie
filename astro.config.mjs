// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Absolute URL for canonical, Open Graph, JSON-LD and the sitemap. Set SITE_URL once the domain is known.
// The fallback is the live Netlify address, never localhost: the site is also built on this machine and
// deployed from there (netlify deploy), and a localhost canonical tells Google the page lives nowhere.
const site = process.env.SITE_URL || 'https://natalie-soundroom.netlify.app';

export default defineConfig({
  site,
  // about.html rather than about/index.html: Netlify serves /about as is, without a 301 to /about/.
  build: {
    format: 'file',
    // Styles inline in the page, not as separate files: no render-blocking requests before the first paint.
    // The CSP allows inline styles (style-src 'unsafe-inline').
    inlineStylesheets: 'always',
  },
  vite: {
    plugins: [tailwindcss()],
    // Never inline small scripts into the HTML: the Content-Security-Policy (netlify.toml) only allows script files.
    build: { assetsInlineLimit: 0 },
  },
});

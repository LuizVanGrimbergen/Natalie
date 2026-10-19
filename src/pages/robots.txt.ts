import type { APIRoute } from 'astro';

// Generated, so the sitemap line carries the absolute URL of the site (astro.config.mjs).
export const GET: APIRoute = ({ site }) =>
  new Response(`User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site)}\n`);

import { pageview } from '@vercel/analytics';

const seen = new Set<string>();

/**
 * Counts a scene as a page in Vercel Web Analytics (/scene/<name>), once per
 * visit, so the Pages list shows how far people get through the story. The
 * hero is the page itself (/), so it isn't counted again.
 */
export function trackScene(scene: HTMLElement) {
  const name = scene.dataset.scene;
  if (!name || name === 'hero' || seen.has(name)) return;
  seen.add(name);
  pageview({ route: '/scene/[name]', path: `/scene/${name}` });
}

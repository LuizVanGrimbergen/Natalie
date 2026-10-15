import { all } from './dom';
import { hero } from './hero';
import { invitation } from './invitation';
import { listening } from './listening';
import { initPaged } from './paged';
import { perspectives } from './perspectives';
import { initScroll } from './scroll';
import { crossfade } from './transition';
import type { Timeline } from './tweens';
import { welcomes } from './welcomes';

declare global {
  interface Window {
    __scenesReady?: boolean;
  }
}

/** Keyed by each section's data-scene attribute. */
const builders: Record<string, (scene: HTMLElement) => Timeline> = {
  hero,
  listening,
  perspectives,
  welcomes,
  invitation,
};

/**
 * Builds every scene and every crossfade once, then hands them to the mode
 * chosen in public/motion.js: html.paged (touch, one swipe per screen) or
 * the scrubbed scroll story (desktop).
 */
export function initScenes() {
  const scenes = [...all(document, '[data-scene]')];
  const builds = scenes.map((scene) => builders[scene.dataset.scene!](scene));
  const fades = scenes.slice(1).map((scene, i) => crossfade(scenes[i], scene));

  if (document.documentElement.classList.contains('paged')) initPaged(scenes, builds, fades);
  else initScroll(scenes, builds, fades);

  window.__scenesReady = true;
}

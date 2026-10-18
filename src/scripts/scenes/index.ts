import { coaching } from './coaching';
import { all } from './dom';
import { elements } from './elements';
import { hero } from './hero';
import { invitation } from './invitation';
import { listening } from './listening';
import { initNavigation } from './navigation';
import { shape } from './shape';
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
  shape,
  listening,
  elements,
  coaching,
  welcomes,
  invitation,
};

/** Builds every scene and every crossfade once, then hands them to the screen-by-screen navigation. */
export function initScenes() {
  const scenes = [...all(document, '[data-scene]')];
  const builds = scenes.map((scene) => builders[scene.dataset.scene!](scene));
  const fades = scenes.slice(1).map((scene, i) => crossfade(scenes[i], scene));
  initNavigation(scenes, builds, fades);
  window.__scenesReady = true;
}

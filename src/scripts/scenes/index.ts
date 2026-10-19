import { coaching } from './coaching';
import { all } from './dom';
import { elements } from './elements';
import { enterDome } from './enter';
import { gather } from './gather';
import { hero } from './hero';
import { invitation } from './invitation';
import { list } from './list';
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
  list,
  coaching,
  welcomes,
  invitation,
};

/** Scenes with their own way in, keyed by the arriving scene; every other step is a plain crossfade. */
const entries: Record<string, (prev: HTMLElement, next: HTMLElement) => Timeline> = {
  listening: enterDome,
  list: gather,
};

/** Builds every scene and every crossfade once, then hands them to the screen-by-screen navigation. */
export function initScenes() {
  const scenes = [...all(document, '[data-scene]')];
  // They lie on top of each other in story order (the footer, z-index 15, above them all).
  scenes.forEach((scene, i) => (scene.style.zIndex = String(i + 1)));
  const builds = scenes.map((scene) => builders[scene.dataset.scene!](scene));
  const fades = scenes.slice(1).map((scene, i) => (entries[scene.dataset.scene!] ?? crossfade)(scenes[i], scene));
  initNavigation(scenes, builds, fades);
  window.__scenesReady = true;
}

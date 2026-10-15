import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { all } from './dom';
import { hero } from './hero';
import { invitation } from './invitation';
import { listening } from './listening';
import { perspectives } from './perspectives';
import { followTint } from './tint';
import { enter } from './transition';
import { HOLD, prime, type Timeline } from './tweens';
import { welcomes } from './welcomes';

gsap.registerPlugin(ScrollTrigger);

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

/** Where a scene is fully built: the end of its pin. */
function sceneEnd(scene: HTMLElement) {
  return scene.offsetTop + scene.offsetHeight - window.innerHeight;
}

export function initScenes() {
  // Light smoothing: responsive, without the floaty lag of the default.
  const lenis = new Lenis({ autoRaf: false, lerp: 0.16, wheelMultiplier: 1.25 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  const scenes = [...all(document, '[data-scene]')];
  scenes.forEach((scene, i) => {
    if (i > 0) enter(scenes[i - 1], scene);
    const tl = builders[scene.dataset.scene!]?.(scene);
    if (tl) prime(tl.to({}, { duration: HOLD }));
  });
  followTint(scenes);

  // In-page links land on the finished composition of their scene, not its empty first frame.
  for (const link of all(document, 'a[href^="#"]')) {
    const target = document.getElementById(link.getAttribute('href')!.slice(1));
    if (!target?.matches('[data-scene]')) continue;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      lenis.scrollTo(sceneEnd(target), { duration: 2 });
    });
  }

  const initial = location.hash && document.getElementById(location.hash.slice(1));
  if (initial && initial.matches('[data-scene]')) {
    // After load, so the browser's own anchor jump (to the scene's first frame) can't override it.
    const land = () =>
      requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        lenis.scrollTo(sceneEnd(initial), { immediate: true, force: true });
      });
    if (document.readyState === 'complete') land();
    else addEventListener('load', land, { once: true });
  }

  window.__scenesReady = true;
}

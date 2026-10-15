import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { all, one } from './dom';
import { followTint } from './tint';
import { HOLD, prime, type Timeline } from './tweens';

gsap.registerPlugin(ScrollTrigger);

/** Share of the viewport scrolled during a crossfade (matches --dissolve in styles/scenes.css). */
const DISSOLVE = 0.6;

/** Where a scene is fully built: the end of its pin. */
function sceneEnd(scene: HTMLElement) {
  return scene.offsetTop + scene.offsetHeight - window.innerHeight;
}

/**
 * Desktop: one long scroll. Each scene's build is scrubbed over its --pin
 * length; the next scene's stage is held in place while it dissolves in.
 */
export function initScroll(scenes: HTMLElement[], builds: Timeline[], fades: Timeline[]) {
  // Light smoothing: responsive, without the floaty lag of the default.
  const lenis = new Lenis({ autoRaf: false, lerp: 0.16, wheelMultiplier: 1.25 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  scenes.forEach((scene, i) => {
    if (i > 0) {
      const fade = fades[i - 1].fromTo(one(scene, '.stage'), { y: () => -DISSOLVE * window.innerHeight }, { y: 0, duration: 1 }, 0);
      ScrollTrigger.create({
        animation: prime(fade),
        trigger: scene,
        start: `top ${DISSOLVE * 100}%`,
        end: 'top top',
        scrub: true,
        invalidateOnRefresh: true,
      });
    }
    const pin = parseFloat(getComputedStyle(scene).getPropertyValue('--pin'));
    ScrollTrigger.create({
      animation: prime(builds[i].to({}, { duration: HOLD })),
      trigger: scene,
      start: 'top top',
      end: `+=${pin}`,
      scrub: true,
    });
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
}

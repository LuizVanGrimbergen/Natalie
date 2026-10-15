import { ScrollTrigger } from 'gsap/ScrollTrigger';

const root = document.documentElement;
const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

function apply(color: string | undefined) {
  if (!color) return;
  root.style.setProperty('--tint', color);
  meta?.setAttribute('content', color);
}

/**
 * Safari colors its bars from the page background (and theme-color), so the
 * tint follows whichever scene fills the screen, switching halfway through
 * each dissolve.
 */
export function followTint(scenes: HTMLElement[]) {
  scenes.forEach((scene, i) => {
    if (i === 0) return;
    ScrollTrigger.create({
      trigger: scene,
      start: 'top 30%',
      onEnter: () => apply(scene.dataset.tint),
      onLeaveBack: () => apply(scenes[i - 1].dataset.tint),
    });
  });
}

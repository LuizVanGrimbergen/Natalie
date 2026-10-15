import { ScrollTrigger } from 'gsap/ScrollTrigger';

const root = document.documentElement;
const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

/** Safari colors its bars from the page background (and theme-color). */
export function applyTint(color: string | undefined) {
  if (!color) return;
  root.style.setProperty('--tint', color);
  meta?.setAttribute('content', color);
}

/** Scroll mode: the tint follows whichever scene fills the screen, switching halfway through each dissolve. */
export function followTint(scenes: HTMLElement[]) {
  scenes.forEach((scene, i) => {
    if (i === 0) return;
    ScrollTrigger.create({
      trigger: scene,
      start: 'top 30%',
      onEnter: () => applyTint(scene.dataset.tint),
      onLeaveBack: () => applyTint(scenes[i - 1].dataset.tint),
    });
  });
}

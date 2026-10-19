import { one } from './dom';

/** Rough perceived lightness (0–1) of a #rrggbb color. */
function lightness(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * The progress rail (ProgressRail.astro): one button per scene, a pill on the one on
 * show, the scenes before it marked as seen. navigation.ts calls set() with every step;
 * clicking a dot goes straight to its scene.
 */
export function initProgress(scenes: HTMLElement[], go: (to: number) => void) {
  const rail = one(document, '[data-rail]');
  const pill = one(rail, '[data-rail-pill]');
  const dots = scenes.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'rail__dot';
    dot.setAttribute('aria-label', `Scherm ${i + 1} van ${scenes.length}`);
    dot.addEventListener('click', () => go(i));
    rail.append(dot);
    return dot;
  });
  // After the first frame, so the pill doesn't glide in from the top on load.
  requestAnimationFrame(() => rail.classList.add('is-ready'));
  return {
    set(at: number) {
      pill.style.setProperty('--at', String(at));
      rail.classList.toggle('is-light', lightness(scenes[at].dataset.tint ?? '#000000') > 0.5);
      dots.forEach((dot, i) => {
        dot.classList.toggle('is-seen', i <= at);
        if (i === at) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      });
    },
  };
}

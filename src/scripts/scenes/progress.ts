import { one } from './dom';

/**
 * The progress rail (ProgressRail.astro): one dot per scene, a pill on the one on
 * show, the scenes before it marked as seen. navigation.ts calls set() with every step.
 */
export function initProgress(count: number) {
  const rail = one(document, '[data-rail]');
  const pill = one(rail, '[data-rail-pill]');
  const dots = Array.from({ length: count }, () => {
    const dot = document.createElement('span');
    dot.className = 'rail__dot';
    rail.append(dot);
    return dot;
  });
  // After the first frame, so the pill doesn't glide in from the top on load.
  requestAnimationFrame(() => rail.classList.add('is-ready'));
  return {
    set(at: number) {
      pill.style.setProperty('--at', String(at));
      dots.forEach((dot, i) => dot.classList.toggle('is-seen', i <= at));
    },
  };
}

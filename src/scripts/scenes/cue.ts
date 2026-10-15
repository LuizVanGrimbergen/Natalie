import { one } from './dom';

/** Rough perceived lightness (0–1) of a #rrggbb color. */
function lightness(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/**
 * The "next" cue (NextCue.astro): shown once a screen is complete, hidden as
 * soon as the next step starts. Clicking it takes that step.
 */
export function initCue(next: () => void) {
  const cue = one(document, '[data-next]');
  cue.addEventListener('click', next);
  return {
    show(scene: HTMLElement) {
      cue.classList.toggle('is-light', lightness(scene.dataset.tint ?? '#000000') > 0.5);
      cue.classList.add('is-shown');
    },
    hide() {
      cue.classList.remove('is-shown');
    },
  };
}

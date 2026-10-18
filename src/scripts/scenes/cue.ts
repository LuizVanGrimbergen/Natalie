import { one } from './dom';

/**
 * The "next" cue (NextCue.astro): shown once a screen is complete, hidden as
 * soon as the next step starts. Clicking it takes that step.
 */
export function initCue(next: () => void) {
  const cue = one(document, '[data-next]');
  cue.addEventListener('click', next);
  return {
    show() {
      cue.classList.add('is-shown');
    },
    hide() {
      cue.classList.remove('is-shown');
    },
  };
}

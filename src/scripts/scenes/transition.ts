import gsap from 'gsap';
import { one } from './dom';
import type { Timeline } from './tweens';

/**
 * The next scene dissolves in place over the previous one (no slide), and the
 * previous one dims. Relative timeline (0–1), driven by scroll or by time.
 *  dark  — true crossfade, previous dims to warm dark brown.
 *  light — previous fades to ivory first (0–55%), then the next appears (40–100%).
 */
export function crossfade(prev: HTMLElement, next: HTMLElement): Timeline {
  const dim = one(prev, '.exit-dim');
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  if (next.dataset.enter === 'light') {
    tl.fromTo(dim, { opacity: 0 }, { opacity: 1, duration: 0.55 }, 0).fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.4);
  } else {
    tl.fromTo(dim, { opacity: 0 }, { opacity: 0.55, duration: 1 }, 0).fromTo(next, { opacity: 0 }, { opacity: 1, duration: 1 }, 0);
  }
  return tl;
}

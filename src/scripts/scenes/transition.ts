import gsap from 'gsap';
import { one } from './dom';
import type { Timeline } from './tweens';

/**
 * The next scene dissolves in place over the previous one (no slide), and the
 * previous one dims to warm dark brown. Relative timeline (0–1), played by navigation.ts.
 */
export function crossfade(prev: HTMLElement, next: HTMLElement): Timeline {
  const dim = one(prev, '.exit-dim');
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  tl.fromTo(dim, { opacity: 0 }, { opacity: 0.55, duration: 1 }, 0).fromTo(next, { opacity: 0 }, { opacity: 1, duration: 1 }, 0);
  return tl;
}

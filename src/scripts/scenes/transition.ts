import gsap from 'gsap';
import { one } from './dom';
import { prime } from './tweens';

/** Share of the viewport scrolled during a crossfade (matches --dissolve in styles/scenes.css). */
const DISSOLVE = 0.6;

/**
 * The next scene dissolves in place over the previous one (no slide): its
 * stage is held at the top of the viewport while it scrolls in, and the
 * previous stage stays pinned and dims.
 *  dark  — true crossfade, previous dims to warm dark brown.
 *  light — previous fades to ivory first (0–55%), then the next appears (40–100%).
 */
export function enter(prev: HTMLElement, next: HTMLElement) {
  const dim = one(prev, '.exit-dim');
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: next, start: `top ${DISSOLVE * 100}%`, end: 'top top', scrub: true, invalidateOnRefresh: true },
  });
  tl.fromTo(one(next, '.stage'), { y: () => -DISSOLVE * window.innerHeight }, { y: 0, duration: 1 }, 0);
  if (next.dataset.enter === 'light') {
    tl.fromTo(dim, { opacity: 0 }, { opacity: 1, duration: 0.55 }, 0).fromTo(next, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.4);
  } else {
    tl.fromTo(dim, { opacity: 0 }, { opacity: 0.55, duration: 1 }, 0).fromTo(next, { opacity: 0 }, { opacity: 1, duration: 1 }, 0);
  }
  prime(tl);
}

import { one, reveal } from './dom';
import { build, fade, rise, type Timeline } from './tweens';

/* 01 · Dusk lifts, the photo settles, and the sentence completes itself. */
export function hero(scene: HTMLElement): Timeline {
  const tl = build();
  // The first line is already there (load intro); the first scroll lifts the dusk right away.
  tl.fromTo(one(scene, '[data-cue]'), { opacity: 1, y: 0 }, { opacity: 0, y: -30, duration: 0.08 }, 0)
    .fromTo(one(scene, '[data-hero-img]'), { scale: 1.22 }, { scale: 1, duration: 0.5 }, 0)
    .fromTo(one(scene, '[data-hero-dark]'), { opacity: 0.5 }, { opacity: 0, duration: 0.22 }, 0)
    .fromTo(one(scene, '[data-hero-warm]'), { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.1);
  rise(tl, reveal(scene, 2), 0.08, 0.14);
  fade(tl, reveal(scene, 3), 0.24, 0.14);
  return tl;
}

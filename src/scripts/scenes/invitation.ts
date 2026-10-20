import { all, reveal } from './dom';
import { build, fade, rise, type Timeline } from './tweens';

/* 06 · The forest slowly appears and settles, then title, text and the invitation. */
export function invitation(scene: HTMLElement): Timeline {
  const tl = build();
  const forest = all(scene, '[data-forest]');
  fade(tl, forest, 0, 0.45);
  tl.fromTo(forest, { scale: 1.08 }, { scale: 1, duration: 0.9, ease: 'power2.out' }, 0);
  rise(tl, reveal(scene, 1), 0.12, 0.2);
  rise(tl, reveal(scene, 2), 0.28, 0.2);
  rise(tl, reveal(scene, 3), 0.42, 0.17);
  return tl;
}

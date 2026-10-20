import { one, reveal } from './dom';
import { build, rise, type Timeline } from './tweens';

/* 06 · The poster appears on the wall, the forest settles in it; then title, text and the invitation. */
export function invitation(scene: HTMLElement): Timeline {
  const tl = build();
  tl.fromTo(one(scene, '[data-poster]'), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, 0)
    .fromTo(one(scene, '[data-poster-photo]'), { scale: 1.1 }, { scale: 1, duration: 0.7, ease: 'power2.out' }, 0);
  rise(tl, reveal(scene, 1), 0.18, 0.2);
  rise(tl, reveal(scene, 2), 0.32, 0.2);
  rise(tl, reveal(scene, 3), 0.44, 0.17);
  return tl;
}

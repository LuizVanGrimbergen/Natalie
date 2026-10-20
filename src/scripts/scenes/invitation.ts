import { one, reveal } from './dom';
import { build, rise, type Timeline } from './tweens';

/* 06 · A postcard lands gently and settles at its angle, the one beneath it follows; then title, text and the invitation. */
export function invitation(scene: HTMLElement): Timeline {
  const tl = build();
  tl.fromTo(one(scene, '[data-card-under]'), { opacity: 0, y: 40, rotate: 12 }, { opacity: 1, y: 0, rotate: 5, duration: 0.4, ease: 'power2.out' }, 0)
    .fromTo(one(scene, '[data-card]'), { opacity: 0, y: 70, rotate: -10 }, { opacity: 1, y: 0, rotate: -3, duration: 0.45, ease: 'power2.out' }, 0.08);
  rise(tl, reveal(scene, 1), 0.12, 0.2);
  rise(tl, reveal(scene, 2), 0.28, 0.2);
  rise(tl, reveal(scene, 3), 0.42, 0.17);
  return tl;
}

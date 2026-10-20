import { one, reveal } from './dom';
import { build, rise, unveil, type Timeline } from './tweens';

/* 06 · The glowing door of the dome opens from the bottom, then title, text and the invitation. */
export function invitation(scene: HTMLElement): Timeline {
  const tl = build();
  unveil(tl, one(scene, '[data-unveil]'), 0, 0.32, 40);
  rise(tl, reveal(scene, 1), 0.05, 0.2);
  rise(tl, reveal(scene, 2), 0.22, 0.2);
  rise(tl, reveal(scene, 3), 0.38, 0.17);
  return tl;
}

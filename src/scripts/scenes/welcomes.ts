import { one, reveal } from './dom';
import { build, rise, unveil, type Timeline } from './tweens';

/* 06 · The portrait opens from the bottom, then the words follow. */
export function welcomes(scene: HTMLElement): Timeline {
  const tl = build();
  unveil(tl, one(scene, '[data-unveil]'), 0.02, 0.2);
  rise(tl, reveal(scene, 1), 0.04, 0.08);
  rise(tl, reveal(scene, 2), 0.08, 0.12);
  rise(tl, reveal(scene, 3), 0.2, 0.1);
  rise(tl, reveal(scene, 4), 0.28, 0.1);
  return tl;
}

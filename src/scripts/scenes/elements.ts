import { reveal } from './dom';
import { build, rise, type Timeline } from './tweens';

/* 04 · The title of the three elements and its one line; the elements follow together on the next screen (list.ts). */
export function elements(scene: HTMLElement): Timeline {
  const tl = build();
  rise(tl, reveal(scene, 1), 0.04, 0.4);
  rise(tl, reveal(scene, 2), 0.36, 0.4);
  return tl;
}

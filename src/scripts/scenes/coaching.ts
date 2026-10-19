import { one, path, reveal } from './dom';
import { build, draw, fade, rise, type Timeline } from './tweens';

/* 05 · Coaching: two voices draw themselves into a pair of eighth notes — guiding without fixing. */
export function coaching(scene: HTMLElement): Timeline {
  const tl = build();
  draw(tl, path(scene, '[data-draw="self"]'), 0.02, 0.23);
  fade(tl, one(scene, '[data-head="self"]'), 0.23, 0.03);
  draw(tl, path(scene, '[data-stem="self"]'), 0.25, 0.04);
  draw(tl, path(scene, '[data-draw="with"]'), 0.29, 0.16);
  fade(tl, one(scene, '[data-head="with"]'), 0.44, 0.03);
  draw(tl, path(scene, '[data-stem="with"]'), 0.46, 0.04);
  fade(tl, one(scene, '[data-beam]'), 0.5, 0.05);

  rise(tl, reveal(scene, 1), 0.06, 0.1);
  rise(tl, reveal(scene, 2), 0.16, 0.1);
  rise(tl, reveal(scene, 3), 0.31, 0.12);
  rise(tl, reveal(scene, 4), 0.42, 0.12);
  return tl;
}

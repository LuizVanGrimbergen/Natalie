import { one, path, reveal } from './dom';
import { build, draw, fade, rise, type Timeline } from './tweens';

/* 04 · Ivory arrives, then two voices draw themselves into a pair of eighth notes. */
export function perspectives(scene: HTMLElement): Timeline {
  const tl = build();
  tl.fromTo(one(scene, '[data-warmth]'), { opacity: 1 }, { opacity: 0, duration: 0.17 }, 0);

  draw(tl, path(scene, '[data-draw="self"]'), 0.16, 0.19);
  fade(tl, one(scene, '[data-head="self"]'), 0.33, 0.02);
  draw(tl, path(scene, '[data-stem="self"]'), 0.34, 0.03);
  draw(tl, path(scene, '[data-draw="with"]'), 0.37, 0.13);
  fade(tl, one(scene, '[data-head="with"]'), 0.49, 0.02);
  draw(tl, path(scene, '[data-stem="with"]'), 0.5, 0.03);
  fade(tl, one(scene, '[data-beam]'), 0.53, 0.04);

  rise(tl, reveal(scene, 1), 0.17, 0.08);
  rise(tl, reveal(scene, 2), 0.25, 0.08);
  rise(tl, reveal(scene, 3), 0.38, 0.1);
  return tl;
}

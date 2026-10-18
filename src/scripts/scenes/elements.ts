import { reveal } from './dom';
import { build, rise, type Timeline } from './tweens';

/* 04 · Three elements of a session: the title, then the three rise one by one. */
export function elements(scene: HTMLElement): Timeline {
  const tl = build();
  rise(tl, reveal(scene, 1), 0.04, 0.16);
  for (let i = 0; i < 3; i++) rise(tl, reveal(scene, i + 2), 0.24 + i * 0.16, 0.16);
  return tl;
}

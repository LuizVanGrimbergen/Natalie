import { reveal } from './dom';
import { build, rise, type Timeline } from './tweens';

/* 04 · The three elements together: they rise slowly, one after the other. */
export function list(scene: HTMLElement): Timeline {
  const tl = build();
  for (let i = 0; i < 3; i++) rise(tl, reveal(scene, i + 1), 0.04 + i * 0.26, 0.4);
  return tl;
}

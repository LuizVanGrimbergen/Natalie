import { one, reveal } from './dom';
import { build, fade, rise, type Timeline } from './tweens';

/* 03 · The camera steps inside: the room zooms out and brightens. */
export function listening(scene: HTMLElement): Timeline {
  const tl = build();
  tl.fromTo(one(scene, '[data-room-img]'), { scale: 1.4 }, { scale: 1, duration: 0.5 }, 0).fromTo(
    one(scene, '[data-room-dim]'),
    { opacity: 0.7 },
    { opacity: 0, duration: 0.4 },
    0,
  );
  rise(tl, reveal(scene, 1), 0.14, 0.14);
  rise(tl, reveal(scene, 2), 0.34, 0.12);
  fade(tl, reveal(scene, 3), 0.5, 0.12);
  return tl;
}

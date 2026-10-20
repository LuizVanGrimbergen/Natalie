import { all, path, reveal } from './dom';
import { build, draw, fade, rise, type Timeline } from './tweens';

/* 06 · A dome panel draws itself, the second one follows, the chair appears in the window; then title, text and the invitation. */
export function invitation(scene: HTMLElement): Timeline {
  const tl = build();
  draw(tl, path(scene, '[data-pane-line="1"]'), 0, 0.32);
  draw(tl, path(scene, '[data-pane-line="2"]'), 0.12, 0.3);
  const photo = all(scene, '[data-pane-photo]');
  fade(tl, photo, 0.14, 0.34);
  tl.fromTo(photo, { scale: 1.12 }, { scale: 1, duration: 0.5, ease: 'power2.out' }, 0.14);
  rise(tl, reveal(scene, 1), 0.08, 0.2);
  rise(tl, reveal(scene, 2), 0.24, 0.2);
  rise(tl, reveal(scene, 3), 0.4, 0.17);
  return tl;
}

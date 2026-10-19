import { one } from './dom';
import { wayIn } from './transition';
import { fade, type Timeline } from './tweens';

/**
 * Shape → wooden room: the photo is the inside of the dome, so instead of a
 * plain crossfade the camera steps into it. The text gives way, the closed
 * dome grows towards you (turning a little) until its copper fills the screen,
 * and inside it the room appears, still zoomed in and dark; its own build
 * then zooms out. Backwards it is the mirror: you step out of the dome.
 * Relative timeline (0–1), 1.6s, played by navigation.ts like every crossfade.
 */
export function enterDome(prev: HTMLElement, next: HTMLElement): Timeline {
  const dome = one(prev, '[data-dome]');
  const tl = wayIn(1.6);
  tl.fromTo(one(prev, '[data-shape-text]'), { opacity: 1, y: 0 }, { opacity: 0, y: -24, duration: 0.3, ease: 'power1.in' }, 0)
    .fromTo(one(prev, '[data-shape-glow]'), { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0)
    .fromTo(dome, { scale: 1, rotation: 0 }, { scale: 6, rotation: 14, duration: 1, ease: 'power3.in' }, 0)
    .fromTo(dome, { opacity: 1 }, { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.7);
  fade(tl, next, 0.55, 0.4);
  return tl;
}

import gsap from 'gsap';
import { one } from './dom';
import type { Timeline } from './tweens';

/**
 * The next scene slides up from the bottom while the previous one moves up and out, like turning
 * a page upward: one scroll, one screen. Played backwards it is the mirror (the earlier scene comes
 * back down). Relative timeline (0–1), played by navigation.ts with its own duration and ease.
 */
export function slideUp(prev: HTMLElement, next: HTMLElement): Timeline {
  // Each scene element is moved by one slide only (the one that brings it in); the previous scene moves
  // its stage instead, so two slides never drive the same element.
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  tl.fromTo(next, { yPercent: 100, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 1 }, 0).fromTo(
    one(prev, '.stage'),
    { yPercent: 0 },
    { yPercent: -100, duration: 1 },
    0,
  );
  return tl;
}

/** How much of a scene is on screen (0–1): faded in and slid into place. */
export function shown(scene: HTMLElement) {
  const opacity = Number(gsap.getProperty(scene, 'opacity'));
  const offset = Math.abs(Number(gsap.getProperty(scene, 'yPercent')) || 0) / 100;
  return opacity * Math.max(0, 1 - offset);
}

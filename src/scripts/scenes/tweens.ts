import gsap from 'gsap';

export type Timeline = gsap.core.Timeline;

/**
 * A scene's build timeline. Positions in the scene files are relative: on
 * desktop the timeline is scrubbed over the scene's --pin length (scroll.ts),
 * on touch screens it plays by itself once the scene is on screen (paged.ts).
 */
export function build(): Timeline {
  return gsap.timeline({ paused: true, defaults: { ease: 'none' } });
}

/** Scrolled after the last tween, so there is no dead scroll before the next scene dissolves in. */
export const HOLD = 0.1;

/**
 * Put every tween of a timeline in its start state right away. A scrubbed
 * timeline otherwise only renders once its scroll range is reached, so a scene
 * would dissolve in already finished and then jump back.
 */
export function prime(tl: Timeline): Timeline {
  return tl.progress(1).progress(0);
}

export function rise(tl: Timeline, targets: gsap.TweenTarget, at: number, duration: number) {
  tl.fromTo(targets, { opacity: 0, y: 48 }, { opacity: 1, y: 0, duration, ease: 'power2.out' }, at);
}

export function fade(tl: Timeline, targets: gsap.TweenTarget, at: number, duration: number) {
  tl.fromTo(targets, { opacity: 0 }, { opacity: 1, duration }, at);
}

/** Reveal bottom-up. `bleed` keeps room around the element so its shadow isn't clipped. */
export function unveil(tl: Timeline, target: gsap.TweenTarget, at: number, duration: number, bleed = 0) {
  const b = `${-bleed}%`;
  tl.fromTo(
    target,
    { clipPath: `inset(${100 + bleed}% ${b} ${b} ${b})`, scale: 1.06 },
    { clipPath: `inset(${b} ${b} ${b} ${b})`, scale: 1, duration, ease: 'power2.out' },
    at,
  );
}

/** Draw a stroke along with the scroll, using its real length so every pixel of scroll moves the pen. */
export function draw(tl: Timeline, path: SVGGeometryElement, at: number, duration: number) {
  const length = path.getTotalLength();
  tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration }, at);
}

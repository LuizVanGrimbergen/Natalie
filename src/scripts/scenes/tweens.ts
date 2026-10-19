import gsap from 'gsap';

export type Timeline = gsap.core.Timeline;

/**
 * A relative timeline (positions 0–1), paused: a scene's build or a transition.
 * navigation.ts plays it in time once the scene is on screen.
 */
export function build(vars: gsap.TimelineVars = {}): Timeline {
  return gsap.timeline({ paused: true, defaults: { ease: 'none' }, ...vars });
}

/**
 * Put every tween of a timeline in its start state right away. A paused
 * timeline otherwise renders nothing until it plays, so a scene would
 * dissolve in already finished and then jump back.
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

/** Draw a stroke over its real length (never pathLength="1": GSAP rounds that to a jump). */
export function draw(tl: Timeline, path: SVGGeometryElement, at: number, duration: number) {
  const length = path.getTotalLength();
  tl.fromTo(path, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration }, at);
}

import gsap from 'gsap';

export type Timeline = gsap.core.Timeline;

/**
 * A scene's build timeline is scrubbed over its --pin length, starting once
 * the stage is fully in place. Positions in the scene files are relative;
 * after the last tween only a short HOLD remains, so there is no dead scroll
 * before the next scene dissolves in.
 */
export const HOLD = 0.1;

export function build(scene: HTMLElement): Timeline {
  const pin = parseFloat(getComputedStyle(scene).getPropertyValue('--pin'));
  return gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: { trigger: scene, start: 'top top', end: `+=${pin}`, scrub: true },
  });
}

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

import gsap from 'gsap';
import { all, one } from './dom';
import { onStep, type Step } from './input';
import { tintNow, tintTo } from './tint';
import { prime, type Timeline } from './tweens';

/** Seconds a scene takes to build itself once it is on screen. */
const BUILD: Record<string, number> = { hero: 1.8, listening: 2.2, perspectives: 2.6, welcomes: 1.8, invitation: 1.8 };
/** Seconds of the crossfade into the next scene, and back. */
const FADE = 0.9;
const BACK = 0.6;
/** The hero completes its sentence by itself, after the load intro. */
const HERO_DELAY = 1.2;
/** A step asked for while another runs speeds that one up by this much, then follows. */
const HURRY = 3;

const ease = 'power1.inOut';

/**
 * One scroll or swipe is one screen. The scenes lie on top of each other;
 * the next one dissolves in and then builds itself in time, so every step
 * shows a complete composition. A last step after the invitation brings up
 * the footer.
 */
export function initNavigation(scenes: HTMLElement[], builds: Timeline[], fades: Timeline[]) {
  builds.forEach(prime);
  fades.forEach(prime);
  const header = one(document, '[data-header]');
  const footer = one(document, '[data-footer]');
  const last = scenes.length - 1;

  /** Index of the scene on screen; last + 1 means the footer is up. */
  let current = 0;
  let active: gsap.core.Animation | null = null;
  let queued: Step | null = null;

  /** Only the scenes taking part in a step keep their CSS loops (drift, breathing glow) running. */
  function onstage(...visible: number[]) {
    scenes.forEach((scene, i) => scene.toggleAttribute('data-offstage', !visible.includes(i)));
  }

  function run(animation: gsap.core.Animation) {
    active = animation;
    animation.eventCallback('onComplete', () => {
      active = null;
      onstage(Math.min(current, last));
      const next = queued;
      queued = null;
      if (next) step(next);
    });
  }

  const seconds = (i: number) => BUILD[scenes[i].dataset.scene!] ?? 2;
  const play = (i: number) => builds[i].tweenFromTo(0, builds[i].duration(), { duration: seconds(i), ease });

  function forward() {
    if (current > last) return;
    const to = current + 1;
    const tl = gsap.timeline();
    if (to > last) {
      tl.to(scenes[last], { y: () => -footer.offsetHeight, duration: 0.7, ease: 'power2.out' }, 0).to(
        footer,
        { yPercent: -100, duration: 0.7, ease: 'power2.out' },
        0,
      );
    } else {
      onstage(current, to);
      builds[to].progress(0);
      tl.add(fades[current].tweenTo(1, { duration: FADE, ease }), 0)
        .add(tintTo(scenes[to], FADE, { seconds: seconds(to), length: builds[to].duration(), ease }), 0)
        .add(play(to), FADE * 0.5);
      if (current === 0) tl.to(header, { autoAlpha: 0, duration: 0.4 }, 0);
    }
    current = to;
    run(tl);
  }

  function back() {
    if (current === 0) return;
    const from = current;
    const tl = gsap.timeline();
    if (from > last) {
      tl.to(scenes[last], { y: 0, duration: BACK, ease }, 0).to(footer, { yPercent: 0, duration: BACK, ease }, 0);
    } else {
      // The scene we return to keeps its finished composition.
      onstage(from - 1, from);
      tl.add(fades[from - 1].tweenTo(0, { duration: BACK, ease }), 0).add(tintTo(scenes[from - 1], BACK), 0);
      if (from === 1) tl.to(header, { autoAlpha: 1, duration: 0.4 }, BACK / 2);
    }
    current = from - 1;
    run(tl);
  }

  function step(dir: Step) {
    if (active) {
      queued = dir;
      active.timeScale(HURRY);
      return;
    }
    if (dir > 0) forward();
    else back();
  }

  /** Skip ahead to a later scene: it dissolves in over the current one, the scenes in between are settled underneath. */
  function jump(to: number, instant = false) {
    if (to <= current || current > last) return;
    // Whatever is still playing (e.g. the hero's own build) finishes at once.
    queued = null;
    active?.progress(1);
    if (to === current + 1 && !instant) return forward();
    const settle = () => {
      for (let i = 0; i < to; i++) builds[i].progress(1);
      for (let i = 0; i < to; i++) fades[i].progress(1);
    };
    gsap.set(header, { autoAlpha: 0 });
    current = to;
    if (instant) {
      tintNow(scenes[to]);
      settle();
      builds[to].progress(1);
      onstage(to);
      return;
    }
    onstage(0, current, to);
    builds[to].progress(0);
    const tl = gsap.timeline();
    tl.to(scenes[to], { opacity: 1, duration: FADE, ease, onComplete: settle }, 0)
      .add(tintTo(scenes[to], FADE), 0)
      .add(play(to), FADE * 0.5);
    run(tl);
  }

  onstage(0);
  run(
    gsap
      .timeline({ delay: HERO_DELAY })
      .add(play(0), 0)
      .add(tintTo(scenes[0], 0, { seconds: seconds(0), length: builds[0].duration(), ease }), 0),
  );
  onStep(step);

  // In-page links and keyboard focus bring their scene on screen.
  for (const link of all(document, 'a[href^="#"]')) {
    const target = scenes.indexOf(document.getElementById(link.getAttribute('href')!.slice(1))!);
    if (target < 0) continue;
    link.addEventListener('click', (event) => {
      event.preventDefault();
      jump(target);
    });
  }
  addEventListener('focusin', (event) => {
    const target = scenes.findIndex((scene) => scene.contains(event.target as Node));
    if (target > current) jump(target, true);
  });

  const initial = scenes.indexOf(document.getElementById(location.hash.slice(1))!);
  if (initial > 0) jump(initial, true);
}

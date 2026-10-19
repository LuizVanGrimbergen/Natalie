import gsap from 'gsap';
import { initCue } from './cue';
import { all, one } from './dom';
import { onStep, type Step } from './input';
import { tintNow, tintTo } from './tint';
import type { WayIn } from './transition';
import { trackScene } from './track';
import { prime, type Timeline } from './tweens';

/** Seconds a scene takes to build itself once it is on screen. */
const BUILD: Record<string, number> = {
  hero: 1.8,
  shape: 3.2,
  listening: 2.2,
  elements: 1.6,
  list: 2.6,
  coaching: 2.6,
  welcomes: 1.8,
  invitation: 1.8,
};
/** Seconds of the crossfade between scenes (both ways), and of the footer sliding back down. */
const FADE = 0.9;
const BACK = 0.6;
/** The hero completes its sentence by itself, after the load intro. */
const HERO_DELAY = 1.2;
/** A step asked for while another runs speeds that one up by this much, then follows. */
const HURRY = 3;
/** Steps remembered while one runs (a few quick swipes in a row all count). */
const QUEUE = 3;

const ease = 'power1.inOut';

/**
 * One scroll or swipe is one screen. The scenes lie on top of each other;
 * the next one dissolves in and then builds itself in time, so every step
 * shows a complete composition. A last step after the invitation slides the
 * footer up over its bottom edge.
 */
export function initNavigation(scenes: HTMLElement[], builds: Timeline[], fades: Timeline[]) {
  builds.forEach(prime);
  fades.forEach(prime);
  const footer = one(document, '[data-footer]');
  const last = scenes.length - 1;

  // Shown once a screen is complete; the last scene ends on its own call to action.
  const cue = initCue(() => step(1));

  /** Index of the scene on screen; last + 1 means the footer is up. */
  let current = 0;
  let active: gsap.core.Animation | null = null;
  const queued: Step[] = [];

  /** Only the scenes taking part in a step keep their CSS loops (drift, breathing glow) running. */
  function onstage(...visible: number[]) {
    scenes.forEach((scene, i) => scene.toggleAttribute('data-offstage', !visible.includes(i)));
  }

  function run(animation: gsap.core.Animation) {
    active = animation;
    if (queued.length) animation.timeScale(HURRY);
    cue.hide();
    animation.eventCallback('onComplete', () => {
      active = null;
      onstage(Math.min(current, last));
      const next = queued.shift();
      if (next) step(next);
      else if (current < last) cue.show();
    });
  }

  const seconds = (i: number) => BUILD[scenes[i].dataset.scene!] ?? 2;
  const ownWayIn = (i: number) => fades[i].data as WayIn | undefined;
  /** Seconds of the step between scene i and i + 1; the arriving scene starts building half a crossfade before it ends. */
  const fadeTime = (i: number) => ownWayIn(i)?.seconds ?? FADE;
  const buildAt = (i: number) => fadeTime(i) - FADE * 0.5;
  const play = (i: number) => builds[i].tweenFromTo(0, builds[i].duration(), { duration: seconds(i), ease });

  function forward() {
    if (current > last) return;
    const to = current + 1;
    const tl = gsap.timeline();
    if (to > last) {
      // On short screens the invitation's content moves up just enough to stay clear of the footer.
      const clear = one(scenes[last], '[data-footer-clear]').getBoundingClientRect().bottom;
      const room = Math.max(0, clear + 24 - (window.innerHeight - footer.offsetHeight));
      tl.to(footer, { yPercent: -100, duration: 0.7, ease: 'power2.out' }, 0).to(
        one(scenes[last], '[data-footer-shift]'),
        { y: -room, duration: 0.7, ease: 'power2.out' },
        0,
      );
    } else {
      onstage(current, to);
      trackScene(scenes[to]);
      builds[to].progress(0);
      tl.add(fades[current].tweenTo(1, { duration: fadeTime(current), ease }), 0)
        .add(tintTo(scenes[to], fadeTime(current)), 0)
        .add(play(to), buildAt(current));
    }
    current = to;
    run(tl);
  }

  function back() {
    if (current === 0) return;
    const from = current;
    const tl = gsap.timeline();
    if (from > last) {
      tl.to(footer, { yPercent: 0, duration: BACK, ease }, 0).to(one(scenes[last], '[data-footer-shift]'), { y: 0, duration: BACK, ease }, 0);
    } else {
      // A mirror of a step forward: the earlier scene dissolves back in and builds itself again.
      const to = from - 1;
      onstage(to, from);
      tl.add(fades[to].tweenTo(0, { duration: fadeTime(to), ease }), 0).add(tintTo(scenes[to], fadeTime(to)), 0);
      // A scene's own way in is mirrored, so the earlier scene comes back finished.
      if (!ownWayIn(to)) {
        builds[to].progress(0);
        tl.add(play(to), buildAt(to));
      }
    }
    current = from - 1;
    run(tl);
  }

  function step(dir: Step) {
    // The hamburger menu lies over the story; nothing steps underneath it (site-menu.ts).
    if (document.documentElement.classList.contains('menu-open')) return;
    if (active) {
      if (queued.length < QUEUE) queued.push(dir);
      active.timeScale(HURRY);
      return;
    }
    if (dir > 0) forward();
    else back();
  }

  /** Go straight to a scene (a menu link, a hash): forward it dissolves in over the current one, back it is uncovered. */
  function jump(to: number, instant = false) {
    // Whatever is still playing (e.g. the hero's own build) finishes at once.
    queued.length = 0;
    active?.progress(1);
    if (to < current) return jumpBack(to);
    if (to === current || current > last) return;
    if (to === current + 1 && !instant) return forward();
    const settle = () => {
      for (let i = 0; i < to; i++) builds[i].progress(1);
      for (let i = 0; i < to; i++) fades[i].progress(1);
    };
    current = to;
    trackScene(scenes[to]);
    if (instant) {
      tintNow(scenes[to]);
      settle();
      builds[to].progress(1);
      onstage(to);
      if (to < last) cue.show();
      else cue.hide();
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

  /**
   * Back to an earlier scene: the scenes in between vanish underneath, then the one on
   * screen dissolves away over it, and it builds itself again (like a step back).
   */
  function jumpBack(to: number) {
    if (current > last) {
      gsap.set(footer, { yPercent: 0 });
      gsap.set(one(scenes[last], '[data-footer-shift]'), { y: 0 });
      current = last;
      if (to === last) return;
    }
    const from = current;
    if (to === from - 1) return back();
    for (let i = to; i < from - 1; i++) fades[i].progress(0);
    onstage(to, from);
    builds[to].progress(0);
    const tl = gsap.timeline();
    tl.add(fades[from - 1].tweenTo(0, { duration: FADE, ease }), 0)
      .add(tintTo(scenes[to], FADE), 0)
      .add(play(to), FADE * 0.5);
    current = to;
    run(tl);
  }

  onstage(0);
  run(
    gsap
      .timeline({ delay: HERO_DELAY })
      .add(play(0), 0)
      .add(tintTo(scenes[0], 0), 0),
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

  // The navbar's light/dark switch: the bars take the scene on show's color in the new theme.
  addEventListener('themechange', () => tintNow(scenes[Math.min(current, last)]));

  const initial = scenes.indexOf(document.getElementById(location.hash.slice(1))!);
  if (initial > 0) jump(initial, true);
}

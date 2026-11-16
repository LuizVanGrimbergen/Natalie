import gsap from 'gsap';
import { initBook } from './book';
import { initCue } from './cue';
import { all, one } from './dom';
import { onStep, type Step } from './input';
import { initProgress } from './progress';
import { tintNow, tintTo } from './tint';
import { shown } from './transition';
import { prime, type Timeline } from './tweens';

/** Seconds a scene takes to build itself once it is on screen. */
const BUILD: Record<string, number> = { hero: 1.8, listening: 2.2, perspectives: 2.6, welcomes: 1.8, invitation: 1.8 };
/** Seconds of the slide between scenes (both ways). */
const FADE = 0.9;
/** The hero completes its sentence by itself, after the load intro. */
const HERO_DELAY = 1.2;

const ease = 'power1.inOut';

/**
 * One scroll or swipe is one screen. The scenes lie on top of each other;
 * the next one slides up from the bottom and then builds itself in time, so every step
 * shows a complete composition. The invitation is the end.
 */
export function initNavigation(scenes: HTMLElement[], builds: Timeline[], fades: Timeline[]) {
  builds.forEach(prime);
  fades.forEach(prime);
  const header = one(document, '[data-header]');
  const last = scenes.length - 1;

  // Shown once a screen is complete; the last scene ends on its own call to action.
  const cue = initCue(() => step(1));
  const rail = initProgress(scenes, (to) => jump(to));
  const book = initBook(scenes);

  /** Index of the scene on screen. */
  let current = 0;
  let active: gsap.core.Animation | null = null;
  /** Until when a slide is still moving: input then is ignored, never saved for later (one scroll, one screen). */
  let slidingUntil = 0;

  /** Only the scenes taking part in a step keep their CSS loops (drift, breathing glow) running. */
  function onstage(...visible: number[]) {
    scenes.forEach((scene, i) => scene.toggleAttribute('data-offstage', !visible.includes(i)));
  }

  function run(animation: gsap.core.Animation) {
    active = animation;
    rail.set(current);
    book.set(current);
    cue.hide();
    animation.eventCallback('onComplete', () => {
      active = null;
      onstage(current);
      if (current < last) cue.show(scenes[current]);
    });
  }

  const seconds = (i: number) => BUILD[scenes[i].dataset.scene!] ?? 2;
  const play = (i: number) => builds[i].tweenFromTo(0, builds[i].duration(), { duration: seconds(i), ease });

  /** The build's timing, so the bars can follow a scene that lifts (perspectives). */
  const timing = (i: number) => ({ seconds: seconds(i), length: builds[i].duration(), ease });

  /** Show a scene finished at once (opening on #invitation, keyboard focus). */
  function land(to: number) {
    builds[to].progress(1);
    tintNow(scenes[to]);
    onstage(to);
    rail.set(to);
    book.set(to);
    gsap.set(header, { autoAlpha: to === 0 ? 1 : 0 });
    if (to < last) cue.show(scenes[to]);
    else cue.hide();
    current = to;
  }

  function forward() {
    if (current >= last) return;
    const to = current + 1;
    const tl = gsap.timeline();
    onstage(current, to);
    builds[to].progress(0);
    tl.add(fades[current].tweenTo(1, { duration: FADE, ease }), 0)
      .add(tintTo(scenes[to], FADE, timing(to), () => shown(scenes[to])), 0)
      .add(play(to), FADE * 0.5);
    if (current === 0) tl.to(header, { autoAlpha: 0, duration: 0.4 }, 0);
    current = to;
    run(tl);
  }

  /**
   * Back to an earlier scene, a mirror of a step forward: the scenes in between vanish
   * underneath, the one on screen slides back down, and the earlier one comes down and builds itself again.
   */
  function back(to = current - 1, instant = false) {
    if (to < 0) return;
    const from = current;
    const adjacent = to === from - 1 && !instant;
    // Put every scene between back in its place, newest first: each reset puts its earlier scene on screen
    // and its later one below the screen, so the earliest reset (the one we go back to) wins.
    for (let i = adjacent ? from - 2 : from - 1; i >= to; i--) fades[i].progress(0);
    if (instant) return land(to);
    onstage(to, from);
    builds[to].progress(0);
    const tl = gsap.timeline();
    // One step back: both scenes slide down together. Further back (a dot on the rail): the earlier scene
    // is put in place underneath and the one on screen slides down off it.
    const slide = adjacent
      ? fades[from - 1].tweenTo(0, { duration: FADE, ease })
      : gsap.fromTo(scenes[from], { yPercent: 0, opacity: 1 }, { yPercent: 100, duration: FADE, ease });
    tl.add(slide, 0)
      .add(
        // Revealed as the later scene slides back down.
        tintTo(scenes[to], FADE, timing(to), () => 1 - shown(scenes[from])),
        0,
      )
      .add(play(to), FADE * 0.5);
    if (to === 0) tl.to(header, { autoAlpha: 1, duration: 0.4 }, FADE / 2);
    current = to;
    run(tl);
  }

  /**
   * One scroll, swipe or key is one screen, never more: while a slide is still moving the input is ignored, not
   * saved for later. A new gesture while the screen is only building its text finishes that build at once and
   * then moves on by one.
   */
  function step(dir: Step) {
    if (performance.now() < slidingUntil) return;
    if (active) active.progress(1);
    slidingUntil = performance.now() + FADE * 1000;
    if (dir > 0) forward();
    else back();
  }

  /** Go straight to any scene: a later one slides up over the current one, the scenes in between are settled underneath. */
  function jump(to: number, instant = false) {
    // Whatever is still playing (e.g. the hero's own build) finishes at once.
    active?.progress(1);
    if (to < current) return back(to, instant);
    if (to === current) return;
    if (to === current + 1 && !instant) return forward();
    const settle = () => {
      for (let i = 0; i < to; i++) builds[i].progress(1);
      for (let i = 0; i < to; i++) fades[i].progress(1);
    };
    if (instant) {
      settle();
      return land(to);
    }
    gsap.set(header, { autoAlpha: 0 });
    onstage(0, current, to);
    builds[to].progress(0);
    current = to;
    const tl = gsap.timeline();
    tl.fromTo(scenes[to], { yPercent: 100, opacity: 1 }, { yPercent: 0, duration: FADE, ease, onComplete: settle }, 0)
      .add(tintTo(scenes[to], FADE, timing(to), () => shown(scenes[to])), 0)
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
  // Both ways, so focus never sits on a scene hidden under the one on show (Shift+Tab).
  addEventListener('focusin', (event) => {
    const target = scenes.findIndex((scene) => scene.contains(event.target as Node));
    if (target >= 0 && target !== current) jump(target, true);
  });

  const initial = scenes.indexOf(document.getElementById(location.hash.slice(1))!);
  if (initial > 0) jump(initial, true);
}

import gsap from 'gsap';
import { Observer } from 'gsap/Observer';
import { all, one } from './dom';
import { applyTint } from './tint';
import { prime, type Timeline } from './tweens';

gsap.registerPlugin(Observer);

/** Seconds a scene takes to build itself once it is on screen. */
const BUILD: Record<string, number> = { hero: 1.8, listening: 2.2, perspectives: 2.6, welcomes: 1.8, invitation: 1.8 };
/** Seconds of the crossfade into the next scene, and back. */
const FADE = 0.9;
const BACK = 0.6;
/** The hero completes its sentence by itself, after the load intro. */
const HERO_DELAY = 1.2;

const ease = 'power1.inOut';

/**
 * Touch screens: one swipe is one screen. The next scene dissolves in and
 * then builds itself in time, so every swipe shows a complete composition.
 * A last swipe after the invitation brings up the footer.
 */
export function initPaged(scenes: HTMLElement[], builds: Timeline[], fades: Timeline[]) {
  builds.forEach(prime);
  fades.forEach(prime);
  const header = one(document, '[data-header]');
  const footer = one(document, '[data-footer]');
  const last = scenes.length - 1;

  // The scroll cue stays until the first swipe instead of fading with the hero build.
  const cue = one(scenes[0], '[data-cue]');
  builds[0].getTweensOf(cue).forEach((tween) => tween.kill());
  gsap.set(cue, { clearProps: 'opacity,transform' });

  /** Index of the scene on screen; last + 1 means the footer is up. */
  let current = 0;
  let busy = false;

  const play = (i: number) => builds[i].tweenFromTo(0, builds[i].duration(), { duration: BUILD[scenes[i].dataset.scene!] ?? 2, ease });
  builds[0].tweenFromTo(0, builds[0].duration(), { duration: BUILD.hero, ease, delay: HERO_DELAY });

  function run(tl: gsap.core.Timeline) {
    busy = true;
    tl.eventCallback('onComplete', () => (busy = false));
  }

  function forward() {
    if (busy || current > last) return;
    const to = current + 1;
    const tl = gsap.timeline();
    if (to > last) {
      tl.to(scenes[last], { y: () => -footer.offsetHeight, duration: 0.7, ease: 'power2.out' }, 0).to(
        footer,
        { yPercent: -100, duration: 0.7, ease: 'power2.out' },
        0,
      );
    } else {
      builds[to].progress(0);
      tl.add(fades[current].tweenTo(1, { duration: FADE, ease }), 0)
        .call(() => applyTint(scenes[to].dataset.tint), [], FADE / 2)
        .add(play(to), FADE * 0.5);
      if (current === 0) tl.to(header, { autoAlpha: 0, duration: 0.4 }, 0);
    }
    current = to;
    run(tl);
  }

  function back() {
    if (busy || current === 0) return;
    const from = current;
    const tl = gsap.timeline();
    if (from > last) {
      tl.to(scenes[last], { y: 0, duration: BACK, ease }, 0).to(footer, { yPercent: 0, duration: BACK, ease }, 0);
    } else {
      // The scene we return to keeps its finished composition.
      tl.add(fades[from - 1].tweenTo(0, { duration: BACK, ease }), 0).call(() => applyTint(scenes[from - 1].dataset.tint), [], BACK / 2);
      if (from === 1) tl.to(header, { autoAlpha: 1, duration: 0.4 }, BACK / 2);
    }
    current = from - 1;
    run(tl);
  }

  /** Skip ahead to a later scene: it dissolves in over the current one, the scenes in between are settled underneath. */
  function jump(to: number, instant = false) {
    if (busy || to <= current || current > last) return;
    if (to === current + 1 && !instant) return forward();
    const settle = () => {
      for (let i = 0; i < to; i++) builds[i].progress(1);
      for (let i = 0; i < to; i++) fades[i].progress(1);
    };
    gsap.set(header, { autoAlpha: 0 });
    applyTint(scenes[to].dataset.tint);
    current = to;
    if (instant) {
      settle();
      builds[to].progress(1);
      return;
    }
    builds[to].progress(0);
    const tl = gsap.timeline();
    tl.to(scenes[to], { opacity: 1, duration: FADE, ease, onComplete: settle }, 0).add(play(to), FADE * 0.5);
    run(tl);
  }

  Observer.create({
    target: window,
    type: 'wheel,touch',
    wheelSpeed: -1,
    tolerance: 12,
    preventDefault: true,
    allowClicks: true,
    onUp: forward,
    onDown: back,
  });

  addEventListener('keydown', (event) => {
    if (event.target !== document.body) return;
    if (['ArrowDown', 'PageDown', ' '].includes(event.key)) forward();
    else if (['ArrowUp', 'PageUp'].includes(event.key)) back();
    else return;
    event.preventDefault();
  });

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

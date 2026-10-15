import gsap from 'gsap';

const root = document.documentElement;
const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

/** The color Safari's bars currently show; tweened so they change together with the screen. */
const bar = { color: meta?.content ?? '#12100D' };

/** Safari colors its bars (around the camera and the toolbar) from the page background and theme-color. */
function apply() {
  root.style.setProperty('--tint', bar.color);
  meta?.setAttribute('content', bar.color);
}

/** Time (0–1) at which an eased playback reaches progress p. */
function timeAt(p: number, ease: string) {
  const curve = gsap.parseEase(ease);
  let lo = 0;
  let hi = 1;
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2;
    if (curve(mid) < p) lo = mid;
    else hi = mid;
  }
  return hi;
}

/**
 * Fade the bars to a scene's color together with the crossfade (same
 * duration and ease). A scene that arrives in another color (data-tint-enter,
 * e.g. copper-brown) and then lifts to its final data-tint is followed
 * exactly: data-tint-lift is where that lift ends in the scene's own build
 * timeline, which starts halfway through the crossfade.
 */
export function tintTo(scene: HTMLElement, fade: number, build?: { seconds: number; length: number; ease: string }) {
  const ease = 'power1.inOut';
  const { tint, tintEnter, tintLift } = scene.dataset;
  if (!tintEnter || !build) return gsap.to(bar, { color: tint, duration: fade, ease, onUpdate: apply });

  const fadeCurve = gsap.parseEase(ease);
  const buildCurve = gsap.parseEase(build.ease);
  const end = parseFloat(tintLift ?? '0') / build.length;
  const start = fade / 2;
  const lifted = start + timeAt(end, build.ease) * build.seconds;
  const lift = gsap.utils.interpolate(tintEnter, tint!);
  const clock = { t: 0 };
  let from = bar.color;
  return gsap.to(clock, {
    t: Math.max(fade, lifted),
    duration: Math.max(fade, lifted),
    ease: 'none',
    onStart: () => {
      from = bar.color;
    },
    onUpdate: () => {
      const shown = fade ? fadeCurve(Math.min(1, clock.t / fade)) : 1;
      const progress = Math.max(0, clock.t - start) / build.seconds;
      const color = lift(Math.min(1, buildCurve(Math.min(1, progress)) / end));
      bar.color = gsap.utils.interpolate(from, color, shown);
      apply();
    },
  });
}

/** Set the bars at once (jumping to a scene). */
export function tintNow(scene: HTMLElement) {
  gsap.killTweensOf(bar);
  bar.color = scene.dataset.tint ?? bar.color;
  apply();
}

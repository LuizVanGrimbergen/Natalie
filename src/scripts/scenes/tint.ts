import gsap from 'gsap';

const root = document.documentElement;
const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

/** The color Safari's bars currently show; tweened so they change together with the screen. */
const bar = { color: meta?.content ?? '#120A05' };

/** Rough perceived lightness (0–1) of a color GSAP has written (#rrggbb or rgb()). */
function lightness(color: string) {
  const [r, g, b] = gsap.utils.splitColor(color) as number[];
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Safari colors its bars (around the camera and the toolbar) from the page background
 * and theme-color. html[data-surface] follows along, so the navbar and the next cue
 * turn dark on light screens.
 */
function apply() {
  root.style.setProperty('--tint', bar.color);
  meta?.setAttribute('content', bar.color);
  root.dataset.surface = lightness(bar.color) > 0.5 ? 'light' : 'dark';
}

/** A scene's edge color in the current theme: data-tint-light in the light theme, if it has one. */
export function tintOf(scene: HTMLElement) {
  return (root.dataset.theme === 'light' && scene.dataset.tintLight) || scene.dataset.tint!;
}

/** Fade the bars to a scene's color together with the crossfade (same duration and ease). */
export function tintTo(scene: HTMLElement, fade: number) {
  return gsap.to(bar, { color: tintOf(scene), duration: fade, ease: 'power1.inOut', onUpdate: apply });
}

/** Set the bars at once (jumping to a scene, switching the theme). */
export function tintNow(scene: HTMLElement) {
  gsap.killTweensOf(bar);
  bar.color = tintOf(scene);
  apply();
}

const root = document.documentElement;
const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

/** Safari colors its bars from the page background (and theme-color), so it follows the scene on screen. */
export function applyTint(color: string | undefined) {
  if (!color) return;
  root.style.setProperty('--tint', color);
  meta?.setAttribute('content', color);
}

/**
 * The navbar's light/dark switch (SiteHeader.astro). public/theme.js already set
 * the stored theme before first paint; this flips it, stores it, re-tints
 * Safari's bars to the page's color in that theme (data-tint / data-tint-light
 * on <html>, from Base.astro), and lets the page follow: the story then re-tints
 * from the scene on show (navigation.ts listens for `themechange`).
 */
const root = document.documentElement;

function tintPage() {
  const tint = (isLight() ? root.dataset.tintLight : root.dataset.tint)!;
  root.style.setProperty('--tint', tint);
  root.dataset.surface = isLight() ? 'light' : 'dark';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tint);
}

const isLight = () => root.dataset.theme === 'light';

function show(buttons: NodeListOf<HTMLButtonElement>) {
  for (const button of buttons) {
    button.setAttribute('aria-pressed', String(isLight()));
    button.setAttribute('aria-label', isLight() ? 'Donkere weergave' : 'Lichte weergave');
  }
}

export function initThemeToggle() {
  const buttons = document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]');
  show(buttons);
  for (const button of buttons) {
    button.addEventListener('click', () => {
      const light = !isLight();
      if (light) root.dataset.theme = 'light';
      else delete root.dataset.theme;
      try {
        localStorage.setItem('theme', light ? 'light' : 'dark');
      } catch {
        // Private mode or blocked storage: the switch still works for this visit.
      }
      show(buttons);
      tintPage();
      // The story re-tints from the scene on show.
      dispatchEvent(new Event('themechange'));
    });
  }
}

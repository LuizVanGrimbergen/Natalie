/**
 * The navbar's light/dark switch (SiteHeader.astro). public/theme.js already set
 * the stored theme before first paint; this flips it, stores it, and lets the
 * page follow: the story re-tints Safari's bars from the scene on show
 * (navigation.ts listens for `themechange`); other pages start with a photo,
 * dark in both themes, so their bars stay as they are.
 */
const root = document.documentElement;

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
      // The story re-tints from the scene on show; other pages start with a photo, dark in both themes.
      dispatchEvent(new Event('themechange'));
    });
  }
}

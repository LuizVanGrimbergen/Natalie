/**
 * The navbar's light/dark switch (SiteHeader.astro). public/theme.js already set
 * the stored theme before first paint; this flips it, stores it, and lets the
 * page follow: the story re-tints Safari's bars from the scene on show
 * (navigation.ts listens for `themechange`), other pages from their data-tint-*.
 */
const root = document.documentElement;
const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');

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
      // The story re-tints from the scene on show; other pages from their own two colors.
      if (!window.__scenesReady) {
        const tint = (light && root.dataset.tintLight) || root.dataset.tintDark;
        if (tint) {
          root.style.setProperty('--tint', tint);
          meta?.setAttribute('content', tint);
          root.dataset.surface = light && root.dataset.tintLight ? 'light' : 'dark';
        }
      }
      dispatchEvent(new Event('themechange'));
    });
  }
}

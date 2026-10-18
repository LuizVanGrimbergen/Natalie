/**
 * The hamburger menu (SiteHeader.astro) is a <details>; this closes it on a link
 * or Escape, and marks html.menu-open while it is open, so the story doesn't
 * step underneath it (navigation.ts).
 */
export function initSiteMenu() {
  const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');
  if (!menu) return;
  const close = () => {
    menu.open = false;
  };
  menu.addEventListener('toggle', () => document.documentElement.classList.toggle('menu-open', menu.open));
  for (const link of menu.querySelectorAll('a')) link.addEventListener('click', close);
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      close();
      menu.querySelector('summary')?.focus();
    }
  });
}

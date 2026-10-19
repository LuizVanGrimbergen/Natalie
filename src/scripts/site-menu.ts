/**
 * The hamburger menu (SiteHeader.astro) is a <details>; this closes it on a link,
 * the cross or Escape (fading the panel out first, .is-closing), and marks
 * html.menu-open while it is open, so the story doesn't step underneath it
 * (navigation.ts).
 */
const OUT = 280; // ms, the panel's fade-out in SiteHeader.astro

export function initSiteMenu() {
  const menu = document.querySelector<HTMLDetailsElement>('[data-menu]');
  if (!menu) return;
  const root = document.documentElement;
  let closing = 0;
  const close = () => {
    if (!menu.open || closing) return;
    root.classList.remove('menu-open');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      menu.open = false;
      return;
    }
    menu.classList.add('is-closing');
    closing = window.setTimeout(() => {
      menu.classList.remove('is-closing');
      menu.open = false;
      closing = 0;
    }, OUT);
  };
  menu.addEventListener('toggle', () => root.classList.toggle('menu-open', menu.open));
  // The cross closes with the fade too, instead of the <details> snapping shut.
  menu.querySelector('summary')?.addEventListener('click', (event) => {
    if (!menu.open) return;
    event.preventDefault();
    close();
  });
  for (const link of menu.querySelectorAll('a')) link.addEventListener('click', close);
  addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menu.open) {
      close();
      menu.querySelector('summary')?.focus();
    }
  });
}

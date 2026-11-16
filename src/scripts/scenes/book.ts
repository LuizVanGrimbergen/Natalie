import { lightness } from './progress';

/**
 * The "Boek een sessie" pill (BookPill.astro). With the step navigation, navigation.ts calls set() with every
 * step: hidden on the first and the last scene, light or dark to match the scene on show. Without it (a normal
 * scrolling page), initBookStatic() shows it once the hero has left the screen and hides it at the invitation.
 */
export function initBook(scenes: HTMLElement[]) {
  const pill = document.querySelector<HTMLElement>('[data-book]');
  const last = scenes.length - 1;
  return {
    set(at: number) {
      if (!pill) return;
      pill.classList.toggle('is-shown', at > 0 && at < last);
      pill.classList.toggle('is-light', lightness(scenes[at].dataset.tint ?? '#000000') > 0.5);
    },
  };
}

export function initBookStatic() {
  const pill = document.querySelector<HTMLElement>('[data-book]');
  const hero = document.querySelector<HTMLElement>('[data-scene="hero"]');
  const end = document.querySelector<HTMLElement>('[data-scene="invitation"]');
  if (!pill || !hero || !end) return;
  let heroOn = true;
  let endOn = false;
  const update = () => pill.classList.toggle('is-shown', !heroOn && !endOn);
  new IntersectionObserver(([entry]) => {
    heroOn = entry.isIntersecting;
    update();
  }, { threshold: 0.15 }).observe(hero);
  new IntersectionObserver(([entry]) => {
    endOn = entry.isIntersecting;
    update();
  }, { threshold: 0.35 }).observe(end);
}

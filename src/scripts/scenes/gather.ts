import { all, one } from './dom';
import { wayIn } from './transition';
import { fade, type Timeline } from './tweens';

/**
 * Title of the three elements → the three elements: one thought, not two pages.
 * The label above and the line under the title give way, the title rises and shrinks into the head
 * of the next screen; as it settles, that screen dissolves in, with the head on
 * exactly the same spot and wrapped on the same words, so the handover can't be
 * seen. The three elements then rise under it (list.ts). Backwards it is the mirror.
 * Relative timeline (0–1), 1.2s, played by navigation.ts like every crossfade.
 */
export function gather(prev: HTMLElement, next: HTMLElement): Timeline {
  const title = one(prev, '[data-gather-title]');
  const heading = one(title, 'h2');
  const target = one(next, '[data-gather-target]');

  // Where the title lands, measured untransformed: up front, not in the first frame of the step.
  let to = { x: 0, y: 0, scale: 1 };
  const measure = () => {
    const transform = title.style.transform;
    title.style.transform = 'none';
    const size = (el: Element) => parseFloat(getComputedStyle(el).fontSize);
    const scale = size(target) / size(heading);
    const from = title.getBoundingClientRect();
    // The head is the title scaled down: as wide, in proportion, so it breaks on the same words.
    target.style.width = `${from.width * scale}px`;
    const end = target.getBoundingClientRect();
    title.style.transform = transform;
    to = { x: end.left - from.left, y: end.top - from.top, scale };
  };
  measure();

  const tl = wayIn(1.2);
  tl.fromTo(all(prev, '[data-gather-line]'), { opacity: 1, y: 0 }, { opacity: 0, y: 16, duration: 0.3, ease: 'sine.in' }, 0).fromTo(
    title,
    { x: 0, y: 0, scale: 1, transformOrigin: 'left top', force3D: true },
    {
      x: () => to.x,
      y: () => to.y,
      scale: () => to.scale,
      duration: 0.7,
      // navigation.ts already eases the whole step in and out; this only lets it settle.
      ease: 'sine.out',
    },
    0,
  );
  // The next screen comes in over the last of the movement, so nothing stands still.
  fade(tl, next, 0.5, 0.4);

  // Measured again once the fonts are in, and once per frame at most while the screen changes size.
  let queued = false;
  const remeasure = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      measure();
      tl.invalidate();
    });
  };
  document.fonts?.ready.then(remeasure);
  addEventListener('resize', remeasure);
  return tl;
}

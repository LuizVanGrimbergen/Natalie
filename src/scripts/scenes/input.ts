/** Up or down one screen. */
export type Step = 1 | -1;

/** A wheel gesture ends after this many ms without wheel events (trackpad momentum keeps it going). */
const WHEEL_GAP = 180;
/** Wheel delta (px) a gesture needs before it counts. */
const WHEEL_MIN = 24;
/** Finger travel (px) a swipe needs before it counts. */
const SWIPE_MIN = 36;

/**
 * Turns wheel, touch and keyboard input into single steps: one gesture is
 * exactly one step, however long the trackpad keeps scrolling or the finger
 * keeps moving. The page itself never scrolls.
 */
export function onStep(step: (dir: Step) => void) {
  let last = 0;
  let sum = 0;
  let used = false;
  addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const now = performance.now();
      if (now - last > WHEEL_GAP) {
        sum = 0;
        used = false;
      }
      last = now;
      if (used) return;
      sum += event.deltaY;
      if (Math.abs(sum) < WHEEL_MIN) return;
      used = true;
      step(sum > 0 ? 1 : -1);
    },
    { passive: false },
  );

  let startY: number | null = null;
  addEventListener('touchstart', (event) => (startY = event.touches.length === 1 ? event.touches[0].clientY : null), { passive: true });
  addEventListener(
    'touchmove',
    (event) => {
      if (startY === null) return;
      event.preventDefault();
      const dy = startY - event.touches[0].clientY;
      if (Math.abs(dy) < SWIPE_MIN) return;
      startY = null;
      step(dy > 0 ? 1 : -1);
    },
    { passive: false },
  );

  addEventListener('keydown', (event) => {
    if (event.target !== document.body) return;
    if (['ArrowDown', 'PageDown', ' '].includes(event.key)) step(1);
    else if (['ArrowUp', 'PageUp'].includes(event.key)) step(-1);
    else return;
    event.preventDefault();
  });
}

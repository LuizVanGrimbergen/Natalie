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
 *
 * A trackpad keeps sending ever smaller events after the fingers let go
 * (momentum), often without a gap before the next gesture. So a new gesture
 * also starts when the direction flips, or when the deltas grow again while
 * the momentum was dying down (a fresh push).
 */
export function onStep(step: (dir: Step) => void) {
  let last = 0;
  let sum = 0;
  let used = false;
  let sign = 0;
  let peak = 0;
  let previous = 0;
  addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const now = performance.now();
      const delta = event.deltaY;
      const size = Math.abs(delta);
      const dir = Math.sign(delta);
      const fading = peak > 0 && previous < peak * 0.7;
      const fresh = now - last > WHEEL_GAP || (dir !== 0 && dir !== sign) || (fading && size > previous * 1.6 && size > 6);
      if (fresh) {
        sum = 0;
        used = false;
        sign = dir;
        peak = 0;
      }
      last = now;
      previous = size;
      peak = Math.max(peak, size);
      if (used) return;
      sum += delta;
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

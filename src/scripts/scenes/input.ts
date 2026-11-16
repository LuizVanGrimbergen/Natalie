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
 * exactly one step, however hard the flick, however long the trackpad keeps
 * scrolling or the finger keeps moving. The page itself never scrolls.
 *
 * A trackpad keeps sending events for a second or more after the fingers let
 * go (momentum), and their size goes up and down. A new gesture only starts
 * after a quiet gap (WHEEL_GAP) or when the direction flips (scrolling back).
 * An earlier rule also started one when the deltas grew again ("a fresh push"),
 * but a hard flick's own momentum did that too, and one flick went 2–3 screens.
 */
export function onStep(step: (dir: Step) => void) {
  let last = 0;
  let sum = 0;
  let used = false;
  let sign = 0;
  addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      const now = performance.now();
      const delta = event.deltaY;
      const dir = Math.sign(delta);
      const fresh = now - last > WHEEL_GAP || (dir !== 0 && dir !== sign);
      if (fresh) {
        sum = 0;
        used = false;
        sign = dir;
      }
      last = now;
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
    // A held key repeats: one press is one screen.
    if (event.repeat) {
      if (['ArrowDown', 'PageDown', ' ', 'ArrowUp', 'PageUp'].includes(event.key)) event.preventDefault();
      return;
    }
    if (['ArrowDown', 'PageDown', ' '].includes(event.key)) step(1);
    else if (['ArrowUp', 'PageUp'].includes(event.key)) step(-1);
    else return;
    event.preventDefault();
  });
}

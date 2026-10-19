import gsap from 'gsap';
import type { Timeline } from '../tweens';
import type { FoldState } from './draw';

/** How far the closed dome turns and tilts (radians) with the mouse at the edge of the screen. */
const TURN = 0.45;
const TILT = 0.25;

/**
 * Once the dome is closed it turns gently towards the mouse. Only for a real
 * mouse (no touch), only while the shape scene is on show and fully built.
 * `rest` is the view the build ends on; returns reset(), for when it builds again.
 */
export function followPointer(scene: HTMLElement, tl: Timeline, state: FoldState, rest: { turn: number; tilt: number }, draw: () => void) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};

  const offset = { x: 0, y: 0 };

  const ready = () => tl.progress() === 1 && !scene.hasAttribute('data-offstage');
  const apply = () => {
    if (!ready()) return;
    state.turn = rest.turn + offset.x * TURN;
    state.tilt = rest.tilt + offset.y * TILT;
    draw();
  };
  // One eased tween per axis, retargeted on every move instead of a new tween each time.
  const toX = gsap.quickTo(offset, 'x', { duration: 1.4, ease: 'power3.out', onUpdate: apply });
  const toY = gsap.quickTo(offset, 'y', { duration: 1.4, ease: 'power3.out' });
  const ease = (x: number, y: number) => {
    toX(x);
    toY(y);
  };
  // Straight back to rest, no easing (the build starts again from the dome at rest).
  const reset = () => {
    toX(0, 0);
    toY(0, 0);
  };

  addEventListener(
    'pointermove',
    (event) => {
      if (event.pointerType === 'mouse' && ready()) ease((event.clientX / innerWidth) * 2 - 1, (event.clientY / innerHeight) * 2 - 1);
    },
    { passive: true },
  );
  document.documentElement.addEventListener('mouseleave', () => ready() && ease(0, 0));
  return reset;
}

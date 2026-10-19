import { one, reveal } from './dom';
import { foldCanvas, type FoldState } from './fold/draw';
import { followPointer } from './fold/follow';
import { build, fade, rise, type Timeline } from './tweens';

/** The view the closed dome comes to rest on. */
const REST = { turn: 0.55, tilt: -0.45 };

/* 02 · The flat net of thirty rhombi appears and folds itself into the dome; once closed it follows the mouse. */
export function shape(scene: HTMLElement): Timeline {
  const render = foldCanvas(one(scene, '[data-fold]') as unknown as HTMLCanvasElement);
  const state: FoldState = { appear: 0, fold: 0, turn: 0, tilt: 0 };
  const draw = () => render(state);
  const tl = build();
  const reset = followPointer(scene, tl, state, REST, draw);
  tl.fromTo(state, { appear: 0 }, { appear: 1, duration: 0.16, onStart: reset, onUpdate: draw }, 0).fromTo(
    state,
    { fold: 0, turn: -0.3, tilt: 0 },
    { fold: 1, ...REST, duration: 0.58, ease: 'power1.inOut', onUpdate: draw },
    0.1,
  );
  rise(tl, reveal(scene, 1), 0.42, 0.12);
  rise(tl, reveal(scene, 2), 0.56, 0.12);
  fade(tl, reveal(scene, 3), 0.7, 0.14);
  return tl;
}

import { one } from './dom';
import { build, fade, type Timeline } from './tweens';

/**
 * A scene's own way in (enter.ts, gather.ts) instead of a crossfade: it has its own
 * length, and stepping back is its mirror, so the earlier scene comes back finished
 * instead of building again. navigation.ts reads it from the timeline's data.
 */
export interface WayIn {
  seconds: number;
}

export function wayIn(seconds: number): Timeline {
  return build({ data: { seconds } satisfies WayIn });
}

/**
 * The next scene dissolves in place over the previous one (no slide), and the
 * previous one dims to warm dark brown. Relative timeline (0–1), played by navigation.ts.
 */
export function crossfade(prev: HTMLElement, next: HTMLElement): Timeline {
  const tl = build();
  tl.fromTo(one(prev, '.exit-dim'), { opacity: 0 }, { opacity: 0.55, duration: 1 }, 0);
  fade(tl, next, 0, 1);
  return tl;
}

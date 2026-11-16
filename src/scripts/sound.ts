/**
 * The story page's optional music (SoundToggle.astro). Off by default and never autoplaying: a click
 * fades it in, another fades it out and pauses. It pauses while the tab is hidden, and "on" is
 * remembered for this visit only, so a reload asks again with one click (browsers block autoplay anyway).
 */
const FADE_MS = 1500;
const VOLUME = 0.6;
const KEY = 'sound-on';

export function initSound() {
  const button = document.querySelector<HTMLButtonElement>('[data-sound]');
  if (!button) return;
  const audio = new Audio(button.dataset.sound);
  audio.loop = true;
  audio.preload = 'none';
  audio.volume = 0;

  let on = false;
  let frame = 0;

  function fadeTo(target: number, done?: () => void) {
    cancelAnimationFrame(frame);
    const from = audio.volume;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / FADE_MS);
      audio.volume = from + (target - from) * t;
      if (t < 1) frame = requestAnimationFrame(step);
      else done?.();
    };
    frame = requestAnimationFrame(step);
  }

  function render() {
    button!.setAttribute('aria-pressed', String(on));
    button!.setAttribute('aria-label', on ? 'Geluid uit' : 'Geluid aan');
  }

  function remember() {
    try {
      if (on) sessionStorage.setItem(KEY, '1');
      else sessionStorage.removeItem(KEY);
    } catch {
      // Storage blocked (private mode): the button still works, it just isn't remembered.
    }
  }

  async function play() {
    try {
      await audio.play();
      fadeTo(VOLUME);
      return true;
    } catch {
      return false;
    }
  }

  async function toggle() {
    on = !on;
    render();
    remember();
    if (on) {
      if (!(await play())) {
        on = false;
        render();
        remember();
      }
    } else {
      fadeTo(0, () => audio.pause());
    }
  }

  button.addEventListener('click', toggle);

  document.addEventListener('visibilitychange', () => {
    if (!on) return;
    if (document.hidden) fadeTo(0, () => audio.pause());
    else play();
  });

  // Turned on earlier in this visit: show the button as on; the music starts again with the next click,
  // as browsers only allow sound after a gesture on this page.
  let wasOn = false;
  try {
    wasOn = sessionStorage.getItem(KEY) === '1';
  } catch {
    wasOn = false;
  }
  if (wasOn) {
    // Any first gesture resumes it, except one on the button itself: that click is its own toggle.
    const resume = (event: Event) => {
      stop();
      if (!on && !button.contains(event.target as Node)) toggle();
    };
    const stop = () => {
      document.removeEventListener('pointerdown', resume);
      document.removeEventListener('keydown', resume);
    };
    document.addEventListener('pointerdown', resume);
    document.addEventListener('keydown', resume);
  }

  button.hidden = false;
}

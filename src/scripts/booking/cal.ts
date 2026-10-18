/*
 * Step 3 of the booking page: the Cal.com booker of the chosen session, inline,
 * in the site's colors. It loads only once a session is chosen, and is drawn
 * again when the session or the number of people changes, so the number is
 * filled in on Cal.com's booking form (booking question with identifier `personen`).
 */

const ORIGIN = 'https://app.cal.com';

type Queue = ((...args: unknown[]) => void) & { q: unknown[][] };
type CalApi = Queue & { loaded?: boolean; ns: Record<string, Queue> };

declare global {
  interface Window {
    Cal?: CalApi;
  }
}

let ready: Promise<CalApi> | null = null;

/**
 * Cal.com's own embed snippet (@calcom/embed-snippet), written out: queues calls
 * until embed.js has loaded. Resolves once it has, so only the latest choice is drawn.
 */
function loadCal(): Promise<CalApi> {
  if (ready) return ready;
  const cal = function (...args: unknown[]) {
    const [command, name] = args;
    if (command === 'init' && typeof name === 'string') {
      const ns = cal.ns[name] ?? Object.assign((...nsArgs: unknown[]) => ns.q.push(nsArgs), { q: [] as unknown[][] });
      cal.ns[name] = ns;
      ns.q.push(args);
      cal.q.push(['initNamespace', name]);
      return;
    }
    cal.q.push(args);
  } as CalApi;
  cal.q = [];
  cal.ns = {};
  cal.loaded = true;
  window.Cal = cal;
  ready = new Promise((resolve, reject) => {
    const script = document.head.appendChild(document.createElement('script'));
    script.onload = () => resolve(cal);
    script.onerror = reject;
    script.src = `${ORIGIN}/embed/embed.js`;
  });
  return ready;
}

/** The booker in the booking page's colors, copper only for the choice (Cal.com's own CSS variables), per theme. */
const dark = {
  'cal-brand': '#D49A72',
  'cal-brand-emphasis': '#E2B08F',
  'cal-brand-text': '#0E0B09',
  'cal-bg': '#0E0B09',
  'cal-bg-muted': '#1A1511',
  'cal-bg-subtle': '#1A1511',
  'cal-bg-emphasis': '#2A221C',
  'cal-border': '#2A221C',
  'cal-border-subtle': '#1A1511',
  'cal-border-booker': '#1A1511',
  'cal-border-emphasis': '#3A302A',
  'cal-text': '#F5F1E9',
  'cal-text-emphasis': '#F5F1E9',
  'cal-text-subtle': '#B9B3AB',
  'cal-text-muted': '#8F8983',
};
const light = {
  'cal-brand': '#9C5530',
  'cal-brand-emphasis': '#86472A',
  'cal-brand-text': '#F5F1E9',
  'cal-bg': '#F5F1E9',
  'cal-bg-muted': '#FFFDF9',
  'cal-bg-subtle': '#FFFDF9',
  'cal-bg-emphasis': '#ECE3D7',
  'cal-border': '#E2D8CA',
  'cal-border-subtle': '#ECE3D7',
  'cal-border-booker': '#ECE3D7',
  'cal-border-emphasis': '#CFC3B4',
  'cal-text': '#1E1712',
  'cal-text-emphasis': '#1E1712',
  'cal-text-subtle': '#5E5650',
  'cal-text-muted': '#6E655C',
};
const theme = () => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function initCalEmbed(root: HTMLElement) {
  const links = JSON.parse(root.dataset.links ?? '{}') as Record<string, string>;
  const box = root.querySelector<HTMLElement>('[data-cal-box]')!;
  const started = new Set<string>();
  let shown = '';

  const checked = (name: string) => document.querySelector<HTMLInputElement>(`input[name="${name}"]:checked`)?.value;

  async function render() {
    const session = checked('session');
    const people = checked('people') ?? '1';
    const calLink = session && links[session];
    if (!calLink) return;
    // One namespace per session × group size × theme: Cal.com keeps one inline booker per
    // namespace and ignores a second call that is still queued while embed.js loads.
    const mode = theme();
    const namespace = `${session}-${people}-${mode}`;
    if (namespace === shown) return;
    shown = namespace;

    const cal = await loadCal();
    if (namespace !== shown) return; // chosen again while embed.js was loading
    if (!started.has(namespace)) {
      started.add(namespace);
      cal('init', namespace, { origin: ORIGIN });
      cal.ns[namespace]('ui', { theme: mode, layout: 'month_view', cssVarsPerTheme: { dark, light } });
    }
    // Clear the old booker, then draw the new choice.
    box.replaceChildren();
    cal.ns[namespace]('inline', {
      elementOrSelector: box,
      calLink,
      config: { layout: 'month_view', theme: mode, personen: people },
    });
  }

  document.addEventListener('change', (event) => {
    const name = (event.target as HTMLInputElement).name;
    if (name === 'session' || name === 'people') void render();
  });
  // The navbar's light/dark switch: draw the booker again in the other theme.
  addEventListener('themechange', () => void render());
  void render();
}

/**
 * The booking steps (BookingSteps.astro): one step open at a time, nothing chosen at first. A choice only marks
 * the card; "Volgende" (active once the step has a choice) opens the next step that still needs one. A finished
 * step folds into one line with what was chosen and a "Wijzig" button that opens it again.
 * The soundroom also asks how many people come (1 to its max, 3), and the total follows: base price plus the
 * extra price for each person after the first. The session switches the agenda to that session's schedule and
 * sets how many songs to give.
 * Without JavaScript every step stays open (no [data-booking-ready]) and the agenda is there at once.
 */
const STEPS = 3;
/** The opening transition of a step body (BookingSteps.astro). */
const OPEN_MS = 450;
/** Air between the top of the screen and a step brought into view. */
const SCROLL_GAP = 16;

export function initBooking() {
  const root = document.querySelector<HTMLElement>('[data-booking]');
  if (!root) return;
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const progress = [...root.querySelectorAll<HTMLElement>('[data-progress]')];
  const announce = root.querySelector<HTMLElement>('[data-announce]');
  const sessions = root.querySelectorAll<HTMLInputElement>('input[name="session"]');
  const music = root.querySelectorAll<HTMLInputElement>('input[name="music"]');
  const songsLine = root.querySelector<HTMLElement>('[data-songs-line]');
  const songCount = root.querySelector<HTMLElement>('[data-song-count]');
  const songMax = root.querySelector<HTMLElement>('[data-song-max]');
  const calendar = root.querySelector<HTMLIFrameElement>('[data-booking-calendar]');
  const open = root.querySelector<HTMLAnchorElement>('[data-booking-open]');
  const persons = root.querySelector<HTMLElement>('[data-persons]');
  const minus = root.querySelector<HTMLButtonElement>('[data-persons-minus]');
  const plus = root.querySelector<HTMLButtonElement>('[data-persons-plus]');
  const value = root.querySelector<HTMLElement>('[data-persons-value]');
  const word = root.querySelector<HTMLElement>('[data-persons-word]');
  const total = root.querySelector<HTMLElement>('[data-total]');
  const personsNote = root.querySelector<HTMLElement>('[data-persons-note]');
  const personsCount = root.querySelector<HTMLElement>('[data-persons-count]');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const checked = (inputs: NodeListOf<HTMLInputElement>) => [...inputs].find((input) => input.checked);
  let current = 1;
  let people = 1;

  /** Which steps are done: the session for 1, the music for 2. */
  const done = (n: number) => (n === 1 ? Boolean(checked(sessions)) : n === 2 ? Boolean(checked(music)) : false);
  /** The first step not done yet: where "Volgende" (or a new visitor) goes. */
  const nextOpen = () => (!done(1) ? 1 : !done(2) ? 2 : 3);

  /** How many people the chosen session allows (the soundroom 3, coaching 1). */
  const maxPeople = (session?: HTMLInputElement) => Number(session?.dataset.max ?? 1);
  /** Base price plus the extra price for each person after the first. */
  function price(session: HTMLInputElement) {
    const base = Number(session.dataset.price ?? 0);
    const extra = Number(session.dataset.extra ?? 0);
    return base + extra * (Math.min(people, maxPeople(session)) - 1);
  }
  function summary(session: HTMLInputElement) {
    const many = maxPeople(session) > 1 && people > 1 ? ` · ${people} personen` : '';
    return `${session.dataset.name}${many} · €${price(session)}`;
  }

  function render() {
    const session = checked(sessions);
    const choice = checked(music);
    const group = maxPeople(session) > 1;

    steps.forEach((step, i) => {
      const n = i + 1;
      const isOpen = n === current;
      step.classList.toggle('is-open', isOpen);
      step.classList.toggle('is-done', done(n));
      // A step is locked until every step before it is done.
      step.classList.toggle('is-locked', !isOpen && n > nextOpen());
      const body = step.querySelector<HTMLElement>('.step__body');
      if (body) body.inert = !isOpen;
      const next = step.querySelector<HTMLButtonElement>('[data-next]');
      if (next) next.disabled = !done(n);
      const line = step.querySelector<HTMLElement>('[data-summary]');
      if (line) line.textContent = n === 1 && session ? summary(session) : n === 2 ? (choice?.dataset.summary ?? '') : '';
    });
    progress.forEach((item, i) => {
      item.classList.toggle('is-current', i + 1 === current);
      item.classList.toggle('is-done', done(i + 1) && i + 1 !== current);
    });

    // How many people: only for a session that takes more than one.
    if (persons) persons.hidden = !group;
    if (session && group) {
      people = Math.min(Math.max(people, 1), maxPeople(session));
      if (value) value.textContent = String(people);
      if (word) word.textContent = people === 1 ? 'persoon' : 'personen';
      if (total) total.textContent = `€${price(session)}`;
      if (minus) minus.disabled = people <= 1;
      if (plus) plus.disabled = people >= maxPeople(session);
    }
    if (personsNote) personsNote.hidden = !(group && people > 1);
    if (personsCount) personsCount.textContent = String(people);

    // Your own songs: the reminder in step 3, and in step 2 how many, for the session chosen.
    if (songsLine) songsLine.hidden = choice?.value !== 'own';
    if (session) {
      const songs = `tot ${session.dataset.songs} liedjes`;
      if (songCount) songCount.textContent = songs;
      if (songMax) songMax.textContent = songs;
    }

    // The agenda of the chosen session, loaded only once the visitor gets there.
    const url = session && calendar?.dataset[session.value];
    if (current === STEPS && calendar && url && calendar.src !== url) calendar.src = url;
    if (open && url) {
      const full = new URL(url);
      full.searchParams.delete('gv');
      open.href = full.toString();
    }
  }

  /**
   * Keep the page at least as tall as what is on screen now. Folding a step makes the page shorter, and near the
   * bottom the browser would pull the view back with a jump. So the height is held while a step folds and only
   * let go once the page has scrolled to where it ends up, as far as that position allows.
   */
  const page = document.body;
  function hold() {
    page.style.minHeight = `${Math.ceil(scrollY + innerHeight)}px`;
  }
  function letGo() {
    page.style.minHeight = '';
    // Still below the page's own end (a short page after folding): keep just enough room for where we are.
    if (document.documentElement.scrollHeight < scrollY + innerHeight) hold();
  }
  function afterScroll(done: () => void) {
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      removeEventListener('scrollend', finish);
      done();
    };
    addEventListener('scrollend', finish, { once: true });
    window.setTimeout(finish, 1200);
  }

  /** Open step n: fold the others, bring it into view, and move focus to its title. */
  function go(n: number, focus = true) {
    current = n;
    hold();
    render();
    if (announce) announce.textContent = `Stap ${n} van ${STEPS}`;
    if (!focus) {
      letGo();
      return;
    }
    const step = steps[n - 1];
    const title = step.querySelector<HTMLElement>('.step__title');
    // Wait until the folding above has settled, so the step lands where it ends up.
    window.setTimeout(() => {
      title?.focus({ preventScroll: true });
      const top = step.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.4) {
        // Scroll the page itself, never further than it can go.
        const max = document.documentElement.scrollHeight - innerHeight;
        const target = Math.max(0, Math.min(max, scrollY + top - SCROLL_GAP));
        if (Math.abs(target - scrollY) > 1) {
          afterScroll(letGo);
          window.scrollTo({ top: target, behavior: reduced ? 'auto' : 'smooth' });
          return;
        }
      }
      letGo();
    }, reduced ? 0 : OPEN_MS);
  }

  for (const input of [...sessions, ...music]) input.addEventListener('change', render);
  for (const next of root.querySelectorAll<HTMLButtonElement>('[data-next]')) {
    next.addEventListener('click', () => {
      if (!next.disabled) go(nextOpen());
    });
  }
  minus?.addEventListener('click', () => {
    people -= 1;
    render();
  });
  plus?.addEventListener('click', () => {
    people += 1;
    render();
  });
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-edit]')) {
    button.addEventListener('click', () => go(Number(button.dataset.edit)));
  }

  root.toggleAttribute('data-booking-ready', true);
  go(nextOpen(), false);
}

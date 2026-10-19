// TODO(Natalie): descriptions are sample copy awaiting her approval; names, duration, prices and the friends discount are hers.

/** Each person pays this much less when they book together with friends. */
export const FRIENDS_DISCOUNT = 0.1;
/** At most this many people come together, for either session. */
export const MAX_PEOPLE = 3;

export interface Session {
  id: 'soundroom' | 'coaching';
  name: string;
  text: string;
  minutes: number;
  price: number;
  /** Cal.com event type to book, as `<username>/<event slug>` (e.g. `natalie/soundroom`). */
  calLink?: string;
}

export const SESSIONS: Session[] = [
  {
    id: 'soundroom',
    name: 'Soundroom',
    text: 'Je ligt in de soundroom, omringd door muziek, en komt tot rust.',
    minutes: 50,
    price: 75,
    calLink: import.meta.env.PUBLIC_CAL_SOUNDROOM?.trim() || undefined,
  },
  {
    id: 'coaching',
    name: 'Coaching',
    text: 'Een persoonlijk gesprek met Natalie over wat er speelt en wat jij nodig hebt.',
    minutes: 50,
    price: 65,
    calLink: import.meta.env.PUBLIC_CAL_COACHING?.trim() || undefined,
  },
];

/** Price per person for a group of `people`. */
export const pricePerPerson = (session: Session, people: number) => (people > 1 ? session.price * (1 - FRIENDS_DISCOUNT) : session.price);

export const euro = (amount: number) =>
  new Intl.NumberFormat('nl-BE', { style: 'currency', currency: 'EUR', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2 }).format(
    amount,
  );

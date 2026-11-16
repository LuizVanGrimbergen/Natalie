/**
 * The gift voucher (/gift): a soundroom session to give, for 1 to 3 people. Prices follow the soundroom
 * (€35, + €25 per extra person). Natalie's request of November: a gift for December, with no age on it.
 * Ordering goes through Natalie herself (WhatsApp or e-mail); the site sends nothing.
 * TODO(Natalie): approve the copy, how long a voucher stays valid, and how it is paid and delivered.
 */
import { email } from './contact';

export const BASE = 35;
export const EXTRA = 25;
export const MAX = 3;

export const price = (persons: number) => BASE + EXTRA * (persons - 1);

export const personsText = (persons: number) => `${persons} ${persons === 1 ? 'persoon' : 'personen'}`;

/** The message to Natalie, ready to send. */
export const orderMessage = (persons: number) =>
  `Hoi Natalie, ik wil graag een cadeaubon geven voor de soundroom, voor ${personsText(persons)} (€${price(persons)}).`;

/** The same message as an e-mail to Natalie. */
export const orderMail = (persons: number) =>
  `mailto:${email}?subject=${encodeURIComponent('Cadeaubon soundroom')}&body=${encodeURIComponent(orderMessage(persons))}`;

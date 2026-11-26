/**
 * The gift voucher (/gift): a soundroom session to give, for 1 to 3 people. Prices follow the soundroom
 * (€35, + €25 per extra person). Natalie's request of November: a gift for December, with no age on it.
 * Ordering goes through Natalie herself (WhatsApp or e-mail); the site sends nothing.
 * TODO(Natalie): approve the copy, how long a voucher stays valid, and how it is paid and delivered.
 */
import { email } from './contact';

export const BASE = 35;
const EXTRA = 25;
export const MAX = 3;

export const price = (persons: number) => BASE + EXTRA * (persons - 1);

export const personsText = (persons: number) => `${persons} ${persons === 1 ? 'persoon' : 'personen'}`;

/**
 * Mollie payment links (live, reusable, made in Natalie's Mollie dashboard on 26 November), one per number of
 * people. Each returns to /gift-thanks?n=1|2|3 after paying, which asks for one short message so Natalie
 * can send the voucher with its code (Mollie doesn't give her the buyer's contact). Links can't be edited in Mollie: a change means new links here.
 */
const payLinks: Record<number, string> = {
  1: 'https://payment-links.mollie.com/payment/JxUbv4xiMJCa8XFYSJPSP',
  2: 'https://payment-links.mollie.com/payment/X8YNogP32yxgfQv298QZG',
  3: 'https://payment-links.mollie.com/payment/yo2jSqR2nnniutDtZKaTP',
};
export const payLink = (persons: number) => payLinks[persons];

/** The message to Natalie, ready to send. */
export const orderMessage = (persons: number) =>
  `Hoi Natalie, ik wil graag een cadeaubon geven voor de soundroom, voor ${personsText(persons)} (€${price(persons)}).`;

/** The same message as an e-mail to Natalie. */
export const orderMail = (persons: number) =>
  `mailto:${email}?subject=${encodeURIComponent('Cadeaubon soundroom')}&body=${encodeURIComponent(orderMessage(persons))}`;

/** After paying (the thank-you page): one short message, so Natalie knows where to send the voucher with its code. */
export const thanksMessage = (persons: number) =>
  `Hoi Natalie, ik heb net een cadeaubon betaald voor de soundroom, voor ${personsText(persons)} (€${price(persons)}). Mag ik de bon met de code ontvangen?`;

export const thanksMail = (persons: number) =>
  `mailto:${email}?subject=${encodeURIComponent('Cadeaubon soundroom (betaald)')}&body=${encodeURIComponent(thanksMessage(persons))}`;

/**
 * The gift page (GiftOrder.astro + GiftCard.astro): the voucher and the order links follow the number of
 * people chosen. Without JavaScript the page still works, for one person.
 */
import { whatsapp } from '../data/contact';
import { orderMail, payLink, orderMessage, personsText, price } from '../data/gift';

export function initGift() {
  const root = document.querySelector<HTMLElement>('[data-gift]');
  if (!root) return;
  const persons = document.querySelector<HTMLElement>('[data-gift-persons]');
  const amount = document.querySelector<HTMLElement>('[data-gift-price]');
  const wa = root.querySelector<HTMLAnchorElement>('[data-gift-whatsapp]');
  const pay = root.querySelector<HTMLAnchorElement>('[data-gift-pay]');
  const mail = root.querySelector<HTMLAnchorElement>('[data-gift-mail]');

  const update = (count: number) => {
    if (persons) persons.textContent = personsText(count);
    if (amount) amount.textContent = String(price(count));
    if (pay) pay.href = payLink(count);
    if (wa) wa.href = whatsapp(orderMessage(count));
    if (mail) mail.href = orderMail(count);
  };

  root.addEventListener('change', (event) => {
    const input = event.target as HTMLInputElement;
    if (input.name === 'persons') update(Number(input.value));
  });
  // A choice kept by the browser on back/forward.
  const kept = root.querySelector<HTMLInputElement>('input[name="persons"]:checked');
  if (kept) update(Number(kept.value));
}

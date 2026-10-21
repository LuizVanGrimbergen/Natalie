/** Natalie's contact details, shared by every place on the site that links to her. */
export const email = 'nvandervoort@mereon.org';
export const phone = '+32 478 51 76 57';

/** A WhatsApp chat with Natalie, optionally with a message ready to send. */
export function whatsapp(text?: string) {
  const url = `https://wa.me/${phone.replace(/\D/g, '')}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}

/** Where the dome stands: the street only, no number (Natalie gives the exact spot herself). */
export const address = 'Struikenlei, Schoten';

/** The street in Google Maps; on a phone it opens the maps app. */
export const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, België`)}`;

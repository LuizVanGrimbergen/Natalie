/** Natalie's contact details, shared by every place on the site that links to her. */
export const email = 'nvandervoort@mereon.org';
export const phone = '+32 478 51 76 57';

/** The Mereon Legacy, the team Natalie works with: shown as its bare domain, linked. */
export const website = { label: 'mereon.org', url: 'https://mereon.org' };

/** A WhatsApp chat with Natalie, optionally with a message ready to send. */
export function whatsapp(text?: string) {
  const url = `https://wa.me/${phone.replace(/\D/g, '')}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}

/** Where the dome stands: only the town, no street (Natalie gives the exact spot herself). */
export const address = 'Schoten';

/** The town in Google Maps; on a phone it opens the maps app. */
export const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address}, België`)}`;

/**
 * The legal details a Belgian self-employed person must show on the website: the registered office
 * (sociale zetel, never the home address) and the enterprise number (KBO). Shown on /booking only
 * once both are filled in.
 */
export const business = {
  name: 'Natalie Van der Voort',
  seat: 'Paalstraat 149, 2900 Schoten',
  enterpriseNumber: 'BE 0882.177.881',
};

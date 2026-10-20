/** Natalie's contact details, shared by every place on the site that links to her. */
export const email = 'nvandervoort@mereon.org';
export const phone = '+32 478 51 76 57';

/** A WhatsApp chat with Natalie, optionally with a message ready to send. */
export function whatsapp(text?: string) {
  const url = `https://wa.me/${phone.replace(/\D/g, '')}`;
  return text ? `${url}?text=${encodeURIComponent(text)}` : url;
}

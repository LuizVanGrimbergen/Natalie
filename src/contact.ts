/** Natalie's contact details, used by the footer and the booking page. TODO(Natalie): fill in. */
export const CONTACT_EMAIL = '';

/** Visitor-facing: the e-mail address, or the placeholder until it is known. */
export const contactLabel = CONTACT_EMAIL || '[CONTACTGEGEVENS]';
export const contactHref = CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : undefined;

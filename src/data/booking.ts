/**
 * Does Natalie's Google booking form ask for the songs and the number of people yet?
 * false (for now): step 3 asks to send them to Natalie on WhatsApp after booking, with a message ready.
 * true: once the form has the questions "Welke liedjes wil je horen?" and "Met hoeveel personen kom je?",
 * step 3 asks to fill them in there instead. Test with one booking before switching.
 */
export const formAsksSongs = false;

/**
 * Does the Google booking form ask for a voucher code yet ("Heb je een cadeaubon? Vul je code in.")?
 * false (for now): step 3 asks voucher holders to send their code to Natalie on WhatsApp after booking.
 * true: once Natalie has added that question to the form.
 */
export const formAsksVoucher = false;

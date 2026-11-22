/**
 * The two sessions: shown on /booking (step 1) and described to search engines and AI assistants
 * (JSON-LD in Base.astro, llms.txt). Prices: Natalie's feedback of 19 October and the meeting of November.
 * Every session is 50 minutes (Natalie can have only one Google schedule).
 */
export const MINUTES = 50;

export const sessions = [
  {
    id: 'soundroom',
    name: 'Soundroom',
    text: 'In verbinding gaan met klank & ruimte, op jouw tempo, zonder begeleiding.',
    price: '€35',
    duration: `${MINUTES} minuten`,
    songs: 13,
    // Up to 3 people in the soundroom, €25 for each one after the first.
    amount: 35,
    extra: { price: '+ €25', text: 'per bijkomende persoon · max. 3 personen', amount: 25, max: 3 },
  },
  {
    id: 'coaching',
    name: 'Coaching',
    text: 'In verbinding gaan met klank & ruimte, op jouw tempo, met begeleiding van Natalie.',
    price: '€65',
    duration: `${MINUTES} minuten`,
    songs: 2,
    amount: 65,
  },
];

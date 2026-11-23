import type { APIRoute } from 'astro';
import { pages } from '../data/pages';
import { sessions } from '../data/sessions';
import { BASE as GIFT_FROM, MAX as GIFT_MAX, price } from '../data/gift';
import { email, instagram, phone, website } from '../data/contact';
import { BUSINESS_DESCRIPTION, SITE_NAME } from '../data/schema';

// llms.txt (llmstxt.org): a plain summary of the site, so AI assistants answer about it correctly.
// Built from the same data as the pages. Never the word "koepel" (Natalie's rule).
export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const text = `# ${SITE_NAME} — soundroom en coaching in het bos in Schoten

> ${BUSINESS_DESCRIPTION}

Natalie wil jonge mensen helpen hun eigen perspectief te ontdekken, niet hen "herstellen". Ze is er niet om je de weg te wijzen, wel om de deur open te houden.

## De ruimte

- Een geometrische ruimte van hout (een ruitentriacontaëder, dertig ruitvormige vlakken), met koperkleurige panelen, midden in het bos in Schoten, bij Antwerpen. Ook "het ruimteschip" genoemd.
- Binnen klinkt muziek uit unieke luidsprekers, gebouwd in de lijn van akoestisch pionier Frans Van Hauwaert: muziek die je van alle kanten omringt.
- Er is altijd muziek. Je kiest zelf liedjes, of je laat Natalie de muziek kiezen.

## Sessies (${sessions[0].duration})

${sessions
  .map((s) => `- ${s.name} — ${s.price}: ${s.text}${s.extra ? ` ${s.extra.price} ${s.extra.text}.` : ''}${s.age ? ` ${s.age.text}.` : ''}`)
  .join('\n')}
- Boeken via de agenda op ${url('/booking')}. Annuleren kan tot 24 uur op voorhand. Betalen met Bancontact.

## Cadeaubon

- Een sessie in de soundroom cadeau, voor jong en oud: vanaf €${GIFT_FROM} (${Array.from({ length: GIFT_MAX }, (_, i) => `${i + 1} p. €${price(i + 1)}`).join(', ')}). Eén jaar geldig.
- Bestellen via WhatsApp of e-mail bij Natalie: ${url('/gift')}

## Pagina's

${pages.map((p) => `- [${p.name}](${url(p.path)}): ${p.about}`).join('\n')}

## Contact

- ${SITE_NAME}, Schoten (België)
- E-mail: ${email}
- WhatsApp: ${phone}
- Instagram: @${instagram.handle} (${instagram.url})
- Natalie werkt samen met The Mereon Legacy: ${website.url}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};

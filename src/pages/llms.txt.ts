import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SESSIONS, FRIENDS_DISCOUNT, MAX_PEOPLE, euro } from '../components/booking/sessions';

// llms.txt (llmstxt.org): a plain summary of the site, so AI assistants can answer about it correctly.
export const GET: APIRoute = async ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const pieces = (await getCollection('research', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
  const text = `# Natalie Vandervoort — soundroom en coaching in Schoten

> Een houten, geometrische soundroom (een koepel in de vorm van een ruitentriacontaëder) in Schoten, bij Antwerpen. Je komt er tot rust in muziek en stilte, of je gaat er in gesprek met Natalie Vandervoort. Sessies van 50 minuten, vanaf 18 jaar.

Natalie wil mensen helpen hun eigen perspectief te ontdekken, niet hen "herstellen". Dit is geen therapie en vervangt die ook niet.

## Sessies

${SESSIONS.map((s) => `- ${s.name} — ${euro(s.price)}, ${s.minutes} minuten: ${s.text}`).join('\n')}
- Met maximaal ${MAX_PEOPLE} mensen samen; met vrienden betaalt ieder ${Math.round(FRIENDS_DISCOUNT * 100)}% minder.

## Pagina's

- [Het verhaal](${url('/')}): de soundroom, hoe een sessie verloopt, coaching, wie je ontvangt
- [Afspraak maken](${url('/booking')}): een sessie kiezen en boeken
- [Onderzoek](${url('/onderzoek')}): wat de ruimte doet, wat er gemeten wordt (hartslagvariabiliteit voor en na)

## Onderzoek

${pieces.map((p) => `- [${p.data.title} ${p.data.accent}](${url(`/onderzoek/${p.id}`)}): ${p.data.summary}`).join('\n')}
`;
  return new Response(text, { headers: { 'Content-Type': 'text/markdown; charset=utf-8' } });
};

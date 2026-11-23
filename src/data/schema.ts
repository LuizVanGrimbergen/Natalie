/**
 * What search engines and AI assistants read about the site (schema.org JSON-LD, one graph per page):
 * who Natalie is, where the room stands, what a session costs. Built from the same data the pages show,
 * so the two never drift apart. Only the town, never the street (Natalie gives the exact spot herself).
 */
import { email, instagram, phone, website } from './contact';
import { sessions, MINUTES } from './sessions';
import { BASE as GIFT_FROM } from './gift';

export const SITE_NAME = 'Natalie Van der Voort';

export const BUSINESS_DESCRIPTION =
  'Een geometrisch ruimteschip van hout in het bos in Schoten, bij Antwerpen: een soundroom met unieke luidsprekers, ' +
  'waar muziek je van alle kanten omringt. Sessies van 50 minuten, alleen in de soundroom of met begeleiding van Natalie (coaching voor 18 tot 35 jaar).';

interface Page {
  url: URL;
  title: string;
  description: string;
  image: URL;
  /** schema.org type of this page: WebPage, AboutPage, … */
  type?: string;
}

export function graph(site: URL, page: Page) {
  const home = new URL('/', site).href;
  const id = (name: string) => `${home}#${name}`;
  const booking = new URL('/booking', site).href;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': id('website'),
        url: home,
        name: SITE_NAME,
        inLanguage: 'nl-BE',
        publisher: { '@id': id('business') },
      },
      {
        '@type': page.type ?? 'WebPage',
        '@id': `${page.url.href}#page`,
        url: page.url.href,
        name: page.title,
        description: page.description,
        inLanguage: 'nl-BE',
        isPartOf: { '@id': id('website') },
        about: { '@id': id('business') },
        primaryImageOfPage: page.image.href,
      },
      {
        '@type': 'Person',
        '@id': id('natalie'),
        name: SITE_NAME,
        url: new URL('/about', site).href,
        worksFor: { '@id': id('business') },
        affiliation: { '@type': 'Organization', name: 'The Mereon Legacy', url: website.url },
      },
      {
        '@type': 'LocalBusiness',
        '@id': id('business'),
        name: `${SITE_NAME} — Soundroom`,
        alternateName: ['Soundroom Schoten', 'Het ruimteschip in het bos'],
        description: BUSINESS_DESCRIPTION,
        url: home,
        image: page.image.href,
        email,
        telephone: phone.replace(/\s/g, ''),
        founder: { '@id': id('natalie') },
        sameAs: [instagram.url],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Schoten',
          postalCode: '2900',
          addressRegion: 'Antwerpen',
          addressCountry: 'BE',
        },
        areaServed: ['Schoten', 'Antwerpen', 'Vlaanderen'],
        priceRange: `€${Math.min(...sessions.map((s) => s.amount))}–€${Math.max(...sessions.map((s) => s.amount))}`,
        makesOffer: [
          ...sessions.map((session) => ({
            '@type': 'Offer',
            price: session.amount,
            priceCurrency: 'EUR',
            url: booking,
            itemOffered: {
              '@type': 'Service',
              name: session.name,
              description: session.text,
              duration: `PT${MINUTES}M`,
              ...(session.age && {
                audience: { '@type': 'PeopleAudience', suggestedMinAge: session.age.min, suggestedMaxAge: session.age.max },
              }),
            },
          })),
          {
            '@type': 'Offer',
            price: GIFT_FROM,
            priceCurrency: 'EUR',
            url: new URL('/gift', site).href,
            itemOffered: {
              '@type': 'Service',
              name: 'Cadeaubon soundroom',
              description: 'Een sessie van 50 minuten in de soundroom cadeau, voor 1 tot 3 personen, voor jong en oud.',
            },
          },
        ],
      },
    ],
  };
}

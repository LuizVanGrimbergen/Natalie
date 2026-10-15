# Natalie — website

A single scrolling story of five scenes plus a separate booking page, for Natalie Vandervoort.
Natalie invites young people (20–30) to an experience of **immersive music inside a wooden, geometric dome in the forest**, followed by **personal guidance** (lying down inside the dome). She wants to help people discover their own perspective, **not "fix" them**.

> Build a beautiful story, not a commercial landing page.
> Less technology, more feeling. The technology should be invisible.

The original HTML prototype has been fully rebuilt in this codebase; **the code is now the source of truth** for layout, timing, colors and copy.

## Language

- **Everything is in English** — file names, folders, identifiers, ids, comments, docs.
- **Only the visitor-facing text on the website is Dutch** (copy, labels, page titles, alt/aria text). Copy is given below and must be used **verbatim**.

---

## Stack

| Part | Choice | Why |
|---|---|---|
| Framework | **Astro**, TypeScript | Static HTML, minimal JS, fast, good SEO |
| Styling | **Tailwind CSS** v4 | Design tokens as theme values (`styles/tokens.css`); component styles scoped in `.astro` files |
| Animation | **GSAP + ScrollTrigger** | Cross-browser (incl. Safari), scrubbing, timelines |
| Smooth scroll | **Lenis** | Linked to ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + gsap ticker) |
| Images | **astro:assets** `<Picture>` | AVIF + WebP, JPG fallback, responsive `srcset`; hero preloaded, the rest lazy |
| Fonts | `@fontsource` (self-hosted) | Cormorant Garamond (300, 400, italic) + Figtree (300, 400, 500), latin subset |
| Booking | Google Calendar appointment schedule | Embedded on `/booking` via `PUBLIC_BOOKING_URL` |
| Hosting | Vercel (preview links for the client) or own VPS via Ploi | Static output (`astro build`) |

No UI framework. If interactivity is ever needed: an Astro island.

---

## Structure

```
src/
  layouts/Base.astro                # <html>, fonts, meta/OG, sets html.motion (or not) before paint
  pages/
    index.astro                     # the story: header + the five scenes, starts the scene script
    booking.astro                   # booking page
  components/
    SiteHeader.astro                # wordmark + one link, scrolls away with the page
    CtaLink.astro                   # outline pill button with pulse + hover fill
    ScrollCue.astro                 # equalizer bars + "SCROLL" + falling drop of light
    NotesSvg.astro                  # the two lines + eighth notes (scene 04)
    scenes/
      Hero.astro                    # 01
      Listening.astro               # 03 wooden room (02 was removed)
      Perspectives.astro            # 04 lines + music notes
      WhoWelcomes.astro             # 05 Natalie
      Invitation.astro              # 06 invitation + footer
    booking/
      BookingDetails.astro          # title, intro, location/duration/price/contact
      BookingCalendar.astro         # Google Calendar embed or placeholder card
  scripts/scenes/
    index.ts                        # initScenes(): Lenis, wires scenes + transitions, in-page links
    dom.ts                          # query helpers
    tweens.ts                       # build() + rise/fade/unveil/draw, HOLD
    transition.ts                   # dissolve between scenes, DISSOLVE
    tint.ts                         # browser bar color follows the scene on screen
    hero.ts, listening.ts, perspectives.ts, welcomes.ts, invitation.ts   # one timeline per scene
  styles/
    global.css                      # imports only
    tokens.css                      # design tokens (@theme)
    base.css                        # base elements, .display / .label, reduced motion
    scenes.css                      # scene/stage pinning mechanics, exit dims
  assets/                           # hero.avif, interior.avif, door.avif
```

Conventions: one component per file; styles live scoped in the component that owns them; global CSS only for tokens, base and shared scene mechanics. Animated elements are found via `data-*` attributes (`data-scene`, `data-reveal="n"`, `data-unveil`, …), never via styling classes.

---

## Design tokens

Colors (tuned to the dome: bronze, copper, wood, ivory):

| Token | Hex | Use |
|---|---|---|
| `bronze-950` | `#12100D` | dark base, hero night |
| `bronze-900` | `#1E1712` | dark text on ivory, button |
| `wood-950` | `#120A05` | wooden scene background |
| `copper-700` | `#9C5530` | accents on ivory (italic accent words, labels, line 1) |
| `copper-300` | `#D49A72` | accent on dark (scroll cue bars) |
| `clay` | `#C88F80` | second line / note (the guide) |
| `copper-brown` | `#6B4A36` | transition color into ivory in scene 04 |
| `ivory` | `#F5F1E9` | light base, text on dark |
| `ivory-warm` / `ivory-warm-2` | `#F2E5DA` → `#EEDACC` | gradient in scene 06 |
| `body-on-ivory` | `#3E342C` | body text on ivory |
| `muted` / `muted-2` | `#5E5650` / `#6E655C` | footer, small text |
| `aluminium` | `#A7ADB0` | small labels on dark |

Typography:
- Display: **Cormorant Garamond 300**, `letter-spacing: -0.02em`, large titles with `clamp(...)`.
- **Every scene title has one italic accent in `copper-700`** (e.g. *om te voelen.*, *Wel om de deur open te houden.*, *voor jou.*). Keep this consistent.
- Body: **Figtree 300/400**, 17–18px desktop, 15–16px phone, `line-height` 1.6–1.75.
- Labels: 12px, `letter-spacing: .34em`, uppercase.
- Contrast: all text at least 4.5:1 (3:1 from 24px). Text on images gets a soft dark scrim + text-shadow.

---

## Scenes (in order; Dutch copy used VERBATIM)

Each scene is a **pinned, full-screen stage** (`100lvh`, content in a `100svh` frame) that stays put while its content builds up. Build lengths (`--pin`): hero 900px, wooden room 1500px, perspectives 1600px, Natalie 800px, invitation 700px. After the last tween only a short hold remains (`HOLD`), so there is no dead scroll.

### Transitions between scenes
- **No slide.** The next scene **dissolves in place** over the previous one: the new stage holds still and fades 0 → 1, the previous stays pinned and dims. The dissolve takes 60% of a viewport of scroll (`--dissolve` in `styles/scenes.css` = `DISSOLVE` in `scripts/scenes/transition.ts`; keep in sync).
- Dark transitions (hero → wood → perspectives): true crossfade; the previous dims to warm dark brown (`radial-gradient(#2A1E16, #120D0A)`, max opacity ~.55).
- Light transitions (perspectives → Natalie → invitation): the previous first fades to ivory (0–55% of the transition), then the new one appears (40–100%), so texts never overlap.
- All content of a scene is fully built **before** the next scene starts dissolving in.

### Header (scrolls away, not sticky)
- Left: wordmark *Natalie* (Cormorant italic).
- Right: link **"Kom het zelf ontdekken →"** to `#invitation`; lands on the finished invitation scene.

### 01 · Hero — wonder
- Image: `hero.avif` (the copper dome in the forest), full screen, `object-fit: cover`.
- Copy:
  - (top left, large) **Niet alles wat je raakt,**
  - (bottom right, large, italic) **kun je meteen begrijpen.**
  - (bottom left, small) Soms begint een nieuw perspectief met luisteren naar wat je voelt.
  - Semantically one `<h1>`: "Niet alles wat je raakt, kun je meteen begrijpen." (visually split, `aria-hidden` on the visual parts).
- On load (time-based, CSS): the dome is visible at dusk, the photo drifts slowly, a warm copper glow breathes on the dome, and line 1 fades in word by word. The comma leaves the sentence open, so scrolling finishes it.
- On scroll (scrub): the dusk lifts immediately, the photo zooms out from `scale(1.22)` → 1, a warm glow comes up, then line 2 and the subtext rise (fade + 48px rise).
- **Scroll cue**, bottom center, appears after line 1: 5 copper bars (4px wide, 38px high, 6px gap) moving like an equalizer (1.4s, different delays) + "SCROLL" + a thin line with a falling drop of light. Disappears in the first ~8% of scrolling.

### 02 · (removed)
Deliberately removed. Do not bring back.

### 03 · The wooden room — listening
- Image: `interior.avif` = rendered inside of the dome (rhombic triacontahedron seen from inside, wooden panels with grain, thin semi-transparent white seams, warm light from below).
- No visible lamp / no "sun".
- Scrim: dark wash along the edges and behind text for readability.
- Copy (desktop: spread out; phone/tablet portrait: title on top, the rest grouped at the bottom):
  - h2: **Soms hoef je alleen maar te luisteren.** (top left)
  - In een bijzondere geometrische ruimte, met speciaal op maat gemaakte luidsprekers, word je van alle kanten omringd door muziek. (bottom left)
  - Een geluidservaring die je nauwelijks kunt bevatten, maar des te meer kunt voelen. (right middle, right aligned)
  - *Geen afleiding, geen verwachtingen. Alleen de muziek en wat ze bij je oproept.* (bottom right, italic, larger)
- Animation: the image starts zoomed in `scale(1.4)` and dark → zooms out and brightens (a camera stepping inside). Texts appear one by one.

### 04 · New perspectives — guiding, not fixing
- Background goes from copper-brown `#6B4A36` → ivory in the first ~17% of the build; only then text.
- Visual: SVG with **two lines that end in a pair of eighth notes**. The lines **draw themselves along with the scroll** (stroke-dashoffset over each path's real length — never `pathLength="1"`, GSAP rounds that to a jump):
  1. Copper line (`#9C5530`) draws, hesitates, makes a loop → note head → stem.
  2. Then a clay line (`#C88F80`) walks alongside without touching the first → second note head → stem.
  3. Finally a **beam** joins both notes.
  Meaning: two separate voices sounding together = guiding without fixing. Timing is linear and directly tied to the scroll (no glide, no swelling, no floating).
- Copy (to the right of the notes on desktop; below the notes on phone/tablet portrait):
  - label: NIEUWE PERSPECTIEVEN
  - h2: **Er is meer dan één manier** *om te voelen.* (accent italic in copper)
  - Een veilige plek waar je met jezelf kunt connecteren, experimenteren en luisteren.
  - Als je een bijkomende behoefte hebt, kun je die ook delen met Natalie, zodat je samen een begeleidend project kunt aangaan. (appears together with the second line)

### 05 · Who welcomes you
- Ivory, soft window light on the wall (blurred diagonal patch of light).
- Desktop: text left, portrait right (4:5). Phone/tablet portrait: small portrait on top, text below.
- Portrait: **placeholder** `[Foto van Natalie]` until there is a real photo.
- Copy:
  - label: WIE JE ONTVANGT
  - h2: **Ik ben er niet om je de weg te wijzen.** *Wel om de deur open te houden.* (second sentence italic in copper)
  - Ik geloof niet dat jonge mensen gerepareerd moeten worden. Wel dat er te weinig plekken zijn waar je gewoon even mag zijn. Daarom maakte ik deze ruimte en ontvang ik je er graag.
  - *Natalie Vandervoort* (signature, Cormorant italic)
  - ⚠️ This personal text is sample copy; Natalie still has to approve it.
- Animation: the photo reveals bottom-up (`clip-path: inset(100% 0 0 0)` → 0, slight scale 1.06 → 1), then label, title, text, signature.

### 06 · The invitation (`id="invitation"`)
- Warm ivory gradient, soft clay glow.
- Image: `door.avif` = the glowing opening of the dome with the orange lamp, in an **arch** (`border-radius: 999px 999px 2px 2px`), warm shadow. The reveal clip leaves room so the shadow isn't cut off.
- Desktop: text left, arch right. Phone/tablet portrait: arch on top.
- Copy:
  - h2: **Misschien is dit iets** *voor jou.*
  - Sommige ervaringen laten zich moeilijk in woorden vatten. Je ontdekt pas wat ze voor jou betekenen wanneer je ervoor openstaat.
  - Button: **Afspraak maken** → `/booking`
- Button style (`CtaLink`): clean outline (1px bronze), 14px, pill, min height 44px; soft copper **pulse ring** every ~3.2s; on hover/focus dark bronze fills from left to right, text turns ivory, arrow `→` slides in.
- Footer at the bottom of the scene: *Natalie Vandervoort* · `[LOCATIE]` · `[CONTACTGEGEVENS]`.
- Animation: the arch reveals, then title, text, button.

### Booking page (`/booking`)
- Header: wordmark + "← Terug".
- Left: h1 **Afspraak** *maken*, `[KORTE INTRO OVER DE AFSPRAAK]`, definition list Locatie / Duur / Prijs / Contact with placeholders.
- Right: card with the **Google Calendar appointment schedule** (embed URL in env var `PUBLIC_BOOKING_URL`; without it, a tidy placeholder card).
- Phone: stacked.

---

## Responsive

Test at least: 320×568, 390×844, 768×1024, 834×1194, 1024×1366 (portrait), 1024×768, 1280×720, 1920×1080, 844×390 (phone landscape).

- Stages are `100lvh` so they stay full screen when Safari's toolbars collapse; their content sits in `.frame` (`100svh`) so nothing hides behind the toolbars. No max height.
- **Phone** (`≤ 559px`, or `≤ 820px` and taller than 520px): stacked, left aligned.
- **Tablet portrait** (600–1100px and portrait): stacked like phone, but larger type, 8–12vw margins.
- **Phone landscape** (`≥ 560px` wide and `≤ 520px` high): desktop layout with compact, `vh`-based type and smaller images.
- **Short phones** (`≤ 700px` high, e.g. iPhone SE): extra compact; nothing may overlap or fall off screen.

---

## Quality & accessibility

- `prefers-reduced-motion: reduce` → no pinning/scrub, everything visible in its final composition, no pulse, no equalizer, no intro.
- Without JavaScript: the page is fully readable (final composition, normal flow). `html.motion` is only set from `<head>` when motion is allowed; a safety timeout removes it if the scene script never loads.
- Real `<a>`/`<button>`, visible focus style (copper outline), touch targets ≥ 44px.
- Decorative images/SVG `aria-hidden`; portrait with a label.
- Performance: hero image preloaded, the rest lazy; only animate `transform`/`opacity` (no live filters, blur or blend modes during scroll — they made the prototype stutter); Lighthouse ≥ 95 on all four.
- Safari bars: `viewport-fit=cover`; each scene has `data-tint`, and `scripts/scenes/tint.ts` sets `--tint` (page background) + `theme-color` to the scene on screen. Pages pass `tint` to `Base`.
- SEO: `lang="nl"`, title + meta description, canonical, Open Graph image (hero). Set `SITE_URL` once the domain is known.

---

## Open items (keep the placeholders)

- Real portrait photo of Natalie
- Approval of the personal text (scene 05)
- Booking page: intro, location, duration, price, contact
- Google Calendar appointment schedule URL
- Natalie's confirmation that the dome may be shown and that the copper palette is right
- Domain name
- Higher-resolution `door.avif` (currently 330×490, soft on retina screens)

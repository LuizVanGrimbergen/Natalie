# Natalie — website

A story of five full-screen scenes, one scroll or swipe per screen, plus a separate booking page, for Natalie Vandervoort.
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
| Animation | **GSAP** (core only) | Cross-browser (incl. Safari), timelines, transform/opacity only |
| Navigation | Own gesture handling (`scripts/scenes/input.ts`) | One wheel/trackpad gesture or swipe = exactly one step |
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
    SiteHeader.astro                # wordmark + one link; on the story it fades out after the hero
    CtaLink.astro                   # outline pill button with pulse + hover fill
    NextCue.astro                   # "next" cue: round button, self-drawing arrow, pulse ring, Scroll/Swipe
    EdgeFade.astro                  # photo scenes fade into one flat color at top/bottom (Safari's bars)
    SiteFooter.astro                # name · location · contact, below the story (not part of a scene)
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
    index.ts                        # initScenes(): builds every scene + crossfade, picks the mode
    navigation.ts                   # one step per screen: crossfade, then the build plays in time; footer, links, focus
    input.ts                        # wheel / touch / keys → single steps (trackpad momentum = still one step)
    cue.ts                          # shows/hides the NextCue, light or dark per scene
    dom.ts                          # query helpers
    tweens.ts                       # build() + rise/fade/unveil/draw, prime
    transition.ts                   # crossfade between scenes
    tint.ts                         # Safari bar color, tweened together with the crossfades
    hero.ts, listening.ts, perspectives.ts, welcomes.ts, invitation.ts   # one relative timeline per scene
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
| `copper-300` | `#D49A72` | accent on dark (next cue pulse) |
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

Each scene is a **full-screen stage** (`100lvh`, content in a `100svh` frame). The page itself doesn't scroll: the scenes lie on top of each other (`position: fixed`) and `navigation.ts` moves from one to the next. Build durations (`BUILD` in `navigation.ts`): hero 1.8s, wooden room 2.2s, perspectives 2.6s, Natalie 1.8s, invitation 1.8s.

### Transitions between scenes
- **No slide.** The next scene **dissolves in place** over the previous one: the new stage fades 0 → 1, the previous stays and dims. Forward 0.9s (`FADE`), back 0.6s (`BACK`).
- Dark transitions (hero → wood → perspectives): true crossfade; the previous dims to warm dark brown (`radial-gradient(#2A1E16, #120D0A)`, max opacity ~.55).
- Light transitions (perspectives → Natalie → invitation): the previous first fades to ivory (0–55% of the transition), then the new one appears (40–100%), so texts never overlap.
- All content of a scene is fully built **before** the next scene starts dissolving in.

### One step per screen (desktop and touch alike)
- **One scroll gesture, swipe, or arrow/Page key = one screen.** A trackpad flick with momentum still counts once (`input.ts`: a gesture ends after 180ms without wheel events).
- A step forward crossfades to the next scene, then its build **plays by itself**, so every screen is shown complete. Step back returns to the earlier scene as it was left.
- A step asked for while one is still playing is **not ignored**: the running one speeds up ×3, finishes, and the next follows (`HURRY`).
- The hero completes its sentence by itself after the load intro.
- **Next cue** (`NextCue.astro`, bottom center, on every scene except the last): a round outline button with an arrow that draws itself downwards (like the notes' lines) and a soft copper pulse ring (like the CTA), plus the label **Scroll** (mouse) / **Swipe** (touch). It appears with a small rise once a screen is **complete** and hides as soon as the next step starts; clicking it is a step too. Ivory on dark scenes, bronze on light ones. Every scene but the last keeps 72px free at the bottom of its frame for it.
- A last step after the invitation slides the footer up over its bottom edge. On short screens the invitation's content moves up just enough to keep the button clear (`data-footer-clear` / `data-footer-shift`), fading out softly under the top edge so that edge stays ivory. The header fades out after the hero.
- Links to `#invitation` (header link, or opening the page with the hash) dissolve straight to the finished scene; keyboard focus on a later scene (Tab to the button) brings it on screen.
- Scenes under the one on screen pause their CSS loops (`data-offstage`), so the browser only works on what is visible.
- The scene timelines are relative (positions 0–1); `navigation.ts` gives them their duration.

### Header (not sticky; fades out after the hero)
- Left: wordmark *Natalie* (Cormorant italic).
- Right: link **"Kom het zelf ontdekken →"** to `#invitation`; lands on the finished invitation scene.

### 01 · Hero — wonder
- Image: `hero.avif` (the copper dome in the forest), full screen, `object-fit: cover`.
- Copy:
  - (top left, large) **Niet alles wat je raakt,**
  - (bottom right, large, italic) **kun je meteen begrijpen.**
  - (bottom left, small) Soms begint een nieuw perspectief met luisteren naar wat je voelt.
  - Semantically one `<h1>`: "Niet alles wat je raakt, kun je meteen begrijpen." (visually split, `aria-hidden` on the visual parts).
- On load (time-based, CSS): the dome is visible at dusk, the photo drifts slowly, a warm copper glow breathes on the dome, and line 1 fades in word by word. The comma leaves the sentence open; it completes itself a moment later.
- Then (time-based, ~1.2s after load): the dusk lifts, the photo zooms out from `scale(1.22)` → 1, a warm glow comes up, then line 2 and the subtext rise (fade + 48px rise).
- The next cue (see above) appears once the sentence is complete.

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
- Visual: SVG with **two lines that end in a pair of eighth notes**. The lines **draw themselves** (stroke-dashoffset over each path's real length — never `pathLength="1"`, GSAP rounds that to a jump):
  1. Copper line (`#9C5530`) draws, hesitates, makes a loop → note head → stem.
  2. Then a clay line (`#C88F80`) walks alongside without touching the first → second note head → stem.
  3. Finally a **beam** joins both notes.
  Meaning: two separate voices sounding together = guiding without fixing. Each stroke draws at an even pace (no glide, no swelling, no floating).
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
- Ivory with a warm band in the middle (plain ivory at the top and bottom edges, for Safari's bars), soft clay glow.
- Image: `door.avif` = the glowing opening of the dome with the orange lamp, in an **arch** (`border-radius: 999px 999px 2px 2px`), warm shadow. The reveal clip leaves room so the shadow isn't cut off.
- Desktop: text left, arch right. Phone/tablet portrait: arch on top.
- Copy:
  - h2: **Misschien is dit iets** *voor jou.*
  - Sommige ervaringen laten zich moeilijk in woorden vatten. Je ontdekt pas wat ze voor jou betekenen wanneer je ervoor openstaat.
  - Button: **Afspraak maken** → `/booking`
- Button style (`CtaLink`): clean outline (1px bronze), 14px, pill, min height 44px; soft copper **pulse ring** every ~3.2s; on hover/focus dark bronze fills from left to right, text turns ivory, arrow `→` slides in.
- Footer (`SiteFooter`) **below** the invitation scene, in normal flow: *Natalie Vandervoort* · Schoten · `[CONTACTGEGEVENS]`.
- Animation: the arch reveals, then title, text, button.

### Booking page (`/booking`)
- Header: wordmark + "← Terug".
- Left: h1 **Afspraak** *maken*, `[KORTE INTRO OVER DE AFSPRAAK]`, definition list Locatie (Schoten — town only, no street address) / Duur / Prijs / Contact with placeholders.
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

- `prefers-reduced-motion: reduce` → no step navigation, a normal scrolling page, everything visible in its final composition, no pulse, no equalizer, no intro.
- Without JavaScript: the page is fully readable (final composition, normal flow). `html.motion` is only set from `<head>` when motion is allowed; a safety timeout removes it if the scene script never loads.
- Real `<a>`/`<button>`, visible focus style (copper outline), touch targets ≥ 44px.
- Decorative images/SVG `aria-hidden`; portrait with a label.
- Performance: hero image preloaded, the rest lazy; only animate `transform`/`opacity` (no live filters, blur or blend modes during animation — they made the prototype stutter); Lighthouse ≥ 95 on all four.
- Safari bars (around the camera and the toolbar) must change **together with the screen**, never ahead of it. `viewport-fit=cover`; `scripts/scenes/tint.ts` tweens `--tint` (page background) + `theme-color` with the same duration and ease as each crossfade.
  - `data-tint` on each scene = the measured color of its **top edge** when finished (hero `#12100D`, wooden room `#120A05`, ivory scenes `#F5F1E9`).
  - Safari never paints a photo under its bars, so photo scenes (hero, wooden room) fade into one flat color at their top and bottom edge with `<EdgeFade color>`; that color **is** the scene's `data-tint`. Light scenes are flat ivory at the edges already.
  - Safari also samples the background of fixed elements at the screen edges, so every `.scene` has `background-color: var(--tint)` (its stage covers it). Light scenes keep **plain ivory at the top and bottom edge** (scene 06's warm gradient sits in the middle; the footer and the booking page are ivory too). Nothing may cast a shadow into the screen edges.
  - A scene that arrives in another color and then lifts (perspectives: copper-brown → ivory) also has `data-tint-enter` and `data-tint-lift` (where the lift ends in its build timeline; keep in sync with the scene's `.ts`). The bars then follow the build frame by frame.
  - Pages pass `tint` to `Base` for the first paint (default `#12100D`, the hero's edge).
- Security: static site, no forms, cookies or user data. Security headers (CSP, HSTS, nosniff, frame-ancestors, Referrer- and Permissions-Policy) live in `vercel.json`. No inline scripts (the motion/mode check is `public/motion.js`), so `script-src` stays `'self'`; `style-src` allows inline because of `style` attributes (`z-index`, `--i`, `--tint`) and Astro's inlined styles. A new external service (e.g. analytics) must be added to the CSP. The booking embed is allowed via `frame-src https://calendar.google.com`.
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

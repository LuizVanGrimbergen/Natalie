# Natalie — website

A story of seven scenes (eight full screens: scene 04 takes two), one scroll or swipe per screen, plus a separate booking page, for Natalie Vandervoort.
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
| Visitor stats | **Vercel Web Analytics** (`@vercel/analytics`, `<Analytics />` in `Base`) | Cookieless (no consent banner), same-origin script, visitors / referrers / countries / devices / UTM. Each scene reached counts once per visit as a page `/scene/<name>` (`track.ts`), so the Pages list shows how far people get; `/booking` shows who clicked through. Time per scene would need custom events (Pro plan). |
| Booking | **Cal.com** (free plan) | One event type per session, set in `PUBLIC_CAL_SOUNDROOM` / `PUBLIC_CAL_COACHING` as `<username>/<slug>`. Inline embed on `/booking` (`scripts/booking/cal.ts`), dark, in the site's copper; the chosen number of people prefills the booking question `personen`. Payments (Stripe, or Mollie via another route) come later |
| Hosting | Vercel (preview links for the client) or own VPS via Ploi | Static output (`astro build`) |

No UI framework. If interactivity is ever needed: an Astro island.

---

## Structure

```
src/
  layouts/Base.astro                # <html>, fonts, meta/OG, sets html.motion (or not) before paint
  pages/
    index.astro                     # the story: header + the seven scenes (eight screens), starts the scene script
    booking.astro                   # booking page
  components/
    SiteHeader.astro                # the navbar: wordmark, story links, Afspraak maken; hamburger menu below 900px
    CtaLink.astro                   # outline pill button with pulse + hover fill
    NextCue.astro                   # "next" cue: a mouse with a rolling wheel (pointer) or two chevrons (touch)
    ProgressRail.astro              # one dot per screen on the right edge, a pill on the one on show
    EdgeFade.astro                  # photo scenes fade into one flat color at top/bottom (Safari's bars)
    SiteFooter.astro                # name · location · contact, below the story (not part of a scene)
    NotesSvg.astro                  # the two lines + eighth notes (scene 05, coaching)
    scenes/
      Hero.astro                    # 01
      Shape.astro                   # 02 the net folds into the dome (canvas; static SVG without JS)
      Listening.astro               # 03 wooden room
      Elements.astro                # 04 three elements: the title screen, then ElementsList
      ElementsList.astro            # 04 the three elements together on one screen
      Coaching.astro                # 05 coaching: lines + music notes
      WhoWelcomes.astro             # 06 Natalie
      Invitation.astro              # 07 invitation + footer
    booking/
      BookingVisual.astro           # photo band on top: title + one line of facts
      SectionLabel.astro            # small label above each part
      BookingCalendar.astro         # the chosen session's Cal.com booker, or a placeholder
      Sessions.astro                # pick a session (two plain rows)
      People.astro                  # number of people (segmented 1–3), total, the copper button
      sessions.ts                   # the two sessions: name, text, duration, price, Cal.com link; friends discount, max people
      GoodToKnow.astro              # "Goed om te weten": practical and safety notes, folded
  scripts/site-menu.ts              # closes the hamburger menu (link, Escape); html.menu-open pauses the story's steps
  scripts/theme.ts                  # the light/dark switch: stores it, re-tints, fires themechange
  scripts/booking/
    cal.ts                          # loads Cal.com's embed once a session is chosen; one booker per session × people, in the booking page's colors
  scripts/scenes/
    index.ts                        # initScenes(): builds every scene + crossfade, picks the mode
    navigation.ts                   # one step per screen: crossfade, then the build plays in time; footer, links, focus
    input.ts                        # wheel / touch / keys → single steps (trackpad momentum = still one step)
    cue.ts                          # shows/hides the NextCue, light or dark per scene
    progress.ts                     # builds the rail's dots, moves its pill with every step
    track.ts                        # counts each reached scene once per visit as /scene/<name> (Vercel Web Analytics)
    dom.ts                          # query helpers
    tweens.ts                       # build() + rise/fade/unveil/draw, prime
    transition.ts                   # crossfade between scenes
    enter.ts                        # shape → wooden room: stepping into the dome instead of a crossfade
    gather.ts                       # 04 title → list: the title shrinks into the head of the next screen
    tint.ts                         # Safari bar color, tweened together with the crossfades
    hero.ts, shape.ts, listening.ts, elements.ts, list.ts, coaching.ts, welcomes.ts, invitation.ts   # one relative timeline per scene
    fold/geometry.ts                # rhombic triacontahedron + its flat net, folding and projection (pure math, also used at build time)
    fold/shade.ts                   # face, seam and hinge colors (copper panels, aluminium seams, like hero.avif)
    fold/draw.ts                    # draws one frame of the fold on a canvas
    fold/follow.ts                  # the closed dome turns gently towards the mouse (fine pointers only)
  styles/
    global.css                      # imports only
    tokens.css                      # design tokens (@theme)
    theme.css                       # light/dark theme variables (html[data-theme]) + --on-screen (html[data-surface])
    base.css                        # base elements, .display / .label, reduced motion
    scenes.css                      # scene/stage pinning mechanics, exit dims
  assets/                           # hero.avif, interior.avif, door.avif, booking.avif
```

Conventions: one component per file; styles live scoped in the component that owns them; global CSS only for tokens, base and shared scene mechanics. Animated elements are found via `data-*` attributes (`data-scene`, `data-reveal="n"`, `data-unveil`, …), never via styling classes.

---

## Design tokens

**One mood per theme.** Dark: every screen of the story without a photo, and the footer, is flat `wood-950` with ivory text and copper accents, so it flows into the two photo scenes; the booking page is the same wood brown (`night-*` tokens, see Booking page). Within a theme, never mix light and dark backgrounds on flat screens. Warmth comes from soft copper glows in the middle of a screen, never at its edges.

**Light theme** (**the default**; the navbar's switch flips to dark, the visitor's choice is stored in `localStorage`; without JS the CSS default, dark, shows): every flat screen, the footer, the navbar menu and the booking page turn ivory with bronze text and `copper-700` accents. The photo scenes (hero, wooden room) and the booking page's photo band look **exactly the same in both themes**: the dark wood filter, ivory words, dark edges and bars. Tried and rejected: an ivory veil (milky), ivory text glows, a brown filter (muddy, see-through). Don't tint the photos per theme. All colors of flat screens and shared components come from the theme variables in `styles/theme.css` (`--page`, `--page-booking`, `--surface`, `--fg`, `--fg-soft`, `--fg-muted`, `--accent`, `--line`, `--outline`, `--dim`, notes, portrait …), swapped by `html[data-theme='light']` — never hard-code ivory or wood in them. `public/theme.js` (blocking in `<head>` on every page) sets the theme before first paint; `scripts/theme.ts` runs the switch and fires `themechange` (the story re-tints, the Cal.com booker redraws in its light theme). `html[data-surface]` (light / dark, from the bar color in `tint.ts`) tells the navbar and the next cue which screen is on show, so they are ivory over dark screens and photos, bronze over light ones (`--on-screen`).

Colors (tuned to the dome: bronze, copper, wood, ivory):

| Token | Hex | Use |
|---|---|---|
| `bronze-950` | `#12100D` | hero night (its edge color) |
| `bronze-900` | `#1E1712` | button text on its ivory hover fill |
| `wood-950` | `#120A05` | background of every flat screen of the story |
| `night-950` / `night-900` / `night-800` | `#120A05` / `#1F150D` / `#2E2016` | booking page: page (the wood brown), cards, the chosen number |
| `copper-300` | `#D49A72` | the accent: italic accent words, copper labels, line 1, pulses, focus outline |
| `clay` | `#C88F80` | second line / note (the guide) |
| `ivory` | `#F5F1E9` | text |
| `aluminium` | `#A7ADB0` | small labels, footer, placeholder notes |

Typography:
- Display: **Cormorant Garamond 300**, `letter-spacing: -0.02em`, large titles with `clamp(...)`.
- **Every scene title has one italic accent in `copper-300`** (e.g. *meeluistert.*, *even stil te staan.*, *jouw manier.*). Keep this consistent.
- Body: **Figtree 300/400**, 17–18px desktop, 15–16px phone, `line-height` 1.6–1.75.
- Labels: 12px, `letter-spacing: .34em`, uppercase.
- Contrast: all text at least 4.5:1 (3:1 from 24px). Text on images gets a soft dark scrim + text-shadow.

---

## Scenes (in order; Dutch copy used VERBATIM)

Each scene is a **full-screen stage** (`100lvh`, content in a `100svh` frame). The page itself doesn't scroll: the scenes lie on top of each other (`position: fixed`) and `navigation.ts` moves from one to the next. Build durations (`BUILD` in `navigation.ts`): hero 1.8s, shape 3.2s, wooden room 2.2s, elements 1.6s, list 2.6s, coaching 2.6s, Natalie 1.8s, invitation 1.8s.

### Transitions between scenes
- **No slide.** The next scene **dissolves in place** over the previous one: the new stage fades 0 → 1, the previous stays and dims. 0.9s both ways (`FADE`); the footer slides back down in 0.6s (`BACK`).
- Every transition is the same true crossfade; the previous dims to warm dark brown (`radial-gradient(#2A1E16, #120D0A)`, max opacity ~.55).
- **Exceptions:** title → list of scene 04 (`gather.ts`, see 04), and **shape → wooden room** (`enter.ts`, 1.6s; a scene's own way in is a `wayIn(seconds)` timeline from `transition.ts`, which `navigation.ts` reads for its length and to mirror it on a step back). The photo is the inside of the dome, so the camera steps into it: the text gives way, the closed dome grows towards you (×6, turning a little) until its copper fills the screen, and inside it the room fades in, still zoomed in and dark; its own build then zooms out. Transform/opacity only. Stepping back is the mirror (you step out of the dome) and the shape comes back finished, without folding again.
- All content of a scene is fully built **before** the next scene starts dissolving in.

### One step per screen (desktop and touch alike)
- **One scroll gesture, swipe, or arrow/Page key = one screen.** A trackpad flick with momentum still counts once (`input.ts`: a gesture ends after 180ms without wheel events — or as soon as the direction flips, or a fresh push makes the dying momentum grow again, so scrolling back the other way right away always works).
- A step forward crossfades to the next scene, then its build **plays by itself**, so every screen is shown complete. A step back is the mirror image: the earlier scene dissolves back in and **builds itself again**.
- A step asked for while one is still playing is **not ignored**: the running one speeds up ×3, finishes, and the next follows (`HURRY`); up to 3 quick steps are remembered (`QUEUE`).
- The hero completes its sentence by itself after the load intro.
- **Progress rail** (`ProgressRail.astro` + `progress.ts`, fixed on the right, vertically centred): one dot per screen; a small outlined pill glides to the screen on show with the crossfade (0.9s), screens already seen stay full, the ones to come are faint, so you see how far along you are. An indicator only (`aria-hidden`, no clicks). Phones: smaller, 9px from the edge, clear of the text.
- **Next cue** (`NextCue.astro`, bottom center, on every scene except the last), without words, as on professional story sites: a small mouse outline whose wheel rolls down (pointer), or two chevrons that light up one after the other (touch). Transform/opacity only. (Replaced: a round button with an arrow and a pulse ring, then a Scroll/Swipe label over a hairline.) It appears with a small rise once a screen is **complete** and hides as soon as the next step starts; clicking it is a step too. Ivory over dark screens, bronze over light ones. Every scene but the last keeps 72px free at the bottom of its frame for it.
- A last step after the invitation slides the footer up over its bottom edge. On short screens the invitation's content moves up just enough to keep the button clear (`data-footer-clear` / `data-footer-shift`), fading out softly under the top edge so that edge stays flat wood.
- Links to a scene (`#start`, `#ruimte`, `#luisteren`, `#coaching`, `#natalie`, `#invitation` — the navbar and menu, or opening the page with the hash) go straight to it: a later scene dissolves in over the current one, an earlier one is uncovered (the scenes in between vanish underneath) and builds itself again. Keyboard focus on a later scene (Tab to the button) brings it on screen. While the hamburger menu is open the story doesn't step.
- Scenes under the one on screen pause their CSS loops (`data-offstage`), so the browser only works on what is visible.
- The scene timelines are relative (positions 0–1); `navigation.ts` gives them their duration.

### Navbar (`SiteHeader.astro`, fixed on every screen and page)
- Left: wordmark *Natalie* (Cormorant italic) → the hero (`#start`; `/` from other pages).
- From 900px: links **De ruimte · Luisteren · Coaching · Over Natalie** (14px, 78% ivory) and an outline pill **Afspraak maken** → `/booking`.
- Below 900px: a hamburger (two lines that turn into a cross) opens a full-screen menu in the page's own color, **everything centered**: the four links large in Cormorant in the middle of the screen, **Afspraak maken** as an outline pill (max 320px) at the bottom, within thumb's reach. It opens with a fade, a soft copper glow in the middle and the links rising one after the other (the button last); closing fades it out (`.is-closing`). It is a `<details>`, so it works without JS; `scripts/site-menu.ts` closes it on a link, the cross or Escape.
- Always (beside the hamburger on phones, after the links on desktop): the **light/dark switch**, a circle half filled that turns over; shown only when scripts run (`html.js`, set by `public/theme.js`).
- Colors follow the screen on show (`--on-screen`), not the theme: ivory over dark screens and photos, bronze over light screens.
- Its backdrop fades from the page color (`--tint`) at the very top to nothing, so the top edge stays the page's color for Safari's bar and the links stay readable over photos.
- On other pages (`base="/"`) the links lead back into the story (`/#coaching` …), which opens on that finished scene.

### 01 · Hero — wonder
- Image: `hero.avif` (the copper dome in the forest, daylight, 1448×1086), full screen, `object-fit: cover`.
- Copy:
  - (top left, large) **Niet alles wat je raakt,**
  - (bottom right, large, italic) **kun je meteen begrijpen.**
  - (bottom left, small) In een soundroom in Schoten kom je tot rust in muziek en stilte, of ga je met Natalie in gesprek. (says at once what she offers and where; keep it about three lines on a phone)
  - Semantically one `<h1>`: "Niet alles wat je raakt, kun je meteen begrijpen." (visually split, `aria-hidden` on the visual parts).
- On load (time-based, CSS): the dome is visible at dusk, the photo drifts slowly, a warm copper glow breathes on the dome, and line 1 fades in word by word. The comma leaves the sentence open; it completes itself a moment later.
- Then (time-based, ~1.2s after load): the dusk lifts, the photo zooms out from `scale(1.22)` → 1, a warm glow comes up, then line 2 and the subtext rise (fade + 48px rise).
- The next cue (see above) appears once the sentence is complete.

### 02 · The shape — the dome folds itself
(The original scene 02 stays removed; this is a new scene in its place.)
- Flat `wood-950`, a soft copper glow behind the dome (fading to flat wood well before the edges).
- Visual: the flat net of **30 rhombi** (Natalie's prototype, data from Paul Bourke) appears from the centre rhombus outward, then **folds itself** into the rhombic triacontahedron — the shape of the dome in the hero. The folds start at the centre and run out to the ends of the arms; a hinge glows `copper-300` only while it moves. Panels copper, lit from one side; seams aluminium; inner sides dark. Ends closed and still.
- Once closed (build finished, scene on show), the dome turns and tilts gently towards the mouse (`fold/follow.ts`, eased; back to rest when the mouse leaves the window). Real mouse only, nothing on touch.
- Drawn on a `<canvas>` (`fold/draw.ts`), driven by a proxy tween in `shape.ts`. Without JS / reduced motion: a static SVG of the closed dome, rendered at build time from the same `fold/geometry.ts`.
- Desktop: text left, dome right. Phone/tablet portrait: dome on top, text grouped at the bottom.
- Copy (sample, from Natalie's notes and the article — awaiting her approval):
  - label: DE RUIMTE
  - h2: **Een ruimte die** *meeluistert.*
  - Dertig ruiten vouwen samen tot één soundroom. Elke hoek en elk vlak bepaalt hoe het geluid beweegt, weerkaatst en uitdooft.
  - *Stilte is hier geen leegte. Het is structuur.* (italic, `copper-300`)

### 03 · The wooden room — listening
- Image: `interior.avif` = the inside of the dome looking up (light wooden rhombi meeting in a star, clean seams, 1086×1448 portrait; zoom origin on the star's centre).
- No visible lamp / no "sun".
- Scrim: dark wash along the edges and behind text for readability.
- Copy (desktop: spread out; phone/tablet portrait: title on top, the rest grouped at the bottom):
  - h2: **Soms hoef je alleen maar te luisteren.** (top left)
  - In een bijzondere geometrische ruimte, met speciaal op maat gemaakte luidsprekers, word je van alle kanten omringd door muziek. (bottom left)
  - Een ervaring die je niet hoeft te begrijpen, maar zelf kunt beleven. (right middle, right aligned)
  - *Geen afleiding, geen verwachtingen. Alleen de muziek en wat ze bij je oproept.* (bottom right, italic, larger)
- Animation: the image starts zoomed in `scale(1.4)` and dark → zooms out and brightens (a camera stepping inside). Texts appear one by one.

### 04 · Three elements — how a session goes, what music can do
Two screens, so it reads calmly without many steps: the title, then the three elements together. (Tried and rejected: three equal columns — read as a feature list; cards with icons — looked generic; one screen per element — too much scrolling.)
- `Elements.astro`: the title screen (`data-scene="elements"`, label + h2 + the one line, `elements.ts`), followed by `ElementsList.astro` (`data-scene="list"`, z-index 5, `list.ts`).
- **The two screens are one thought** (`gather.ts`, `wayIn(1.2)`): instead of a crossfade, the label above and the line under the title give way (every `data-gather-line`) and the title rises and shrinks into the head of the list screen (the same words, small, `data-gather-target`), landing as that screen dissolves in (the head is sized to wrap on the same words as the title, so the handover is invisible); then the three elements rise under it. Measured from the real positions (again on resize and once fonts load). Stepping back is the mirror.
- Flat `wood-950`, a soft copper glow in the middle of the list screen. **Text only, no icons, cards or numbers.**
- The list: each element's name large in Cormorant (h3, the noun as the italic copper accent: De *persoon.*, Het *geluidsveld.*, De *wisselwerking.*) with its one sentence; quiet hairlines between them; they rise slowly one after the other.
- Desktop: name left, sentence right, three rows. Phone/tablet portrait: name above sentence, the three under each other.
- Copy (sample, from Natalie's email — awaiting her approval):
  - label: HOE VERLOOPT EEN SESSIE?
  - h2: **Wat muziek** *met je kan doen.*
  - Je ligt in de soundroom en luistert, vijftig minuten lang. Je hoeft niets te doen of te bereiken: wat je hoort en wat het met je doet, is voor iedereen anders. Drie dingen spelen daarin samen. (The one concrete description of a session on the story: lying in the dome, 50 minutes, as in `sessions.ts`. Natalie's documents avoid the word *ontspanning*.)
  - **De persoon** — Jij, zoals je binnenkomt: je lichaam, je adem, de ruis in je hoofd, je vermoeidheid of alertheid.
  - **Het geluidsveld** — De muziek zelf: klank, ritme, frequenties, stilte, en hoe de ruimte ze draagt.
  - **De wisselwerking** — Wat er tussen jou en het geluid ontstaat: een adem die vertraagt, schouders die zakken, beelden, rust.

### 05 · Coaching — guiding, not fixing
The second half of what Natalie offers (beside the soundroom): a personal conversation. Its title mirrors scene 03 (*Soms hoef je alleen maar te luisteren.*).
- Flat `wood-950`; the lines start drawing right away, the text rises alongside.
- Visual: SVG with **two lines that end in a pair of eighth notes**. The lines **draw themselves** (stroke-dashoffset over each path's real length — never `pathLength="1"`, GSAP rounds that to a jump):
  1. Copper line (`#D49A72`) draws, hesitates, makes a loop → note head → stem.
  2. Then a clay line (`#C88F80`) walks alongside without touching the first → second note head → stem.
  3. Finally a **beam** joins both notes.
  Meaning: two separate voices sounding together = guiding without fixing. Each stroke draws at an even pace (no glide, no swelling, no floating).
- Layout: notes and text form one group, centred in the screen (desktop: side by side, max 1440px wide; tablet portrait: notes above the text, the drawing's empty top and bottom cropped). Phone keeps the notes running in from the left edge, text at the bottom; on the smallest phones (≤ 600px high) the notes stay out, the text needs the screen. Phone landscape: a wider text column.
- Copy (to the right of the notes on desktop; below the notes on phone/tablet portrait):
  - label: COACHING
  - h2: **Ruimte voor** *jouw verhaal.* (accent italic in copper)
  - Soms is het fijn om even stil te staan bij wat je bezighoudt. Om je gedachten uit te spreken, nieuwe inzichten te ontdekken of gewoon met iemand te praten die écht luistert.
  - Tijdens een persoonlijk gesprek met Natalie krijg je de ruimte om op jouw tempo te verkennen wat er speelt.
  - Zonder oordeel, zonder verwachtingen. Met oprechte aandacht voor jou en jouw verhaal. (appears together with the second line)
  - Button (`CtaLink`): **Plan een gesprek** → `/booking`
  - Copy as given by the client.

### 06 · Who welcomes you
- Flat `wood-950`, a soft warm copper light falling diagonally across the wall.
- Desktop: text left, portrait right (4:5). Phone/tablet portrait: small portrait on top, text below.
- Portrait: for now `booking.avif` (Natalie smiling in the opening of the soundroom, the booking page's photo), cropped 4:5 on her face, until there is a portrait of its own.
- Copy:
  - label: WIE JE ONTVANGT
  - h2: **Een plek om** *even stil te staan.*
  - Ik geloof dat niemand los staat van de relaties, ruimtes en ritmes waarin we leven. Toch zijn we vaak zo druk met alles om ons heen, dat we vergeten naar onszelf te luisteren. Daarom maakte ik deze plek: een ruimte waar je niets moet. Ik ontvang je graag, met een open blik en aandacht voor jouw verhaal. (Natalie's belief from her email, made warmer; no invented biography.)
  - *Natalie* (signature, Cormorant italic)
  - ⚠️ This personal text is sample copy; Natalie still has to approve it.
- Animation: the photo reveals bottom-up (`clip-path: inset(100% 0 0 0)` → 0, slight scale 1.06 → 1), then label, title, text, signature.

### 07 · The invitation (`id="invitation"`)
- Flat `wood-950` with a soft clay glow in the middle (flat wood at the top and bottom edges, for Safari's bars).
- Image: `door.avif` = the glowing opening of the dome with the orange lamp, in an **arch** (`border-radius: 999px 999px 2px 2px`), warm shadow. The reveal clip leaves room so the shadow isn't cut off.
- Desktop: text left, arch right. Phone/tablet portrait: arch on top.
- Copy:
  - h2: **Ervaar het op** *jouw manier.*
  - Je hoeft niet precies te weten wat je zoekt. Soms is even tijd voor jezelf al een mooi begin: in de soundroom, of in een gesprek met Natalie.
  - Button: **Ontdek de sessies** → `/booking`
- Button style (`CtaLink`): clean outline (1px ivory), 14px, pill, min height 44px; soft copper **pulse ring** every ~3.2s; on hover/focus ivory fills from left to right, text turns bronze, arrow `→` slides in.
- Footer (`SiteFooter`) **below** the invitation scene, in normal flow (flat wood, aluminium text): *Natalie Vandervoort* · Schoten · `[CONTACTGEGEVENS]`. With motion it is fixed above every scene (`z-index` 15; the scenes' own `z-index` is their DOM order, set in `initScenes`).
- Animation: the arch reveals, then title, text, button.

### Booking page (`/booking`)
Calm and mobile first: one column on every screen (centered, 560px from 700px wide). Its own quiet palette within the dark mood: wood-brown `night-950` page, plain `night-900` cards, `night-800` for the chosen number, ivory text, secondary text at 60% ivory. **Copper only for what you choose (the card's border) and the one button** — no badges, pills, icons, step numbers or tinted fills.
- Navbar as on the story (links lead back into it).
- **Photo band** (`BookingVisual.astro`): `booking.avif` (Natalie smiling in the wooden opening of the dome), `min(48svh, 420px)` on phones, `min(56svh, 560px)` wider; it looks the same in both themes, like the story's photos: flat wood (`wood-950`) at its top and bottom, ivory words, copper accent; in the dark theme it flows into the page, in the light theme the ivory page starts under it with a straight edge. (Tried and rejected: blooming the wood into ivory with a gradient — muddy.) On it: h1 **Afspraak** *maken* and one line: *50 minuten · Schoten · vanaf 18 jaar*.
- Each part has a small label (`SectionLabel.astro`: 12px, uppercase, 60% ivory).
- **Kies je sessie** (`Sessions.astro`): two plain rows (radio buttons, `name="session"`; no form, nothing is sent), each with a visible radio ring on the left (filled copper when chosen), the name in Cormorant, one line in 82% ivory, the price on the right. Until one is chosen the rows are outlined and one line above says *Tik op Soundroom of Coaching om verder te gaan.* Chosen: copper border and ring. Data in `sessions.ts` (names, durations, prices and discount are Natalie's, descriptions are sample):
  - **Soundroom** — €75 — Je ligt in de soundroom, omringd door muziek, en beleeft het op je eigen manier, zonder begeleiding.
  - **Coaching** — €65 — Ook in de soundroom, maar met Natalie erbij: na het luisteren een persoonlijk gesprek over wat er speelt.
  (Both take place in the soundroom: alone you experience it yourself, with coaching Natalie is there and you talk afterwards.)
- **Aantal personen** (`People.astro`): segmented 1 · 2 · 3 (`MAX_PEOPLE`, 1 preselected), greyed out and disabled with *Kies eerst een sessie.* until a session is chosen (a small script sets `disabled`; without JS only the CSS greys it). The buttons 2 and 3 carry the friends discount, *−10%* (`FRIENDS_DISCOUNT`), as a small line under the number; no prices on the buttons. Plain muted text, no badges. Then **Totaal**: *Kies een sessie* until one is chosen, then the amount (Cormorant, 32px) with the regular price struck through beside it for groups (~~€225~~ €202,50). Then the one copper button **Kies een moment** (`#moment`), shown once a session is chosen; while no session has a Cal.com link it reads **Neem contact op om af te spreken** instead. Generated `:has()` rules, no JS.
- **Moment** (`BookingCalendar.astro` + `scripts/booking/cal.ts`): shown once a session is chosen; the **Cal.com booker** of that session, inline, dark, with Cal.com's CSS variables set to the same night palette and copper (`month_view`); from 700px it breaks out of the column (max 960px) so month and times sit side by side. embed.js loads only once a session is chosen and is awaited, then only the latest choice is drawn; every session × people combination gets its own Cal.com namespace (Cal.com keeps one inline booker per namespace), with `personen` prefilled. Without Cal.com links: a short placeholder (*De online agenda volgt binnenkort. Neem tot dan contact op met Natalie om af te spreken.*); without JS: plain links to cal.com.
- **Goed om te weten** (`GoodToKnow.astro`): a folded `<details>` card at the end (17px title; the notes 16px in 82% ivory with hairlines between them, so they read easily), sample from Natalie's documents: Maximaal drie mensen tegelijk, geen schermen. · Er is altijd iemand in de buurt. Je kunt op elk moment stoppen, zonder uitleg. · Dit is geen therapie en vervangt die ook niet. Heb je meer nodig, dan zoeken we samen waar je terecht kunt. · We meten je hartslagvariabiliteit voor en na, om te leren wat de ruimte doet. Is er geen verschil, dan zeggen we dat ook. Under it: *Vragen vooraf?* `[CONTACTGEGEVENS]`.

---

## Responsive

Test at least: 320×568, 390×844, 768×1024, 834×1194, 1024×1366 (portrait), 1024×768, 1280×720, 1920×1080, 844×390 (phone landscape).

- Stages are `100lvh` so they stay full screen when Safari's toolbars collapse; their content sits in `.frame` (`100svh`) so nothing hides behind the toolbars. No max height.
- **Phone** (`≤ 559px`, or `≤ 820px` and taller than 520px): stacked, left aligned.
- **Tablet portrait** (600–1100px and portrait): stacked like phone, but larger type; `--gutter` is **10vw** there (`base.css`), used by every scene.
- **Desktop**: every scene (and the footer) uses one side margin, `--gutter` in `base.css`: `max(6vw, (100vw - 1240px) / 2)`, so all screens line up and on big screens the content stays in a centred 1240px column instead of hugging the left edge. The navbar stays at the screen edges.
- **Phone landscape** (`≥ 560px` wide and `≤ 520px` high): desktop layout with compact, `vh`-based type and smaller images.
- **Short phones** (`≤ 700px` high, e.g. iPhone SE): extra compact; nothing may overlap or fall off screen.

---

## Quality & accessibility

- `prefers-reduced-motion: reduce` → no step navigation, a normal scrolling page, everything visible in its final composition, no pulse, no next cue, no intro.
- Without JavaScript: the page is fully readable (final composition, normal flow). `html.motion` is only set from `<head>` when motion is allowed; a safety timeout removes it if the scene script never loads.
- Real `<a>`/`<button>`, visible focus style (copper outline), touch targets ≥ 44px.
- Decorative images/SVG `aria-hidden`; portrait with a label.
- Performance: hero image preloaded, the rest lazy; only animate `transform`/`opacity` (no live filters, blur or blend modes during animation — they made the prototype stutter); Lighthouse ≥ 95 on all four.
- Safari bars (around the camera and the toolbar) must change **together with the screen**, never ahead of it. `viewport-fit=cover`; `scripts/scenes/tint.ts` tweens `--tint` (page background) + `theme-color` with the same duration and ease as each crossfade.
  - `data-tint` on each scene = the measured color of its **top edge** when finished (every scene `#120A05`, the wood brown); flat scenes also have `data-tint-light="#F5F1E9"` for the light theme (`tintOf()` in `tint.ts`).
  - Safari never paints a photo under its bars, so photo scenes (hero, wooden room) fade into one flat color at their top and bottom edge with `<EdgeFade color>`; that color **is** the scene's `data-tint`. The other scenes are flat wood at the edges already.
  - Safari also samples the background of fixed elements at the screen edges, so every `.scene` has `background-color: var(--tint)` (its stage covers it). Every scene keeps **flat wood at the top and bottom edge** (glows sit in the middle; the footer and the booking page are flat wood too). Nothing may cast a shadow into the screen edges.
  - Pages pass `tint` to `Base` for the first paint (default `#120A05`); every page starts with a photo (dark in both themes), so `public/theme.js` only sets the theme, the story re-tints per scene.
- Security: static site, no forms, cookies or user data. Security headers (CSP, HSTS, nosniff, frame-ancestors, Referrer- and Permissions-Policy) live in `vercel.json`. No inline scripts (the motion/mode check is `public/motion.js`), so `script-src` stays `'self'`; `style-src` allows inline because of `style` attributes (`z-index`, `--i`, `--tint`) and Astro's inlined styles. Vercel Web Analytics loads from `/_vercel/insights` (same origin), so it needs no CSP change; `vite.build.assetsInlineLimit: 0` keeps Astro from inlining small scripts (which the CSP would block). Any other external service must be added to the CSP. Cal.com is allowed via `script-src https://app.cal.com` (embed.js), `frame-src https://app.cal.com` (the booker) and `font-src https://cal.com`.
- SEO: `lang="nl"`, title + meta description, canonical, Open Graph image (hero). Set `SITE_URL` once the domain is known.

---

## Open items (keep the placeholders)

- A portrait of Natalie of its own (scene 06 uses the booking photo for now)
- Approval of the personal text (scene 06) and of the new sample copy (scenes 02, 04 and 05, the booking texts and "Goed om te weten")
- Booking page: contact; the session descriptions; Natalie's Cal.com account with the two event types (`soundroom`, `coaching`: 50 min, location Schoten, required booking question identifier `personen` + an 18+ check), connected to her Google Agenda; payments later; confirm that the safety notes and HRV measuring apply
- The article places the room "behind an unassuming façade on a quiet street in Schoten"; the site says a dome in the forest — check with Natalie
- A project name (she tried *A Space for Sound*, *SŌNAR*, *SYNC∞ × OFFL*); for now the wordmark stays *Natalie*
- Natalie's confirmation that the dome may be shown and that the dark copper/wood palette is right
- Domain name
- Higher-resolution `door.avif` (currently 330×490, soft on retina screens) and `interior.avif` (1086×1448, upscaled on wide desktop screens)

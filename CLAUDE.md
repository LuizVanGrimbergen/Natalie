# Natalie — website

A story of five full-screen scenes, one scroll or swipe per screen, plus a separate booking page and a gift page, for Natalie Van Der Voort.
Natalie invites young people (18–35) to an experience of **immersive music inside a wooden, geometric dome in the forest**, followed by **personal guidance** (lying down inside the dome). She wants to help people discover their own perspective, **not "fix" them**.

> Build a beautiful story, not a commercial landing page.
> Less technology, more feeling. The technology should be invisible.

The original HTML prototype has been fully rebuilt in this codebase; **the code is now the source of truth** for layout, timing, colors and copy.

## Language

- **Everything is in English** — file names, folders, identifiers, ids, comments, docs.
- **Only the visitor-facing text on the website is Dutch** (copy, labels, page titles, alt/aria text). Copy is given below and must be used **verbatim**.
- **Never use the word "koepel"** in Dutch copy (site, meta, social posts). Say *soundroom*, *ruimte* or *geometrische ruimte* instead. ("Dome" in English code and docs is fine.)

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
| Visitor stats | None | Vercel Web Analytics was removed with the move to Netlify (Netlify's own analytics is paid). No cookies, no tracking. |
| Booking | Google Calendar appointment schedule | Embedded on `/booking` via `PUBLIC_BOOKING_URL` |
| Hosting | **Netlify**, free `*.netlify.app` subdomain to start (`netlify.toml`); later handed over to Natalie's own Netlify team | Static output (`astro build`); env vars `PUBLIC_BOOKING_URL`, `SITE_URL` |
| Music | Optional soundtrack (`data/sound.ts`, `SoundToggle.astro`, `scripts/sound.ts`) | Off by default, never autoplays, royalty-free only |

No UI framework. If interactivity is ever needed: an Astro island.

---

## Structure

```
src/
  layouts/Base.astro                # <html>, fonts, meta/OG, sets html.motion (or not) before paint
  pages/
    index.astro                     # the story: header + the five scenes, starts the scene script
    booking.astro                   # booking page
    gift.astro                      # gift voucher page (/gift)
  components/
    SiteHeader.astro                # wordmark + one link; on the story it fades out after the hero
    BookPill.astro                  # "Boek een sessie": small pill top right on the middle scenes, to /booking
    SoundToggle.astro               # optional music: round frosted button bottom right, off by default (renders only with a soundtrack)
    CtaLink.astro                   # outline pill button with pulse + hover fill
    NextCue.astro                   # "next" cue: round button, self-drawing arrow, pulse ring (no words)
    ProgressRail.astro              # one clickable dot per scene on the right edge, a pill on the one on show
    EdgeFade.astro                  # photo scenes fade into one flat color at top/bottom (Safari's bars)
    NotesSvg.astro                  # the two lines + eighth notes (scene 04)
    scenes/
      Hero.astro                    # 01
      Listening.astro               # 03 wooden room (02 was removed)
      Perspectives.astro            # 04 lines + music notes
      WhoWelcomes.astro             # 05 Natalie
      Invitation.astro              # 06 invitation (the end; no footer)
    booking/
      BookingIntro.astro            # title, intro, "Struikenlei, Schoten" + Maps link, the age (18–35)
      BookingSteps.astro            # the three steps (session, music, moment), one open at a time; holds the agenda
      BookingContact.astro          # Natalie's email and WhatsApp, below the calendar (mailto / wa.me links)
      BookingLegal.astro            # registered office + enterprise number, small, under the contact; renders only once both are filled in
      BookingCalendar.astro         # Google Calendar embed (per session) + full-screen link, or placeholder card
    gift/
      GiftIntro.astro               # label, title, lead, what the gift is ("Er staat geen leeftijd op")
      GiftCard.astro                # the voucher drawn as a ticket (hero photo, perforated seam), follows the choice
      GiftOrder.astro               # 1/2/3 personen, how it goes, order via WhatsApp (prefilled) or e-mail
  data/contact.ts                   # Natalie's email + phone, whatsapp(text?) link, address + Google Maps link, business (legal details); the one place they live
  data/gift.ts                      # voucher prices (35 + 25 per extra person, max 3), the order message + mailto
  data/sound.ts                     # the optional soundtrack path (public/audio/) + its credit/licence
  scripts/gift.ts                   # keeps the voucher and both order links in step with the number of people
  scripts/booking.ts                # the booking steps: open/fold, summaries, Wijzig, scroll + focus, agenda per session
  scripts/sound.ts                  # the sound toggle: fade in/out, pauses when the tab is hidden, "on" remembered per visit
  scripts/scenes/
    index.ts                        # initScenes(): builds every scene + slide, picks the mode
    navigation.ts                   # one step per screen: slide up, then the build plays in time; links, focus
    input.ts                        # wheel / touch / keys → single steps (trackpad momentum = still one step)
    cue.ts                          # shows/hides the NextCue, light or dark per scene
    progress.ts                     # builds the rail's dots (buttons), moves its pill with every step
    book.ts                         # shows/hides the "Boek een sessie" pill per scene, light or dark
    dom.ts                          # query helpers
    tweens.ts                       # build() + rise/fade/unveil/draw, prime
    transition.ts                   # slide up between scenes (slideUp, shown)
    tint.ts                         # Safari bar color, tweened together with the slides
    hero.ts, listening.ts, perspectives.ts, welcomes.ts, invitation.ts   # one relative timeline per scene
  styles/
    global.css                      # imports only
    tokens.css                      # design tokens (@theme)
    base.css                        # base elements, .display / .label, reduced motion
    scenes.css                      # scene/stage pinning mechanics, exit dims
  assets/                           # hero.avif, interior.avif, forest.avif, door.avif
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
| `ivory` | `#F5F1E9` | light base |
| `sand` | `#EAD3C2` | all text on dark screens and photos (soft beige, Natalie's choice) |
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
- **Slide up** (changed in November, on request; it used to be a dissolve in place): the next scene slides up from the bottom while the previous one moves up and out with it, like turning a page upward. 0.9s both ways (`FADE`), `power1.inOut`. A step back is the mirror: both slide down.
- `transition.ts` (`slideUp`): each scene element is moved only by the slide that brings it in (`yPercent` 100 → 0); the outgoing scene moves its `.stage` (0 → −100), so two slides never drive the same element. A jump back over several scenes (a dot on the rail) puts the earlier scene in place underneath and slides the one on screen down off it.
- The Safari bars follow how far the new scene has slid in (`shown()` in `transition.ts`).
- The `.exit-dim` layers in the scenes are left over from the dissolve and no longer used.
- All content of a scene is fully built **before** the next scene starts sliding in.

### One step per screen (desktop and touch alike)
- **One scroll gesture, swipe, or arrow/Page key = one screen (one dot), however hard the flick.** `input.ts`: a wheel gesture ends after 180ms without wheel events, or when the direction flips (so scrolling back works right away). A trackpad's momentum tail, which wobbles up and down for a second or more, never starts a new step (an earlier "fresh push" rule did, and one hard flick went 2–3 screens). A held key repeats: only the first press counts.
- A step forward slides the next scene up, then its build **plays by itself**, so every screen is shown complete. A step back is the mirror image: the earlier scene slides back down and **builds itself again**.
- **Nothing is queued** (changed in November, on request): input while a slide is still moving (0.9s) is ignored. A new gesture while the screen is only building its text finishes that build at once and moves on by one. Checked with a simulated hard trackpad flick (90 wheel events, swelling and fading): one flick, one dot, both ways.
- The hero completes its sentence by itself after the load intro.
- **Next cue** (`NextCue.astro`, bottom center, on every scene except the last): a round outline button with an arrow that draws itself downwards (like the notes' lines) and a soft copper pulse ring (like the CTA), without words. It appears with a small rise once a screen is **complete** and hides as soon as the next step starts; clicking it is a step too. Ivory on dark scenes, bronze on light ones. Every scene but the last keeps 72px free at the bottom of its frame for it.
- **Progress rail** (`ProgressRail.astro` + `progress.ts`, fixed on the right, vertically centred): one dot per scene; a small outlined pill glides to the screen on show with the slide (0.9s), screens already seen stay full, the ones to come faint. Each dot is a button (44px wide) that goes straight to its scene, forwards or back. Ivory on dark scenes, bronze on light ones.
- The invitation is the end: no footer, no name or contact (Natalie's choice). The header fades out after the hero.
- **Boek een sessie** (`BookPill.astro` + `scripts/scenes/book.ts`, added in November so whoever is ready doesn't have to go through the whole story): a small pill top right, from the second scene to the fourth, straight to `/booking`. Hidden on the hero (the header link is there) and on the invitation (its own button is). Frosted dark on dark scenes, ivory with a bronze outline on light ones, fading with the step. Without the step navigation (reduced motion, no JS) it shows once the hero has scrolled away and hides at the invitation.
- Links to `#invitation` (header link, or opening the page with the hash) go straight to the finished scene; keyboard focus on a later scene (Tab to the button) brings it on screen.
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
  - Een geometrische ruimte met unieke luidsprekers, en muziek die je van alle kanten omringt. (bottom left)
  - Een ervaring om te voelen (right middle, right aligned)
  - *Geen afleiding, geen verwachtingen. Alleen de klanken en wat ze in je oproepen.* (bottom right, italic, larger)
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
  - Een veilige plek om te verbinden met jezelf, te luisteren en te delen.
  - Als je behoefte hebt aan begeleiding, kan je ervoor kiezen om een coaching traject met Natalie op te starten. (appears together with the second line)

### 05 · Who welcomes you
- Ivory, soft window light on the wall (blurred diagonal patch of light).
- Desktop: text left, portrait right (4:5). Phone/tablet portrait: small portrait on top, text below.
- Portrait: the dome in the forest (`forest.avif`) stands in until there is a real photo of Natalie.
- Copy:
  - label: EEN LUISTEREND OOR
  - h2: **Ik ben er niet om je de weg te wijzen.** *Wel om de deur open te houden.* (second sentence italic in copper)
  - Ik geloof niet dat jonge mensen gerepareerd moeten worden. Wel dat er nood is aan veilige plekken waar ze gewoon even kunnen zijn. Daarom maakte ik deze ruimte en verwelkom ik hen er graag.
  - *Natalie Van Der Voort* (signature, Cormorant italic)
  - THE MEREON LEGACY (under the signature, small label in `muted`)
- Animation: the photo reveals bottom-up (`clip-path: inset(100% 0 0 0)` → 0, slight scale 1.06 → 1), then label, title, text, signature.

### 06 · The invitation (`id="invitation"`)
- Ivory with a warm band in the middle (plain ivory at the top and bottom edges, for Safari's bars), soft clay glow.
- Image: `door.avif` = the glowing opening of the dome with the orange lamp, in a calm 4:5 frame with a soft shadow (not the forest photo: that is scene 05's).
- Desktop: text left, photo right. Phone/tablet portrait: photo on top, aligned left (clear of the dots).
- Copy:
  - h2: **Misschien is dit iets** *voor jou.*
  - Je hoeft niet precies te weten wat je zoekt. Soms is even tijd voor jezelf al een mooi begin: in de soundroom, of in een gesprek met Natalie. Ervaar het op jouw manier.
  - A quiet practical line (15px, copper, lining numerals): **Soundroom vanaf €35 · Coaching €65**
  - Button: **Kies je sessie** → `/booking` (matches step 1 on the booking page)
  - The photo may still change (Natalie is still looking, perhaps something with music).
- Button style (`CtaLink`): clean outline (1px bronze), 14px, pill, min height 44px; soft copper **pulse ring** every ~3.2s; on hover/focus dark bronze fills from left to right, text turns ivory, arrow `→` slides in.
- Animation: the photo opens from the bottom, then title, text, button.

### Booking page (`/booking`)
The page that matters most, built phone-first. **One calm column on every screen** (max 720px, centred): intro, the three steps, contact. Booking goes through the agenda, not WhatsApp (meeting of November); WhatsApp and e-mail stay as contact. No form is sent from the site, no English version, no reviews (for now).

- Header: wordmark + "← Terug".
- **Intro** (`BookingIntro.astro`): h1 **Afspraak** *maken*, *Sommige ervaringen vragen geen woorden, maar ruimte.*, **Struikenlei, Schoten** (street without number, copper) + *Bekijk op Google Maps →* (under the street on phones; no embedded map), *Van 18 tot 35 jaar* (the whole site is for 18–35).
- **Three steps** (`BookingSteps.astro` + `scripts/booking.ts`), one open at a time, **nothing chosen at first**:
  - A progress line above them: three numbered dots *Sessie — Muziek — Moment* joined by lines; the step you are on has a copper ring, finished ones are filled copper (labels hidden under 360px).
  - Each step is a rounded card (18px) with a numbered circle and a Cormorant title. The open one is brighter with a soft shadow; steps still to come are there but faded (`is-locked`).
  - **1 Kies je sessie**: two tappable option cards: **Soundroom** — In verbinding gaan met klank & ruimte, op jouw tempo, zonder begeleiding. — **€35** · 50 minuten — **+ €25** per bijkomende persoon · max. 3 personen; **Coaching** — … met begeleiding van Natalie. — **€65** · 60 minuten. Prices in `copper-700`, Figtree lining numerals.
  - **2 Jouw muziek**: there is always music; the choice is who picks it. Two option cards (side by side from 600px): **Ik kies zelf liedjes** — *Geef bij het boeken de liedjes door die je graag wil horen (tot 13 liedjes).* (2 for coaching, following the session); **Ik kies liever niet** — *Natalie kiest de muziek voor je. Je hoeft niets voor te bereiden.* Folded summaries: *Eigen liedjes* / *Natalie kiest*.
  - **3 Kies een moment**: with own songs the line *Vergeet niet je liedjes door te geven in het formulier: tot 13 liedjes.* (2 for coaching); the Google agenda of the chosen session; *Open de agenda op volledig scherm ↗*; *Annuleren kan tot 24 uur op voorhand. Je betaalt met Bancontact.*
  - Option cards: whole card is the target, a radio stays in the page for keyboard and screen readers. Chosen: 2px copper outline, warmer background, the round mark fills copper and draws a tick. Hover: outline darkens; press: scales to .99.
  - **Soundroom: how many people** — once Soundroom is chosen, a panel under the cards: *Met hoeveel zijn jullie?* with a − **1** + stepper (48px buttons, 1 to 3, the ends disabled), *persoon/personen*, and *Totaal* **€35 / €60 / €85** (base €35 + €25 per extra person; `data-price`, `data-extra`, `data-max` on the radio). Coaching is one-on-one: no panel. The Google form can't take the number, so with 2 or 3 step 3 says *Vermeld in het formulier dat jullie met 2 komen.*
  - A choice **only marks the card**; **Volgende →** (dark pill, full width on phones, disabled until the step has a choice; only with JavaScript) opens the next step that still needs a choice. The finished step folds into one line: its title, what was chosen in copper (*Soundroom · 2 personen · €60*, *Eigen liedjes*), and **Wijzig** (on phones a small grid: number + title, the choice under the title, Wijzig on the right). Wijzig reopens that step; Volgende from there goes on to the first step still open, so with the music already chosen straight back to the agenda.
  - Hover styles only under `@media (hover: hover)`: on a phone a tapped button kept its tint.
  - Opening and folding animate by height (`grid-template-rows` 0fr ↔ 1fr, .45s); folded bodies are `inert`. While a step folds, the page height is held (`body` min-height) so it never shrinks under the view; the newly opened step then scrolls into view (`window.scrollTo`, capped at the page end), focus moves to its title, and a live region says *Stap n van 3*. Reduced motion: no animation, instant scroll.
  - ⚠️ Nothing in a step may stick out past its card: on a phone Chrome then widens the whole page (`innerHeight` jumped 844 → 925 with an earlier negative-margin summary), the view shifts and taps land ~80px too low.
  - Without JavaScript (`[data-booking-ready]` missing) every step is open and the agenda shows at once.
- **Agenda** (`BookingCalendar.astro`): Google Calendar appointment schedule, one per session (`PUBLIC_BOOKING_URL_SOUNDROOM` / `_COACHING`, each falling back to `PUBLIC_BOOKING_URL`), `hl=nl`, loaded only once step 3 opens. 720px high on desktop, 1180px on phones so the month and the times fit without the box scrolling by itself; rounded 12px.
- **Contact** below: nvandervoort@mereon.org (mailto) · WhatsApp +32 478 51 76 57 (wa.me, new tab); then the legal line (name · sociale zetel · ondernemingsnummer, 13px, `muted`): a Belgian self-employed person must show the business address — the registered office, never the home address. Natalie Van Der Voort · Paalstraat 149, 2900 Schoten · ondernemingsnummer BE 0882.177.881 (`business` in `data/contact.ts`; hidden if emptied).
- Animation on load (CSS only, `data-rise` + `--i` in `base.css`): intro, progress, the three steps and contact rise one after another.
- Checked with real touch taps (mobile emulation) at 320×568 and 390×844, and with a mouse at 1440×900: no sideways scroll, all targets ≥ 44px.

### Gift page (`/gift`)
Added in November on Natalie's request: a gift for December, "een experience kasootje", **with no age on it** (the sessions are 18–35; a voucher can go to anyone). Same calm 720px column and ivory background as the booking page; the site sends nothing, ordering goes through Natalie.
- Header: wordmark + "← Terug". Intro: label CADEAUBON, h1 **Geef een moment** *cadeau.*, *Geen spullen, maar ruimte. Om even te zijn.*, then: Een klankervaring in een geometrische ruimte midden in het bos: muziek die je van alle kanten omringt, vijftig minuten lang. Voor iemand die je graag ziet, alleen of samen. Er staat geen leeftijd op.
- The voucher (`GiftCard`, `aria-hidden`): a ticket with the hero photo left (on top on phones), a dashed seam with half-moon notches, *Cadeaubon*, *Een klankervaring* *in het bos.*, Soundroom · 50 minuten, *Voor 1 persoon* + price.
- **Voor hoeveel personen?** three option cards (1 persoon €35 · 2 personen €60 · 3 personen €85), one person chosen from the start so it works without JS; the card and the links follow the choice.
- How it goes (copper numbered circles): **Stuur Natalie een berichtje.** Ze maakt de bon op naam in orde, met jouw boodschap erbij als je wil. — **Geef hem door.** Digitaal, om door te sturen of af te drukken. — **Wie hem krijgt, kiest zelf een moment** in de agenda. De bon blijft een jaar geldig.
- **Bestel via WhatsApp →** (dark pill, wa.me with *Hoi Natalie, ik wil graag een cadeaubon geven voor de soundroom, voor 2 personen (€60).*) and *of per e-mail* (mailto, subject *Cadeaubon soundroom*). Then contact + legal line, as on /booking.
- Ways in: on the invitation scene *of geef het cadeau* beside the button; on /booking *Iemand anders verrassen? Geef een cadeaubon →* right under the age.
- ⚠️ Sample copy; validity (one year), payment and delivery still to be confirmed by Natalie.

---

## Responsive

Test at least: 320×568, 390×844, 768×1024, 834×1194, 1024×1366 (portrait), 1024×768, 1280×720, 1920×1080, 844×390 (phone landscape).

- Stages are `100lvh` so they stay full screen when Safari's toolbars collapse; their content sits in `.frame` (`100svh`) so nothing hides behind the toolbars. No max height.
- **Phone** (`≤ 559px`, or `≤ 820px` and taller than 520px): stacked, left aligned.
- **Tablet portrait** (600–1100px and portrait): stacked like phone, but larger type, the same `--gutter` (12vw) side margin.
- **Desktop**: every scene uses one side margin, `--gutter` in `base.css`: `max(12vw, (100vw - 1080px) / 2)`, so the text sits in a centred column (at most 1080px wide) instead of hugging the edges (no long left-to-right reading). The header stays at the screen edges.
- **Phone landscape** (`≥ 560px` wide and `≤ 520px` high): desktop layout with compact, `vh`-based type and smaller images; `--gutter` drops to 6vw.
- **Short phones** (`≤ 700px` high, e.g. iPhone SE): extra compact; nothing may overlap or fall off screen.

---

## Quality & accessibility

- `prefers-reduced-motion: reduce` → no step navigation, a normal scrolling page, everything visible in its final composition, no pulse, no next cue, no intro.
- Without JavaScript: the page is fully readable (final composition, normal flow). `html.motion` is only set from `<head>` when motion is allowed; a safety timeout removes it if the scene script never loads.
- Real `<a>`/`<button>`, visible focus style (copper outline), touch targets ≥ 44px.
- Decorative images/SVG `aria-hidden`; portrait with a label.
- Performance: hero image preloaded, the rest lazy; only animate `transform`/`opacity` (no live filters, blur or blend modes during animation — they made the prototype stutter); Lighthouse ≥ 95 on all four.
- Safari bars (around the camera and the toolbar) must change **together with the screen**, never ahead of it. `viewport-fit=cover`; `scripts/scenes/tint.ts` tweens `--tint` (page background) + `theme-color` with the same duration and ease as each slide.
  - `data-tint` on each scene = the measured color of its **top edge** when finished (hero `#12100D`, wooden room `#120A05`, ivory scenes `#F5F1E9`).
  - Safari never paints a photo under its bars, so photo scenes (hero, wooden room) fade into one flat color at their top and bottom edge with `<EdgeFade color>`; that color **is** the scene's `data-tint`. Light scenes are flat ivory at the edges already.
  - Safari also samples the background of fixed elements at the screen edges, so every `.scene` has `background-color: var(--tint)` (its stage covers it). Light scenes keep **plain ivory at the top and bottom edge** (scene 06's warm gradient sits in the middle; the booking page is ivory too). Nothing may cast a shadow into the screen edges.
  - A scene that arrives in another color and then lifts (perspectives: copper-brown → ivory) also has `data-tint-enter` and `data-tint-lift` (where the lift ends in its build timeline; keep in sync with the scene's `.ts`). The bars then follow the build frame by frame.
  - Pages pass `tint` to `Base` for the first paint (default `#12100D`, the hero's edge).
- Security: static site, no forms, cookies or user data. Security headers (CSP, HSTS, nosniff, frame-ancestors, Referrer- and Permissions-Policy) live in `netlify.toml`. No inline scripts (the motion/mode check is `public/motion.js`), so `script-src` stays `'self'`; `style-src` allows inline because of `style` attributes (`z-index`, `--i`, `--tint`) and Astro's inlined styles. `media-src 'self'` lets the soundtrack play from `public/audio/`; `vite.build.assetsInlineLimit: 0` keeps Astro from inlining small scripts (which the CSP would block). Any other external service must be added to the CSP. The booking embed is allowed via `frame-src https://calendar.google.com`.
- SEO: `lang="nl"`, title + meta description, canonical, Open Graph image (hero). Set `SITE_URL` once the domain is known.

---

### Sound toggle (story page)
- Optional music, decided in the November meeting: it must be royalty-free and easy to switch off. Set `soundtrack` in `data/sound.ts` (a file in `public/audio/`, ~128 kbps MP3) with its credit; empty = no button at all.
- `SoundToggle.astro`: a round frosted dark button (44px) bottom right, under the progress rail: that corner stays free on every scene, the invitation included (bottom left would cover its button on phones). A music note, crossed by a slash while off; `aria-label` *Geluid aan* / *Geluid uit*, `aria-pressed`, copper focus ring. Readable on dark and ivory scenes alike.
- `scripts/sound.ts`: never autoplays; a click fades it in over 1.5s (volume 0.6), another fades it out and pauses. Pauses while the tab is hidden. "On" is remembered for this visit (`sessionStorage`); after a reload the first gesture elsewhere on the page resumes it.
- Commercial songs (Hotel California live, the Interstellar soundtrack) need a licence: not without one.

## Open items (keep the placeholders)

- Real portrait photo of Natalie (photos and videos from the workshop approved; she is looking for a friendlier one)
- Booking page: intro, location, duration, price, contact
- Google Calendar appointment schedule URL
- Natalie's confirmation that the dome may be shown and that the copper palette is right
- Domain name
- Higher-resolution `door.avif` (currently 330×490, soft on retina screens)
- In Natalie's Google appointment schedule: turn off Google Meet, add the questions "Welke liedjes wil je horen?" and "Met hoeveel personen kom je?", and a second appointment schedule so Soundroom (50 min) and Coaching (60 min) each have their own (`PUBLIC_BOOKING_URL_SOUNDROOM` / `_COACHING`)
- The soundtrack (royalty-free) for the sound toggle
- Gift page: Natalie's approval of the copy, the validity (one year?), how a voucher is paid and delivered, and how a receiver mentions it when booking (e.g. a code in the Google form)
- Netlify subdomain, then hand-over to Natalie's account

# shared/deck: story-deck engine

A full-screen deck of real HTML slides that auto-advance like stories, each with its own 30 fps frame clock.
The engine owns sequencing, timing, input, URLs, chrome and accessibility. Your deck owns markup and CSS.
Reference deck: `src/` (the front page).

| File | Contents |
|---|---|
| `engine.js` | `createDeck(options)`, and re-exports from the two files below |
| `chrome.css` | chrome and slide base styles, skinned with `--deck-*` custom properties |
| `motion.js` | `interpolate`, `spring`, `Easing`, `clamp` (Remotion semantics, frame based) |
| `html.js` | `esc`, `kinetic`, `icon`, `initials`, `greetingFrom` |

## Minimal deck

`index.html`

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>Thore Caspersen</title>
  <link rel="stylesheet" href="/shared/deck/chrome.css">
  <link rel="stylesheet" href="/src/style.css">
</head>
<body>
  <noscript>This needs JavaScript. <a href="/thore-caspersen-cv.pdf">Download the CV (PDF)</a></noscript>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

`src/main.js`

```js
import { createDeck, esc, kinetic } from '../shared/deck/engine.js'
import { profile } from '../shared/data.js'

createDeck({
  slides: [
    {
      id: 'hello', title: 'Introduction', duration: 6, theme: 'light',
      render: (ctx) => `
        ${ctx.greeting ? `<p data-anim="up">${esc(ctx.greeting)}</p>` : ''}
        <h1 aria-label="${esc(profile.name)}"><span aria-hidden="true">${kinetic(profile.name, 4)}</span></h1>
        <p data-anim="up" data-at="20">${esc(profile.tagline)}</p>`,
    },
    {
      id: 'next', title: "Let's talk", duration: 4, theme: 'dark',
      render: () => `
        <h2 data-anim="pop">Let's talk</h2>
        <a href="${esc(profile.cvPdf)}" download>Download CV (PDF)</a>
        <button type="button" data-deck-action="replay">Replay</button>
        <button type="button" data-deck-action="profile">See full profile</button>`,
    },
  ],
  profile: () => `<button type="button" data-deck-action="deck">Back to the story</button><h1>${esc(profile.name)}</h1>`,
  photo: profile.photo,
  actions: [
    { href: `mailto:${profile.email}`, label: 'Contact' },
    { href: profile.cvPdf, label: 'Download CV (PDF)', short: 'CV (PDF)', icon: 'download', primary: true, download: true },
  ],
})
```

`style.css`

```css
body { margin: 0; overflow: hidden; font-family: system-ui, sans-serif; }
.deck { --deck-stage-bg: #000; }
.deck[data-theme='light'] { --deck-chip-bg: #111; --deck-chip-fg: #fff; --deck-seg-track: #0003; --deck-seg-fill: #111; --deck-hint: #333; }
.deck[data-theme='dark'] { --deck-chip-bg: #fff; --deck-chip-fg: #111; --deck-seg-track: #fff4; --deck-seg-fill: #fff; --deck-hint: #ccc; }
.deck-slide[data-theme='light'] { background: #f4f1ea; color: #111; }
.deck-slide[data-theme='dark'] { background: #111; color: #f4f1ea; }
.deck-profile { background: #f4f1ea; padding: 24px; }
```

## createDeck(options)

| Option | Type | Default | Meaning |
|---|---|---|---|
| `slides` | `Slide[]` | required | in order |
| `profile` | `(ctx) => html` | none | full-profile page, shown at `#profile` |
| `actions` | `Action[]` | `[]` | top-right chrome links (CV, contact) |
| `photo` | url | none | checked once with HEAD; if it is an image it fills every `img[data-deck-photo]` |
| `label` | string | `'Story'` | accessible name of the deck |
| `fps` | number | `30` | frame clock rate |
| `transition` | `'wipe'` `'fade'` `'cut'` or `(p, {cur, old, dir, bands}) => void` | `'wipe'` | slide change; `p` runs 0 to 1, `dir` is 1 forward, -1 back |
| `transitionFrames` | number | `18` | length of the transition |
| `hint` | string | engine text | bottom-bar hint |
| `kinds` | `{ name: (el, v, anim) => void }` | | extra `data-anim` kinds |
| `springs` | `{ name: { damping, stiffness, mass } }` | | extra `data-cfg` presets |
| `mount` | Element | `document.body` | where the deck is appended |
| `onChange` | `(index) => void` | | called after every slide change |

`Slide`: `{ id, title, duration, theme?, render(ctx), update?(frame, { el, reduced }) }`

- `id`: becomes `data-slide` on the slide element.
- `title`: used in segment labels and the hover preview.
- `duration`: seconds on screen before auto-advance.
- `theme`: becomes `data-theme` on the slide and on `.deck` while that slide is current.
- `render(ctx)` returns an HTML string or a Node. `ctx = { greeting, index, total, reduced }`. `greeting` is `''` or "Hi Acme team" from `?for=acme`.
- `update(frame, { el, reduced })` is optional and is called every frame while the slide is current. `frame` counts from 0 when the slide is entered and freezes while the user holds. Under reduced motion it is called once with `frame = 1e6` (final state). Keep it cheap.

`Action`: `{ href, label, short?, icon?, primary?, download?, external? }`. `short` replaces `label` below 640px.

Returns `{ root, greeting, reduced, index, go(i), next(), prev(), skip(), replay(), play(), pause(), showProfile(), showDeck(), preview(i) }`.

## Animating with attributes

Put these on any element inside a slide. The engine reads them once and paints them every frame until they settle.

| Attribute | Meaning |
|---|---|
| `data-anim` | `rise` `up` `down` `left` `right` `pop` `grow` `growY` `wipe` `count` `fade`, or a key from `kinds` |
| `data-at` | start frame (default 0) |
| `data-cfg` | spring preset: `soft` (default) `snappy` (default for rise) `bouncy` (default for pop), or a `springs` key |
| `data-len` | frames, for the eased kinds `grow` `growY` `wipe` `count` (default 22) |
| `data-to` | final number for `count`; put the same number in the element's text |

`rise` moves the element up from 112% of its own height, so give its parent `overflow: hidden`. `kinetic(text, at, stagger = 1.5)` builds that for you: one masked word per word and one rising letter per letter.
`grow` scales X from 0 (set `transform-origin`), `wipe` reveals left to right with `clip-path`, and `count` counts up.
The engine owns the inline `transform`, `opacity` and `clip-path` of animated elements; animate inner wrappers if you need your own transforms.

## Markup hooks

| Hook | Effect |
|---|---|
| `data-deck-action="replay"` / `"profile"` / `"deck"` / `"next"` / `"prev"` | buttons anywhere, including the profile page |
| `[data-deck-photo-slot]` with `img[data-deck-photo][hidden]` inside | the slot gets `.has-photo` and the img is shown when `photo` exists; style your fallback (a monogram via `initials(name)`) to hide under `.has-photo` |
| `data-deck-fit` | the font size shrinks until the element stops overflowing horizontally (use `white-space: nowrap` lines) |
| `data-deck-no-nav` | taps inside it do not change slides; links, buttons and inputs already don't |

## Skinning

Override these on `.deck`, per theme with `.deck[data-theme='x']`, because the chrome sits over every slide:
`--deck-pad --deck-top --deck-bottom --deck-font --deck-mono --deck-stage-bg --deck-chip-bg --deck-chip-fg --deck-primary-bg --deck-primary-fg --deck-seg-track --deck-seg-fill --deck-hint --deck-focus --deck-band-a --deck-band-b --deck-preview-bg --deck-preview-fg --deck-radius --deck-ease`.
`--deck-band-a` and `--deck-band-b` colour the two bands of the `wipe` transition; they are read from the incoming slide's theme.

Classes you can style: `.deck-slide` (a flex column with chrome-safe padding), `.deck-top`, `.deck-segs`, `.deck-seg`, `.deck-chip` (`.is-primary`), `.deck-pause`, `.deck-count`, `.deck-hint`, `.deck-preview`, `.deck-profile`.
State classes on `.deck`: `.is-paused`, `.is-held`, `.is-ended`, `.is-reduced`. `body.deck-profile-open` is set while the profile shows.

## What the engine already does

- Autoplay with per-slide durations; it stops on the last slide (no loop), and the pause button turns into Replay.
- Progress segments: buttons with aria-labels; hover or keyboard focus shows a preview card (number, title, live thumbnail of the settled slide); click or tap jumps; long-press on touch previews.
- Input: tap or click the right 65% for next and the left 35% for back, swipe, arrow keys, PageUp and PageDown, Home, End, Space to pause, hold anywhere to pause, End jumps to the last slide, Esc goes back from the profile.
- URLs: `?for=name` greeting (sanitised, max 30 characters), `#slide=N` (1-based) to start on a slide, kept current as the deck moves so Back from a linked page lands on the same slide, `#profile` for the profile page.
- `prefers-reduced-motion`: no autoplay, no transitions, every slide in its final state, and the user steps through.
- Inactive slides are `inert` and `aria-hidden`; the counter is a live region while paused.

## Rules for decks

- Every slide must fit the viewport at 390x844 and 1440x900 without scrolling. Size type with `min(vw, dvh)`.
- Style slides as `.deck-slide[data-slide='id'] ...` or with your own classes, never through `.deck-stage`: preview thumbnails are clones that live outside the stage.
- Don't use `id` attributes inside slides; thumbnails strip them.
- Text stays real HTML. Mark anything with `placeholder: true` in `shared/data.js` with a visible "Placeholder" marker.

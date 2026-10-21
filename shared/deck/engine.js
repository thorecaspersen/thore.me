/* Story-deck engine: slides of real HTML that auto-advance like stories, with a per-slide frame clock.
   Style-agnostic: decks skin it through CSS custom properties (see chrome.css and README.md). */
import { spring, interpolate, Easing, clamp } from './motion.js'
import { esc, icon, greetingFrom } from './html.js'

export { spring, interpolate, Easing, clamp } from './motion.js'
export { esc, icon, kinetic, initials, greetingFrom } from './html.js'

const SPRINGS = { soft: { damping: 18, stiffness: 120 }, snappy: { damping: 14, stiffness: 140 }, bouncy: { damping: 9, stiffness: 160 } }
const KIND_SPRING = { rise: 'snappy', pop: 'bouncy' }
const EASED = new Set(['grow', 'growY', 'wipe', 'count'])
const outCubic = Easing.out(Easing.cubic)
const wipeEase = Easing.bezier(0.77, 0, 0.18, 1)

/** Built-in animation kinds: (element, value 0..1, overshoot allowed for springs). */
const KINDS = {
  rise: (el, v) => (el.style.transform = `translateY(${(1 - v) * 112}%)`),
  up: (el, v) => {
    el.style.transform = `translateY(${(1 - v) * 0.9}em)`
    el.style.opacity = clamp(v * 1.6, 0, 1)
  },
  down: (el, v) => {
    el.style.transform = `translateY(${(v - 1) * 0.9}em)`
    el.style.opacity = clamp(v * 1.6, 0, 1)
  },
  left: (el, v) => {
    el.style.transform = `translateX(${(v - 1) * 1.6}em)`
    el.style.opacity = clamp(v * 1.6, 0, 1)
  },
  right: (el, v) => {
    el.style.transform = `translateX(${(1 - v) * 1.6}em)`
    el.style.opacity = clamp(v * 1.6, 0, 1)
  },
  pop: (el, v) => {
    el.style.transform = `scale(${Math.max(0, v)})`
    el.style.opacity = clamp(v * 3, 0, 1)
  },
  grow: (el, v) => (el.style.transform = `scaleX(${v})`),
  growY: (el, v) => (el.style.transform = `scaleY(${v})`),
  wipe: (el, v) => (el.style.clipPath = v >= 1 ? 'none' : `inset(-20% ${(1 - v) * 100}% -20% 0)`),
  count: (el, v, a) => (el.textContent = String(Math.round(a.to * v))),
  fade: (el, v) => (el.style.opacity = clamp(v, 0, 1)),
}

const SKEW = 14
function poly(p, dir) {
  const e = p * (100 + SKEW) - SKEW
  return dir > 0 ? `polygon(0 0, ${e + SKEW}% 0, ${e}% 100%, 0 100%)` : `polygon(${100 - e - SKEW}% 0, 100% 0, 100% 100%, ${100 - e}% 100%)`
}

/**
 * createDeck({ slides, profile?, actions?, photo?, label?, fps?, transition?, transitionFrames?,
 *              hint?, kinds?, springs?, mount?, onChange? }) -> controller
 */
export function createDeck(opts) {
  const {
    slides: defs,
    profile: renderProfile,
    actions = [],
    photo,
    label = 'Story',
    fps = 30,
    transition = 'wipe',
    transitionFrames = 18,
    hint,
    kinds = {},
    springs = {},
    mount = document.body,
    onChange,
  } = opts
  const KIND = { ...KINDS, ...kinds }
  const SPRING = { ...SPRINGS, ...springs }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const touch = matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0
  const greeting = greetingFrom(location.search)
  const N = defs.length
  const LAST = N - 1

  /* ------------------------------------------------------------ DOM */

  const actionHtml = actions
    .map(
      (a) =>
        `<a class="deck-chip${a.primary ? ' is-primary' : ''}" href="${esc(a.href)}"${a.download ? ' download' : ''}${a.external ? ' target="_blank" rel="noopener"' : ''}>${a.icon ? icon(a.icon) : ''}${
          a.short ? `<span class="deck-long">${esc(a.label)}</span><span class="deck-short">${esc(a.short)}</span>` : `<span>${esc(a.label)}</span>`
        }</a>`,
    )
    .join('')
  const tpl = document.createElement('template')
  tpl.innerHTML =
    `<section class="deck${reduced ? ' is-reduced' : ''}" aria-roledescription="carousel" aria-label="${esc(label)}">
      <div class="deck-stage"><div class="deck-band deck-band-a" aria-hidden="true"></div><div class="deck-band deck-band-b" aria-hidden="true"></div></div>
      <header class="deck-top">
        <div class="deck-segs" role="group" aria-label="Slides">${defs
          .map((d, i) => `<button class="deck-seg" type="button" data-i="${i}" aria-label="Slide ${i + 1} of ${N}: ${esc(d.title)}"><span class="deck-seg-bar"><i></i></span></button>`)
          .join('')}</div>
        <div class="deck-top-row">
          <button class="deck-chip deck-icon deck-pause" type="button"></button>
          <nav class="deck-actions" aria-label="Contact">${actionHtml}</nav>
        </div>
      </header>
      <div class="deck-preview" aria-hidden="true" hidden><div class="deck-preview-thumb"></div><p class="deck-preview-label"><span class="deck-preview-num"></span><span class="deck-preview-title"></span></p></div>
      <footer class="deck-bottom">
        <span class="deck-count" aria-live="off"></span>
        <span class="deck-hint"></span>
      </footer>
    </section>
    <main class="deck-profile" aria-label="Full profile" hidden></main>`
  const root = tpl.content.querySelector('.deck')
  const profileEl = tpl.content.querySelector('.deck-profile')
  mount.append(tpl.content)
  const stage = root.querySelector('.deck-stage')
  const bands = [...root.querySelectorAll('.deck-band')]
  const pauseBtn = root.querySelector('.deck-pause')
  const countEl = root.querySelector('.deck-count')
  const preview = root.querySelector('.deck-preview')
  const segBtns = [...root.querySelectorAll('.deck-seg')]
  const segFills = segBtns.map((b) => ({ el: b.querySelector('i'), last: -1 }))
  const hintEl = root.querySelector('.deck-hint')
  const hintFor = (isTouch) =>
    hint ||
    (reduced
      ? 'Use the arrow keys or tap the sides to step through.'
      : isTouch
        ? 'Tap the sides to move. Hold to pause.'
        : 'Click right for next, left for back. Arrow keys work. Hold or press Space to pause.')
  hintEl.textContent = hintFor(touch)
  addEventListener('pointerdown', (e) => e.pointerType === 'touch' && (hintEl.textContent = hintFor(true)), { once: true })

  const ctxBase = { greeting, reduced, total: N }
  const slides = defs.map((d, i) => {
    const el = document.createElement('section')
    el.className = 'deck-slide'
    el.dataset.slide = d.id
    if (d.theme) el.dataset.theme = d.theme
    el.setAttribute('role', 'group')
    el.setAttribute('aria-roledescription', 'slide')
    el.setAttribute('aria-label', `${i + 1} of ${N}: ${d.title}`)
    const content = d.render({ ...ctxBase, index: i })
    if (typeof content === 'string') el.innerHTML = content
    else el.append(content)
    stage.insertBefore(el, bands[0])
    const anims = [...el.querySelectorAll('[data-anim]')].map((n) => ({
      el: n,
      kind: n.dataset.anim,
      at: +n.dataset.at || 0,
      len: +n.dataset.len || 22,
      to: +n.dataset.to || 0,
      cfg: SPRING[n.dataset.cfg] || SPRING[KIND_SPRING[n.dataset.anim]] || SPRING.soft,
      last: NaN,
    }))
    const settle = Math.max(0, ...anims.map((a) => a.at + a.len)) + 45
    return { def: d, el, anims, settle, frames: Math.round((d.duration || 5) * fps) }
  })

  /* ---------------------------------------------------------- frames */

  function value(a, f) {
    const x = f - a.at
    if (EASED.has(a.kind)) return interpolate(x, [0, a.len], [0, 1], { easing: outCubic, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    return spring({ frame: x, fps, config: a.cfg })
  }

  function paintSlide(sl, f) {
    for (const a of sl.anims) {
      const v = reduced ? 1 : value(a, f)
      if (Math.abs(v - a.last) < 0.0004) continue
      a.last = v
      ;(KIND[a.kind] || KIND.fade)(a.el, v, a)
    }
    sl.def.update?.(reduced ? 1e6 : f, { el: sl.el, reduced })
  }

  /* ---------------------------------------------------- sequencing */

  const S = { i: 0, t: 0, a: 0, playing: !reduced, held: false, ended: false, trans: null }

  function finishTransition() {
    const tr = S.trans
    if (!tr) return
    tr.old?.el.classList.remove('is-leaving')
    slides[S.i].el.style.clipPath = ''
    slides[S.i].el.style.opacity = ''
    for (const b of bands) b.style.visibility = 'hidden'
    S.trans = null
  }

  function renderTransition() {
    const tr = S.trans
    const cur = slides[S.i].el
    const p = (k) => interpolate(tr.t, [k * 2, k * 2 + transitionFrames - 4], [0, 1], { easing: wipeEase, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })
    if (typeof transition === 'function') transition(clamp(tr.t / transitionFrames, 0, 1), { cur, old: tr.old?.el || null, dir: tr.dir, bands })
    else if (transition === 'fade') cur.style.opacity = p(0)
    else if (transition === 'wipe') {
      bands.forEach((b, k) => {
        b.style.visibility = 'visible'
        b.style.clipPath = poly(p(k), tr.dir)
      })
      cur.style.clipPath = poly(p(2), tr.dir)
    }
    if (tr.t >= transitionFrames) finishTransition()
  }

  function activate(cur, old, dir) {
    finishTransition()
    for (const sl of slides) {
      const on = sl === cur
      sl.el.classList.toggle('is-on', on)
      sl.el.inert = !on
      sl.el.setAttribute('aria-hidden', String(!on))
    }
    cur.anims.forEach((a) => (a.last = NaN))
    paintSlide(cur, 0)
    root.dataset.theme = cur.def.theme || ''
    document.documentElement.dataset.deckTheme = cur.def.theme || ''
    if (!reduced && transition !== 'cut') {
      old?.el.classList.add('is-leaving')
      S.trans = { old, dir, t: 0 }
      renderTransition()
    }
    countEl.textContent = `${S.i + 1} / ${N}`
    segBtns.forEach((b, k) => (k === S.i ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')))
    updateControls()
    onChange?.(S.i)
    if (location.hash !== '#profile') history.replaceState(null, '', S.i ? `#slide=${S.i + 1}` : location.pathname + location.search)
  }

  function go(j) {
    j = clamp(j, 0, LAST)
    const old = slides[S.i]
    const dir = j >= S.i ? 1 : -1
    S.i = j
    S.t = 0
    S.a = 0
    S.ended = false
    activate(slides[j], old === slides[j] ? null : old, dir)
  }
  const next = () => S.i < LAST && go(S.i + 1)
  const prev = () => go(S.i - 1)
  const skip = () => go(LAST)

  function replay() {
    S.playing = !reduced
    go(0)
  }
  function setPlaying(p) {
    if (S.ended) return replay()
    S.playing = p
    updateControls()
  }
  const togglePause = () => setPlaying(!S.playing)

  function updateControls() {
    const state = S.ended ? 'replay' : S.playing ? 'pause' : 'play'
    pauseBtn.innerHTML = icon(state)
    pauseBtn.setAttribute('aria-label', { replay: 'Replay the story', pause: 'Pause the story', play: 'Play the story' }[state])
    pauseBtn.title = { replay: 'Replay', pause: 'Pause (Space)', play: 'Play (Space)' }[state]
    countEl.setAttribute('aria-live', S.playing ? 'off' : 'polite')
    root.classList.toggle('is-paused', !S.playing)
    root.classList.toggle('is-ended', S.ended)
  }

  function paintSegs() {
    segFills.forEach((sg, k) => {
      const v = k < S.i ? 1 : k > S.i ? 0 : reduced || S.ended ? 1 : clamp(S.t / slides[S.i].frames, 0, 1)
      if (Math.abs(v - sg.last) < 0.001) return
      sg.last = v
      sg.el.style.transform = `scaleX(${v})`
    })
  }

  /* --------------------------------------------------------- clock */

  let view = 'deck'
  let lastNow = performance.now()
  function tick(now) {
    requestAnimationFrame(tick)
    const dt = Math.min(0.1, (now - lastNow) / 1000) * fps
    lastNow = now
    if (view !== 'deck' || document.hidden || S.held) return
    const cur = slides[S.i]
    if (S.trans) {
      S.trans.t += dt
      renderTransition()
    }
    if (!reduced && (S.a <= cur.settle || cur.def.update)) {
      S.a += dt
      paintSlide(cur, S.a)
    }
    if (S.playing) {
      S.t += dt
      if (S.t >= cur.frames) {
        if (S.i < LAST) go(S.i + 1)
        else {
          S.t = cur.frames
          S.playing = false
          S.ended = true
          updateControls()
        }
      }
    }
    paintSegs()
  }

  /* -------------------------------------------------------- preview */

  const thumbs = new Map()
  function thumbOf(k) {
    if (thumbs.has(k)) return thumbs.get(k)
    const c = slides[k].el.cloneNode(true)
    c.classList.remove('is-on', 'is-leaving')
    c.classList.add('deck-thumb')
    c.inert = true
    c.setAttribute('aria-hidden', 'true')
    c.style.clipPath = ''
    c.style.opacity = ''
    c.style.width = `${innerWidth}px`
    c.style.height = `${innerHeight}px`
    c.querySelectorAll('[id]').forEach((n) => n.removeAttribute('id'))
    c.querySelectorAll('[data-anim]').forEach((n) => {
      for (const p of ['transform', 'opacity', 'clip-path']) n.style.removeProperty(p)
      if (n.dataset.anim === 'count') n.textContent = n.dataset.to
    })
    thumbs.set(k, c)
    return c
  }

  let previewFor = -1
  function showPreview(k) {
    const btn = segBtns[k]
    const s = Math.min(clamp(innerWidth * 0.2, 150, 280) / innerWidth, 240 / innerHeight, 0.4)
    const w = innerWidth * s
    const box = preview.querySelector('.deck-preview-thumb')
    if (previewFor !== k) {
      const c = thumbOf(k)
      c.style.transform = `scale(${s})`
      box.replaceChildren(c)
      box.style.width = `${w}px`
      box.style.height = `${innerHeight * s}px`
      preview.style.width = `${w + 12}px`
      preview.querySelector('.deck-preview-num').textContent = `${k + 1} / ${N}`
      preview.querySelector('.deck-preview-title').textContent = defs[k].title
      previewFor = k
    }
    preview.hidden = false
    const r = btn.getBoundingClientRect()
    const pw = preview.offsetWidth
    preview.style.left = `${clamp(r.left + r.width / 2 - pw / 2, 8, innerWidth - pw - 8)}px`
    preview.style.top = `${r.bottom + 6}px`
  }
  function hidePreview() {
    preview.hidden = true
  }
  addEventListener('resize', () => {
    thumbs.clear()
    previewFor = -1
    hidePreview()
  })

  let segPress = null
  for (const b of segBtns) {
    const k = +b.dataset.i
    b.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && showPreview(k))
    b.addEventListener('pointerleave', (e) => e.pointerType === 'mouse' && hidePreview())
    b.addEventListener('focus', () => b.matches(':focus-visible') && showPreview(k))
    b.addEventListener('blur', hidePreview)
    b.addEventListener('pointerdown', (e) => {
      if (e.pointerType === 'mouse') return
      segPress = { k, long: false, timer: setTimeout(() => {
        segPress.long = true
        showPreview(k)
      }, 380) }
    })
    b.addEventListener('pointerup', () => {
      if (!segPress) return
      clearTimeout(segPress.timer)
      if (segPress.long) {
        hidePreview()
        b.dataset.swallow = '1'
      }
      segPress = null
    })
    b.addEventListener('pointercancel', () => {
      if (segPress) clearTimeout(segPress.timer)
      segPress = null
      hidePreview()
    })
    b.addEventListener('contextmenu', (e) => e.preventDefault())
    b.addEventListener('click', () => {
      if (b.dataset.swallow) return delete b.dataset.swallow
      go(k)
    })
  }

  /* ---------------------------------------------------------- input */

  let press = null
  let holdTimer = 0
  const interactive = (t) => t.closest('a, button, input, select, textarea, label, [data-deck-no-nav]')

  function release() {
    clearTimeout(holdTimer)
    if (!S.held) return
    S.held = false
    root.classList.remove('is-held')
    lastNow = performance.now()
  }

  stage.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || interactive(e.target)) return
    press = { x: e.clientX, y: e.clientY, held: false }
    clearTimeout(holdTimer)
    holdTimer = setTimeout(() => {
      if (!press) return
      press.held = true
      S.held = true
      root.classList.add('is-held')
    }, 220)
  })
  stage.addEventListener('pointerup', (e) => {
    const p = press
    press = null
    const wasHeld = p?.held
    release()
    if (!p || wasHeld) return
    const dx = e.clientX - p.x
    const dy = e.clientY - p.y
    if (e.pointerType !== 'mouse' && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) return dx < 0 ? next() : prev()
    if (Math.hypot(dx, dy) > 10 || String(getSelection()).length) return
    if (e.clientX < innerWidth * 0.35) prev()
    else next()
  })
  stage.addEventListener('pointercancel', () => {
    press = null
    release()
  })
  stage.addEventListener('contextmenu', (e) => S.held && e.preventDefault())

  pauseBtn.addEventListener('click', togglePause)
  document.addEventListener('click', (e) => {
    const act = e.target.closest('[data-deck-action]')?.dataset.deckAction
    if (act === 'replay') replay()
    else if (act === 'profile') showProfile()
    else if (act === 'deck') showDeck()
    else if (act === 'next') next()
    else if (act === 'prev') prev()
  })

  document.addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return
    const k = e.key
    if (view === 'profile') {
      if (k === 'Escape') showDeck()
      return
    }
    if (e.target.closest('input, textarea, select')) return
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown') {
      e.preventDefault()
      next()
    } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
      e.preventDefault()
      prev()
    } else if (k === 'Home') {
      e.preventDefault()
      go(0)
    } else if (k === 'End') {
      e.preventDefault()
      skip()
    } else if (k === ' ' && !e.target.closest('a, button')) {
      e.preventDefault()
      togglePause()
    }
  })

  /* -------------------------------------------------------- routing */

  function showProfile() {
    if (!renderProfile) return
    if (!profileEl.firstChild) {
      profileEl.innerHTML = renderProfile({ ...ctxBase })
      applyPhoto(profileEl)
      fit()
    }
    view = 'profile'
    root.hidden = true
    profileEl.hidden = false
    document.body.classList.add('deck-profile-open')
    if (location.hash !== '#profile') history.pushState(null, '', '#profile')
    scrollTo(0, 0)
    profileEl.querySelector('[data-deck-action="deck"]')?.focus({ preventScroll: true })
  }

  function showDeck() {
    view = 'deck'
    root.hidden = false
    profileEl.hidden = true
    document.body.classList.remove('deck-profile-open')
    if (location.hash === '#profile') history.pushState(null, '', location.pathname + location.search)
    lastNow = performance.now()
  }

  function route() {
    if (location.hash === '#profile') return showProfile()
    if (view !== 'deck') showDeck()
    const m = /^#slide=(\d+)$/.exec(location.hash)
    if (m) go(+m[1] - 1)
  }
  addEventListener('popstate', route)
  addEventListener('hashchange', route)

  /* ----------------------------------------------------- fit + photo */

  /** Shrink [data-deck-fit] elements until their content no longer overflows their width. */
  function fit() {
    for (const el of document.querySelectorAll('[data-deck-fit]')) {
      el.style.fontSize = ''
      if (el.scrollWidth > el.clientWidth) el.style.fontSize = `${(parseFloat(getComputedStyle(el).fontSize) * el.clientWidth * 0.98) / el.scrollWidth}px`
    }
    thumbs.clear()
    previewFor = -1
  }
  addEventListener('resize', fit)
  document.fonts?.ready.then(fit)

  let photoOk = false
  function applyPhoto(scope) {
    if (!photoOk) return
    for (const img of scope.querySelectorAll('img[data-deck-photo]')) {
      img.src = photo
      img.hidden = false
      img.closest('[data-deck-photo-slot]')?.classList.add('has-photo')
    }
  }
  if (photo) {
    fetch(photo, { method: 'HEAD' })
      .then((r) => {
        photoOk = r.ok && (r.headers.get('content-type') || '').startsWith('image/')
        applyPhoto(document)
        thumbs.clear()
        previewFor = -1
      })
      .catch(() => {})
  }

  /* ----------------------------------------------------------- boot */

  const start = /^#slide=(\d+)$/.exec(location.hash)
  S.i = start ? clamp(+start[1] - 1, 0, LAST) : 0
  activate(slides[S.i], null, 1)
  fit()
  if (location.hash === '#profile') showProfile()
  requestAnimationFrame((now) => {
    lastNow = now
    tick(now)
  })

  return {
    root,
    greeting,
    reduced,
    go,
    next,
    prev,
    skip,
    replay,
    play: () => setPlaying(true),
    pause: () => setPlaying(false),
    showProfile,
    showDeck,
    preview: showPreview,
    get index() {
      return S.i
    },
  }
}

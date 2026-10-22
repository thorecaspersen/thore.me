/* thore.me: one story in three worlds.
   Swiss punk posters, a product keynote and a hacker terminal.
   Every slide keeps its own world: its type, its motion kinds, and its own way in. */
import { createDeck, clamp, Easing } from '../shared/deck/engine.js'
import { profile } from '../shared/data.js'
import { slides } from './slides.js'

/* ------------------------------------------------------------ Swiss: stepped, never eased */

const step = (v, n) => Math.min(1, Math.round(Math.max(0, v) * n) / n)

/** Translate along the grid in whole columns (--col) or rows (--row), one jump per unit. */
function slideOnGrid(el, v, axis, n, unit) {
  const off = n * (1 - step(v, Math.abs(n)))
  el.style.transform = off ? `translate${axis}(calc(var(${unit}) * ${off.toFixed(3)}))` : ''
  el.style.opacity = v > 0 ? '' : '0'
}

/* ------------------------------------------------------------ keynote: out of focus, then settled */

const out = Easing.out(Easing.cubic)
const blur = (px) => (px > 0.05 ? `blur(${px.toFixed(2)}px)` : '')

const kinds = {
  // Swiss
  gx: (el, v) => slideOnGrid(el, v, 'X', +el.dataset.dx || -1, '--col'),
  gy: (el, v) => slideOnGrid(el, v, 'Y', +el.dataset.dy || 1, '--row'),
  cut: (el, v) => (el.style.opacity = v > 0 ? '' : '0'),
  fill: (el, v) => {
    const k = step(v, +el.dataset.steps || 4)
    const r = `${((1 - k) * 100).toFixed(2)}%`
    const side = { l: `0 ${r} 0 0`, r: `0 0 0 ${r}`, t: `0 0 ${r} 0`, b: `${r} 0 0 0` }[el.dataset.from || 'l']
    el.style.clipPath = k >= 1 ? '' : `inset(${side})`
  },
  // keynote
  focus: (el, v) => {
    el.style.opacity = clamp(v * 1.5, 0, 1)
    el.style.transform = `scale(${1 + (1 - v) * 0.08})`
    el._fs ??= parseFloat(getComputedStyle(el).fontSize)
    el.style.filter = blur(Math.max(0, 1 - v) * Math.min(12, el._fs * 0.12))
  },
  lift: (el, v) => {
    el.style.opacity = clamp(v * 1.5, 0, 1)
    el.style.transform = `translateY(${(1 - v) * 0.7}em)`
    el.style.filter = blur(Math.max(0, 1 - v) * 7)
  },
  reel: (el, v) => {
    const n = +el.dataset.n
    const speed = Math.abs(v - (el._pv ?? v)) * n
    el._pv = v
    const s = clamp(speed * 2.6, 0, 1)
    el.style.translate = `0 ${(-v * n).toFixed(3)}em`
    el.style.filter = blur(s * 2.2)
    el.style.textShadow = s > 0.02 ? `0 ${0.14 * s}em ${0.05 * s}em rgba(245,245,247,${0.4 * s}), 0 ${0.3 * s}em ${0.1 * s}em rgba(245,245,247,${0.2 * s})` : ''
  },
  // terminal: an output block shoved in from the left edge, revealed as it travels
  shove: (el, v) => {
    el.style.opacity = v > 0.001 ? 1 : 0
    el.style.transform = `translateX(${(v - 1) * 1.3}em)`
    el.style.clipPath = v > 0.995 ? 'none' : `inset(-30% ${Math.max(0, (1 - v) * 100).toFixed(2)}% -30% -2%)`
  },
}

/* Swiss lands without overshoot on the grid lines; the keynote glides; the terminal shoves. */
const hard = { damping: 28, stiffness: 196 }
const springs = {
  soft: hard,
  snappy: hard,
  bouncy: hard,
  cine: { damping: 10, stiffness: 22 },
  glide: { damping: 13, stiffness: 46 },
  term: { damping: 18, stiffness: 120 },
}

/* ------------------------------------------------------------ the three ways in */

const FRAMES = 24

/** Swiss: a block slams across, the slide cuts underneath, the block steps off column by column. */
const IN = 0.36
function slam(p, { cur, dir, bands: [block, edge] }) {
  edge.style.visibility = 'hidden'
  block.style.visibility = 'visible'
  block.style.zIndex = '6'
  const W = innerWidth
  if (p < IN) {
    const r = (1 - (p / IN) ** 3) * W
    block.style.clipPath = dir > 0 ? `inset(0 0 0 ${r}px)` : `inset(0 ${r}px 0 0)`
    cur.style.opacity = '0'
    return
  }
  cur.style.opacity = ''
  const cols = W <= 700 ? 4 : 6
  const pad = Math.min(80, Math.max(18, W * 0.044))
  const stops = [W, ...Array.from({ length: cols + 1 }, (_, i) => W - pad - ((W - 2 * pad) * i) / cols), 0]
  const x = stops[Math.min(stops.length - 1, Math.floor(((p - IN) / (1 - IN)) * stops.length))]
  block.style.clipPath = dir > 0 ? `inset(0 ${W - x}px 0 0)` : `inset(0 0 0 ${W - x}px)`
}

/** Keynote: the old slide recedes into the dark stage, the new one fades up out of it. */
function fadeThroughBlack(p, { cur, old }) {
  cur.style.opacity = String(out(clamp((p - 0.38) / 0.62, 0, 1)))
  if (!old) return
  const q = out(clamp(p / 0.5, 0, 1))
  old.style.opacity = p >= 1 ? '' : String(1 - q)
  old.style.transform = p >= 1 ? '' : `scale(${1 - q * 0.035})`
}

/** Terminal: the new screen paints top-down behind a bright scan edge while hot slices tear the old one. */
function redraw(p, { cur, old, dir, bands: [tear, scan] }) {
  const e = 1 - Math.pow(1 - p, 3)
  const y = e * 100
  cur.style.clipPath = dir > 0 ? `inset(0 0 ${(100 - y).toFixed(2)}% 0)` : `inset(${(100 - y).toFixed(2)}% 0 0 0)`
  const edge = dir > 0 ? y : 100 - y
  scan.style.visibility = p < 1 ? 'visible' : 'hidden'
  scan.style.clipPath = `inset(calc(${edge.toFixed(2)}% - ${dir > 0 ? 0 : 4}px) 0 calc(${(100 - edge).toFixed(2)}% - ${dir > 0 ? 4 : 0}px) 0)`
  if (p < 0.55) {
    const k = Math.floor(p * 12)
    const pts = []
    for (let i = 0; i < 3; i++) {
      const top = (k * 29 + i * 37) % 92
      const h = 0.8 + ((k * 7 + i * 3) % 5) * 0.9
      pts.push(`0 ${top}%, 100% ${top}%, 100% ${top + h}%, 0 ${top + h}%`)
    }
    tear.style.visibility = 'visible'
    tear.style.clipPath = `polygon(${pts.join(', ')})`
    if (old) old.style.transform = `translateX(${(k % 2 ? 1 : -1) * (6 + (k % 3) * 5)}px)`
  } else {
    tear.style.visibility = 'hidden'
    if (old) old.style.transform = ''
  }
}

const worldOf = Object.fromEntries(slides.map((s) => [s.id, s.world]))

/** One transition, three effects: the incoming slide's world decides how it arrives. */
function transition(p, ctx) {
  if (p === 0) {
    for (const s of ctx.cur.parentElement.querySelectorAll('.deck-slide')) {
      s.style.transform = ''
      s.style.opacity = ''
      s.style.clipPath = ''
    }
    for (const b of ctx.bands) {
      b.style.visibility = 'hidden'
      b.style.zIndex = ''
      b.style.clipPath = ''
    }
  }
  const world = worldOf[ctx.cur.dataset.slide]
  if (world === 'sw') slam(Math.min(1, (p * FRAMES) / 14), ctx)
  else if (world === 'tm') redraw(Math.min(1, (p * FRAMES) / 13), ctx)
  else fadeThroughBlack(p, ctx)
}

/* The AI slide's read-more pop-up; declared before the deck, which closes it on every slide change. */
let morePop = null
let moreFrom = null
function closeMore() {
  if (!morePop) return
  morePop.hidden = true
  morePop.querySelectorAll('.pop-w').forEach((w) => (w.hidden = true))
  morePop = null
  moreFrom?.focus()
}

const deck = createDeck({
  slides,
  label: `${profile.name} in ${slides.length} slides`,
  transition,
  transitionFrames: FRAMES,
  kinds,
  springs,
  onChange: () => closeMore(),
  actions: [
    { href: `mailto:${profile.email}`, label: 'Contact' },
    { href: profile.cvPdf, label: 'Download CV (PDF)', short: 'CV (PDF)', icon: 'download', primary: true, download: true },
  ],
})
deck.root.classList.add('hint-pause')
for (const ev of ['animationend', 'animationcancel']) deck.root.addEventListener(ev, (e) => e.animationName === 'ph-ripple' && e.pseudoElement === '::after' && deck.root.classList.remove('hint-pause'))
if (deck.greeting) document.title = `${profile.name}, for the ${deck.greeting.slice(3)}`

/* In their words, on phones: each person shows the start of a quote, one opens at a time, and opening one pauses the deck so it can be read. */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.q-more')
  if (!btn) return
  const card = btn.closest('.q')
  const open = !card.classList.contains('is-open')
  for (const q of card.parentElement.children) {
    const on = open && q === card
    q.classList.toggle('is-open', on)
    const b = q.querySelector('.q-more')
    if (b) {
      b.setAttribute('aria-expanded', String(on))
      b.textContent = on ? 'Show less' : 'Read more'
    }
  }
  if (open) {
    deck.pause()
    requestAnimationFrame(() => card.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
  }
})

/* Let's talk: the form posts to FormBold without leaving the slide, and the send button says how it went. */
document.addEventListener('submit', async (e) => {
  const form = e.target.closest('.msg')
  if (!form) return
  e.preventDefault()
  const btn = form.querySelector('.f-send')
  btn.disabled = true
  btn.lastElementChild.textContent = 'Sending…'
  const ok = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } }).then((r) => r.ok, () => false)
  if (ok) form.reset()
  btn.lastElementChild.textContent = ok ? 'Sent. Thanks!' : 'Not sent. Try again'
  btn.disabled = false
})

/* AI, read more: a click opens that window's full text mid-screen and pauses the deck. The ×, a click outside it,
   Escape or leaving the slide closes it. */
document.addEventListener('click', (e) => {
  const btn = e.target.closest('.rm[data-more]')
  if (btn) {
    closeMore()
    morePop = btn.closest('.deck-slide').querySelector('.pop')
    moreFrom = btn
    morePop.hidden = false
    const win = morePop.querySelectorAll('.pop-w')[+btn.dataset.more]
    win.hidden = false
    win.querySelector('.pop-x').focus()
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) decrypt(win)
    deck.pause()
  } else if (morePop && (e.target === morePop || e.target.closest('.pop-x'))) closeMore()
})
addEventListener(
  'keydown',
  (e) => {
    if (morePop && e.key === 'Escape') {
      e.stopImmediatePropagation()
      closeMore()
    }
  },
  true,
)

/* The opened text decrypts, scrambled characters settling left to right into the words. */
const SCRAMBLE = '#$%&*+=<>/|01'
function decrypt(win) {
  const els = [...win.querySelectorAll('.dx')]
  for (const e of els) e.dataset.text ??= e.textContent
  const t0 = performance.now()
  const step = (now) => {
    const p = Math.min(1, (now - t0) / 900)
    for (const e of els) {
      const txt = e.dataset.text
      const n = Math.floor(txt.length * p)
      e.textContent = txt.slice(0, n) + [...txt.slice(n)].map((c) => (c === ' ' ? ' ' : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0])).join('')
    }
    if (p < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}

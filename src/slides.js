/* The slides in three worlds, all built from shared/data.js.
   world 'sw' = Swiss posters, 'kn' = keynote, 'tm' = terminal.
   Each slide's markup only uses its own world's classes and data-anim kinds (see main.js). */
import { profile, sellingPoints, stories, storiesPreAi, testimonials, techSpecs, delivery, beyond, aiStory, experience, education, stats } from '../shared/data.js'
import { esc, icon, Easing, clamp } from '../shared/deck/engine.js'
import { createGlobe } from '../shared/globe.js'

const ph = (label = 'Placeholder') => `<span class="ph">${esc(label)}</span>`
const unph = (s) => s.replace(/^Placeholder:\s*/i, '')
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const lc = (s) => s.toLowerCase()
const ext = 'target="_blank" rel="noopener"'

const job = (id) => experience.find((e) => e.id === id)
const current = experience.find((e) => !e.to)
const htx = education.find((e) => e.id === 'htx')
const ek = education.find((e) => e.id === 'ek')
const firstCode = /class with ([^,.]+)/.exec(htx.note)[1]

/** "2015–17", "2020–now", "c. 2009–11", "2015" */
function span(e) {
  const a = e.from.slice(0, 4)
  const b = e.to ? e.to.slice(0, 4) : 'now'
  return `${e.datesApprox ? 'c. ' : ''}${a}${b === a ? '' : `–${b === 'now' ? b : b.slice(2)}`}`
}

/* ================================================================ SWISS */

const RULES = `<div class="rules" aria-hidden="true"><i class="rv" data-anim="growY" data-at="2" data-len="12"></i><i class="rh" data-anim="grow" data-at="4" data-len="12"></i><b class="m m1"></b><b class="m m2"></b><b class="m m3"></b><b class="m m4"></b></div>`

function setHot(el, items, k) {
  if (el._k === k) return
  el._k = k
  items.forEach((n, i) => n.classList.toggle('is-hot', i === k))
}

/* ------------------------------------------------------------ 1. intro */

/* Swiss-style rain for the red slab: the stack falls as words on a strict grid, stepping one row at a time. */
const RAIN_WORDS = ['react', 'typescript', '.net', 'azure', 'aws', 'python', 'sql', 'docker', 'node', 'claude', 'ci/cd', 'c++', 'django', 'redux', 'mongodb', 'php']
const mix = (word, c) => [...word].reduce((hsh, ch) => Math.imul(hsh ^ ch.charCodeAt(0), 2654435761) >>> 0, (c + 1) * 40503)
function rain(f, { el, reduced }) {
  const cv = (el._rain ??= el.querySelector('.rain'))
  const w = cv.clientWidth
  const h = cv.clientHeight
  if (!w || !h) return
  const dpr = Math.min(devicePixelRatio || 1, 2)
  const step = reduced ? 7 : Math.floor(f / 4)
  if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
    cv.width = Math.round(w * dpr)
    cv.height = Math.round(h * dpr)
    el._rainStep = -1
  }
  if (el._rainStep === step) return
  el._rainStep = step
  const ctx = cv.getContext('2d')
  const cols = Math.max(4, Math.round(w / 36))
  const cell = w / cols
  const rowH = cell * 0.86
  const rows = Math.ceil(h / rowH)
  const rule = Math.floor(rows * 0.62)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(0, 0, 0, 0.16)'
  for (let c = 1; c < cols; c++) ctx.fillRect(Math.round(c * cell), 0, 1, h)
  ctx.fillStyle = '#fff'
  ctx.fillRect(0, Math.round(rule * rowH) - 1, w, 2)
  ctx.font = `900 ${cell * 0.92}px 'Schibsted Grotesk', sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  for (let c = 0; c < cols; c++) {
    const words = [...RAIN_WORDS].sort((x, y) => mix(x, c) - mix(y, c))
    const text = words.join('  ') + '  '
    const wordAt = []
    words.forEach((wd, k) => { for (let n = 0; n < wd.length + 2; n++) wordAt.push(n < wd.length ? k : -1) })
    const L = text.length
    const offset = step * (c % 3 === 1 ? 2 : 1) + c * 11
    const idx = (r) => (((r - offset) % L) + L) % L
    const hot = wordAt[idx(rule)]
    for (let r = 0; r < rows; r++) {
      const k = idx(r)
      if (text[k] === ' ') continue
      ctx.fillStyle = wordAt[k] === hot ? '#fff' : 'rgba(0, 0, 0, 0.42)'
      ctx.fillText(text[k], (c + 0.5) * cell, (r + 0.56) * rowH)
    }
  }
}

function intro(greeting) {
  const [first, ...rest] = profile.name.split(' ')
  return `<div class="pg pg-hello">
  ${RULES}
  <div class="slab" aria-hidden="true" data-anim="fill" data-from="t" data-steps="4" data-at="5"><canvas class="rain"></canvas></div>
  <header class="head">
    ${greeting ? `<p class="greet" data-anim="gx" data-dx="-2" data-at="6">${esc(greeting)}</p>` : ''}
    <h1 class="name" aria-label="${esc(profile.name)}"><span class="ln" data-anim="gx" data-dx="-3" data-at="8" aria-hidden="true"><span class="fit" data-deck-fit>${esc(lc(first))}</span></span><span class="ln" data-anim="gx" data-dx="-4" data-at="12" aria-hidden="true"><span class="fit" data-deck-fit>${esc(lc(rest.join(' ')))}</span></span></h1>
  </header>
  <p class="role" data-anim="cut" data-at="18"><strong>${esc(profile.statement[0])}</strong><span>${esc(profile.statement[1])}</span><small>${esc(profile.now)}</small></p>
  <p class="yrs" data-anim="gy" data-dy="1" data-at="22"><span class="yrs-n">${esc(profile.proYears.replace(/\D+$/, ''))}<span class="plus">${esc(profile.proYears.replace(/^\d+/, ''))}</span></span><span class="yrs-l">years building software</span></p>
</div>`
}

/* ------------------------------------------------------------ 2. core values */

function why() {
  return `<div class="pg pg-why">
  ${RULES}
  <h2 class="hd" aria-label="Core values"><span class="mv" data-anim="gx" data-dx="-3" data-at="4" aria-hidden="true"><span class="fit" data-deck-fit>Core values</span></span></h2>
  <ol class="wps">${sellingPoints
    .map(
      (p, i) => `<li class="wp">
      <p class="wp-s" aria-hidden="true"><span class="mv" data-anim="gx" data-dx="-2" data-at="${10 + i * 24}"><span class="fit" data-deck-fit>${esc(p.short)}</span></span></p>
      <div class="wp-b" data-anim="cut" data-at="${12 + i * 24}">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </div>
    </li>`,
    )
    .join('')}</ol>
</div>`
}

/* Each point flips red as it lands, then the red walks the three once a second. */
function whyBeat(f, { el, reduced }) {
  const items = (el._hot ||= [...el.querySelectorAll('.wp')])
  const k = reduced || f < 10 || f >= 82 ? -1 : Math.floor((f - 10) / 24)
  setHot(el, items, k)
}

/* ------------------------------------------------------------ 4b. three stories, each one click from its full page */

const phText = (t) => (/^Placeholder/i.test(t) ? `${ph()} ${esc(cap(unph(t)))}` : esc(t))

function tale() {
  return `<div class="pg pg-story">
  ${RULES}
  <p class="kick" data-anim="cut" data-at="4">${esc(stories.map((s) => s.arc).join(' · '))}</p>
  <div class="hd-wrap">
    <h2 class="hd" aria-label="Three stories"><span class="mv" data-anim="gx" data-dx="-3" data-at="6" aria-hidden="true"><span class="fit" data-deck-fit>three stories</span></span></h2>
    <p class="pre-ai" data-anim="cut" data-at="10">${esc(storiesPreAi)}</p>
  </div>
  <ol class="beats">${stories
    .map((s, i) => {
      const e = job(s.id)
      return `<li class="bt${i === stories.length - 1 ? ' last' : ''}" data-anim="fill" data-from="t" data-steps="3" data-at="${14 + i * 10}">
      <p class="bt-co"><span class="bt-n" aria-hidden="true">0${i + 1}</span><span>${esc(e.company)}, ${esc(span(e))}</span>${s.placeholder ? ph() : ''}</p>
      <h3>${esc(s.title)}</h3>
      <p class="bt-t">${phText(s.teaser)}</p>
      <a class="bt-a" href="/experience/${esc(s.id)}/">Read the story<span class="sr-only">: ${esc(e.company)}</span>${icon('arrow')}</a>
    </li>`
    })
    .join('')}</ol>
</div>`
}

/* ------------------------------------------------------------ 4c. in their words */

function quotes() {
  return `<div class="pg pg-quotes">
  ${RULES}
  <h2 class="hd" aria-label="In their words"><span class="mv" data-anim="gx" data-dx="-3" data-at="4" aria-hidden="true"><span class="fit" data-deck-fit>in their words</span></span></h2>
  <ul class="qs">${testimonials
    .map((t, i) => {
      const more = t.quotes.length > 1 || t.quotes[0].length > 140
      return `<li class="q${more ? ' has-more' : ''}" data-anim="cut" data-at="${12 + i * 8}">
      ${t.quotes.map((q) => `<blockquote><p>${phText(q)}</p></blockquote>`).join('')}
      <div class="q-foot">
        <p class="who"><b>${esc(t.name)}</b><span>${esc(t.title)}</span></p>
        ${more ? '<button type="button" class="q-more" aria-expanded="false">Read more</button>' : ''}
      </div>
    </li>`
    })
    .join('')}</ul>
</div>`
}

/* ------------------------------------------------------------ 7. next */

function next() {
  const ctas = [
    { href: profile.cvPdf, label: 'Download CV (PDF)', icon: 'download', attrs: 'download' },
    { href: `mailto:${profile.email}`, label: profile.email, icon: 'mail' },
    { href: profile.linkedin, label: 'LinkedIn', icon: 'linkedin', attrs: ext },
    { href: profile.github, label: 'GitHub', icon: 'github', attrs: ext },
  ]
  return `<div class="pg pg-next">
  ${RULES}
  <h2 class="hd" aria-label="Let’s talk"><span class="mv" data-anim="gx" data-dx="-2" data-at="6" aria-hidden="true"><span class="fit" data-deck-fit><span class="ln">let’s</span> <span class="ln">talk</span></span></span></h2>
  <form class="msg" action="${esc(profile.formbold)}" method="POST" data-anim="fill" data-from="t" data-steps="3" data-at="10" data-deck-no-nav>
    <label class="f-name"><span>Name</span><input name="name" autocomplete="name" required></label>
    <label class="f-mail"><span>Email</span><input name="email" type="email" autocomplete="email" required></label>
    <label class="f-msg"><span>Message</span><textarea name="message" required></textarea></label>
    <button class="cta f-send" type="submit">${icon('arrow')}<span aria-live="polite">Send</span></button>
  </form>
  <nav class="ctas" aria-label="Contact and CV">${ctas
    .map((c, i) => `<a class="cta c${i}" href="${esc(c.href)}" ${c.attrs || ''} data-anim="fill" data-from="t" data-steps="2" data-at="${16 + i * 2}">${icon(c.icon)}<span>${esc(c.label)}</span></a>`)
    .join('')}</nav>
  <div class="end" data-anim="cut" data-at="32">
    <button class="end-btn" type="button" data-deck-action="replay">${icon('replay')}<span>Replay</span></button>
  </div>
  <p class="colophon" data-anim="cut" data-at="36"><span>${esc(profile.site.replace(/^https?:\/\//, ''))}</span><span>${esc(profile.location)}</span></p>
</div>`
}

/* ================================================================ KEYNOTE */

const reel = (n, at) =>
  `<span class="reel-win" data-final="${n}" aria-hidden="true"><span class="reel" data-anim="reel" data-at="${at}" data-cfg="cine" data-n="${n}" style="--n:${n}">${Array.from({ length: n + 1 }, (_, i) => `<span>${i}</span>`).join('')}</span></span>`

/* ------------------------------------------------------------ 3. in the making */


/* Eight stops from the first line of code to today: school, freelance, school, then the five companies. */
const stops = [
  { from: profile.codingSince.toString(), year: String(profile.codingSince), co: htx.school, logo: htx.logo, rl: 'Programming class', dt: htx.degree },
  { from: ek.from, year: ek.from, co: ek.school.split(',')[0], logo: ek.logo, rl: ek.degree.split(', ').join(',\n'), dt: `${ek.from}–${ek.to.slice(2)}` },
  ...experience.map((e) => ({
    from: e.from,
    year: e.from.slice(0, 4),
    approx: e.datesApprox,
    co: e.company,
    logo: e.logo,
    rl: e.role,
    rlWords: true,
    dt: span(e),
    cur: !e.to,
  })),
].sort((a, b) => a.from.localeCompare(b.from))

const logoTile = (s) => {
  const first = s.co.split(/[\s,]+/)[0]
  const ini = /^[A-Z]{2,4}$/.test(first) ? first : s.co.replace(/\.\w+$/, '').split(/[\s-]+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  return s.logo
    ? `<span class="logo"><img src="${esc(s.logo)}" alt="" loading="lazy"></span>`
    : `<span class="logo is-ini" aria-hidden="true">${esc(ini)}</span>`
}

const RAIL_AT = 16
const RAIL_LEN = 84
const railEase = Easing.inOut(Easing.sin)
const railP = (f) => railEase(clamp((f - RAIL_AT) / RAIL_LEN, 0, 1))
/** Frame at which the running light reaches stop i of n. */
const arrive = (i, n) => {
  let f = RAIL_AT
  while (railP(f) < i / n) f++
  return f
}

function career() {
  return `
  <div class="l-rail">
    <h2 class="h" data-anim="focus" data-at="2" data-cfg="cine">${stats.codingYears} years in the making.</h2>
    <p class="sub" data-anim="lift" data-at="10" data-cfg="glide">From the first line of ${esc(firstCode)} in ${profile.codingSince} to ${esc(current.company)} today.</p>
    <div class="rail" style="--p:1">
      <span class="rail-line" aria-hidden="true"></span>
      <span class="rail-fill" aria-hidden="true"></span>
      <span class="runner" aria-hidden="true"></span>
      <ol class="stops">${stops
        .map((s, i) => {
          const at = arrive(i, stops.length)
          return `<li class="${s.cur ? 'cur' : ''}">
          <p class="yr" data-anim="focus" data-at="${at}" data-cfg="glide">${s.approx ? '<span class="c">c.</span>' : ''}${esc(s.year)}</p>
          <span class="node" aria-hidden="true"></span>
          <div class="stop-txt" data-anim="lift" data-at="${at + 4}" data-cfg="glide">
            <h3 class="co">${logoTile(s)}<span>${esc(s.co)}</span></h3>
            <p class="rl">${s.rlWords ? s.rl.split(' ').map((w) => `<span class="rl-w">${esc(w)}</span>`).join(' ') : esc(s.rl).replace(/\n/g, '<br> ')}</p>
            <p class="dt">${esc(s.dt)}</p>
          </div>
        </li>`
        })
        .join('')}</ol>
    </div>
  </div>`
}

/** The light runs the rail and switches each stop on as it passes. */
function railUpdate(f, { el }) {
  const rail = (el._rail ??= el.querySelector('.rail'))
  const items = (el._stops ??= [...el.querySelectorAll('.stops > li')])
  const p = railP(f)
  const glow = clamp(Math.min(p * 8, (1 - p) * 5), 0, 1)
  rail.style.setProperty('--p', p.toFixed(4))
  rail.style.setProperty('--glow', glow.toFixed(3))
  items.forEach((li, i) => li.classList.toggle('off', p < i / items.length + 0.004))
}

/* ------------------------------------------------------------ 5. tech specs */

function specs() {
  return `
  <div class="l-spec">
    <div class="spec-head">
      <h2 class="h" data-anim="focus" data-at="2" data-cfg="cine">Tech specs.</h2>
      <p class="arch" data-anim="lift" data-at="12" data-cfg="glide"><strong>${esc(techSpecs.lede)}</strong></p>
      <ul class="pairs" data-anim="lift" data-at="16" data-cfg="glide">${techSpecs.pairs.map(([a, b]) => `<li>${esc(a)} <i>or</i> ${esc(b)}</li>`).join('')}</ul>
      <p class="close" data-anim="lift" data-at="20" data-cfg="glide">${esc(techSpecs.close)}</p>
    </div>
    <dl class="spec-rows">${techSpecs.areas
      .map(
        (s, g) => `<div class="spec-row">
        <span class="hair" data-anim="grow" data-at="${18 + g * 5}" data-len="26" aria-hidden="true"></span>
        <dt data-anim="lift" data-at="${22 + g * 5}" data-cfg="glide">${esc(s.area)}</dt>
        <dd class="main" data-anim="lift" data-at="${23 + g * 5}" data-cfg="glide">${esc(s.main)}</dd>
        <dd class="yrs">${reel(s.years, 24 + g * 5)}<span class="plus" aria-hidden="true">+</span><span class="unit" aria-hidden="true">years</span><span class="sr-only">${s.years}+ years</span></dd>
        <dd class="also" data-anim="lift" data-at="${26 + g * 5}" data-cfg="glide">${esc(s.also)}</dd>
      </div>`,
      )
      .join('')}</dl>
  </div>`
}

/* ------------------------------------------------------------ 5b. how I ship, 5c. beyond the code */

function columns(heading, groups) {
  return `
  <div class="l-ship">
    <h2 class="h" data-anim="focus" data-at="2" data-cfg="cine">${esc(heading)}</h2>
    <div class="ship-cols">${groups
      .map(
        (d, c) => `<section class="ship-col">
        <span class="hair" data-anim="grow" data-at="${12 + c * 10}" data-len="26" aria-hidden="true"></span>
        <h3 data-anim="lift" data-at="${14 + c * 10}" data-cfg="glide">${esc(d.title)}${d.tag ? ` <span class="tag">${esc(d.tag)}</span>` : ''}</h3>
        <ul>${d.points.map((p, i) => `<li data-anim="lift" data-at="${18 + c * 10 + i * 3}" data-cfg="glide">${typeof p === 'string' ? esc(p) : `<b>${esc(p.title)}</b> ${esc(p.text)}`}</li>`).join('')}</ul>
      </section>`,
      )
      .join('')}</div>
  </div>`
}

/* ================================================================ TERMINAL */

/** Per-character key times for a command (frames), and the frame enter is pressed. */
function typed(cmd, start = 6) {
  let t = start
  const times = [...cmd].map((ch, i) => (t += ch === ' ' ? 1.5 : 0.5 + (((ch.charCodeAt(0) * 7 + i * 13) % 9) / 9) * 0.75))
  return { cmd, times, enter: Math.ceil(t + 6) }
}

const PS1 = '<span class="ps1" aria-hidden="true"><b>thore@cph</b> <i>~</i> <u>$</u></span>'
const CUR = '<span class="cur" aria-hidden="true"></span>'

function term(T, out, endAt) {
  return `
  <div class="term">
    <h2 class="prompt">${PS1} <span class="cmd">${esc(T.cmd)}</span>${CUR}</h2>
    <div class="out">${out}</div>
    <p class="prompt next" data-anim="fade" data-at="${T.enter + endAt}" aria-hidden="true">${PS1} ${CUR}</p>
  </div>
  <div class="tear" aria-hidden="true"><i></i><i></i><i></i></div>`
}

const noise = (n) => {
  const x = Math.sin(n * 12.9898 + 4.1) * 43758.5453
  return x - Math.floor(x)
}

/** Typing, enter, shake and tear; `extra` runs after it. */
function session(T, { glitchAt = 2, extra } = {}) {
  let s = null
  return (f, { el, reduced }) => {
    if (s?.el !== el) s = { el, term: el.querySelector('.term'), cmd: el.querySelector('.cmd'), bars: [...el.querySelectorAll('.tear i')], n: -1, typing: null, shake: true, last: Infinity }
    if (f < s.last) s.n = -1
    s.last = f
    const n = f >= T.enter ? T.cmd.length : T.times.filter((t) => t <= f).length
    if (s.cmd && n !== s.n) {
      s.cmd.textContent = T.cmd.slice(0, n)
      s.n = n
    }
    const typing = f < T.enter
    if (typing !== s.typing) {
      s.term.classList.toggle('is-typing', typing)
      s.typing = typing
    }
    const g = f - (T.enter + glitchAt)
    if (!reduced && g >= 0 && g < 10) {
      const a = 18 * (1 - g / 10)
      s.term.style.transform = `translate(${((noise(f) - 0.5) * 2 * a).toFixed(1)}px, ${((noise(f + 3.1) - 0.5) * a).toFixed(1)}px)`
      el.classList.toggle('is-glitch', g < 6)
      s.bars.forEach((b, i) => {
        b.style.top = `${(noise(Math.floor(f / 2) * 3 + i) * 94).toFixed(1)}%`
        b.style.height = `${(2 + noise(f + i * 7) * 16).toFixed(0)}px`
        b.style.transform = `translateX(${((noise(f + i) - 0.5) * 24).toFixed(0)}%)`
      })
      s.shake = true
    } else if (s.shake) {
      s.term.style.transform = ''
      el.classList.remove('is-glitch')
      s.shake = false
    }
    extra?.(f, el, reduced, s)
  }
}

/* ------------------------------------------------------------ 6. AI: tiled terminal windows around the globe
   Six windows touching on a one-pixel line: the globe, which you can drag, and five topics. The topics type in one at a
   time; the untyped part of a line is hidden but keeps its space, so nothing jumps, and on desktop the type shrinks (--k)
   until everything fits without scrolling. "read more" opens the full text mid-screen, where it decrypts into words. */

const AW = aiStory.windows
const AI_T = typed(aiStory.command)
const CPS = 2.2 // characters typed per frame
const TYPE_FRAMES = Math.ceil(AW.reduce((n, x) => n + x.bait.length + x.hook.length + 24, 0) / CPS)
const ty = (text) => `<span class="ty"><span class="ty-on"></span><span class="ty-off">${esc(text)}</span></span>`
const ln = (text, cls) => `<p class="${cls}">${ty(text)}</p>`
const bar = (label, x = '') => `<div class="tag"><span>${esc(label)}</span>${x}</div>`
const LINKS = aiStory.globe.length - 1

function aiWindows(E) {
  const w = (x, i) => `<section class="fw">${bar(x.id)}<div class="ib">${ln(x.bait, 'rm-hot')}${ln(x.hook, 'rm-dim')}<button type="button" class="rm" data-more="${i}">${ty('[ read more ]')}</button></div></section>`
  const globe = `<section class="fw fw-g">${bar('global links')}<div class="ib"><canvas class="globe-cv" role="img" aria-label="Globe with links from Copenhagen to ${LINKS} AI and cloud regions. Drag to spin." data-deck-no-nav></canvas></div></section>`
  return `<div class="wm l-more" data-type-at="${E + 6}">${w(AW[0], 0)}${globe}${AW.slice(1).map((x, i) => w(x, i + 1)).join('')}</div>`
}
const AI_POP = `<div class="pop" hidden data-deck-no-nav>${AW.map(
  (x) => `<section class="fw pop-w" role="dialog" aria-modal="true" aria-label="${esc(x.id)}, read more" hidden>
    ${bar(x.id, '<button type="button" class="pop-x" aria-label="Close">×</button>')}
    <div class="ib"><p class="rm-hot dx">${esc(x.bait)}</p>${x.more.map((m) => `<p class="dx">${esc(m)}</p>`).join('')}${x.source ? `<p class="src">Source: <a href="${esc(x.source.href)}" ${ext}>${esc(x.source.label)}</a></p>` : ''}</div>
  </section>`,
).join('')}</div>`

/** Shrinks the slide's type (--k) until nothing overflows. Desktop only; phones stack and scroll. */
function fitAi(el) {
  el.style.setProperty('--k', '1')
  if (innerWidth <= 700) return
  const boxes = [...el.querySelectorAll('.out, .ib')]
  const over = () => boxes.some((b) => b.scrollHeight > b.clientHeight + 1 || b.scrollWidth > b.clientWidth + 1)
  for (let k = 1; k > 0.5 && over(); ) {
    k -= 0.04
    el.style.setProperty('--k', k.toFixed(2))
  }
}

/** A pure function of the frame: typing, the globe, and a refit whenever the window size changes. */
function aiFrames(f, el, reduced, s) {
  if (!s.typed) {
    const stream = el.querySelector('[data-type-at]')
    let t = +stream.dataset.typeAt
    s.typed = [...stream.querySelectorAll('.ty')].map((node) => {
      const full = [...node.textContent]
      const it = { node, on: node.firstElementChild, off: node.lastElementChild, full, start: t, n: -1 }
      t += Math.ceil(full.length / CPS) + 3
      return it
    })
    const cv = el.querySelector('.globe-cv')
    s.globe = createGlobe(cv, { nodes: aiStory.globe, font: getComputedStyle(cv).fontFamily })
    document.fonts?.ready.then(() => (s.fitKey = ''))
  }
  const key = `${innerWidth}x${innerHeight}`
  if (s.fitKey !== key) {
    s.fitKey = key
    fitAi(el)
  }
  for (const it of s.typed) {
    const n = reduced ? it.full.length : clamp(Math.floor((f - it.start) * CPS), 0, it.full.length)
    if (n === it.n) continue
    it.n = n
    it.on.textContent = it.full.slice(0, n).join('')
    it.off.textContent = it.full.slice(n).join('')
    it.node.classList.toggle('is-idle', n === 0)
    it.node.classList.toggle('is-typing', n > 0 && n < it.full.length)
  }
  s.globe(f / 30)
}

/* ================================================================ the story */

/** id, world, colour theme, preview title, seconds on screen, markup, per-frame hook. */
export const slides = [
  { id: 'intro', world: 'sw', theme: 'sw-white', title: 'Introduction', duration: 6, render: (ctx) => intro(ctx.greeting), update: rain },
  { id: 'why', world: 'sw', theme: 'sw-black', title: 'Core values', duration: 14, render: why, update: whyBeat },
  { id: 'career', world: 'kn', theme: 'kn', title: `${stats.codingYears} years in the making`, duration: 8, render: career, update: railUpdate },
  { id: 'story', world: 'sw', theme: 'sw-black', title: 'Three stories', duration: 12, render: tale },
  { id: 'quotes', world: 'sw', theme: 'sw-white', title: 'In their words', duration: 14, render: quotes },
  { id: 'specs', world: 'kn', theme: 'kn', title: 'Tech specs', duration: 9, render: specs },
  { id: 'ship', world: 'kn', theme: 'kn', title: 'How I ship', duration: 12, render: () => columns('How I ship.', delivery) },
  { id: 'beyond', world: 'kn', theme: 'kn', title: 'Beyond the code', duration: 12, render: () => columns('Beyond the code.', beyond) },
  { id: 'ai', world: 'tm', theme: 'tm', title: 'AI', duration: Math.ceil((AI_T.enter + 40 + TYPE_FRAMES) / 30) + 8, render: () => term(AI_T, aiWindows(AI_T.enter), 9999) + AI_POP, update: session(AI_T, { glitchAt: 0, extra: aiFrames }) },
  { id: 'next', world: 'sw', theme: 'sw-red', title: 'Let’s talk', duration: 5, render: next },
]

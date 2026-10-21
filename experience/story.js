/* One story in full at /experience/<id>/: the id comes from <html data-story>, everything else from shared/data.js. */
import { profile, stories, storiesPreAi, experience, fmtMonth } from '../shared/data.js'
import { esc, icon } from '../shared/deck/html.js'

const job = (id) => experience.find((e) => e.id === id)
const s = stories.find((x) => x.id === document.documentElement.dataset.story)
const e = job(s.id)
const PH = '<span class="ph">Placeholder</span>'
const text = (t) => {
  const u = t.replace(/^Placeholder:\s*/i, '')
  return u === t ? esc(t) : `${PH} ${esc(u[0].toUpperCase() + u.slice(1))}`
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `<div class="bar">
  <a class="btn" href="/" data-back>${icon('back')}<span>Back</span></a>
  <a class="btn" href="mailto:${esc(profile.email)}">Contact</a>
  <a class="btn is-cv" href="${esc(profile.cvPdf)}" download>${icon('download')}<span class="long">Download CV (PDF)</span><span class="short">CV (PDF)</span></a>
</div>
<main class="st">
  <header class="st-head">
    <p class="st-kick">${[s.arc, e.company, e.role, `${fmtMonth(e.from)} – ${fmtMonth(e.to)}`].map(esc).join(' · ')}${s.placeholder ? ` ${PH}` : ''}</p>
    <h1 class="st-title">${esc(s.title)}</h1>
    <p class="st-teaser">${text(s.teaser)}</p>
    <p class="st-pre-ai">${esc(storiesPreAi)}</p>
  </header>
  ${s.beats
    .map(
      (b, bi) => `<section class="st-sec"><h2>${esc(b.label)}</h2><div><p>${text(b.text)}</p>${
        b.link ? `<a class="st-link" href="${esc(b.link.href)}" target="_blank" rel="noopener">${esc(b.link.label)}${icon('arrow')}</a>` : ''
      }${
        b.images
          ? `<div class="st-figs" data-gallery="g${bi}">${b.images
              .map(
                (img) =>
                  `<figure class="st-fig"><button type="button" class="st-fig-btn" aria-label="Open photo: ${esc(img.caption || img.alt)}"><img src="${esc(img.src)}" alt="${esc(img.alt)}" loading="lazy"></button>${img.caption ? `<figcaption>${esc(img.caption)}</figcaption>` : ''}</figure>`,
              )
              .join('')}</div>`
          : ''
      }</div></section>`,
    )
    .join('')}
  <section class="st-sec"><h2>Stack</h2><ul class="tags">${e.stack.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>
  <nav class="st-sec"><h2>More stories</h2><ul class="more">${stories
    .filter((x) => x !== s)
    .map((x) => `<li><a href="/experience/${esc(x.id)}/"><span>${esc(job(x.id).company)}</span><b>${esc(x.title)}</b>${icon('arrow')}</a></li>`)
    .join('')}</ul></nav>
</main>
<div class="lb" hidden role="dialog" aria-modal="true" aria-label="Photo viewer">
  <button type="button" class="lb-close" aria-label="Close">${icon('close')}</button>
  <button type="button" class="lb-prev" aria-label="Previous photo">${icon('back')}</button>
  <button type="button" class="lb-next" aria-label="Next photo">${icon('arrow')}</button>
  <figure><img class="lb-img" alt=""><figcaption class="lb-cap"></figcaption></figure>
</div>`,
)

/* Lightbox: click a proof photo to see it full size. Esc or the backdrop closes it; arrow keys browse the others in its group. */
{
  const lb = document.querySelector('.lb')
  const lbImg = lb.querySelector('.lb-img')
  const lbCap = lb.querySelector('.lb-cap')
  const itemsOf = (group) =>
    [...group.querySelectorAll('.st-fig')].map((fig) => ({ src: fig.querySelector('img').src, alt: fig.querySelector('img').alt, caption: fig.querySelector('figcaption')?.textContent || '' }))
  let group = null
  let i = 0
  let trigger = null

  function render() {
    const it = itemsOf(group)[i]
    lbImg.src = it.src
    lbImg.alt = it.alt
    lbCap.textContent = it.caption
    const many = itemsOf(group).length > 1
    lb.querySelector('.lb-prev').hidden = !many
    lb.querySelector('.lb-next').hidden = !many
  }
  function open(g, index, btn) {
    group = g
    i = index
    trigger = btn
    render()
    lb.hidden = false
    document.body.classList.add('lb-open')
    lb.querySelector('.lb-close').focus()
  }
  function close() {
    lb.hidden = true
    document.body.classList.remove('lb-open')
    trigger?.focus()
  }
  function step(d) {
    const n = itemsOf(group).length
    i = (i + d + n) % n
    render()
  }

  document.querySelectorAll('.st-fig-btn').forEach((btn) => {
    const g = btn.closest('.st-figs')
    btn.addEventListener('click', () => open(g, [...g.querySelectorAll('.st-fig-btn')].indexOf(btn), btn))
  })
  lb.querySelector('.lb-close').addEventListener('click', close)
  lb.querySelector('.lb-prev').addEventListener('click', () => step(-1))
  lb.querySelector('.lb-next').addEventListener('click', () => step(1))
  lb.addEventListener('click', (ev) => ev.target === lb && close())
  addEventListener('keydown', (ev) => {
    if (lb.hidden) return
    if (ev.key === 'Escape') close()
    else if (ev.key === 'ArrowLeft') step(-1)
    else if (ev.key === 'ArrowRight') step(1)
  })
}

/* Back from the deck returns to the slide it came from (the deck keeps #slide=N in its URL). */
if (document.referrer.startsWith(`${location.origin}/`)) {
  document.querySelector('[data-back]').addEventListener('click', (ev) => {
    ev.preventDefault()
    history.back()
  })
}

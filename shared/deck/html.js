/* Small markup helpers for decks: escaping, kinetic letters, icons, initials, the ?for= greeting. */

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])

/** Letters that rise one by one from behind their word (data-anim="rise").
    Mark the parent aria-hidden and give the real text to an aria-label or sr-only copy. */
export function kinetic(text, at = 0, stagger = 1.5) {
  let k = 0
  return String(text)
    .split(' ')
    .map((w) => `<span class="deck-w">${[...w].map((ch) => `<span class="deck-ch" data-anim="rise" data-at="${(at + k++ * stagger).toFixed(1)}">${esc(ch)}</span>`).join('')}</span>`)
    .join(' ')
}

export const initials = (name) =>
  String(name)
    .split(/\s+/)
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

const PATHS = {
  download: '<path d="M12 4v11"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M5 19.5h14"/>',
  mail: '<rect x="3.5" y="5.5" width="17" height="13" rx="2"/><path d="M4 7l8 6 8-6"/>',
  linkedin: '<rect x="3.5" y="3.5" width="17" height="17" rx="3"/><path d="M8 10.5V16M8 7.6v.1M11.5 16v-3.2a2.3 2.3 0 0 1 4.6 0V16M11.5 10.5V16"/>',
  calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  github: '<circle cx="6.5" cy="6" r="2.2"/><circle cx="6.5" cy="18" r="2.2"/><circle cx="17.5" cy="8" r="2.2"/><path d="M6.5 8.2v7.6M17.5 10.2c0 4-6 3.5-10 5.8"/>',
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  back: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  replay: '<path d="M4 12a8 8 0 1 0 2.4-5.7"/><path d="M4 4v4.5h4.5"/>',
  list: '<path d="M9 6.5h11M9 12h11M9 17.5h11"/><circle cx="4.75" cy="6.5" r=".9"/><circle cx="4.75" cy="12" r=".9"/><circle cx="4.75" cy="17.5" r=".9"/>',
  pause: '<path d="M8.5 5.5v13M15.5 5.5v13" stroke-width="3"/>',
  play: '<path d="M8 5.6v12.8L18.6 12z" fill="currentColor"/>',
  skip: '<path d="M5 6.2L13.4 12 5 17.8z"/><path d="M18.5 5.5v13"/>',
  close: '<path d="M6 6l12 12M18 6L6 18"/>',
}

/** Inline SVG icon, stroked with currentColor. Names: download mail linkedin calendar github arrow back replay list pause play skip close. */
export const icon = (name) => `<svg class="deck-i" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${PATHS[name] || ''}</svg>`

/** "?for=acme corp" -> "Hi Acme Corp team". Letters, digits, space and & . ' - only; max 30 characters. */
export function greetingFrom(search) {
  const raw = new URLSearchParams(search).get('for') || ''
  const clean = raw.replace(/[^\p{L}\p{N} &.'-]/gu, ' ').replace(/\s+/g, ' ').trim().slice(0, 30).trim()
  return clean ? `Hi ${clean.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} team` : ''
}

/* A wireframe globe on a 2D canvas: land as dots (or characters, or a faint vector field), great-circle links with
   travelling pulses, pinging pins. Drawn per call from a time in seconds, so a slide's frame clock drives it; drag spins
   it with inertia. Land mask: 720x360 bits, deflated, base64. */

const LAND_B64 = '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'

export async function decodeLand() {
  const bin = Uint8Array.from(atob(LAND_B64), (c) => c.charCodeAt(0))
  const stream = new Blob([bin]).stream().pipeThrough(new DecompressionStream('deflate'))
  return new Uint8Array(await new Response(stream).arrayBuffer())
}

const rad = (d) => (d * Math.PI) / 180
const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const vec = (lat, lon) => [Math.cos(rad(lat)) * Math.sin(rad(lon)), Math.sin(rad(lat)), Math.cos(rad(lat)) * Math.cos(rad(lon))]

export function createGlobe(cv, { nodes, home = 0, ink = '71,255,143', hi = '220,255,232', mode = 'dots', chars = ' .:-=+*#%@', glow = 0, dot = 1, size, lon0 = 0, upper = false, sweep = false, font = '"JetBrains Mono", ui-monospace, monospace' }) {
  const ctx = cv.getContext('2d')
  const pins = nodes.map((n, i) => ({ ...n, v: vec(n.lat, n.lon), phase: (i * 0.37) % 1 }))
  const hub = pins[home]
  const M = 48
  const arcs = pins
    .filter((n) => n !== hub)
    .map((b, i) => {
      const a = hub
      const w = Math.acos(clamp(a.v[0] * b.v[0] + a.v[1] * b.v[1] + a.v[2] * b.v[2], -1, 1))
      const lift = 0.05 + 0.24 * (w / Math.PI)
      const pts = new Float32Array(M * 3)
      for (let k = 0; k < M; k++) {
        const t = k / (M - 1)
        const r = 1 + lift * Math.sin(Math.PI * t)
        for (let j = 0; j < 3; j++) pts[k * 3 + j] = ((a.v[j] * Math.sin((1 - t) * w)) / Math.sin(w) + (b.v[j] * Math.sin(t * w)) / Math.sin(w)) * r
      }
      return { pts, speed: 0.16 + ((i * 0.07) % 0.12), phase: (i * 0.29) % 1, sx: new Float32Array(M), sy: new Float32Array(M), vis: new Uint8Array(M) }
    })
  const grat = []
  for (let lon = 0; lon < 360; lon += 30) grat.push(Array.from({ length: 37 }, (_, k) => vec(-90 + k * 5, lon)))
  for (let lat = -60; lat <= 60; lat += 30) grat.push(Array.from({ length: 73 }, (_, k) => vec(lat, k * 5)))
  let dots = null
  let lastT = 0
  // drag: the user's spin rides on top of the slow auto-spin and coasts out when let go
  const user = { lon: 0, lat: 0, vx: 0, drag: null, at: 0 }
  cv.style.touchAction = 'none'
  cv.style.cursor = 'grab'
  cv.addEventListener('pointerdown', (e) => {
    cv.setPointerCapture(e.pointerId)
    user.drag = { x: e.clientX, y: e.clientY, lon: user.lon, lat: user.lat, t: performance.now(), lx: e.clientX }
    user.vx = 0
    cv.style.cursor = 'grabbing'
  })
  cv.addEventListener('pointermove', (e) => {
    const d = user.drag
    if (!d) return
    const k = 180 / Math.max(160, cv.clientWidth)
    user.lon = d.lon - (e.clientX - d.x) * k
    user.lat = clamp(d.lat + (e.clientY - d.y) * k, -60, 60)
    const now = performance.now()
    user.vx = (-(e.clientX - d.lx) * k) / Math.max(0.008, (now - d.t) / 1000)
    d.lx = e.clientX
    d.t = now
    draw(lastT)
  })
  const release = () => {
    if (!user.drag) return
    user.drag = null
    user.vx = clamp(user.vx, -120, 120)
    user.at = performance.now()
    cv.style.cursor = 'grab'
  }
  cv.addEventListener('pointerup', release)
  cv.addEventListener('pointercancel', release)
  decodeLand().then((bytes) => {
    const isLand = (lat, lon) => {
      const k = Math.min(359, Math.floor((90 - lat) * 2)) * 720 + Math.min(719, Math.floor((lon + 180) * 2))
      return bytes[k >> 3] & (0x80 >> (k & 7))
    }
    const out = []
    let ring = 0
    for (let lat = -87; lat <= 87; lat += 1.8, ring++) {
      const n = Math.max(1, Math.round((360 * Math.cos(rad(lat))) / 1.8))
      for (let i = 0; i < n; i++) {
        const lon = -180 + ((i + (ring % 2) * 0.5) / n) * 360
        if (isLand(lat, lon)) out.push(...vec(lat, lon), lat)
      }
    }
    dots = new Float32Array(out)
    draw(lastT)
  })

  return draw
  function draw(t) {
    lastT = t
    const dpr = Math.min(devicePixelRatio || 1, 2)
    const w = cv.clientWidth
    const h = cv.clientHeight
    if (w < 20 || h < 20) return
    if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) {
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
    }
    if (!user.drag && user.vx) {
      const now = performance.now()
      const dt = Math.min(0.05, (now - user.at) / 1000)
      user.at = now
      user.lon += user.vx * dt
      user.vx *= Math.exp(-dt * 2.2)
      if (Math.abs(user.vx) < 0.5) user.vx = 0
    }
    const lon = hub.lon - 40 + lon0 + t * 6 + user.lon
    const lat = clamp(24 + 6 * Math.sin(t / 9) + user.lat, -70, 70)
    const cl = Math.cos(rad(lon)), sl = Math.sin(rad(lon)), ct = Math.cos(rad(lat)), st = Math.sin(rad(lat))
    const cx = w / 2, cy = h / 2, R = Math.min(w, h) * (sweep ? 0.38 : 0.44)
    const P = [0, 0, 0]
    const proj = (x, y, z) => {
      const x1 = x * cl - z * sl
      const z1 = x * sl + z * cl
      P[0] = cx + R * x1
      P[1] = cy - R * (y * ct - z1 * st)
      P[2] = y * st + z1 * ct
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, w, h)
    ctx.strokeStyle = `rgba(${ink},.45)`
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(cx, cy, R, 0, Math.PI * 2)
    ctx.stroke()

    const front = new Path2D()
    for (const line of grat) {
      let pz = -1, px = 0, py = 0
      line.forEach((v, k) => {
        proj(v[0], v[1], v[2])
        if (k && P[2] >= 0 && pz >= 0) {
          front.moveTo(px, py)
          front.lineTo(P[0], P[1])
        }
        px = P[0]; py = P[1]; pz = P[2]
      })
    }
    ctx.strokeStyle = `rgba(${ink},${mode === 'wire' ? 0.42 : 0.14})`
    ctx.stroke(front)
    if (glow) {
      ctx.shadowColor = `rgba(${ink},.9)`
      ctx.shadowBlur = glow
    }

    if (dots) {
      const scan = -72 + 144 * ((t / 6.5) % 1)
      const s = clamp(R / 90, 1.2, 2.4) * dot
      const layers = [[], [], [], [], []]
      const hot = []
      for (let i = 0; i < dots.length; i += 4) {
        proj(dots[i], dots[i + 1], dots[i + 2])
        if (P[2] < 0) continue
        if (Math.abs(dots[i + 3] - scan) < 2.2) hot.push(P[0], P[1])
        else layers[Math.min(4, (P[2] * 5) | 0)].push(P[0], P[1])
      }
      if (mode === 'ascii') {
        // a coarser grid of characters, denser glyphs where the surface faces you
        // land snapped to a character grid the size of the page's own type, denser glyphs where it faces you
        const gs = (typeof size === 'function' ? size() : size) || clamp(R / 26, 7, 13)
        ctx.font = `600 ${gs.toFixed(1)}px ${font}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const cw = gs * 0.62
        const ch = gs * 1.05
        const seen = new Set()
        const glyphs = [...chars]
        layers.forEach((arr, i) => {
          ctx.fillStyle = `rgba(${ink},${[0.3, 0.45, 0.62, 0.8, 0.95][i]})`
          for (let j = 0; j < arr.length; j += 2) {
            const gx = Math.round(arr[j] / cw)
            const gy = Math.round(arr[j + 1] / ch)
            const key = gx * 4096 + gy
            if (seen.has(key)) continue
            seen.add(key)
            ctx.fillText(glyphs[Math.min(glyphs.length - 1, Math.floor(((i + 1) / 5) * (glyphs.length - 1)) + ((gx + gy) % 2))], gx * cw, gy * ch)
          }
        })
        ctx.fillStyle = `rgba(${hi},.95)`
        for (let j = 0; j < hot.length; j += 6) ctx.fillText(glyphs[glyphs.length - 1], Math.round(hot[j] / cw) * cw, Math.round(hot[j + 1] / ch) * ch)
        ctx.textAlign = 'start'
        ctx.textBaseline = 'alphabetic'
      } else {
        const paint = (arr, color) => {
          ctx.fillStyle = color
          ctx.beginPath()
          for (let i = 0; i < arr.length; i += 2) ctx.rect(arr[i] - s / 2, arr[i + 1] - s / 2, s, s)
          ctx.fill()
        }
        const alphas = mode === 'wire' ? [0.06, 0.1, 0.16, 0.22, 0.3] : [0.18, 0.32, 0.5, 0.7, 0.9]
        layers.forEach((arr, i) => paint(arr, `rgba(${ink},${alphas[i]})`))
        paint(hot, `rgba(${hi},.95)`)
      }
    }

    for (const a of arcs) {
      ctx.beginPath()
      let open = false
      for (let k = 0; k < M; k++) {
        proj(a.pts[k * 3], a.pts[k * 3 + 1], a.pts[k * 3 + 2])
        const x = P[0], y = P[1]
        const v = P[2] >= 0 || (x - cx) ** 2 + (y - cy) ** 2 > R * R
        a.sx[k] = x; a.sy[k] = y; a.vis[k] = v ? 1 : 0
        if (v) { if (open) ctx.lineTo(x, y); else ctx.moveTo(x, y); open = true } else open = false
      }
      ctx.strokeStyle = `rgba(${ink},.4)`
      ctx.stroke()
      const u = (t * a.speed + a.phase) % 1.35
      if (u <= 1) {
        const k1 = Math.round(u * (M - 1))
        ctx.beginPath()
        let o = false
        for (let k = Math.max(0, k1 - 8); k <= k1; k++) {
          if (!a.vis[k]) { o = false; continue }
          if (o) ctx.lineTo(a.sx[k], a.sy[k]); else ctx.moveTo(a.sx[k], a.sy[k])
          o = true
        }
        ctx.strokeStyle = `rgba(${hi},.95)`
        ctx.lineWidth = 2
        ctx.stroke()
        ctx.lineWidth = 1
      }
    }

    if (sweep) {
      // a radar arm turning once every four seconds, its wake fading behind it
      const a = (t / 4) * Math.PI * 2
      for (let k = 0; k < 24; k++) {
        const b = a - k * 0.035
        ctx.strokeStyle = `rgba(${ink},${(0.5 * (1 - k / 24)).toFixed(3)})`
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(cx + Math.cos(b) * R * 1.12, cy + Math.sin(b) * R * 1.12)
        ctx.stroke()
      }
      ctx.strokeStyle = `rgba(${ink},.3)`
      for (const r of [0.5, 0.8, 1.12]) {
        ctx.beginPath()
        ctx.arc(cx, cy, R * r, 0, Math.PI * 2)
        ctx.stroke()
      }
    }

    ctx.font = `600 11px ${font}`
    const labels = []
    for (const n of pins) {
      proj(n.v[0], n.v[1], n.v[2])
      if (P[2] < 0.02) continue
      const ph = (t * 0.45 + n.phase) % 1
      ctx.strokeStyle = `rgba(${n === hub ? hi : ink},${0.8 * (1 - ph)})`
      ctx.beginPath()
      ctx.arc(P[0], P[1], 3 + ph * (n === hub ? 16 : 11), 0, Math.PI * 2)
      ctx.stroke()
      ctx.fillStyle = `rgb(${n === hub ? hi : ink})`
      ctx.beginPath()
      ctx.arc(P[0], P[1], n === hub ? 3.2 : 2.4, 0, Math.PI * 2)
      ctx.fill()
      if (n === hub || n.label) labels.push([n, P[0], P[1]])
    }
    // labels last, so no pin or arc is drawn over them
    ctx.shadowBlur = 0
    for (const [n, px, py] of labels) {
      const label = upper ? n.name.toUpperCase() : n.name
      const tw = ctx.measureText(label).width
      const lx = px + 9 + tw > w - 4 ? px - 9 - tw : px + 9
      // a knockout behind the label, so it never reads as struck through by the land or the wires
      ctx.fillStyle = 'rgba(2,8,4,.88)'
      ctx.fillRect(lx - 4, py - 17, tw + 8, 15)
      ctx.fillStyle = `rgba(${hi},.95)`
      ctx.fillText(label, lx, py - 6)
    }
    ctx.shadowBlur = 0
  }
}

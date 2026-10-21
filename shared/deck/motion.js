/* Frame-based motion helpers, same semantics as Remotion's interpolate / spring / Easing.
   Everything is a pure function of a frame number. */

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

function bezier(x1, y1, x2, y2) {
  if (x1 === y1 && x2 === y2) return (t) => t
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by
  const X = (t) => ((ax * t + bx) * t + cx) * t
  const Y = (t) => ((ay * t + by) * t + cy) * t
  const dX = (t) => (3 * ax * t + 2 * bx) * t + cx
  return (x) => {
    if (x <= 0) return 0
    if (x >= 1) return 1
    let t = x
    for (let i = 0; i < 8; i++) {
      const err = X(t) - x
      if (Math.abs(err) < 1e-5) return Y(t)
      const d = dX(t)
      if (Math.abs(d) < 1e-6) break
      t -= err / d
    }
    let lo = 0, hi = 1
    t = x
    for (let i = 0; i < 24; i++) {
      const v = X(t)
      if (Math.abs(v - x) < 1e-5) break
      if (v < x) lo = t
      else hi = t
      t = (lo + hi) / 2
    }
    return Y(t)
  }
}

export const Easing = {
  linear: (t) => t,
  quad: (t) => t * t,
  cubic: (t) => t * t * t,
  sin: (t) => 1 - Math.cos((t * Math.PI) / 2),
  exp: (t) => Math.pow(2, 10 * (t - 1)),
  back: (s = 1.70158) => (t) => t * t * ((s + 1) * t - s),
  bezier,
  in: (fn) => fn,
  out: (fn) => (t) => 1 - fn(1 - t),
  inOut: (fn) => (t) => (t < 0.5 ? fn(t * 2) / 2 : 1 - fn((1 - t) * 2) / 2),
}

/** interpolate(frame, [inA, inB, ...], [outA, outB, ...], { easing, extrapolateLeft, extrapolateRight }) */
export function interpolate(input, inputRange, outputRange, { easing = Easing.linear, extrapolateLeft = 'extend', extrapolateRight = 'extend' } = {}) {
  const n = inputRange.length
  let r = input
  if (r < inputRange[0] && extrapolateLeft === 'clamp') r = inputRange[0]
  if (r > inputRange[n - 1] && extrapolateRight === 'clamp') r = inputRange[n - 1]
  let i = 1
  while (i < n - 1 && r > inputRange[i]) i++
  const a = inputRange[i - 1], b = inputRange[i]
  if (a === b) return outputRange[i - 1]
  return outputRange[i - 1] + easing((r - a) / (b - a)) * (outputRange[i] - outputRange[i - 1])
}

/** Closed-form damped spring from 0 to 1. */
function springAt(t, { mass, damping, stiffness }) {
  if (t <= 0) return 0
  const w0 = Math.sqrt(stiffness / mass)
  const zeta = damping / (2 * Math.sqrt(stiffness * mass))
  if (zeta < 1 - 1e-9) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta)
    return 1 - Math.exp(-zeta * w0 * t) * (Math.cos(wd * t) + ((zeta * w0) / wd) * Math.sin(wd * t))
  }
  if (zeta <= 1 + 1e-9) return 1 - (1 + w0 * t) * Math.exp(-w0 * t)
  const s = Math.sqrt(zeta * zeta - 1)
  const r1 = -w0 * (zeta - s), r2 = -w0 * (zeta + s)
  const A = r2 / (r1 - r2)
  return 1 + A * Math.exp(r1 * t) + (-1 - A) * Math.exp(r2 * t)
}

/** spring({ frame, fps, config: { damping, mass, stiffness }, from, to }) */
export function spring({ frame, fps, config = {}, from = 0, to = 1 }) {
  const x = springAt(Math.max(0, frame) / fps, { damping: 10, mass: 1, stiffness: 100, ...config })
  return from + (to - from) * x
}

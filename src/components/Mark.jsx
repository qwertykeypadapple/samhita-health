/**
 * Samhita mark: a four-point star with concave arms, its nodes sitting in the
 * diagonal gaps on a faint orbit: a star that is also a federation seen from
 * above. Arms stay thin so the shape survives at favicon size.
 */
const C = 16
const ARM = 15.1
const WAIST = 2.55
const ORBIT = 9.1

const pt = (deg, r) => {
  const a = ((deg - 90) * Math.PI) / 180
  return [C + r * Math.cos(a), C + r * Math.sin(a)]
}
const f = (n) => n.toFixed(2)

/* Four arms; the waist between each pair is the quadratic's control point. */
const STAR = (() => {
  const [sx, sy] = pt(0, ARM)
  let d = `M${f(sx)} ${f(sy)}`
  for (let i = 0; i < 4; i++) {
    const [cx, cy] = pt(i * 90 + 45, WAIST)
    const [nx, ny] = pt((i + 1) * 90, ARM)
    d += `Q${f(cx)} ${f(cy)} ${f(nx)} ${f(ny)}`
  }
  return `${d}Z`
})()

const NODES = [45, 135, 225, 315].map((deg) => pt(deg, ORBIT))

export default function Mark({ className = 'h-7 w-7' }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx={C} cy={C} r={ORBIT} fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.22" />
      <path d={STAR} fill="currentColor" />
      {NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.45" fill="currentColor" opacity="0.9" />
      ))}
      <circle cx={C} cy={C} r="2.3" fill="currentColor" />
      <circle cx={C} cy={C} r="0.95" fill="var(--color-paper)" />
    </svg>
  )
}

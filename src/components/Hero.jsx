import { useEffect, useState } from 'react'

/**
 * Ambient federation diagram. Ticks on a timer rather than a setState per
 * animation frame, and only while its face is at the front of the cube.
 */
export function HeroWeave({ active = true }) {
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setT((v) => v + 1), 70)
    return () => clearInterval(id)
  }, [active])

  const nodes = [
    { x: 60, y: 62 },
    { x: 232, y: 42 },
    { x: 300, y: 176 },
    { x: 196, y: 288 },
    { x: 46, y: 216 },
  ]
  const c = { x: 172, y: 164 }

  return (
    <svg viewBox="0 0 360 340" className="h-full w-full">
      <defs>
        <radialGradient id="halo" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#14a8a0" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#14a8a0" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx={c.x} cy={c.y} r="120" fill="url(#halo)" />

      {nodes.map((n, i) => {
        const phase = (t * 0.9 + i * 22) % 100
        const p = phase / 100
        const outbound = p < 0.5
        const k = outbound ? p * 2 : (p - 0.5) * 2
        const px = outbound ? c.x + (n.x - c.x) * k : n.x + (c.x - n.x) * k
        const py = outbound ? c.y + (n.y - c.y) * k : n.y + (c.y - n.y) * k
        return (
          <g key={i}>
            <line x1={c.x} y1={c.y} x2={n.x} y2={n.y} stroke="#a3c4d6" strokeWidth="1" opacity="0.55" />
            <circle cx={px} cy={py} r={outbound ? 2.6 : 3.4} fill={outbound ? '#3c7291' : '#14a8a0'} opacity="0.95" />
            {!outbound && <circle cx={px} cy={py} r="6" fill="#14a8a0" opacity="0.16" />}
            <circle cx={n.x} cy={n.y} r="15" fill="#fff" stroke="#d0e2ec" />
            <path
              d={`M${n.x - 6} ${n.y + 5} v-7 l6 -4 l6 4 v7 z`}
              fill="none"
              stroke="#24506a"
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path d={`M${n.x} ${n.y - 2} v4 M${n.x - 2} ${n.y} h4`} stroke="#14a8a0" strokeWidth="1.3" />
          </g>
        )
      })}

      <circle cx={c.x} cy={c.y} r="26" fill="#0a1a26" />
      <circle cx={c.x} cy={c.y} r="26" fill="none" stroke="#14a8a0" strokeWidth="1" opacity="0.5" />
      <path d={`M${c.x - 9} ${c.y} h18 M${c.x} ${c.y - 9} v18`} stroke="#7fe0d6" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

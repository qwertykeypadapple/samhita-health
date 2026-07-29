import { useEffect, useRef, useState } from 'react'
import { Icons, Pill } from '../lib/ui'

const SITES = [
  { name: 'Apex Institute', city: 'Delhi', n: '84,200' },
  { name: 'Medical College', city: 'Pune', n: '51,700' },
  { name: 'Cancer Centre', city: 'Kolkata', n: '29,600' },
  { name: 'District Hospital', city: 'Nashik', n: '22,400' },
  { name: 'Trust Hospital', city: 'Kochi', n: '38,900' },
]

const CX = 380
const CY = 216
const RX = 268
const RY = 146

const POS = SITES.map((_, i) => {
  const a = ((-90 + i * 72) * Math.PI) / 180
  return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) }
})

const STEPS = [
  {
    key: 'dispatch',
    label: 'Dispatch',
    title: 'The model travels to the hospital',
    body:
      'The coordinator sends the current global model (architecture and weights, nothing else) to every site over an outbound TLS channel the hospital itself opens. No inbound port is exposed on your network.',
    tint: '#3c7291',
  },
  {
    key: 'train',
    label: 'Local training',
    title: 'Training happens entirely behind your firewall',
    body:
      'The node reads your records over a read-only connection to your HIS or FHIR layer and trains on your own hardware. Identifiers are stripped before a tensor is ever constructed. Nothing crosses the perimeter.',
    tint: '#0d8b88',
  },
  {
    key: 'update',
    label: 'Update leaves',
    title: 'Only a masked gradient leaves the building',
    body:
      'What returns is a weight delta, masked and noised before transmission. Not a record, not a summary statistic, not a de-identified extract. A tensor of numbers describing how the model should change.',
    tint: '#14a8a0',
  },
  {
    key: 'aggregate',
    label: 'Secure aggregation',
    title: 'The coordinator can only see the sum',
    body:
      'Pairwise masks cancel only when contributions are combined. The coordinator computes the aggregate without ever being able to read any single hospital’s update, including yours. Cryptographic, not contractual.',
    tint: '#0b6e6e',
  },
  {
    key: 'release',
    label: 'New global model',
    title: 'A better model returns to every site',
    body:
      'The updated model is versioned, content-addressed and logged with a manifest of which sites contributed. Then the round repeats, and your hospital ends up with a model trained on the whole federation’s experience.',
    tint: '#17364a',
  },
]

const STEP_MS = 4200

function HospitalNode({ p, site, step, prog }) {
  const training = step === 1
  const active = step === 1 || step === 2
  return (
    <g>
      {training && (
        <circle cx={p.x} cy={p.y} r={52} fill="none" stroke="#0d8b88" strokeWidth="1.2" strokeDasharray="4 6" opacity={0.5} />
      )}

      <rect
        x={p.x - 66}
        y={p.y - 24}
        width="132"
        height="48"
        rx="11"
        fill="#fff"
        stroke={active ? '#14a8a0' : '#d0e2ec'}
        strokeWidth={active ? 1.6 : 1}
        style={{ transition: 'stroke .4s ease' }}
      />
      <g transform={`translate(${p.x - 57} ${p.y - 10})`} stroke="#24506a" strokeWidth="1.3" fill="none">
        <path d="M2 19h16M4 19V7l7-4 7 4v12" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11 9v5M8.5 11.5h5" stroke="#14a8a0" />
      </g>
      <text x={p.x - 30} y={p.y - 3} fontSize="10" fontWeight="600" fill="#0a1a26" fontFamily="Newsreader, serif">
        {site.name}
      </text>
      <text x={p.x - 30} y={p.y + 9.5} fontSize="8.5" fill="#6b9cb8" fontFamily="Newsreader, serif">
        {site.city} · {site.n}
      </text>

      <g opacity={training ? 1 : 0.35} style={{ transition: 'opacity .4s ease' }}>
        <rect
          x={p.x - 26}
          y={p.y + 29}
          width="52"
          height="14"
          rx="4"
          fill={training ? '#e8f1f6' : '#f4f2ed'}
          stroke={training ? '#35c9bd' : '#d0e2ec'}
        />
        <text
          x={p.x}
          y={p.y + 39}
          fontSize="7.5"
          textAnchor="middle"
          fill={training ? '#0b6e6e' : '#6b9cb8'}
          fontFamily="JetBrains Mono, monospace"
        >
          PHI · local
        </text>
      </g>

      {training &&
        [0, 1, 2].map((k) => {
          const w = 8 + ((prog * 3 + k * 0.33) % 1) * 26
          return (
            <rect key={k} x={p.x - 40} y={p.y + 48 + k * 4} width={w} height="2" rx="1" fill="#35c9bd" opacity={0.75 - k * 0.18} />
          )
        })}
    </g>
  )
}

export default function RoundVisualiser({ active }) {
  const [step, setStep] = useState(0)
  const [prog, setProg] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [round, setRound] = useState(47)
  const t0 = useRef(performance.now())

  useEffect(() => {
    if (!active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setProg(1)
      return
    }
    const id = setInterval(() => {
      const now = performance.now()
      const p = Math.min(1, (now - t0.current) / STEP_MS)
      setProg(p)
      if (p >= 1 && playing) {
        t0.current = now
        setStep((s) => {
          const next = (s + 1) % STEPS.length
          if (next === 0) setRound((r) => r + 1)
          return next
        })
      }
    }, 66)
    return () => clearInterval(id)
  }, [playing, active])

  const goto = (i) => {
    setStep(i)
    t0.current = performance.now()
    setProg(0)
  }

  const s = STEPS[step]
  const outbound = step === 0
  const inbound = step === 2
  const aggregating = step === 3
  const releasing = step === 4

  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      {/* Canvas */}
      <div className="card self-start overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink-100 px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <button
              data-nodrag
              onClick={() => {
                setPlaying((p) => !p)
                t0.current = performance.now()
              }}
              className="grid h-7 w-7 place-items-center rounded-full bg-ink-900 text-paper transition hover:bg-ink-700"
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                  <rect x="6" y="5" width="4" height="14" rx="1" />
                  <rect x="14" y="5" width="4" height="14" rx="1" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-3 w-3 translate-x-px" fill="currentColor">
                  <path d="M7 4.5l12 7.5-12 7.5z" />
                </svg>
              )}
            </button>
            <span className="font-mono text-[0.7rem] text-ink-500">round {round}</span>
          </div>
          <div className="flex items-center gap-1.5">
            {STEPS.map((st, i) => (
              <button
                data-nodrag
                key={st.key}
                onClick={() => goto(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-7 bg-signal-500' : 'w-3.5 bg-ink-200 hover:bg-ink-300'
                }`}
                aria-label={st.label}
              />
            ))}
          </div>
        </div>

        <div className="bg-[linear-gradient(180deg,#fbfaf7,#f4f2ed)]">
          <svg viewBox="0 0 760 430" className="w-full">
            {POS.map((p, i) => (
              <line
                key={`l${i}`}
                x1={CX}
                y1={CY}
                x2={p.x}
                y2={p.y}
                stroke={outbound || inbound || releasing ? '#a3c4d6' : '#d0e2ec'}
                strokeWidth="1.1"
                style={{ transition: 'stroke .4s ease' }}
              />
            ))}

            {(outbound || inbound || releasing) &&
              POS.map((p, i) => {
                const local = Math.min(1, Math.max(0, prog * 1.25 - i * 0.05))
                const goOut = outbound || releasing
                const k = goOut ? local : 1 - local
                const x = CX + (p.x - CX) * k
                const y = CY + (p.y - CY) * k
                if (local <= 0 || local >= 1) return null
                return (
                  <g key={`p${i}`}>
                    <circle cx={x} cy={y} r="11" fill={s.tint} opacity="0.12" />
                    <rect x={x - 8} y={y - 6.5} width="16" height="13" rx="3" fill={s.tint} opacity="0.95" />
                    {inbound ? (
                      <path d={`M${x - 2.6} ${y + 1.5} v-2.4 a2.6 2.6 0 0 1 5.2 0 v2.4`} fill="none" stroke="#fff" strokeWidth="1.1" />
                    ) : (
                      <path d={`M${x - 3} ${y} h6 M${x} ${y - 3} v6`} stroke="#fff" strokeWidth="1.2" />
                    )}
                  </g>
                )
              })}

            {POS.map((p, i) => (
              <HospitalNode key={i} p={p} site={SITES[i]} step={step} prog={prog} />
            ))}

            <g>
              {aggregating && <circle cx={CX} cy={CY} r={42 + prog * 14} fill="#0b6e6e" opacity={0.16 * (1 - prog)} />}
              <rect
                x={CX - 62}
                y={CY - 32}
                width="124"
                height="64"
                rx="13"
                fill="#0a1a26"
                stroke={aggregating ? '#35c9bd' : '#17364a'}
                strokeWidth="1.4"
                style={{ transition: 'stroke .4s ease' }}
              />
              <text x={CX} y={CY - 12} fontSize="8.5" textAnchor="middle" fill="#6b9cb8" fontFamily="JetBrains Mono, monospace" letterSpacing="1">
                COORDINATOR
              </text>
              <text x={CX} y={CY + 3} fontSize="12" fontWeight="600" textAnchor="middle" fill="#fff" fontFamily="Newsreader, serif">
                {aggregating ? 'Σ masked' : releasing ? `model v${round}` : 'aggregation'}
              </text>
              {/* Budget: the box is 124 units wide and JetBrains Mono advances
                  0.6em, so at 8px these captions must stay under 23 characters
                  or they spill past the coordinator's edges. */}
              <text x={CX} y={CY + 18} fontSize="8" textAnchor="middle" fill="#7fe0d6" fontFamily="JetBrains Mono, monospace">
                {aggregating ? 'individual sites hidden' : 'holds no patient data'}
              </text>
            </g>

            <g>
              <rect x="20" y="392" width={318} height="24" rx="8" fill="#fff" stroke="#d0e2ec" />
              <circle cx="37" cy="404" r="4" fill={s.tint} />
              <text x="49" y="408" fontSize="10.5" fill="#17364a" fontFamily="Newsreader, serif" fontWeight="500">
                {step + 1}. {s.title}
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* Explainer */}
      <div className="flex flex-col gap-4">
        <div className="card p-5">
          <div className="flex flex-wrap gap-1.5">
            {STEPS.map((st, i) => (
              <button
                data-nodrag
                key={st.key}
                onClick={() => goto(i)}
                className={`rounded-full border px-2.5 py-1 text-[0.66rem] font-semibold transition ${
                  i === step ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-200 text-ink-500 hover:border-ink-400'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
          <h3 className="font-serif mt-4 text-[1.25rem] leading-snug text-ink-900">{s.title}</h3>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-ink-600">{s.body}</p>
        </div>

        <div className="card overflow-hidden">
          <div className="border-b border-ink-100 px-4 py-2.5">
            <span className="eyebrow text-ink-400">Packet inspector · what is on the wire</span>
          </div>
          <div className="grid gap-4 px-4 py-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {step === 1 ? (
              <div className="flex items-center gap-3 rounded-lg border border-signal-300/60 bg-signal-300/10 px-3 py-4">
                <Icons.lock className="h-4 w-4 shrink-0 text-signal-700" />
                <p className="text-[0.78rem] font-medium text-signal-700">
                  Nothing. During local training the node transmits zero bytes.
                </p>
              </div>
            ) : (
              <pre className="overflow-x-auto rounded-lg bg-ink-950 p-3 font-mono text-[0.63rem] leading-relaxed text-ink-200">
{`{
  "round"      : ${round},
  "site"       : "sha256:9f3c…a1",
  "payload"    : "float16[11,341,760]",
  "masked"     : ${step >= 2 ? 'true' : 'false'},
  "dp_noise"   : "${step >= 2 ? 'gaussian σ=1.10' : 'n/a'}",
  "identifiers": []
}`}
              </pre>
            )}

            <div className="grid content-start gap-1.5">
              <span className="eyebrow text-risk-600">Never transmitted</span>
              {[
                'Names, ABHA numbers, MRNs',
                'DICOM pixel data or study files',
                'Notes, lab values, prescriptions',
                'Row-level records of any kind',
              ].map((x) => (
                <div key={x} className="flex items-center gap-2 text-[0.74rem] text-ink-500">
                  <Icons.x className="h-3 w-3 shrink-0 text-risk-600" />
                  <span className="line-through decoration-risk-300 decoration-2">{x}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Pill tone="signal">
            <Icons.check className="h-3 w-3" /> No inbound ports
          </Pill>
          <Pill tone="signal">
            <Icons.check className="h-3 w-3" /> Read-only HIS access
          </Pill>
          <Pill tone="signal">
            <Icons.check className="h-3 w-3" /> Per-round audit manifest
          </Pill>
        </div>
      </div>
    </div>
  )
}

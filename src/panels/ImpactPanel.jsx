import { useMemo, useState } from 'react'
import { Icons } from '../lib/ui'

const fmt = (n) =>
  n >= 1e7 ? `${(n / 1e7).toFixed(2)} Cr` : n >= 1e5 ? `${(n / 1e5).toFixed(2)} L` : Math.round(n).toLocaleString('en-IN')

/* Learning curve: AUC as a function of positive-case count. */
const aucOf = (n) => (n < 1 ? 0.5 : Math.min(0.965, 0.97 - 0.42 * Math.pow(n, -0.22)))

function Slider({ label, value, min, max, step, onChange, display, hint }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label className="text-[0.79rem] font-semibold text-ink-800">{label}</label>
        <span className="font-mono text-[0.92rem] font-medium text-ink-900">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-2.5" />
      {hint && <p className="mt-1 text-[0.65rem] leading-snug text-ink-400">{hint}</p>}
    </div>
  )
}

function CohortCurve({ solo, fed }) {
  const W = 460
  const H = 190
  const P = { l: 36, r: 14, t: 12, b: 26 }
  const pw = W - P.l - P.r
  const ph = H - P.t - P.b
  const lo = 10
  const hi = 200000
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
  /* Clamp both ends: a large federation can compute well past the axis
     maximum, and an unclamped x puts the marker outside the viewBox, where
     it is silently clipped away instead of pinning to the axis end. */
  const xOf = (n) => P.l + ((Math.log(clamp(n, lo, hi)) - Math.log(lo)) / (Math.log(hi) - Math.log(lo))) * pw
  const yOf = (a) => P.t + ph - ((a - 0.62) / 0.35) * ph
  /* Centred labels need half their own width of room at either end. */
  const labelX = (n) => clamp(xOf(n), P.l + 16, W - P.r - 16)

  const path = useMemo(() => {
    let d = ''
    for (let i = 0; i <= 80; i++) {
      const n = lo * Math.pow(hi / lo, i / 80)
      d += `${i ? 'L' : 'M'}${xOf(n).toFixed(1)} ${yOf(aucOf(n)).toFixed(1)}`
    }
    return d
  }, [])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      {[0, 0.33, 0.66, 1].map((g) => (
        <line key={g} x1={P.l} x2={W - P.r} y1={P.t + ph * g} y2={P.t + ph * g} stroke="#e8f1f6" />
      ))}
      {[100, 1000, 10000, 100000].map((n) => (
        <text key={n} x={xOf(n)} y={H - 8} fontSize="8.5" textAnchor="middle" fill="#6b9cb8" fontFamily="JetBrains Mono, monospace">
          {n >= 1000 ? `${n / 1000}k` : n}
        </text>
      ))}
      <path d={path} fill="none" stroke="#d0e2ec" strokeWidth="2.4" />

      {[
        { n: solo, a: aucOf(solo), c: '#c04a3f', label: 'alone' },
        { n: fed, a: aucOf(fed) - 0.012, c: '#0d8b88', label: 'federated' },
      ].map((m) => (
        <g key={m.label}>
          <line x1={xOf(m.n)} x2={xOf(m.n)} y1={yOf(m.a)} y2={P.t + ph} stroke={m.c} strokeWidth="1" strokeDasharray="3 3" />
          <circle cx={xOf(m.n)} cy={yOf(m.a)} r="5" fill={m.c} stroke="#fff" strokeWidth="2" />
          <text x={labelX(m.n)} y={yOf(m.a) - 10} fontSize="9.5" textAnchor="middle" fill={m.c} fontWeight="600" fontFamily="Newsreader, serif">
            {m.a.toFixed(3)}
          </text>
        </g>
      ))}
    </svg>
  )
}

export default function ImpactPanel() {
  const [vol, setVol] = useState(24000)
  const [partners, setPartners] = useState(7)
  const [ratio, setRatio] = useState(85)
  const [prev, setPrev] = useState(1.2)
  const [years, setYears] = useState(3)

  const soloCases = (vol * years * prev) / 100
  const fedCases = soloCases * (1 + (partners * ratio) / 100)
  const soloAuc = aucOf(soloCases)
  const fedAuc = aucOf(fedCases) - 0.012

  const TARGET = 2000
  const monthsSolo = (TARGET / ((vol * prev) / 100)) * 12
  const monthsFed = (TARGET / (((vol * (1 + (partners * ratio) / 100)) * prev) / 100)) * 12

  const stats = [
    { k: 'Positive cases to train on', solo: fmt(soloCases), fed: fmt(fedCases), mult: `${(fedCases / soloCases).toFixed(1)}×` },
    { k: 'Expected model AUC', solo: soloAuc.toFixed(3), fed: fedAuc.toFixed(3), mult: `+${((fedAuc - soloAuc) * 100).toFixed(1)} pts` },
    {
      k: `Time to ${fmt(TARGET)} positive cases`,
      solo: monthsSolo > 240 ? '20+ yrs' : monthsSolo >= 24 ? `${(monthsSolo / 12).toFixed(1)} yrs` : `${Math.round(monthsSolo)} mo`,
      fed: monthsFed >= 24 ? `${(monthsFed / 12).toFixed(1)} yrs` : `${Math.round(monthsFed)} mo`,
      mult: `${(monthsSolo / monthsFed).toFixed(1)}× faster`,
    },
  ]

  const barMax = Math.max(soloCases, fedCases)

  return (
    <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="card space-y-4 p-5">
        <Slider
          label="Your eligible studies per year"
          value={vol}
          min={2000}
          max={200000}
          step={1000}
          onChange={setVol}
          display={fmt(vol)}
          hint="Imaging studies, encounters or episodes relevant to the clinical question."
        />
        <Slider label="Partner hospitals" value={partners} min={1} max={30} step={1} onChange={setPartners} display={partners} />
        <Slider
          label="Typical partner size vs yours"
          value={ratio}
          min={25}
          max={175}
          step={5}
          onChange={setRatio}
          display={`${ratio}%`}
          hint="District hospitals contribute smaller but often more diverse cohorts."
        />
        <Slider
          label="Condition prevalence"
          value={prev}
          min={0.05}
          max={12}
          step={0.05}
          onChange={setPrev}
          display={`${prev.toFixed(2)}%`}
          hint="Rare presentations are exactly where a single hospital's cohort fails."
        />
        <Slider
          label="Years of retrospective data"
          value={years}
          min={1}
          max={10}
          step={1}
          onChange={setYears}
          display={`${years} yr${years > 1 ? 's' : ''}`}
        />
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 xl:grid-cols-2">
          <div className="card p-5">
            <span className="eyebrow text-ink-400">Training cohort</span>
            <div className="mt-3.5 space-y-3.5">
              {[
                { label: 'Your hospital alone', v: soloCases, c: '#c04a3f' },
                { label: `With ${partners} partner${partners > 1 ? 's' : ''}`, v: fedCases, c: '#0d8b88' },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex items-baseline justify-between">
                    <span className="text-[0.78rem] font-semibold text-ink-700">{b.label}</span>
                    <span className="font-mono text-[0.95rem] font-medium" style={{ color: b.c }}>
                      {fmt(b.v)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-ink-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(2, (b.v / barMax) * 100)}%`, background: b.c }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[0.66rem] text-ink-400">Positive cases of the target condition available for training.</p>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between">
              <span className="eyebrow text-ink-400">Cohort size vs performance</span>
              <span className="text-[0.62rem] text-ink-400">log scale</span>
            </div>
            <div className="mt-2">
              <CohortCurve solo={soloCases} fed={fedCases} />
            </div>
            <p className="mt-1 text-right text-[0.64rem] text-ink-400">positive cases in training</p>
          </div>
        </div>

        <div className="card overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-ink-100 bg-paper-2">
                <th className="px-4 py-2.5" />
                <th className="px-3 py-2.5 text-right text-[0.64rem] font-semibold uppercase tracking-wider text-ink-500">Alone</th>
                <th className="px-3 py-2.5 text-right text-[0.64rem] font-semibold uppercase tracking-wider text-signal-700">
                  Federated
                </th>
                <th className="px-4 py-2.5 text-right text-[0.64rem] font-semibold uppercase tracking-wider text-ink-500">Δ</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((s) => (
                <tr key={s.k} className="border-b border-ink-100 last:border-0">
                  <td className="px-4 py-2.5 text-[0.8rem] font-medium text-ink-800">{s.k}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[0.83rem] text-ink-500">{s.solo}</td>
                  <td className="px-3 py-2.5 text-right font-mono text-[0.83rem] font-medium text-ink-900">{s.fed}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-[0.76rem] font-medium text-signal-600">{s.mult}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-2.5 rounded-lg border border-ink-200 bg-paper-2 p-3">
          <Icons.alert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-400" />
          <p className="text-[0.72rem] leading-relaxed text-ink-500">
            A standard learning-curve model with a fixed penalty for non-IID data across sites: a planning aid for sizing
            a federation, not a promise about your task. Real gains depend on label quality, case mix and how genuinely
            different your partners are; heterogeneity is a feature here, not a defect.
          </p>
        </div>
      </div>
    </div>
  )
}

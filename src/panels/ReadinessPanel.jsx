import { useMemo, useState } from 'react'
import { Icons, Pill } from '../lib/ui'
import { QUESTIONS, CATEGORIES, BANDS } from '../data/readiness'

const CHOICES = [
  { v: 1, label: 'Yes' },
  { v: 0.5, label: 'Partly' },
  { v: 0, label: 'No' },
]

function Ring({ pct, tone }) {
  const R = 52
  const C = 2 * Math.PI * R
  const colors = { verify: '#12855c', statute: '#b0761c', risk: '#c04a3f' }
  return (
    <svg viewBox="0 0 132 132" className="h-32 w-32">
      <circle cx="66" cy="66" r={R} fill="none" stroke="#e8f1f6" strokeWidth="11" />
      <circle
        cx="66"
        cy="66"
        r={R}
        fill="none"
        stroke={colors[tone]}
        strokeWidth="11"
        strokeLinecap="round"
        strokeDasharray={C}
        strokeDashoffset={C - (C * pct) / 100}
        transform="rotate(-90 66 66)"
        style={{ transition: 'stroke-dashoffset .6s cubic-bezier(.22,1,.36,1), stroke .3s' }}
      />
      <text x="66" y="70" textAnchor="middle" fontSize="30" fontFamily="Newsreader, serif" fill="#0a1a26">
        {Math.round(pct)}
      </text>
      <text x="66" y="87" textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fill="#6b9cb8" letterSpacing="1.5">
        / 100
      </text>
    </svg>
  )
}

export default function ReadinessPanel() {
  const [answers, setAnswers] = useState({})
  const [stage, setStage] = useState(0) // 0..3 categories, 4 = plan

  const answered = Object.keys(answers).length

  const result = useMemo(() => {
    const maxW = QUESTIONS.reduce((s, q) => s + q.weight, 0)
    const got = QUESTIONS.reduce((s, q) => s + (answers[q.id] ?? 0) * q.weight, 0)
    const pct = (got / maxW) * 100

    const byCat = CATEGORIES.map((c) => {
      const qs = QUESTIONS.filter((q) => q.cat === c.id)
      const m = qs.reduce((s, q) => s + q.weight, 0)
      const g = qs.reduce((s, q) => s + (answers[q.id] ?? 0) * q.weight, 0)
      return { ...c, pct: (g / m) * 100 }
    })

    const gaps = QUESTIONS.filter((q) => (answers[q.id] ?? 0) < 1).sort((a, b) => {
      const p = { high: 0, medium: 1 }
      if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority]
      return (answers[a.id] ?? 0) - (answers[b.id] ?? 0)
    })

    return { pct, byCat, gaps, band: BANDS.find((b) => pct >= b.min) }
  }, [answers])

  const cat = CATEGORIES[stage]
  const qs = cat ? QUESTIONS.filter((q) => q.cat === cat.id) : []
  const onPlan = stage >= CATEGORIES.length

  return (
    <div className="grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      {/* Questions / plan */}
      <div className="card flex flex-col overflow-hidden">
        {onPlan ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-3.5">
              <div>
                <h3 className="font-serif text-[1.2rem] text-ink-900">Your prioritised action plan</h3>
                <p className="mt-0.5 text-[0.74rem] text-ink-500">
                  {result.gaps.length === 0
                    ? 'No gaps identified from your answers.'
                    : `${result.gaps.length} items, high priority first.`}
                </p>
              </div>
              <div className="flex gap-2">
                <button data-nodrag onClick={() => setStage(0)} className="btn-ghost !py-2 !px-4 !text-[0.72rem]">
                  Back to questions
                </button>
                <button data-nodrag onClick={() => window.print()} className="btn-primary !py-2 !px-4 !text-[0.72rem]">
                  <Icons.doc className="h-3.5 w-3.5" />
                  Print
                </button>
              </div>
            </div>

            {result.gaps.length === 0 ? (
              <div className="flex items-center gap-4 px-5 py-8">
                <Icons.shield className="h-7 w-7 text-verify-600" />
                <p className="text-[0.88rem] text-ink-700">
                  Every item is covered. Bring this to a walkthrough and we will pressure-test it against your actual
                  deployment.
                </p>
              </div>
            ) : (
              /* The generated plan is the one panel that can legitimately
                 outgrow a face; scroll it inside the card, not the page. */
              <ol className="panel-scroll block max-h-[calc(100vh-21rem)] divide-y divide-ink-100">
                {result.gaps.map((g, i) => (
                  <li key={g.id} className="flex gap-4 px-5 py-3.5">
                    <span className="font-mono text-[0.9rem] font-medium text-ink-300">{String(i + 1).padStart(2, '0')}</span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Pill tone={g.priority === 'high' ? 'risk' : 'statute'}>
                          {g.priority === 'high' ? 'High priority' : 'Medium'}
                        </Pill>
                        <span className="rule-ref">{g.ref}</span>
                        {answers[g.id] === 0.5 && <span className="text-[0.68rem] text-ink-400">partly in place</span>}
                      </div>
                      <p className="mt-1.5 text-[0.84rem] font-semibold text-ink-900">{g.q}</p>
                      <p className="mt-1 text-[0.79rem] leading-relaxed text-ink-600">{g.action}</p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 border-b border-ink-100 px-5 py-3.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: cat.tone }} />
              <h3 className="text-[0.92rem] font-semibold text-ink-900">{cat.name}</h3>
              <span className="ml-auto font-mono text-[0.68rem] text-ink-400">
                step {stage + 1} / {CATEGORIES.length}
              </span>
            </div>

            <div className="divide-y divide-ink-100">
              {qs.map((q) => (
                <div key={q.id} className="flex flex-col gap-2.5 px-5 py-4 sm:flex-row sm:items-start sm:gap-5">
                  <div className="flex-1">
                    <p className="text-[0.86rem] leading-relaxed text-ink-800">{q.q}</p>
                    <span className="rule-ref mt-1.5 inline-block">{q.ref}</span>
                  </div>
                  <div data-nodrag className="flex shrink-0 gap-1.5">
                    {CHOICES.map((c) => {
                      const on = answers[q.id] === c.v
                      return (
                        <button
                          key={c.label}
                          onClick={() => setAnswers((a) => ({ ...a, [q.id]: c.v }))}
                          className={`rounded-lg border px-3 py-1.5 text-[0.72rem] font-semibold transition ${
                            on
                              ? 'border-ink-900 bg-ink-900 text-paper'
                              : 'border-ink-200 bg-white text-ink-500 hover:border-ink-400 hover:text-ink-700'
                          }`}
                        >
                          {c.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-ink-100 px-5 py-3.5">
              <button
                data-nodrag
                onClick={() => setStage((s) => Math.max(0, s - 1))}
                disabled={stage === 0}
                className="btn-ghost !py-2 !px-4 !text-[0.74rem] disabled:opacity-35"
              >
                Back
              </button>
              <div className="flex gap-1.5">
                {CATEGORIES.map((c, i) => (
                  <span
                    key={c.id}
                    className={`h-1.5 rounded-full transition-all ${i === stage ? 'w-6 bg-ink-900' : 'w-3 bg-ink-200'}`}
                  />
                ))}
              </div>
              <button data-nodrag onClick={() => setStage((s) => s + 1)} className="btn-primary !py-2 !px-4 !text-[0.74rem]">
                {stage === CATEGORIES.length - 1 ? 'See action plan' : 'Next'}
                <Icons.arrow className="h-3.5 w-3.5" />
              </button>
            </div>
          </>
        )}
      </div>

      {/* Score */}
      <div className="card flex flex-col">
        <div className="flex flex-col items-center border-b border-ink-100 px-5 py-5">
          <Ring pct={result.pct} tone={result.band.tone} />
          <Pill tone={result.band.tone} className="mt-3">
            {result.band.label}
          </Pill>
          <p className="mt-2.5 text-center text-[0.77rem] leading-relaxed text-ink-600">{result.band.text}</p>
          <div className="mt-3 font-mono text-[0.66rem] text-ink-400">
            {answered} of {QUESTIONS.length} answered
          </div>
        </div>

        <div className="space-y-3 px-5 py-4">
          {result.byCat.map((c) => (
            <div key={c.id}>
              <div className="flex items-baseline justify-between">
                <span className="text-[0.74rem] font-medium text-ink-700">{c.name}</span>
                <span className="font-mono text-[0.7rem] text-ink-500">{Math.round(c.pct)}%</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${c.pct}%`, background: c.tone }} />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto border-t border-ink-100 px-5 py-3.5">
          <Pill tone="neutral">
            <Icons.lock className="h-3 w-3" />
            Runs in your browser · nothing transmitted
          </Pill>
          <p className="mt-2 text-[0.66rem] leading-relaxed text-ink-400">
            A planning aid, not a compliance certification and not legal advice. Provision references are given so your
            counsel can verify each item.
          </p>
          {answered > 0 && (
            <button
              data-nodrag
              onClick={() => {
                setAnswers({})
                setStage(0)
              }}
              className="mt-2 text-[0.72rem] font-medium text-ink-400 hover:text-ink-700"
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

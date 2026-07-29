import { useMemo, useState } from 'react'
import { Icons, Pill } from '../lib/ui'

/**
 * Illustrative privacy/utility model. Shapes are drawn from published DP-SGD
 * behaviour on clinical imaging tasks; the numbers are not measurements of any
 * deployment, and the UI says so.
 */
const EPS_MIN = 0.2
const EPS_MAX = 30

const utility = (eps, sites, dp) => {
  const ceiling = 0.86 + 0.062 * (1 - Math.exp(-sites / 6))
  if (!dp) return ceiling
  return Math.max(0.62, ceiling - (0.095 / (1 + eps * 0.9)) * Math.sqrt(8 / sites))
}
const empiricalAttack = (eps, dp, secagg) =>
  Math.min(88, (dp ? 50 + 22 * (1 - Math.exp(-eps / 8)) : 72) + (secagg ? 0 : 7))
const worstCase = (eps, dp) => (dp ? ((Math.exp(eps) - 1) / (Math.exp(eps) + 1)) * 100 : 100)

function verdict(eps, dp) {
  if (!dp)
    return {
      tone: 'risk',
      label: 'No formal guarantee',
      text: 'Secure aggregation hides who contributed what, but places no mathematical bound on what the aggregate reveals. Defensible only for low-sensitivity, fully consented cohorts.',
    }
  if (eps <= 1)
    return {
      tone: 'verify',
      label: 'Strong; sensitive cohorts',
      text: 'Appropriate for what your ethics committee will scrutinise hardest: HIV, mental health, genomics, reproductive health. Expect a visible accuracy cost and budget for it.',
    }
  if (eps <= 4)
    return {
      tone: 'verify',
      label: 'Standard clinical research posture',
      text: 'The range most published federated medical studies operate in. Defensible to an IEC with a written justification, and usually the right starting point.',
    }
  if (eps <= 10)
    return {
      tone: 'statute',
      label: 'Permissive; justify in writing',
      text: 'Still a meaningful bound, but your DPIA should record why a tighter budget was not workable for this task.',
    }
  return {
    tone: 'risk',
    label: 'Weak formal guarantee',
    text: 'At this budget the formal guarantee is close to vacuous. Anticipate hard questions from your ethics committee and from partner sites.',
  }
}

function Curve({ eps, sites, dp, secagg }) {
  const W = 520
  const H = 168
  const P = { l: 40, r: 14, t: 12, b: 28 }
  const pw = W - P.l - P.r
  const ph = H - P.t - P.b

  const xOf = (e) => P.l + ((Math.log(e) - Math.log(EPS_MIN)) / (Math.log(EPS_MAX) - Math.log(EPS_MIN))) * pw
  const yUtil = (u) => P.t + ph - ((u - 0.6) / 0.34) * ph
  const yRisk = (r) => P.t + ph - ((r - 45) / 45) * ph

  const samples = useMemo(() => {
    const out = []
    for (let i = 0; i <= 80; i++) {
      const e = EPS_MIN * Math.pow(EPS_MAX / EPS_MIN, i / 80)
      out.push({ e, u: utility(e, sites, dp), r: empiricalAttack(e, dp, secagg) })
    }
    return out
  }, [sites, dp, secagg])

  const path = (key, yFn) =>
    samples.map((s, i) => `${i ? 'L' : 'M'}${xOf(s.e).toFixed(1)} ${yFn(s[key]).toFixed(1)}`).join(' ')

  const mx = xOf(eps)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <defs>
        <linearGradient id="utilFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#14a8a0" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#14a8a0" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1={P.l} x2={W - P.r} y1={P.t + ph * g} y2={P.t + ph * g} stroke="#e8f1f6" />
      ))}
      {[0.5, 1, 3, 10, 30].map((e) => (
        <text key={e} x={xOf(e)} y={H - 9} fontSize="9" textAnchor="middle" fill="#6b9cb8" fontFamily="JetBrains Mono, monospace">
          ε {e}
        </text>
      ))}

      <path d={`${path('u', yUtil)} L ${W - P.r} ${P.t + ph} L ${P.l} ${P.t + ph} Z`} fill="url(#utilFill)" />
      <path d={path('u', yUtil)} fill="none" stroke="#0d8b88" strokeWidth="2.2" strokeLinecap="round" />
      <path d={path('r', yRisk)} fill="none" stroke="#c04a3f" strokeWidth="2" strokeDasharray="5 4" strokeLinecap="round" />

      <line x1={mx} x2={mx} y1={P.t} y2={P.t + ph} stroke="#0a1a26" strokeWidth="1.2" />
      <circle cx={mx} cy={yUtil(utility(eps, sites, dp))} r="5" fill="#0d8b88" stroke="#fff" strokeWidth="2" />
      <circle cx={mx} cy={yRisk(empiricalAttack(eps, dp, secagg))} r="5" fill="#c04a3f" stroke="#fff" strokeWidth="2" />

      <text x={P.l - 6} y={P.t + 8} fontSize="8.5" textAnchor="end" fill="#0d8b88" fontFamily="Newsreader, serif">
        AUC
      </text>
    </svg>
  )
}

function Meter({ label, value, tone, hint }) {
  const tones = { good: '#12855c', warn: '#b0761c', bad: '#c04a3f' }
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-[0.74rem] font-semibold text-ink-700">{label}</span>
        <span className="font-mono text-[0.88rem] font-medium" style={{ color: tones[tone] }}>
          {value}%
        </span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, Math.max(2, value))}%`, background: tones[tone] }}
        />
      </div>
      {hint && <p className="mt-1 text-[0.66rem] leading-snug text-ink-400">{hint}</p>}
    </div>
  )
}

export default function PrivacyPanel() {
  const [eps, setEps] = useState(3)
  const [sites, setSites] = useState(8)
  const [dp, setDp] = useState(true)
  const [secagg, setSecagg] = useState(true)

  const u = utility(eps, sites, dp)
  const atk = empiricalAttack(eps, dp, secagg)
  const wc = worstCase(eps, dp)
  const v = verdict(eps, dp)
  const solo = 0.79

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      {/* Controls */}
      <div className="card space-y-5 self-start p-5">
        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="eps" className="text-[0.8rem] font-semibold text-ink-800">
              Privacy budget · ε
            </label>
            <span className="font-mono text-[1rem] font-medium text-ink-900">{eps.toFixed(1)}</span>
          </div>
          <input
            id="eps"
            type="range"
            min="0.2"
            max="30"
            step="0.1"
            value={eps}
            disabled={!dp}
            onChange={(e) => setEps(+e.target.value)}
            className={`mt-2.5 ${!dp ? 'opacity-40' : ''}`}
          />
          <div className="mt-1 flex justify-between font-mono text-[0.63rem] text-ink-400">
            <span>tighter</span>
            <span>δ = 1e-5</span>
            <span>looser</span>
          </div>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <label htmlFor="sites" className="text-[0.8rem] font-semibold text-ink-800">
              Participating hospitals
            </label>
            <span className="font-mono text-[1rem] font-medium text-ink-900">{sites}</span>
          </div>
          <input id="sites" type="range" min="2" max="30" step="1" value={sites} onChange={(e) => setSites(+e.target.value)} className="mt-2.5" />
          <p className="mt-1 text-[0.66rem] leading-snug text-ink-400">
            More sites means noise averages out faster, so privacy gets cheaper as the federation grows.
          </p>
        </div>

        <div className="space-y-2.5 border-t border-ink-100 pt-4">
          {[
            { on: dp, set: setDp, label: 'Differential privacy (DP-SGD)', hint: 'Bounds any one patient’s influence on the update.' },
            { on: secagg, set: setSecagg, label: 'Secure aggregation', hint: 'Coordinator sees only the sum, never one site’s update.' },
          ].map((t) => (
            <button
              key={t.label}
              onClick={() => t.set(!t.on)}
              className={`flex w-full items-start gap-2.5 rounded-lg border p-3 text-left transition ${
                t.on ? 'border-signal-400/70 bg-signal-300/10' : 'border-ink-200 bg-paper-2'
              }`}
            >
              <span
                className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded border transition ${
                  t.on ? 'border-signal-600 bg-signal-600 text-white' : 'border-ink-300 bg-white'
                }`}
              >
                {t.on && <Icons.check className="h-2.5 w-2.5" />}
              </span>
              <span>
                <span className="block text-[0.78rem] font-semibold text-ink-800">{t.label}</span>
                <span className="mt-0.5 block text-[0.66rem] leading-snug text-ink-500">{t.hint}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Readout */}
      <div className="space-y-4">
        <div className="card p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="eyebrow text-ink-400">Privacy / utility frontier</span>
            <div className="flex items-center gap-3 text-[0.64rem] text-ink-500">
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded bg-signal-600" /> model AUC
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-0.5 w-4 rounded bg-risk-600" /> attack success
              </span>
            </div>
          </div>
          <div className="mt-2">
            <Curve eps={eps} sites={sites} dp={dp} secagg={secagg} />
          </div>
        </div>

        <div className="card p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="eyebrow text-ink-400">Expected model quality</span>
              <div className="mt-1.5 flex items-end gap-2.5">
                <span className="display text-[2.1rem] text-ink-900">{u.toFixed(3)}</span>
                <span className="mb-1.5 text-[0.7rem] font-semibold text-signal-600">
                  +{((u - solo) * 100).toFixed(1)} pts vs. alone
                </span>
              </div>
              <p className="mt-0.5 text-[0.66rem] text-ink-400">AUC · a single site alone reaches ≈ {solo.toFixed(2)}</p>
            </div>
            <div className="space-y-3">
              <Meter
                label="Membership inference success"
                value={atk.toFixed(1)}
                tone={atk < 55 ? 'good' : atk < 65 ? 'warn' : 'bad'}
                hint="An attacker's chance of telling whether one patient was in training. 50% is a coin flip."
              />
              <Meter
                label="Worst-case theoretical bound"
                value={wc.toFixed(1)}
                tone={wc < 60 ? 'good' : wc < 90 ? 'warn' : 'bad'}
                hint="What the ε guarantee formally permits, before any assumption about the attacker."
              />
            </div>
          </div>

          <div
            className={`mt-4 flex gap-3 rounded-lg border p-3.5 ${
              v.tone === 'verify'
                ? 'border-verify-300/70 bg-verify-300/10'
                : v.tone === 'statute'
                  ? 'border-statute-300/70 bg-statute-300/10'
                  : 'border-risk-300/70 bg-risk-300/10'
            }`}
          >
            {v.tone === 'verify' ? (
              <Icons.shield className="mt-0.5 h-4 w-4 shrink-0 text-verify-600" />
            ) : (
              <Icons.alert className="mt-0.5 h-4 w-4 shrink-0 text-statute-700" />
            )}
            <div>
              <Pill tone={v.tone}>{v.label}</Pill>
              <p className="mt-1.5 text-[0.78rem] leading-relaxed text-ink-700">{v.text}</p>
            </div>
          </div>

          {!secagg && (
            <div className="mt-2.5 flex items-start gap-2.5 rounded-lg border border-risk-300/70 bg-risk-300/10 p-3">
              <Icons.alert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-risk-600" />
              <p className="text-[0.74rem] leading-relaxed text-ink-700">
                With secure aggregation off, the coordinator can read your hospital&rsquo;s individual update. Raw
                gradients have been shown to leak training signal. We do not recommend running this way in production.
              </p>
            </div>
          )}

          <p className="mt-3 text-[0.66rem] leading-relaxed text-ink-400">
            ε bounds how much one patient&rsquo;s presence can change what you transmit. At ε = 1, an observer seeing your
            whole update is at most ~2.7× more confident that a given patient was in the cohort. Curves are an
            illustrative DP-SGD model, not measurements, and we benchmark your task during pilot.
          </p>
        </div>
      </div>
    </div>
  )
}

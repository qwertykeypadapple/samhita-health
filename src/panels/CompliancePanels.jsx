import { useState } from 'react'
import { Icons, Pill } from '../lib/ui'
import { TIMELINE, REGULATIONS, MAPPING } from '../data/regulations'

/* ── Tab 1 · Timeline + who carries what ─────────────────── */
const ROLES = [
  {
    title: 'Data Principal',
    who: 'Your patient',
    icon: Icons.users,
    body: 'Holds the rights: access, correction, erasure, grievance redressal. Consent is theirs to give and to withdraw.',
    tone: 'signal',
  },
  {
    title: 'Data Fiduciary',
    who: 'Your hospital',
    icon: Icons.hospital,
    body: 'Determines purpose and means. Carries notice, security, breach-reporting and erasure duties, none of which transfer to us.',
    tone: 'statute',
  },
  {
    title: 'Data Processor',
    who: 'Samhita',
    icon: Icons.server,
    body: 'Processes on your instructions under written contract. Federation means we never receive identifiable data at all.',
    tone: 'neutral',
  },
]

export function TimelinePanel() {
  return (
    <div className="space-y-5">
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-3">
          <span className="eyebrow text-ink-400">Commencement schedule · DPDP</span>
          <Pill tone="signal">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-500" />
            You are here · July 2026
          </Pill>
        </div>

        <div className="relative px-5 py-5">
          <div className="absolute left-8 right-8 top-[2.35rem] hidden h-px bg-ink-200 md:block" />
          <div className="grid gap-5 md:grid-cols-4 md:gap-4">
            {TIMELINE.map((t) => (
              <div key={t.date} className="relative">
                <div className="flex items-center gap-2.5 md:block">
                  <span
                    className={`relative z-10 grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 bg-white ${
                      t.state === 'done'
                        ? 'border-signal-600 text-signal-600'
                        : t.state === 'next'
                          ? 'border-statute-600 text-statute-600'
                          : 'border-ink-300 text-ink-300'
                    }`}
                  >
                    {t.state === 'done' ? <Icons.check className="h-2.5 w-2.5" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                  </span>
                  <span
                    className={`font-mono text-[0.68rem] font-medium md:mt-3 md:block ${
                      t.state === 'future' ? 'text-ink-400' : 'text-ink-700'
                    }`}
                  >
                    {t.date}
                  </span>
                </div>
                <h4 className="mt-1.5 text-[0.85rem] font-semibold leading-snug text-ink-900">{t.title}</h4>
                <p className="mt-1 text-[0.73rem] leading-relaxed text-ink-500">{t.body}</p>
              </div>
            ))}
          </div>
        </div>

      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
        <div className="card divide-y divide-ink-100 overflow-hidden">
          <div className="px-4 py-2">
            <span className="eyebrow text-ink-400">Who carries which obligation</span>
          </div>
          {ROLES.map((r) => (
            <div key={r.title} className="flex items-start gap-3 px-4 py-2.5">
              <div
                className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg ${
                  r.tone === 'signal'
                    ? 'bg-signal-300/25 text-signal-700'
                    : r.tone === 'statute'
                      ? 'bg-statute-300/25 text-statute-700'
                      : 'bg-ink-100 text-ink-600'
                }`}
              >
                <r.icon className="h-3.5 w-3.5" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <h4 className="font-serif text-[0.98rem] leading-tight text-ink-900">{r.title}</h4>
                  <span className="font-mono text-[0.58rem] uppercase tracking-wider text-ink-400">{r.who}</span>
                </div>
                <p className="mt-0.5 text-[0.74rem] leading-snug text-ink-600">{r.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="card px-4 py-2.5">
            <p className="text-[0.75rem] leading-snug text-ink-600">
              <strong className="font-semibold text-ink-800">Why this matters now:</strong> roughly ten months before the
              Consent Manager regime opens, under two years before substantive obligations commence. The consent
              architecture, retention policy and processor contracts you need on 13 May 2027 take longer than that to
              build and get board approval for.
            </p>
          </div>

          <div className="rounded-xl border-2 border-statute-300 bg-statute-300/10 p-4">
            <div className="flex items-start gap-2.5">
              <Icons.alert className="mt-0.5 h-4 w-4 shrink-0 text-statute-700" />
              <h3 className="font-serif text-[1.05rem] leading-snug text-ink-900">
                Federation is a control, not an exemption.
              </h3>
            </div>
            <p className="mt-2 text-[0.76rem] leading-snug text-ink-700">
              Training on patient records is processing under the DPDP Act wherever it happens, so it still needs a
              lawful basis, and model updates may themselves be personal data, which is why DP and secure aggregation
              are defaults here rather than upsells. Your hospital remains the Data Fiduciary throughout. What federation
              removes is the disclosure of identifiable records to a third party: the hardest thing to consent to, and
              the thing that kills most multi-hospital studies. A large, real reduction in risk, but not the whole of
              compliance, and anyone who says otherwise is selling.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Tab 2 · Instruments, master/detail ──────────────────── */
export function InstrumentsPanel() {
  const [sel, setSel] = useState(REGULATIONS[0].id)
  const reg = REGULATIONS.find((r) => r.id === sel)

  return (
    /* Selector runs across the top so the detail gets the panel's full width. A
       wider measure means fewer wrapped lines, which is what keeps this tab
       inside the viewport. */
    <div className="space-y-3">
      <div data-nodrag className="flex flex-wrap gap-1.5">
        {REGULATIONS.map((r) => {
          const on = r.id === sel
          return (
            <button
              key={r.id}
              onClick={() => setSel(r.id)}
              className={`rounded-lg border px-3 py-1.5 text-left transition ${
                on ? 'border-ink-900 bg-ink-900 text-paper' : 'border-ink-200 bg-white hover:border-ink-400'
              }`}
            >
              <span className={`block text-[0.78rem] font-semibold leading-tight ${on ? 'text-white' : 'text-ink-900'}`}>
                {r.short ?? r.name}
              </span>
            </button>
          )
        })}
      </div>

      <div className="card p-4">
        <div className="flex flex-wrap items-baseline gap-x-3">
          <h3 className="font-serif text-[1.18rem] leading-snug text-ink-900">{reg.name}</h3>
          <span className="text-[0.74rem] italic text-ink-500">{reg.sub}</span>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-[0.68rem] text-ink-400">
          <span className="font-mono uppercase tracking-[0.14em] text-statute-700">{reg.tag}</span>
          <span className="h-1 w-1 rounded-full bg-ink-300" />
          <span>{reg.authority}</span>
          <span className="h-1 w-1 rounded-full bg-ink-300" />
          <span className="font-semibold text-ink-600">{reg.status}</span>
        </div>
        <p className="mt-2 text-[0.78rem] leading-snug text-ink-600">{reg.summary}</p>

        {/* Two full-width rows rather than tall narrow columns: text that has
            the card's whole width to wrap in is far shorter, which is what
            keeps the face inside the viewport on a short screen. */}
        <div className="mt-3 space-y-3">
          <div>
            <span className="eyebrow text-statute-700">What it requires</span>
            <ul className="mt-2 gap-x-6 sm:columns-2 lg:columns-3 [&>li]:mb-1.5 [&>li]:break-inside-avoid">
              {reg.obligations.map((o) => (
                <li key={o.text} className="text-[0.77rem] leading-relaxed text-ink-600">
                  <span className="rule-ref mr-2 align-[0.08em]">{o.ref}</span>
                  {o.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <span className="eyebrow text-signal-700">What federation solves</span>
              <ul className="mt-2.5 space-y-1.5">
                {reg.fl.helps.map((h) => (
                  <li key={h} className="flex gap-2">
                    <Icons.check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-verify-600" />
                    <span className="text-[0.76rem] leading-snug text-ink-600">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border border-statute-300/60 bg-statute-300/10 p-3">
              <span className="eyebrow text-statute-700">What you still owe</span>
              <ul className="mt-2 space-y-1.5">
                {reg.fl.owed.map((h) => (
                  <li key={h} className="flex gap-2">
                    <Icons.alert className="mt-0.5 h-3 w-3 shrink-0 text-statute-700" />
                    <span className="text-[0.75rem] leading-snug text-ink-700">{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <a
            href={reg.link}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-[0.76rem] font-semibold text-ink-700 underline decoration-ink-300 underline-offset-4 hover:decoration-ink-600"
          >
            Read the primary instrument
            <Icons.arrow className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── Tab 3 · Pooling vs federation ───────────────────────── */
export function MatrixPanel() {
  const mark = {
    good: { cls: 'text-verify-600', bg: 'bg-verify-300/15', icon: Icons.check },
    warn: { cls: 'text-statute-700', bg: 'bg-statute-300/15', icon: Icons.alert },
    bad: { cls: 'text-risk-600', bg: 'bg-risk-300/15', icon: Icons.x },
  }
  return (
    <div>
      <div className="card overflow-hidden">
        <div className="border-b border-ink-100 px-4 py-2.5">
          <p className="text-[0.78rem] text-ink-500">
            The honest comparison. Green is where federation genuinely removes a problem; amber is where it helps but the
            duty survives.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ink-200 bg-paper-2">
                <th className="px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-wider text-ink-500">Obligation</th>
                <th className="px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-wider text-ink-500">
                  Centralised data pooling
                </th>
                <th className="px-4 py-2.5 text-[0.66rem] font-semibold uppercase tracking-wider text-signal-700">
                  Federated with Samhita
                </th>
              </tr>
            </thead>
            <tbody>
              {MAPPING.map((m) => {
                const C = mark[m.central.verdict]
                const F = mark[m.fed.verdict]
                return (
                  <tr key={m.obligation} className="border-b border-ink-100 align-top last:border-0">
                    <td className="px-4 py-2">
                      <div className="text-[0.78rem] font-semibold leading-snug text-ink-900">{m.obligation}</div>
                      <div className="mt-1">
                        <span className="rule-ref">{m.ref}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className={`flex gap-2 rounded ${C.bg} p-1.5`}>
                        <C.icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${C.cls}`} />
                        <span className="text-[0.73rem] leading-snug text-ink-600">{m.central.text}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className={`flex gap-2 rounded ${F.bg} p-1.5`}>
                        <F.icon className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${F.cls}`} />
                        <span className="text-[0.73rem] leading-snug text-ink-600">{m.fed.text}</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

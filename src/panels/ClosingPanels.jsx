import { useState } from 'react'
import { Icons, Pill } from '../lib/ui'
import { FAQS } from '../data/regulations'

/* ── Applications ────────────────────────────────────────── */
const CASES = [
  {
    area: 'Radiology',
    title: 'Chest X-ray triage for tuberculosis',
    body:
      'India carries roughly a quarter of the global TB burden, and screening volume sits disproportionately in district hospitals with the least capacity to build models. Federation lets a tertiary centre’s labelling quality and a district hospital’s case diversity train one model, without either sending an image anywhere.',
    tags: ['CXR', 'District + tertiary mix', 'High volume'],
  },
  {
    area: 'Critical care',
    title: 'Early warning for sepsis deterioration',
    body:
      'Deterioration models are notoriously site-specific, because they learn a hospital’s documentation habits as much as its physiology. Training across sites with per-site personalisation produces a model that transfers, and per-site metrics that show when it does not.',
    tags: ['Vitals + labs', 'Personalised per site', 'Non-IID'],
  },
  {
    area: 'Ophthalmology',
    title: 'Diabetic retinopathy grading',
    body:
      'With diabetes prevalence rising and screening capacity concentrated in cities, grading models need fundus images across camera types and populations no single network holds. Camera heterogeneity across sites is the point, not the obstacle.',
    tags: ['Fundus imaging', 'Screening', 'Camera diversity'],
  },
  {
    area: 'Oncology',
    title: 'Histopathology subtyping for rare tumours',
    body:
      'The canonical case for federation. A regional cancer centre may see a few dozen instances of a rare subtype a year: clinically important, nowhere near enough to train on. Ten such centres together cross the threshold.',
    tags: ['Whole-slide imaging', 'Rare cohorts', 'Multi-centre'],
  },
]

export function ApplicationsPanel() {
  return (
    <div>
      <p className="max-w-[76ch] text-[0.92rem] leading-relaxed text-ink-600">
        Federated learning is not a general replacement for centralised training. It is the right tool when cohorts are
        small, sites are genuinely different, and the data cannot legally move, which describes most clinically
        interesting problems in India.
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {CASES.map((c) => (
          <div key={c.title} className="card h-full p-5 transition-colors hover:border-signal-400/70">
            <span className="eyebrow text-signal-700">{c.area}</span>
            <h3 className="font-serif mt-2.5 text-[1.2rem] leading-snug text-ink-900">{c.title}</h3>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-ink-600">{c.body}</p>
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {c.tags.map((t) => (
                <Pill key={t} tone="neutral">
                  {t}
                </Pill>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-[0.72rem] leading-relaxed text-ink-400">
        Illustrative applications. Any model deployed into clinical care requires its own validation and, where a clinical
        claim is made, CDSCO classification and licensing.
      </p>
    </div>
  )
}

/* ── FAQ, as master/detail so nothing scrolls ────────────── */
export function FaqPanel() {
  const [sel, setSel] = useState(0)
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(260px,0.42fr)_1fr]">
      <div data-nodrag className="flex flex-col gap-1">
        {FAQS.map((f, i) => {
          const on = i === sel
          return (
            <button
              key={f.q}
              onClick={() => setSel(i)}
              className={`rounded-lg border px-3.5 py-2.5 text-left text-[0.79rem] font-semibold leading-snug transition ${
                on ? 'border-ink-900 bg-ink-900 text-paper' : 'border-transparent text-ink-600 hover:bg-white hover:text-ink-900'
              }`}
            >
              {f.q}
            </button>
          )
        })}
      </div>

      <div className="card flex flex-col justify-center p-6 md:p-8">
        <span className="eyebrow text-signal-700">Answer</span>
        <h3 className="font-serif mt-3 text-[1.4rem] leading-snug text-ink-900">{FAQS[sel].q}</h3>
        <p className="mt-4 max-w-[68ch] text-[0.92rem] leading-[1.75] text-ink-600">{FAQS[sel].a}</p>
      </div>
    </div>
  )
}

/* ── Contact ─────────────────────────────────────────────── */
const AGENDA = [
  'Where your consent architecture sits against the 13 May 2027 commencement',
  'Whether your data would support the clinical question you care about',
  'What your IT security review will actually need from us',
  'A realistic pilot scope, cost and timeline, or an honest no',
]

const CONTACT_EMAIL = 'qwertykeypadapple@gmail.com'

export function ContactPanel() {
  const [sent, setSent] = useState(false)

  const field =
    'mt-1.5 w-full rounded-lg border border-ink-200 bg-paper px-3 py-2 text-[0.84rem] text-ink-900 outline-none transition placeholder:text-ink-300 focus:border-signal-500 focus:bg-white'

  /* No backend, so the form composes the enquiry and hands it to the visitor's
     own mail client. Nothing is transmitted by the page itself. */
  const submit = (e) => {
    e.preventDefault()
    const el = e.currentTarget.elements
    const v = (id) => (el[id]?.value || '').trim()
    const subject = `Walkthrough request${v('org') ? `: ${v('org')}` : ''}`
    const body = [
      `Name: ${v('name')}`,
      `Role: ${v('role')}`,
      `Hospital or institution: ${v('org')}`,
      `Work email: ${v('email')}`,
      `Approximate bed count: ${v('beds')}`,
      '',
      'Clinical question:',
      v('msg') || '(not specified)',
    ].join('\n')
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSent(true)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
      <div>
        <p className="max-w-[52ch] text-[0.94rem] leading-[1.7] text-ink-600">
          A ninety-minute walkthrough with your data protection, IT and clinical research leads in the same room. No
          slideware; we work through your actual constraints and tell you whether this fits.
        </p>

        <ul className="mt-5 space-y-2.5">
          {AGENDA.map((a) => (
            <li key={a} className="flex gap-2.5">
              <Icons.check className="mt-0.5 h-4 w-4 shrink-0 text-signal-600" />
              <span className="text-[0.86rem] leading-relaxed text-ink-700">{a}</span>
            </li>
          ))}
        </ul>

        <div className="mt-5 border-t border-ink-200 pt-4">
          <div className="eyebrow text-ink-400">Get in touch</div>
          {/* The address is carried in the href only, never printed, so it is
              not sitting on the page for scrapers or casual readers. */}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Samhita: walkthrough request')}`}
            className="mt-2 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-ink-900 underline decoration-signal-400 decoration-2 underline-offset-4 hover:text-signal-700"
          >
            Email us directly
            <Icons.arrow className="h-3.5 w-3.5" />
          </a>
        </div>

        <div className="mt-4 border-t border-ink-200 pt-4">
          <div className="eyebrow text-ink-400">Also available</div>
          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-[0.83rem] text-ink-700">
            <span>Template consortium agreement</span>
            <span>DPIA template for federated training</span>
            <span>IEC submission pack</span>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-statute-300/60 bg-statute-300/10 p-4">
          <div className="font-mono text-[0.6rem] uppercase tracking-[0.18em] text-statute-700">
            Important: not legal advice
          </div>
          <p className="mt-2 max-w-[80ch] text-[0.74rem] leading-relaxed text-ink-600">
            The regulatory content here is an informational summary for hospital DPOs, IT leaders and ethics committees.
            It is not legal advice. Indian data protection law is mid-transition: the DPDP Rules were notified on 13
            November 2025, substantive obligations commence on 13 May 2027, and further Government notifications,
            including categories of data subject to localisation, are expected in between. Verify every provision against
            the primary instrument and engage counsel for your deployment.
          </p>
          <div className="mt-2.5 flex flex-wrap gap-x-4 gap-y-1 text-[0.72rem]">
            {[
              ['DPDP Act & Rules · MeitY', 'https://www.meity.gov.in/data-protection-framework'],
              ['ABDM policies · NHA', 'https://abdm.gov.in/publications/policies_regulations'],
              [
                'ICMR AI ethics',
                'https://www.icmr.gov.in/ethical-guidelines-for-application-of-artificial-intelligence-in-biomedical-research-and-healthcare',
              ],
              ['CDSCO medical devices', 'https://cdsco.gov.in/opencms/opencms/en/Medical-Device-Diagnostics/Medical-Device-Diagnostics/'],
            ].map(([l, h]) => (
              <a
                key={l}
                href={h}
                target="_blank"
                rel="noreferrer noopener"
                className="font-semibold text-ink-600 underline decoration-ink-300 underline-offset-2 hover:text-ink-900"
              >
                {l} ↗
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5 md:p-6">
        {sent ? (
          <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-signal-300/25 text-signal-700">
              <Icons.check className="h-6 w-6" />
            </div>
            <h3 className="font-serif mt-4 text-[1.3rem] text-ink-900">Your email client should be open.</h3>
            <p className="mt-2.5 max-w-[38ch] text-[0.84rem] leading-relaxed text-ink-600">
              The enquiry has been composed for you to review and send. Nothing was transmitted by this page. If nothing
              opened, use the link below.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 inline-flex items-center gap-2 text-[0.86rem] font-semibold text-ink-900 underline decoration-signal-400 decoration-2 underline-offset-4 hover:text-signal-700"
            >
              Open your email client
              <Icons.arrow className="h-3.5 w-3.5" />
            </a>
            <button data-nodrag onClick={() => setSent(false)} className="btn-ghost mt-5 !py-2 !px-4 !text-[0.76rem]">
              Back to the form
            </button>
          </div>
        ) : (
          <form data-nodrag onSubmit={submit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="text-[0.75rem] font-semibold text-ink-700">
                  Your name
                </label>
                <input id="name" required placeholder="Dr. A. Sharma" className={field} />
              </div>
              <div>
                <label htmlFor="role" className="text-[0.75rem] font-semibold text-ink-700">
                  Role
                </label>
                <input id="role" required placeholder="Medical Superintendent" className={field} />
              </div>
            </div>

            <div>
              <label htmlFor="org" className="text-[0.75rem] font-semibold text-ink-700">
                Hospital or institution
              </label>
              <input id="org" required placeholder="Name of your hospital" className={field} />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="email" className="text-[0.75rem] font-semibold text-ink-700">
                  Work email
                </label>
                <input id="email" type="email" required placeholder="you@hospital.org" className={field} />
              </div>
              <div>
                <label htmlFor="beds" className="text-[0.75rem] font-semibold text-ink-700">
                  Approximate bed count
                </label>
                <select id="beds" className={field}>
                  <option>Under 100</option>
                  <option>100–300</option>
                  <option>300–750</option>
                  <option>750+</option>
                  <option>Network of hospitals</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="msg" className="text-[0.75rem] font-semibold text-ink-700">
                What clinical question are you trying to answer?
              </label>
              <textarea id="msg" rows={3} placeholder="Optional: the more specific, the better the first call." className={`${field} resize-none`} />
            </div>

            <button type="submit" className="btn-primary w-full !py-2.5">
              Request a walkthrough
              <Icons.arrow className="h-4 w-4" />
            </button>
            <p className="text-center text-[0.68rem] text-ink-400">
              Opens in your own email client. This page has no backend and transmits nothing itself.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import Face from '../components/Face'
import { HeroWeave } from '../components/Hero'
import { Icons, Pill } from '../lib/ui'

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'deadlock', label: 'The deadlock' },
]

const PAINS = [
  {
    icon: Icons.users,
    title: 'Your cohort is too small, and may take time to grow',
    body:
      'A 500-bed hospital may log 40 confirmed cases of a rare presentation in a decade. No architecture search rescues a model from n=40. The constraint is epidemiological, not computational.',
  },
  {
    icon: Icons.scale,
    title: 'The data-sharing agreement never gets signed',
    body:
      'Multi-institution studies die in legal review, not in the lab. Once records must physically leave one hospital, you are negotiating liability between two boards with no reason to accept it.',
  },
  {
    icon: Icons.alert,
    title: 'A pooled repository is one catastrophic target',
    body:
      'Centralising ten hospitals’ records creates something none of them had alone: a single breach exposing every partner, each carrying its own notification duty under Rule 7.',
  },
  {
    icon: Icons.eye,
    title: 'The model you buy never saw your patients',
    body:
      'Imported clinical AI is validated on Western cohorts. Age structure, prevalence, imaging hardware and presentation all differ, and ICMR expects you to have tested that.',
  },
]

function Overview({ front }) {
  return (
    <div className="grid h-full items-center gap-8 pt-2 lg:grid-cols-[1.12fr_0.88fr]">
      <div>
        <Pill tone="statute">
          <span className="h-1.5 w-1.5 rounded-full bg-statute-600" />
          DPDP Rules notified · substantive obligations from 13 May 2027
        </Pill>

        <h1 className="display mt-5 max-w-[15ch] text-[2.5rem] leading-[1.05] sm:text-[3rem] xl:text-[3.6rem]">
          Train on numerous hospitals&rsquo; data, keeping every record{' '}
          <span className="relative whitespace-nowrap">
            <span className="italic text-signal-600">in place</span>
            <svg
              viewBox="0 0 120 10"
              preserveAspectRatio="none"
              className="absolute -bottom-1 left-0 h-2 w-full text-signal-400"
            >
              <path d="M2 7 Q 40 2, 60 6 T 118 4" stroke="currentColor" strokeWidth="2.4" fill="none" />
            </svg>
          </span>
          .
        </h1>

        <p className="mt-6 max-w-[46ch] text-[0.98rem] leading-[1.7] text-ink-600">
          Samhita brings the model to your data instead of your data to a model. Patient records stay behind your
          firewall, on your premises, while your clinicians get an AI trained on a national-scale cohort.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <a href="#contact" data-nodrag className="btn-primary !py-2.5">
            Book a compliance walkthrough
            <Icons.arrow className="h-4 w-4" />
          </a>
          <span className="text-[0.78rem] text-ink-400">or swipe &rarr; to see a training round</span>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink-200 pt-5">
          <span className="eyebrow text-ink-400">Designed around</span>
          {['DPDP Act 2023', 'DPDP Rules 2025', 'ABDM HDMP', 'ICMR AI Ethics', 'CDSCO MDR 2017'].map((s) => (
            <span key={s} className="text-[0.76rem] font-semibold text-ink-600">
              {s}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto w-full max-w-[380px]">
        <div className="card overflow-hidden p-4">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-ink-400">Federation · live view</span>
            <span className="flex items-center gap-1.5 font-mono text-[0.66rem] text-signal-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal-500" />
              round 47
            </span>
          </div>
          <div className="mt-1 aspect-square">
            <HeroWeave active={front} />
          </div>
          <div className="grid grid-cols-3 gap-2 border-t border-ink-100 pt-3 text-center">
            {[
              ['5', 'sites'],
              ['0 B', 'patient data sent'],
              ['ε 3.0', 'privacy budget'],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-mono text-[0.9rem] font-medium text-ink-900">{v}</div>
                <div className="mt-0.5 text-[0.6rem] uppercase tracking-wider text-ink-400">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-2 text-center text-[0.7rem] text-ink-400">Illustrative five-hospital federation.</p>
      </div>
    </div>
  )
}

function Deadlock() {
  return (
    <div>
      <div className="grid gap-x-8 gap-y-6 md:grid-cols-2">
        {PAINS.map((p) => (
          <div key={p.title} className="flex gap-4">
            <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-ink-200 bg-white text-ink-600">
              <p.icon className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-[1.15rem] leading-snug text-ink-900">{p.title}</h3>
              <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-600">{p.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-7 max-w-[92ch] rounded-2xl border border-signal-300/60 bg-white p-6">
        <p className="font-serif text-[1.25rem] leading-snug text-ink-900 md:text-[1.45rem]">
          &ldquo;Data stays with the creator&rdquo; is not a limitation we work around. It is{' '}
          <span className="text-signal-600">the stated architecture of India&rsquo;s national health stack</span>,
          and the reason federated learning is the natural way to build clinical AI here.
        </p>
        <p className="mt-3 text-[0.76rem] font-medium text-ink-500">
          National Digital Health Blueprint · ABDM Health Data Management Policy
        </p>
      </div>
    </div>
  )
}

export default function FaceWhy({ front }) {
  const [tab, setTab] = useState('overview')
  const deadlock = tab === 'deadlock'
  return (
    <Face
      tabs={TABS}
      tab={tab}
      setTab={setTab}
      eyebrow={deadlock ? 'The deadlock' : undefined}
      title={deadlock ? 'Your best model is trapped inside your own walls.' : undefined}
    >
      {deadlock ? <Deadlock /> : <Overview front={front} />}
    </Face>
  )
}

import Mark from './Mark'
import FitPanel from './FitPanel'

export function FaceHeader({ right }) {
  return (
    <div className="flex shrink-0 items-center justify-between px-6 pt-5 md:px-10">
      <div className="flex items-center gap-2.5 text-ink-900">
        <Mark className="h-6 w-6 text-signal-600" />
        <span className="display text-[1.15rem] leading-none">Samhita</span>
        <span className="ml-0.5 hidden font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink-400 sm:inline">
          Health
        </span>
      </div>
      {right}
    </div>
  )
}

export function Tabs({ tabs, tab, setTab }) {
  return (
    <div data-nodrag className="flex flex-wrap items-center gap-1.5">
      {tabs.map((t) => {
        const on = t.id === tab
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`rounded-full border px-3.5 py-1.5 text-[0.76rem] font-semibold transition ${
              on
                ? 'border-ink-900 bg-ink-900 text-paper'
                : 'border-ink-200 bg-white/70 text-ink-500 hover:border-ink-400 hover:text-ink-800'
            }`}
          >
            {t.label}
          </button>
        )
      })}
    </div>
  )
}

/**
 * Standard face chrome: brand row, then a title/tabs row, then the panel.
 * The panel is the only thing allowed to scroll, and only when the viewport
 * is too short to hold it.
 */
export default function Face({ eyebrow, title, tabs, tab, setTab, children }) {
  const tabEl = tabs ? <Tabs tabs={tabs} tab={tab} setTab={setTab} /> : null

  /* No title → the panel supplies its own headline (the overview face). */
  if (!title) {
    return (
      <>
        <FaceHeader right={tabEl} />
        <FitPanel deps={tab}>{children}</FitPanel>
      </>
    )
  }

  return (
    <>
      <FaceHeader />

      <div className="flex shrink-0 flex-col gap-3 px-6 pb-3.5 pt-3.5 md:flex-row md:items-end md:justify-between md:px-10">
        <div className="min-w-0">
          <div className="eyebrow flex items-center gap-2.5 text-signal-700">
            <span className="inline-block h-px w-5 bg-current opacity-50" />
            {eyebrow}
          </div>
          <h2 className="display mt-1.5 text-[1.55rem] leading-tight md:text-[2.05rem]">{title}</h2>
        </div>
        {tabEl}
      </div>

      <FitPanel deps={tab}>{children}</FitPanel>
    </>
  )
}

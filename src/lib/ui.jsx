/* Small shared UI primitives. */

export function Pill({ children, tone = 'neutral', className = '' }) {
  const tones = {
    neutral: 'bg-ink-100 text-ink-700 border-ink-200',
    signal: 'bg-signal-300/25 text-signal-700 border-signal-300/60',
    statute: 'bg-statute-300/25 text-statute-700 border-statute-300/60',
    verify: 'bg-verify-300/25 text-verify-600 border-verify-300/60',
    risk: 'bg-risk-300/25 text-risk-600 border-risk-300/60',
    dark: 'bg-white/10 text-ink-200 border-white/15',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[0.72rem] font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}

/* ── Icons (inline, 1.5px stroke, 24-grid) ─────────────────── */
const I = ({ children, className = 'h-5 w-5', ...p }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    {...p}
  >
    {children}
  </svg>
)

export const Icons = {
  hospital: (p) => (
    <I {...p}>
      <path d="M3 21h18M5 21V7l7-4 7 4v14" />
      <path d="M12 9v6M9 12h6" />
      <path d="M9 21v-4h6v4" />
    </I>
  ),
  lock: (p) => (
    <I {...p}>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 1 1 8 0v3" />
    </I>
  ),
  shield: (p) => (
    <I {...p}>
      <path d="M12 3l7 3v6c0 4.4-3 8.2-7 9-4-.8-7-4.6-7-9V6z" />
      <path d="M9.5 12.2l1.8 1.8 3.4-3.6" />
    </I>
  ),
  scale: (p) => (
    <I {...p}>
      <path d="M12 4v16M7 20h10M3 8l4-2 4 2M13 8l4-2 4 2" />
      <path d="M3 8l-1 4a3 3 0 0 0 6 0zM21 8l1 4a3 3 0 0 1-6 0z" />
    </I>
  ),
  network: (p) => (
    <I {...p}>
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="5" cy="5" r="2" />
      <circle cx="19" cy="5" r="2" />
      <circle cx="5" cy="19" r="2" />
      <circle cx="19" cy="19" r="2" />
      <path d="M6.5 6.5l3.7 3.7M17.5 6.5l-3.7 3.7M6.5 17.5l3.7-3.7M17.5 17.5l-3.7-3.7" />
    </I>
  ),
  doc: (p) => (
    <I {...p}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </I>
  ),
  chart: (p) => (
    <I {...p}>
      <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
    </I>
  ),
  check: (p) => (
    <I {...p}>
      <path d="M4 12.5l5 5L20 6.5" />
    </I>
  ),
  x: (p) => (
    <I {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </I>
  ),
  arrow: (p) => (
    <I {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </I>
  ),
  chevron: (p) => (
    <I {...p}>
      <path d="M6 9l6 6 6-6" />
    </I>
  ),
  alert: (p) => (
    <I {...p}>
      <path d="M12 4.5L2.8 20h18.4z" />
      <path d="M12 10v4M12 17h.01" />
    </I>
  ),
  eye: (p) => (
    <I {...p}>
      <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.5" />
    </I>
  ),
  server: (p) => (
    <I {...p}>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </I>
  ),
  pulse: (p) => (
    <I {...p}>
      <path d="M2 12h4l2.5-7 4 14L15 12h7" />
    </I>
  ),
  users: (p) => (
    <I {...p}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
      <path d="M16 5.3a3.2 3.2 0 0 1 0 5.4M17.5 14.2A6.5 6.5 0 0 1 21.5 20" />
    </I>
  ),
}

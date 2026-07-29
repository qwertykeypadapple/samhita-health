import { useState } from 'react'
import Face from '../components/Face'
import { TimelinePanel, InstrumentsPanel, MatrixPanel } from '../panels/CompliancePanels'
import ReadinessPanel from '../panels/ReadinessPanel'

const TABS = [
  { id: 'timeline', label: 'Timeline' },
  { id: 'instruments', label: 'Instruments' },
  { id: 'matrix', label: 'Pooling vs federated' },
  { id: 'readiness', label: 'Readiness check' },
]

const HEADS = {
  timeline: { eyebrow: 'Compliance hub', title: 'What commences, and when.' },
  instruments: { eyebrow: 'Compliance hub', title: 'The instruments, one by one.' },
  matrix: { eyebrow: 'Compliance hub', title: 'Obligation by obligation.' },
  readiness: { eyebrow: 'Readiness assessment', title: 'Sixteen questions your DPO will be asked anyway.' },
}

export default function FaceCompliance() {
  const [tab, setTab] = useState('timeline')
  const h = HEADS[tab]
  return (
    <Face eyebrow={h.eyebrow} title={h.title} tabs={TABS} tab={tab} setTab={setTab}>
      {tab === 'timeline' && <TimelinePanel />}
      {tab === 'instruments' && <InstrumentsPanel />}
      {tab === 'matrix' && <MatrixPanel />}
      {tab === 'readiness' && <ReadinessPanel />}
    </Face>
  )
}

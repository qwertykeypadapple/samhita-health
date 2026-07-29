import { useState } from 'react'
import Face from '../components/Face'
import ImpactPanel from '../panels/ImpactPanel'
import { ApplicationsPanel, FaqPanel, ContactPanel } from '../panels/ClosingPanels'

const TABS = [
  { id: 'calc', label: 'Calculator' },
  { id: 'apps', label: 'Applications' },
  { id: 'faq', label: 'Questions' },
  { id: 'contact', label: 'Contact' },
]

const HEADS = {
  calc: { eyebrow: 'What it is worth', title: 'How many patients does your model actually learn from?' },
  apps: { eyebrow: 'Where it earns its keep', title: 'Questions a single hospital cannot answer alone.' },
  faq: { eyebrow: 'Straight answers', title: 'Questions we get in the first meeting.' },
  contact: { eyebrow: 'Get started', title: 'Bring your DPO. That is the meeting that matters.' },
}

export default function FaceImpact() {
  const [tab, setTab] = useState('calc')
  const h = HEADS[tab]
  return (
    <Face eyebrow={h.eyebrow} title={h.title} tabs={TABS} tab={tab} setTab={setTab}>
      {tab === 'calc' && <ImpactPanel />}
      {tab === 'apps' && <ApplicationsPanel />}
      {tab === 'faq' && <FaqPanel />}
      {tab === 'contact' && <ContactPanel />}
    </Face>
  )
}

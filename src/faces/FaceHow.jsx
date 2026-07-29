import { useState } from 'react'
import Face from '../components/Face'
import RoundVisualiser from '../panels/RoundVisualiser'
import PrivacyPanel from '../panels/PrivacyPanel'
import SecurityPanel from '../panels/SecurityPanel'

const TABS = [
  { id: 'round', label: 'Round visualiser' },
  { id: 'privacy', label: 'Privacy controls' },
  { id: 'security', label: 'Deployment & security' },
]

const HEADS = {
  round: { eyebrow: 'How a training round works', title: 'Five steps. Zero records in transit.' },
  privacy: { eyebrow: 'Privacy controls', title: 'Privacy is a dial you set, not a claim we make.' },
  security: { eyebrow: 'Deployment & security', title: 'What your IT team will ask, answered first.' },
}

export default function FaceHow({ front }) {
  const [tab, setTab] = useState('round')
  const h = HEADS[tab]
  return (
    <Face eyebrow={h.eyebrow} title={h.title} tabs={TABS} tab={tab} setTab={setTab}>
      {tab === 'round' && <RoundVisualiser active={front} />}
      {tab === 'privacy' && <PrivacyPanel />}
      {tab === 'security' && <SecurityPanel />}
    </Face>
  )
}

import { useEffect, useState } from 'react'
import Cube from './components/Cube'
import FaceWhy from './faces/FaceWhy'
import FaceHow from './faces/FaceHow'
import FaceCompliance from './faces/FaceCompliance'
import FaceImpact from './faces/FaceImpact'

const FACES = [
  { id: 'why', label: 'Why federated', render: (front) => <FaceWhy front={front} /> },
  { id: 'how', label: 'How it works', render: (front) => <FaceHow front={front} /> },
  { id: 'compliance', label: 'Compliance', render: () => <FaceCompliance /> },
  { id: 'impact', label: 'Impact', render: () => <FaceImpact /> },
]

const indexOfHash = () => {
  const i = FACES.findIndex((f) => f.id === window.location.hash.slice(1))
  return i < 0 ? 0 : i
}

export default function App() {
  const [pos, setPos] = useState(indexOfHash)

  /* Keep the URL in step so a face can be linked to directly. */
  const front = ((pos % FACES.length) + FACES.length) % FACES.length
  useEffect(() => {
    const id = `#${FACES[front].id}`
    if (window.location.hash !== id) window.history.replaceState(null, '', id)
  }, [front])

  useEffect(() => {
    const onHash = () => setPos((p) => p + (indexOfHash() - (((p % FACES.length) + FACES.length) % FACES.length)))
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  return <Cube faces={FACES} pos={pos} setPos={setPos} />
}

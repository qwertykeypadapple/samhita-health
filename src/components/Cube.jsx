import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Four-face cube. Swiping right brings the left-hand face round to the front,
 * swiping left brings the right-hand one. Drag tracks the finger; release
 * commits or springs back.
 */
const N = 4
const COMMIT = 0.16 // fraction of viewport width that counts as a swipe
const FLICK = 0.55 // px/ms

/* Ignore drags that start on something the user is actually operating. */
const INTERACTIVE = 'input,textarea,select,button,a,[data-nodrag]'

export default function Cube({ faces, pos, setPos }) {
  const [drag, setDrag] = useState(0) // -1..1, fraction of a face turned
  const [settling, setSettling] = useState(false)
  const stageRef = useRef(null)
  const gesture = useRef(null)

  const go = useCallback(
    (delta) => {
      setSettling(true)
      setDrag(0)
      setPos((p) => p + delta)
    },
    [setPos],
  )

  /* Keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.(INTERACTIVE)) return
      if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  /* Pointer drag */
  const onPointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return
    if (e.target.closest?.(INTERACTIVE)) return
    gesture.current = { x: e.clientX, y: e.clientY, t: performance.now(), axis: null, id: e.pointerId }
    setSettling(false)
  }

  const onPointerMove = (e) => {
    const g = gesture.current
    if (!g) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y

    /* Lock to an axis once the gesture is clearly one or the other, so a
       vertical scroll inside a panel never spins the cube. */
    if (!g.axis) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y'
      if (g.axis === 'x') stageRef.current?.setPointerCapture?.(g.id)
    }
    if (g.axis !== 'x') return

    const w = stageRef.current?.clientWidth || window.innerWidth
    setDrag(Math.max(-1, Math.min(1, dx / w)))
  }

  const endGesture = (e) => {
    const g = gesture.current
    if (!g) return
    gesture.current = null
    if (g.axis !== 'x') return

    const w = stageRef.current?.clientWidth || window.innerWidth
    const dx = (e.clientX ?? g.x) - g.x
    const dt = Math.max(1, performance.now() - g.t)
    const v = Math.abs(dx) / dt

    setSettling(true)
    if (Math.abs(dx) / w > COMMIT || v > FLICK) {
      // Drag right → previous face comes round from the left.
      setDrag(0)
      setPos((p) => p + (dx > 0 ? -1 : 1))
    } else {
      setDrag(0)
    }
  }

  const rot = -(pos - drag) * 90
  const front = ((pos % N) + N) % N

  return (
    <>
      <div
        ref={stageRef}
        className={`stage ${gesture.current?.axis === 'x' ? 'grabbing' : ''}`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endGesture}
        onPointerCancel={endGesture}
      >
        <div
          className={`cube ${settling && !drag ? 'settling' : ''}`}
          style={{ '--rot': `${rot}deg`, '--half': '50vw' }}
          onTransitionEnd={() => setSettling(false)}
        >
          {faces.map((f, i) => {
            const isFront = i === front
            return (
              <div key={f.id} className="face" style={{ '--a': `${i * 90}deg`, '--half': '50vw' }}>
                <div className="face-shell" aria-hidden={!isFront} inert={!isFront}>
                  {f.render(isFront)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Radio indicators */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-2 pb-5 pt-8"
        aria-label="Faces"
      >
        <div className="flex items-center gap-1 rounded-full border border-ink-200/80 bg-paper/90 px-2.5 py-2 backdrop-blur-xl">
          <button
            onClick={() => go(-1)}
            className="grid h-7 w-7 place-items-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-800"
            aria-label="Previous face"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {faces.map((f, i) => {
            const on = i === front
            return (
              <button
                key={f.id}
                onClick={() => go(i - front)}
                className="group flex items-center gap-2 rounded-full px-2.5 py-1.5 transition hover:bg-ink-100"
                aria-current={on}
                title={f.label}
              >
                <span
                  className={`grid h-3.5 w-3.5 place-items-center rounded-full border transition-all ${
                    on ? 'border-ink-900' : 'border-ink-300 group-hover:border-ink-500'
                  }`}
                >
                  <span
                    className={`rounded-full bg-ink-900 transition-all duration-300 ${on ? 'h-1.5 w-1.5' : 'h-0 w-0'}`}
                  />
                </span>
                <span
                  className={`hidden text-[0.74rem] font-semibold transition-colors sm:block ${
                    on ? 'text-ink-900' : 'text-ink-400 group-hover:text-ink-700'
                  }`}
                >
                  {f.label}
                </span>
              </button>
            )
          })}

          <button
            onClick={() => go(1)}
            className="grid h-7 w-7 place-items-center rounded-full text-ink-400 transition hover:bg-ink-100 hover:text-ink-800"
            aria-label="Next face"
          >
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </nav>
    </>
  )
}

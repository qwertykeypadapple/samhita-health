import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

/**
 * Nudges a face's panel down to fit the viewport, and lets the panel scroll for
 * whatever is left over. Transforms don't affect layout, so the child's
 * scrollHeight stays the natural height and can be measured while a scale is
 * applied.
 *
 * Width is deliberately left at 100%: widening the child as it shrinks would
 * change its height, which would change the scale, which would change the
 * height again. Fixed width keeps the calculation a one-shot.
 */

/* Only a gentle shrink. Enough to absorb a small overshoot so a panel that is
   a few pixels too tall still reads as one screen, but not so much that body
   copy becomes unreadable: past this, scrolling is the better trade. */
const MIN = 0.9

/* Below this the layout has stacked into one column and no scale would fit it.
   Phones keep full-size type and scroll, which is the expected gesture there
   anyway; fitting is a desktop nicety. */
const FIT_ABOVE = 900

export default function FitPanel({ children, deps }) {
  const outer = useRef(null)
  const inner = useRef(null)
  const [scale, setScale] = useState(1)
  const [natural, setNatural] = useState(0)

  const measure = useCallback(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    if (window.innerWidth < FIT_ABOVE) {
      setScale(1)
      return
    }
    const h = i.scrollHeight
    /* clientHeight includes the panel's own padding; the content box is what
       the child actually gets, and the bottom padding is what keeps the face
       clear of the radio dots. */
    const cs = getComputedStyle(o)
    const avail = o.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom)
    if (!h || avail <= 0) return
    setNatural(h)
    setScale(h <= avail ? 1 : Math.max(MIN, avail / h))
  }, [])

  /* One measurement is not enough: a tab swap replaces the content, a webfont
     swap changes text metrics, and either can re-wrap the header's tabs and so
     change the height available to the panel. Measure now and on the next two
     frames, by which point layout has settled. */
  const settle = useCallback(() => {
    measure()
    let n = 0
    const tick = () => {
      measure()
      if (++n < 2) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }, [measure])

  const raf = useRef(0)

  useLayoutEffect(() => {
    settle()
    return () => cancelAnimationFrame(raf.current)
  }, [settle, deps])

  useEffect(() => {
    const o = outer.current
    const i = inner.current
    if (!o || !i) return
    const ro = new ResizeObserver(measure)
    ro.observe(o)
    ro.observe(i)
    window.addEventListener('resize', measure)
    window.addEventListener('orientationchange', settle)

    /* Crossing the fit/scroll breakpoint is a mode switch, so drive it off the
       media query itself rather than hoping a resize event lands. Without this
       a phone can keep a stale scale from a wider layout. */
    const mq = window.matchMedia(`(min-width: ${FIT_ABOVE}px)`)
    mq.addEventListener('change', settle)

    document.fonts?.ready.then(settle).catch(() => {})
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
      window.removeEventListener('orientationchange', settle)
      mq.removeEventListener('change', settle)
    }
  }, [measure, settle])

  return (
    <div ref={outer} className="panel-scroll px-6 pb-20 md:px-10">
      <div style={{ height: scale < 1 && natural ? natural * scale : undefined }}>
        <div
          ref={inner}
          style={{
            transform: scale < 1 ? `scale(${scale})` : undefined,
            transformOrigin: 'top center',
            willChange: scale < 1 ? 'transform' : undefined,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

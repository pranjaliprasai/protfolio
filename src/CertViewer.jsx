import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// View-only certificate viewer: big preview, caption, arrows to move between certificates.
// No download / open-file buttons, right-click and drag are switched off on the image.
export default function CertViewer({ items, index, onIndex, onClose }) {
  const c = items[index]
  const [loaded, setLoaded] = useState({})
  const closeRef = useRef(null)
  const touch = useRef(null)
  const count = items.length
  const go = (step) => onIndex((index + step + count) % count)

  useEffect(() => {
    closeRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onIndex((index + 1) % count)
      if (e.key === 'ArrowLeft') onIndex((index - 1 + count) % count)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, count, onIndex, onClose])

  // Preload the neighbours so arrowing through feels instant
  useEffect(() => {
    ;[1, -1].forEach((d) => { new Image().src = items[(index + d + count) % count].file })
  }, [index, count, items])

  const noSave = (e) => e.preventDefault()
  const onTouchStart = (e) => { touch.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touch.current === null) return
    const dx = e.changedTouches[0].clientX - touch.current
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1)
    touch.current = null
  }

  return createPortal(
    <div className="cert-lightbox" role="dialog" aria-modal="true" aria-label={`${c.title} certificate`} onClick={onClose}>
      <div className="lb-top" onClick={(e) => e.stopPropagation()}>
        <span className="lb-count">{String(index + 1).padStart(2, '0')} <i>/</i> {String(count).padStart(2, '0')}</span>
        <button ref={closeRef} className="lb-close" onClick={onClose} aria-label="Close">×</button>
      </div>

      <div className="lb-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {count > 1 && (
          <button className="lb-arrow prev" onClick={(e) => { e.stopPropagation(); go(-1) }} aria-label="Previous certificate">←</button>
        )}
        <figure className="lb-figure" onClick={(e) => e.stopPropagation()}>
          <div
            className={`lb-frame${loaded[c.file] ? ' ready' : ''}`}
            key={c.file}
            style={loaded[c.file] ? { '--ar': loaded[c.file] } : undefined}
          >
            <img
              src={c.file}
              alt={`${c.title} — ${c.issuer}`}
              draggable="false"
              onContextMenu={noSave}
              onDragStart={noSave}
              onLoad={(e) => {
                const { naturalWidth: w, naturalHeight: h } = e.currentTarget
                setLoaded((l) => ({ ...l, [c.file]: h ? w / h : 1.293 }))
              }}
            />
            <span className="lb-guard" onContextMenu={noSave} aria-hidden="true" />
          </div>
          <figcaption className="lb-caption">
            <div>
              <h3>{c.title}</h3>
              <p>{[c.issuer, c.date, c.detail].filter(Boolean).join(' · ')}</p>
            </div>
          </figcaption>
        </figure>
        {count > 1 && (
          <button className="lb-arrow next" onClick={(e) => { e.stopPropagation(); go(1) }} aria-label="Next certificate">→</button>
        )}
      </div>

      {count > 1 && (
        <div className="lb-dots" onClick={(e) => e.stopPropagation()}>
          {items.map((it, i) => (
            <button
              key={it.title}
              className={i === index ? 'active' : ''}
              onClick={() => onIndex(i)}
              aria-label={`Show ${it.title}`}
              aria-current={i === index}
            />
          ))}
        </div>
      )}
    </div>,
    document.body,
  )
}

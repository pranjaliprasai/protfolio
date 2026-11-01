import { useEffect, useRef, useState } from 'react'
import { profile } from './data'

// Renders the CV PDF as crisp "paper" pages inside the site.
// pdf.js is loaded only when the viewer opens, so it doesn't slow down the first page load.
async function loadPdf(url) {
  const [pdfjs, worker] = await Promise.all([
    import('pdfjs-dist'),
    import('pdfjs-dist/build/pdf.worker.min.mjs?url'),
  ])
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default
  return pdfjs.getDocument(url).promise
}

function Page({ pdf, number, width }) {
  const canvasRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!width) return
    let task
    let cancelled = false
    pdf.getPage(number).then((page) => {
      if (cancelled) return
      const base = page.getViewport({ scale: 1 })
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5)
      const viewport = page.getViewport({ scale: (width / base.width) * dpr })
      const canvas = canvasRef.current
      canvas.width = viewport.width
      canvas.height = viewport.height
      task = page.render({ canvasContext: canvas.getContext('2d'), viewport })
      task.promise.then(() => !cancelled && setReady(true)).catch(() => {})
    })
    return () => {
      cancelled = true
      task?.cancel()
    }
  }, [pdf, number, width])

  return (
    <div className={`cv-page${ready ? ' ready' : ''}`} style={{ '--i': number }}>
      <canvas ref={canvasRef} aria-label={`CV page ${number}`} role="img" />
      <span className="cv-page-num">{number}</span>
    </div>
  )
}

function ImagePage({ src, alt, width }) {
  const [ready, setReady] = useState(false)
  return (
    <div className={`cv-page${ready ? ' ready' : ''}`} style={{ '--i': 1, maxWidth: width || undefined }}>
      <img className="cv-img" src={src} alt={alt} onLoad={() => setReady(true)} onError={() => setReady(true)} />
    </div>
  )
}

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </svg>
)
const ExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 3h7v7M10 14 21 3M19 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" />
  </svg>
)

// Generic viewer for a PDF or an image (CV, certificates…)
export function DocViewer({ src, title, subtitle, downloadName, extraAction, onClose }) {
  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(src)
  const [pdf, setPdf] = useState(null)
  const [error, setError] = useState(false)
  const [width, setWidth] = useState(0)
  const bodyRef = useRef(null)
  const closeRef = useRef(null)

  // Load the PDF
  useEffect(() => {
    if (isImage) return
    let doc
    loadPdf(src)
      .then((d) => { doc = d; setPdf(d) })
      .catch(() => setError(true))
    return () => doc?.destroy()
  }, [src, isImage])

  // Fit pages to the available width, and re-render when the window is resized
  useEffect(() => {
    const el = bodyRef.current
    const ro = new ResizeObserver(([entry]) => {
      const w = Math.min(entry.contentRect.width, 820)
      setWidth((prev) => (Math.abs(prev - w) > 24 ? Math.round(w) : prev))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Esc to close, lock page scroll, focus the close button
  useEffect(() => {
    closeRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  return (
    <div className="cv-backdrop" onClick={onClose}>
      <div className="cv-viewer" role="dialog" aria-modal="true" aria-labelledby="cv-title" onClick={(e) => e.stopPropagation()}>
        <header className="cv-bar">
          <div className="cv-title">
            <span className="cv-file" aria-hidden="true">{isImage ? 'IMG' : 'PDF'}</span>
            <div>
              <h2 id="cv-title">{title}</h2>
              <p>{subtitle}{pdf && pdf.numPages > 1 ? ` · ${pdf.numPages} pages` : ''}</p>
            </div>
          </div>
          <div className="cv-actions">
            {extraAction}
            <a className="btn small" href={src} download={downloadName}>
              <DownloadIcon /> <span className="cv-label">Download</span>
            </a>
            <a className="icon-btn" href={src} target="_blank" rel="noreferrer" aria-label="Open in a new tab" title="Open in new tab">
              <ExternalIcon />
            </a>
            <button ref={closeRef} className="icon-btn cv-close" onClick={onClose} aria-label="Close">×</button>
          </div>
        </header>

        <div className="cv-body" ref={bodyRef}>
          {error ? (
            <div className="cv-error">
              <p>The preview couldn't load here.</p>
              <a className="btn" href={src} target="_blank" rel="noreferrer">Open the file instead ↗</a>
            </div>
          ) : isImage ? (
            <ImagePage src={src} alt={subtitle} width={width} />
          ) : !pdf ? (
            <div className="cv-page skeleton" style={{ width: width || '100%' }} aria-label="Loading CV">
              <div className="cv-shimmer" />
            </div>
          ) : (
            Array.from({ length: pdf.numPages }, (_, i) => (
              <Page key={i} pdf={pdf} number={i + 1} width={width} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default function CvViewer({ onClose }) {
  return (
    <DocViewer
      src={profile.resume}
      title={<>Curriculum <em>Vitae</em></>}
      subtitle={profile.name}
      downloadName="Pranjali-Prasai-CV.pdf"
      onClose={onClose}
    />
  )
}

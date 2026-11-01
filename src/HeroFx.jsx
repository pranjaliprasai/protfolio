import { useEffect, useRef, useState } from 'react'

import { prefersReduced } from './heroUtils'


/* ---------- 1. Intro curtain (first visit per browser session) ---------- */

export function Intro({ initials }) {
  const [count, setCount] = useState(0)
  const [leaving, setLeaving] = useState(false)
  const [gone, setGone] = useState(false)

  useEffect(() => {
    try { sessionStorage.setItem('intro-seen', '1') } catch { /* ignore */ }
    const start = performance.now()
    const dur = 1000
    let raf
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1)
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100)) // ease-out
      if (p < 1) raf = requestAnimationFrame(tick)
      else setLeaving(true)
    }
    raf = requestAnimationFrame(tick)
    const t = setTimeout(() => setGone(true), dur + 900)
    return () => { cancelAnimationFrame(raf); clearTimeout(t) }
  }, [])

  if (gone) return null
  return (
    <div className={`intro${leaving ? ' leave' : ''}`} aria-hidden="true">
      <div className="intro-inner">
        <span className="intro-mark">{initials}<b>*</b></span>
        <span className="intro-count">{String(count).padStart(3, '0')}</span>
      </div>
      <div className="intro-bar"><i style={{ transform: `scaleX(${count / 100})` }} /></div>
    </div>
  )
}

/* ---------- 2. Name split into letters that rise in ---------- */

export function SplitText({ text, start = 0, step = 0.045, className = '' }) {
  return (
    <span className={`split ${className}`} aria-label={text}>
      {[...text].map((ch, i) => (
        <span key={i} className="char" aria-hidden="true" style={{ '--d': `${start + i * step}s` }}>
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}

/* ---------- 3. Typewriter that cycles through roles ---------- */

export function RoleTyper({ roles }) {
  const [i, setI] = useState(0)
  const [text, setText] = useState(prefersReduced() ? roles[0] : '')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (prefersReduced()) return
    const full = roles[i % roles.length]
    let delay = deleting ? 35 : 70
    if (!deleting && text === full) delay = 1800 // pause on the full word
    if (deleting && text === '') delay = 300
    const t = setTimeout(() => {
      if (!deleting && text === full) setDeleting(true)
      else if (deleting && text === '') { setDeleting(false); setI((n) => n + 1) }
      else setText(full.slice(0, text.length + (deleting ? -1 : 1)))
    }, i === 0 && text === '' && !deleting ? 1600 : delay)
    return () => clearTimeout(t)
  }, [text, deleting, i, roles])

  return (
    <span className="typer">
      <span className="sr-only">{roles.join(', ')}</span>
      <span aria-hidden="true">{text}</span>
      <span className="typer-caret" aria-hidden="true" />
    </span>
  )
}

/* ---------- 4. Interactive dot field behind the hero ---------- */

export function DotField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = prefersReduced()
    const mouse = { x: -9999, y: -9999, active: false }
    let w = 0, h = 0, dpr = 1, raf = 0, visible = true
    let colors = { dot: '#171512', accent: '#d9411a' }

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement)
      colors = { dot: cs.getPropertyValue('--text').trim(), accent: cs.getPropertyValue('--accent').trim() }
    }
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const GAP = 30
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h)
      const time = t / 1000
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) {
          // gentle wave
          const wave = reduced ? 0 : Math.sin(x * 0.012 + time * 1.1) * Math.cos(y * 0.015 + time * 0.8)
          let px = x, py = y + wave * 4
          let r = 1.1 + (wave + 1) * 0.35
          let near = 0
          if (mouse.active) {
            const dx = px - mouse.x, dy = py - mouse.y
            const dist = Math.hypot(dx, dy)
            const R = 140
            if (dist < R) {
              near = 1 - dist / R
              const push = near * near * 26
              px += (dx / (dist || 1)) * push
              py += (dy / (dist || 1)) * push
              r += near * 1.8
            }
          }
          ctx.globalAlpha = 0.13 + near * 0.75
          ctx.fillStyle = near > 0.15 ? colors.accent : colors.dot
          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const loop = (t) => {
      if (visible && !document.hidden) draw(t)
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = mouse.y > -50 && mouse.y < r.height + 50
    }
    const onLeave = () => { mouse.active = false }

    readColors()
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const mo = new MutationObserver(readColors) // theme switch
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
    io.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    if (reduced) draw(0)
    else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect(); mo.disconnect(); io.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas ref={ref} className="dot-field" aria-hidden="true" />
}


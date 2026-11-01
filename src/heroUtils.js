import { useEffect, useRef } from 'react'

export const prefersReduced = () =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

let introDecided = null
// Decide once, before the first paint, so the hero can wait for the curtain
export function shouldShowIntro() {
  if (introDecided !== null) return introDecided
  let seen = false
  try { seen = sessionStorage.getItem('intro-seen') === '1' } catch { /* private mode */ }
  introDecided = !seen && !prefersReduced()
  if (introDecided) document.documentElement.style.setProperty('--intro', '1.45s')
  return introDecided
}

/* ---------- 5. Magnetic hover for hero buttons ---------- */

export function useMagnetic() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || prefersReduced() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const btns = [...el.querySelectorAll('.btn')]
    const handlers = btns.map((b) => {
      const move = (e) => {
        const r = b.getBoundingClientRect()
        const x = (e.clientX - r.left - r.width / 2) * 0.25
        const y = (e.clientY - r.top - r.height / 2) * 0.35
        b.style.transform = `translate(${x}px, ${y}px)`
      }
      const leave = () => { b.style.transform = '' }
      b.addEventListener('pointermove', move)
      b.addEventListener('pointerleave', leave)
      return () => { b.removeEventListener('pointermove', move); b.removeEventListener('pointerleave', leave) }
    })
    return () => handlers.forEach((off) => off())
  }, [])
  return ref
}

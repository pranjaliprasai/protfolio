import { useCallback, useEffect, useRef, useState } from 'react'
import CvViewer from './CvViewer'
import CertViewer from './CertViewer'
import { DotField, Intro, RoleTyper, SplitText } from './HeroFx'
import { shouldShowIntro, useMagnetic } from './heroUtils'
import { profile, about, experience, projects, skills, education, certifications } from './data'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'education', label: 'Education' },
  { id: 'contact', label: 'Contact' },
]
const navSections = sections.filter((s) => s.id !== 'education')
const initials = profile.name.split(' ').map((w) => w[0]).join('')
const reducedMotion = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches

function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    } catch {
      return 'dark'
    }
  })
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* ignore */ }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

// Fade sections in as they scroll into view
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    // The page renders after the browser tries to jump to #hash, so jump again
    if (location.hash) document.querySelector(location.hash)?.scrollIntoView()
    return () => io.disconnect()
  }, [])
}

// Highlight the nav link of the section currently in the middle of the screen
function useActiveSection() {
  const [active, setActive] = useState('')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el) })
    return () => io.disconnect()
  }, [])
  return active
}

function CommandMenu({ onClose, toggleTheme, showAboutTab, openCv }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef(null)

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  const commands = [
    ...sections.map((s) => ({ label: `Go to ${s.label}`, run: () => go(s.id) })),
    { label: 'Go to Skills', run: () => showAboutTab('skills') },
    { label: 'Go to Certifications', run: () => showAboutTab('certifications') },
    { label: 'Toggle theme', run: toggleTheme },
    { label: 'Copy email', run: () => navigator.clipboard?.writeText(profile.email) },
    ...(profile.resume ? [{ label: 'View CV', run: openCv }] : []),
  ]
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()))

  useEffect(() => inputRef.current?.focus(), [])

  const run = (cmd) => {
    cmd.run()
    onClose()
  }
  const onKey = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
    if (e.key === 'Enter' && filtered[active]) run(filtered[active])
  }

  return (
    <div className="cmd-backdrop" onClick={onClose}>
      <div className="cmd" onClick={(e) => e.stopPropagation()}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActive(0) }}
          onKeyDown={onKey}
          placeholder="Type a command…"
        />
        <ul>
          {filtered.map((c, i) => (
            <li key={c.label} className={i === active ? 'active' : ''} onMouseEnter={() => setActive(i)} onClick={() => run(c)}>
              <span>{c.label}</span><span className="cmd-enter">↵</span>
            </li>
          ))}
          {filtered.length === 0 && <li className="empty">No results</li>}
        </ul>
      </div>
    </div>
  )
}

const SunIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)
const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
  </svg>
)

const cvLink = (openCv, after) => ({
  href: profile.resume,
  onClick: (e) => {
    if (e.ctrlKey || e.metaKey || e.shiftKey) return
    e.preventDefault()
    after?.()
    openCv()
  },
})

const DocIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8M8 17h5" />
  </svg>
)
const DownloadIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
  </svg>
)

function Nav({ theme, toggleTheme, openMenu, active, openCv }) {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    // Close the phone menu if the screen grows to desktop size (e.g. rotating a tablet)
    const mq = matchMedia('(min-width: 901px)')
    const onResize = () => mq.matches && setOpen(false)
    window.addEventListener('keydown', onKey)
    mq.addEventListener('change', onResize)
    return () => {
      window.removeEventListener('keydown', onKey)
      mq.removeEventListener('change', onResize)
    }
  }, [open])

  return (
    <>
      {open && <div className="menu-scrim" onClick={close} />}
      <header className={`nav${open ? ' open' : ''}`}>
        <a href="#top" className="logo" aria-label="Back to top" onClick={close}>{initials}<span>*</span></a>
        <nav className="nav-links">
          {navSections.map((s) => (
            <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''}>{s.label}</a>
          ))}
        </nav>
        <div className="nav-actions">
          <button className="kbd-btn" onClick={openMenu} aria-label="Open command menu"><kbd>Ctrl</kbd><kbd>K</kbd></button>
          <button className="icon-btn" onClick={toggleTheme} aria-label="Toggle theme">{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</button>
          {profile.resume && <a className="btn small resume-btn" {...cvLink(openCv)}>View CV</a>}
          <button
            className="icon-btn menu-btn"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span className="burger" />
          </button>
        </div>
        {open && (
          <nav id="mobile-menu" className="mobile-menu" aria-label="Sections">
            {sections.map((s, i) => (
              <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''} onClick={close}>
                {s.label}<span>{String(i + 1).padStart(2, '0')}</span>
              </a>
            ))}
            {profile.resume && <a {...cvLink(openCv, close)}>View CV<span>PDF</span></a>}
          </nav>
        )}
      </header>
    </>
  )
}

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 4.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
  </svg>
)
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .3a12 12 0 0 0-3.8 23.38c.6.12.83-.26.83-.57l-.02-2.04c-3.34.73-4.04-1.6-4.04-1.6-.55-1.4-1.34-1.77-1.34-1.77-1.08-.74.09-.73.09-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.8 1.3 3.49 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.14-.3-.54-1.52.1-3.18 0 0 1-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.28-1.55 3.29-1.23 3.29-1.23.64 1.66.24 2.88.12 3.18a4.65 4.65 0 0 1 1.23 3.22c0 4.61-2.8 5.63-5.48 5.92.42.36.81 1.1.81 2.22l-.01 3.29c0 .32.21.69.82.57A12 12 0 0 0 12 .3" />
  </svg>
)
const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m3 7 9 6 9-6" />
  </svg>
)

// Round icon links to your profiles — each one hides itself while its link in data.js is empty
function Socials({ withLabels = false }) {
  const links = [
    profile.linkedin && { href: profile.linkedin, label: 'LinkedIn', Icon: LinkedInIcon, external: true },
    profile.github && { href: profile.github, label: 'GitHub', Icon: GitHubIcon, external: true },
    { href: `mailto:${profile.email}`, label: 'Email', Icon: MailIcon },
  ].filter(Boolean)
  return (
    <div className={`socials${withLabels ? ' labelled' : ''}`}>
      {links.map(({ href, label, Icon, external }) => (
        <a
          key={label}
          href={href}
          className={`social social-${label.toLowerCase()}`}
          aria-label={withLabels ? undefined : label}
          title={label}
          {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          <Icon />
          {withLabels && <span>{label}</span>}
        </a>
      ))}
    </div>
  )
}

/* ---------- Works ---------- */

const devicon = (name, variant = 'original') =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${name}/${name}-${variant}.svg`
const techIcons = {
  MongoDB: devicon('mongodb'),
  Express: devicon('express'),
  React: devicon('react'),
  'React.js': devicon('react'),
  'Node.js': devicon('nodejs'),
  JavaScript: devicon('javascript'),
  HTML: devicon('html5'),
  CSS: devicon('css3'),
  'Tailwind CSS': devicon('tailwindcss'),
  Python: devicon('python'),
  Java: devicon('java'),
  MySQL: devicon('mysql'),
  PostgreSQL: devicon('postgresql'),
  Figma: devicon('figma'),
  Git: devicon('git'),
  Vite: devicon('vitejs'),
  'C#': devicon('csharp'),
  'ASP.NET Core': devicon('dotnetcore'),
  '.NET MAUI': devicon('dotnetcore'),
  SQLite: devicon('sqlite'),
  Swagger: devicon('swagger'),
  Postman: devicon('postman'),
  Pandas: devicon('pandas'),
  'Oracle SQL': devicon('oracle'),
  Bootstrap: devicon('bootstrap'),
  'ASP.NET': devicon('dotnetcore'),
  'Scikit-learn': devicon('scikitlearn'),
  Linux: devicon('linux'),
  Windows: devicon('windows11'),
  'VS Code': devicon('vscode'),
  Canva: devicon('canva'),
}
const darkIcons = ['Express'] // black logos that need inverting in dark mode

function TechList({ tags }) {
  return (
    <ul className="tech">
      {tags.map((t) => (
        <li key={t} title={t}>
          {techIcons[t]
            ? <img src={techIcons[t]} alt="" width="18" height="18" loading="lazy" className={darkIcons.includes(t) ? 'invert-dark' : ''} />
            : <i className="tech-dot" />}
          <span>{t}</span>
        </li>
      ))}
    </ul>
  )
}

function StatusBadges({ p }) {
  return (
    <div className="work-badges">
      <span className={`status ${p.status}`}>{p.status === 'ongoing' ? 'Ongoing' : 'Completed'}</span>
      {p.hackathon && <span className="status hack">{p.hackathon}</span>}
    </div>
  )
}

// Shows the project screenshot, or a generated cover in the site's style when there is none
function Cover({ p, i }) {
  if (p.image) {
    return <div className="cover"><img src={p.image} alt={`${p.title} preview`} loading="lazy" /></div>
  }
  return (
    <div className={`cover cover-gen v${i % 3}`} aria-hidden="true">
      <span className="cover-num">{String(i + 1).padStart(2, '0')}</span>
      <span className="cover-title">{p.title}</span>
      <span className="cover-stack">{p.tags.slice(0, 3).join(' · ')}</span>
    </div>
  )
}

function ProjectModal({ p, i, onClose }) {
  const closeRef = useRef(null)
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
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close">×</button>
        <Cover p={p} i={i} />
        <div className="modal-body">
          <StatusBadges p={p} />
          <h3 id="modal-title">{p.title}</h3>
          <p>{p.details || p.desc}</p>
          <p className="tech-label">Technologies used</p>
          <TechList tags={p.tags} />
          {(p.link || profile.github) && (
            <div className="modal-actions">
              {p.link && <a className="btn" href={p.link} target="_blank" rel="noopener noreferrer">Visit project ↗</a>}
              {profile.github && (
                <a className="btn ghost" href={profile.github} target="_blank" rel="noopener noreferrer">
                  <span className="btn-icon"><GitHubIcon /></span>View my GitHub ↗
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const workFilters = [
  { id: 'all', label: 'All', match: () => true },
  { id: 'completed', label: 'Completed', match: (p) => p.status !== 'ongoing' },
  { id: 'ongoing', label: 'Ongoing', match: (p) => p.status === 'ongoing' },
  { id: 'hackathon', label: 'Hackathon', match: (p) => !!p.hackathon },
]

function Works() {
  const [filter, setFilter] = useState('all')
  const [openIndex, setOpenIndex] = useState(null)
  // Hide tabs that would be empty (e.g. no ongoing projects yet)
  const tabs = workFilters.filter((f) => f.id === 'all' || projects.some(f.match))
  const match = workFilters.find((f) => f.id === filter).match

  return (
    <>
      <div
        className="about-tabs work-filter"
        role="tablist"
        aria-label="Filter projects"
        style={{ '--idx': Math.max(0, tabs.findIndex((f) => f.id === filter)), '--n': tabs.length }}
      >
        <span className="about-tabs-pill" aria-hidden="true" />
        {tabs.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            className={filter === f.id ? 'active' : ''}
            onClick={() => setFilter(f.id)}
          >
            <span className="about-tab-label">{f.label}</span>
            <span className="about-tab-count">{projects.filter(f.match).length}</span>
          </button>
        ))}
      </div>

      <div className="work-grid">
        {projects.map((p, i) => match(p) && (
          <article key={p.title} className="work-card">
            <button className="cover-btn" onClick={() => setOpenIndex(i)} aria-label={`View ${p.title}`}>
              <Cover p={p} i={i} />
            </button>
            <div className="work-body">
              <StatusBadges p={p} />
              <h3>{p.title}</h3>
              <p className="muted">{p.desc}</p>
              <div className="work-foot">
                <p className="tech-label">Technologies used</p>
                <TechList tags={p.tags} />
              </div>
              <div className="work-actions">
                <button className="work-link" onClick={() => setOpenIndex(i)}>
                  View project <span>→</span>
                </button>
                {profile.github && (
                  <a
                    className="social work-gh"
                    href={profile.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="My GitHub profile"
                    title="GitHub"
                  >
                    <GitHubIcon />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {openIndex !== null && (
        <ProjectModal p={projects[openIndex]} i={openIndex} onClose={() => setOpenIndex(null)} />
      )}
    </>
  )
}

/* ---------- Contact form ---------- */

// Sends the message straight to your inbox through Web3Forms (free, no server needed).
// Your access key lives in data.js → profile.web3formsKey
const formReady = Boolean(profile.web3formsKey)
const FORM_URL = 'https://api.web3forms.com/submit'

const messageFields = (f) => ({
  access_key: profile.web3formsKey,
  subject: `Portfolio message from ${f.get('name')}`,
  from_name: 'Portfolio contact form',
  name: f.get('name'),
  email: f.get('email'),
  message: f.get('message'),
})

// Plan B: a normal browser form post (like old-school websites). It isn't affected by the
// cross-site checks that some browsers, networks or extensions block, and Web3Forms sends
// the visitor straight back here afterwards with ?sent=1.
function postAsNormalForm(fields) {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = FORM_URL
  form.style.display = 'none'
  const back = new URL(window.location.href)
  back.search = '?sent=1'
  back.hash = 'contact'
  Object.entries({ ...fields, redirect: back.href }).forEach(([name, value]) => {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  })
  document.body.appendChild(form)
  form.submit()
}

// Did we just come back from a Plan B send?
const cameBackSent = () => {
  try { return new URLSearchParams(window.location.search).get('sent') === '1' } catch { return false }
}

function ContactForm() {
  const [state, setState] = useState(() => (cameBackSent() ? 'sent' : 'idle')) // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!cameBackSent()) return
    // tidy the address bar and show the thank-you message
    window.history.replaceState(null, '', window.location.pathname + '#contact')
    setTimeout(() => document.getElementById('contact')?.scrollIntoView(), 300)
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    if (f.get('botcheck')) return // a bot filled the hidden field
    if (!formReady) {
      setErrorMsg('This form is still being set up.')
      setState('error')
      return
    }
    setState('sending')
    const fields = messageFields(f)

    // Plan A: send in the background. FormData (not JSON) keeps it a "simple" request,
    // so the browser doesn't need an extra permission check first.
    const body = new FormData()
    Object.entries(fields).forEach(([k, v]) => body.append(k, v))
    try {
      const res = await fetch(FORM_URL, { method: 'POST', body, headers: { Accept: 'application/json' } })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || String(data.success) === 'false') throw new Error(data.message || `Error ${res.status}`)
      form.reset()
      setState('sent')
    } catch (err) {
      console.warn('Background send failed, switching to normal form post:', err)
      if (err instanceof TypeError) {
        postAsNormalForm(fields) // Plan B — the page goes to Web3Forms and comes back
        return
      }
      setErrorMsg(`Couldn't send: ${err.message}.`)
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="contact-form card form-done" role="status">
        <span className="form-done-icon" aria-hidden="true">✓</span>
        <h3>Message <em>sent</em>!</h3>
        <p className="muted">Thank you for reaching out — I'll get back to you as soon as I can.</p>
        <button className="btn ghost" onClick={() => setState('idle')}>Send another</button>
      </div>
    )
  }

  return (
    <form className="contact-form card" onSubmit={onSubmit}>
      <h3>Send a <em>message</em></h3>
      {/* hidden trap for spam bots */}
      <input type="text" name="botcheck" tabIndex={-1} autoComplete="off" className="honey" aria-hidden="true" />
      <div className="field-row">
        <label>
          <span>Name</span>
          <input name="name" required autoComplete="name" placeholder="Your name" />
        </label>
        <label>
          <span>Email</span>
          <input name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        </label>
      </div>
      <label>
        <span>Message</span>
        <textarea name="message" rows="5" required minLength={5} placeholder="Hi Pranjali, I'd like to talk about…" />
      </label>
      <button className="btn" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? <>Sending<span className="sending-dots" /></> : <>Send message <span className="btn-arrow">→</span></>}
      </button>
      {state === 'error' ? (
        <p className="form-note error" role="alert">
          {errorMsg || "Couldn't send right now."} Please email me directly at{' '}
          <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      ) : (
        <p className="form-note">Your message goes straight to my inbox.</p>
      )}
    </form>
  )
}

// Deterministic "barcode" built from the letters of the name
const barcode = [...profile.name.replace(/\s/g, '').repeat(3)].map((c) => (c.charCodeAt(0) % 3) + 1)

function Ticket() {
  const ref = useRef(null)
  const onMove = (e) => {
    // Tilt only with a real mouse — on touch screens it would fight with scrolling
    if (reducedMotion() || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.setProperty('--ry', `${x * 14}deg`)
    ref.current.style.setProperty('--rx', `${-y * 14}deg`)
    ref.current.style.setProperty('--gx', `${(x + 0.5) * 100}%`)
    ref.current.style.setProperty('--gy', `${(y + 0.5) * 100}%`)
  }
  const onLeave = () => {
    ref.current.style.setProperty('--ry', '0deg')
    ref.current.style.setProperty('--rx', '0deg')
  }

  return (
    <div className="hero-visual">
      <div className="ticket" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
        <div className="ticket-top">
          <span>Developer Pass</span>
          <span>No. 001</span>
        </div>
        {profile.photo && (
          <figure className="ticket-photo">
            <img src={profile.photo} alt={`Portrait of ${profile.name}`} width="799" height="1024" fetchPriority="high" />
          </figure>
        )}
        <div className="ticket-id">
          {!profile.photo && <div className="avatar">{initials}</div>}
          <div>
            <h3>{profile.name}</h3>
            <p>{profile.role}</p>
          </div>
        </div>
        <dl className="ticket-meta">
          <div><dt>Based</dt><dd>Kathmandu, NP</dd></div>
          <div><dt>Time</dt><dd>{profile.timezone}</dd></div>
          <div><dt>Status</dt><dd className="ok">● Available</dd></div>
        </dl>
        <div className="tags">{profile.stack.map((s) => <span key={s}>{s}</span>)}</div>
        <div className="ticket-stub">
          <div className="barcode" aria-hidden="true">
            {barcode.map((w, i) => <i key={i} style={{ width: w }} />)}
          </div>
          <span>Admit one · {new Date().getFullYear()}</span>
        </div>
      </div>
      <SpinBadge />
    </div>
  )
}

function SpinBadge() {
  return (
    <div className="spin-badge" aria-hidden="true">
      <svg viewBox="0 0 120 120">
        <defs>
          <path id="badge-circle" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
        </defs>
        <text>
          <textPath href="#badge-circle" textLength="274">OPEN TO WORK ✦ FRONTEND ✦ FULL STACK ✦ </textPath>
        </text>
      </svg>
      <span>✺</span>
    </div>
  )
}

function Marquee() {
  const items = skills.filter((s) => s.group !== 'Soft Skills').flatMap((s) => s.items)
  const row = items.map((i) => <span key={i}>{i}<b>✦</b></span>)
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div>{row}</div>
        <div>{row}</div>
      </div>
    </div>
  )
}

/* ---------- About tabs: About me / Skills / Certifications ---------- */

const aboutTabs = [
  { id: 'about', label: 'About me', icon: 'M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z' },
  { id: 'skills', label: 'Skills', icon: 'm16 18 6-6-6-6M8 6l-6 6 6 6', count: () => skills.reduce((n, g) => n + g.items.length, 0) },
  { id: 'certifications', label: 'Certifications', icon: 'M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM8.2 13.9 7 22l5-3 5 3-1.2-8.1', count: () => certifications.length },
]

function AboutTabs({ tab, setTab }) {
  // Arrow keys move between tabs, as keyboard and screen-reader users expect
  const onKey = (e) => {
    const i = aboutTabs.findIndex((t) => t.id === tab)
    const next = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null
    if (next === null) return
    const t = aboutTabs[(next + aboutTabs.length) % aboutTabs.length]
    setTab(t.id)
    document.getElementById(`tab-${t.id}`)?.focus()
  }
  return (
    <div
      className="about-tabs"
      role="tablist"
      aria-label="About sections"
      onKeyDown={onKey}
      style={{ '--idx': aboutTabs.findIndex((t) => t.id === tab), '--n': aboutTabs.length }}
    >
      <span className="about-tabs-pill" aria-hidden="true" />
      {aboutTabs.map((t) => (
        <button
          key={t.id}
          id={`tab-${t.id}`}
          role="tab"
          aria-selected={tab === t.id}
          aria-controls={`panel-${t.id}`}
          tabIndex={tab === t.id ? 0 : -1}
          className={tab === t.id ? 'active' : ''}
          onClick={() => setTab(t.id)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d={t.icon} />
          </svg>
          <span className="about-tab-label">{t.label}</span>
          {t.count && <span className="about-tab-count">{t.count()}</span>}
        </button>
      ))}
    </div>
  )
}

function SkillChip({ name, i }) {
  return (
    <li className="skill-chip" style={{ '--i': i }}>
      {techIcons[name]
        ? <img src={techIcons[name]} alt="" width="22" height="22" loading="lazy" className={darkIcons.includes(name) ? 'invert-dark' : ''} />
        : <i className="tech-dot" />}
      <span>{name}</span>
    </li>
  )
}

function SkillsPanel() {
  const tech = skills.filter((s) => s.group !== 'Soft Skills')
  const soft = skills.find((s) => s.group === 'Soft Skills')
  // running index so the chips pop in one after another across groups
  const offsets = tech.map((_, gi) => tech.slice(0, gi).reduce((sum, g) => sum + g.items.length, 0))
  return (
    <div className="tab-panel skills-panel" role="tabpanel" id="panel-skills" aria-labelledby="tab-skills">
      {tech.map((g, gi) => (
        <div key={g.group} className="skill-group">
          <h3>{g.group}</h3>
          <ul className="skill-cloud">
            {g.items.map((name, j) => <SkillChip key={name} name={name} i={offsets[gi] + j} />)}
          </ul>
        </div>
      ))}
      {soft && (
        <div className="skill-group soft">
          <h3>{soft.group}</h3>
          <ul className="soft-list">
            {soft.items.map((name) => <li key={name}>{name}</li>)}
          </ul>
        </div>
      )}
    </div>
  )
}

const certKind = (c) => (/amazon/i.test(c.issuer) ? 'aws' : /linkedin/i.test(c.issuer) ? 'linkedin' : 'award')
// Preview image: public/certificates/thumbs/<same name>.webp (or set `thumb` in data.js)
const certThumb = (c) => c.thumb || c.file.replace(/([^/]+)\.\w+$/, 'thumbs/$1.webp')

function CertsPanel() {
  const viewable = certifications.filter((c) => c.file)
  const [openIndex, setOpenIndex] = useState(null)
  const show = (c) => setOpenIndex(viewable.indexOf(c))
  const close = () => setOpenIndex(null)
  return (
    <div className="tab-panel" role="tabpanel" id="panel-certifications" aria-labelledby="tab-certifications">
      <ul className="cert-grid">
        {certifications.map((c, i) => {
          const kind = certKind(c)
          return (
            <li key={c.title} className="card cert-card" style={{ '--i': i }}>
              {c.file && (
                <button className="cert-thumb" onClick={() => show(c)} aria-label={`View ${c.title} certificate`}>
                  <img src={certThumb(c)} alt="" loading="lazy" width="720" height="557" />
                  <span className="cert-thumb-cta" aria-hidden="true">View ↗</span>
                </button>
              )}
              <div className="cert-body">
                <div className="cert-top">
                  <span className={`cert-logo ${kind}`}>
                    {kind === 'aws' ? <img src={devicon('amazonwebservices', 'plain-wordmark')} alt="" width="26" height="26" loading="lazy" />
                      : kind === 'linkedin' ? <LinkedInIcon />
                        : <span className="cert-mono" aria-hidden="true">KU</span>}
                  </span>
                  <span className="status">{kind === 'award' ? 'Achievement' : 'Certificate'}</span>
                </div>
                <h3>{c.title}</h3>
                <p className="cert-issuer">{c.issuer}</p>
                {(c.date || c.detail) && (
                  <p className="cert-meta">{[c.date, c.detail].filter(Boolean).join(' · ')}</p>
                )}
                {c.file && (
                  <div className="cert-actions">
                    <button className="work-link" onClick={() => show(c)}>
                      View certificate <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            </li>
          )
        })}
      </ul>

      {openIndex !== null && (
        <CertViewer items={viewable} index={openIndex} onIndex={setOpenIndex} onClose={close} />
      )}
    </div>
  )
}

function Section({ id, num, title, children }) {
  return (
    <section id={id} className="section reveal">
      <div className="section-head">
        <span className="section-num">({String(num).padStart(2, '0')})</span>
        <span className="section-label">{sections.find((s) => s.id === id)?.label}</span>
        <span className="section-line" />
      </div>
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  const [menuOpen, setMenuOpen] = useState(false)
  const active = useActiveSection()
  useReveal()

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setMenuOpen((o) => !o)
      }
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const [aboutTab, setAboutTab] = useState('about')
  const [cvOpen, setCvOpen] = useState(false)
  const openCv = () => setCvOpen(true)
  const closeCv = useCallback(() => setCvOpen(false), [])
  const showAboutTab = (tab) => {
    setAboutTab(tab)
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
  }

  const [first, ...rest] = profile.name.split(' ')
  const [showIntro] = useState(shouldShowIntro)
  const heroActions = useMagnetic()

  return (
    <>
      {showIntro && <Intro initials={initials} />}
      <div className="progress" aria-hidden="true" />
      <Nav theme={theme} toggleTheme={toggleTheme} openMenu={() => setMenuOpen(true)} active={active} openCv={openCv} />
      {cvOpen && <CvViewer onClose={closeCv} />}
      {menuOpen && <CommandMenu onClose={() => setMenuOpen(false)} toggleTheme={toggleTheme} showAboutTab={showAboutTab} openCv={openCv} />}

      <main id="top">
        <section className="hero">
          <DotField />
          <div className="hero-text">
            <p className="badge hero-in" style={{ '--d': '0s' }}><span className="dot" /> {profile.badge}</p>
            <h1>
              <span className="line"><SplitText text={first} start={0.1} /></span>
              <span className="line it">
                <SplitText text={rest.join(' ')} start={0.1 + first.length * 0.045 + 0.05} />
                <span className="accent pop">.</span>
              </span>
            </h1>
            <p className="role hero-in" style={{ '--d': '0.75s' }}><span>↳</span> <RoleTyper roles={profile.roles || [profile.role]} /></p>
            <p className="tagline hero-in" style={{ '--d': '0.9s' }}>{profile.tagline}</p>
            <div className="hero-actions hero-in" style={{ '--d': '1.05s' }} ref={heroActions}>
              <a className="btn" href="#projects">View my work <span className="btn-arrow">→</span></a>
              {profile.resume ? (
                <span className="cv-group">
                  <a className="btn ghost" {...cvLink(openCv)}>
                    <DocIcon /> View CV
                  </a>
                  <a
                    className="btn ghost cv-download"
                    href={profile.resume}
                    download="Pranjali-Prasai-CV.pdf"
                    aria-label="Download CV as PDF"
                    title="Download CV"
                  >
                    <DownloadIcon />
                  </a>
                </span>
              ) : (
                <a className="btn ghost" href="#contact">Get in touch</a>
              )}
            </div>
          </div>
          <Ticket />
        </section>

        <Marquee />

        <Section id="about" num={1} title={<>Crafting <em>interfaces</em> people enjoy using.</>}>
          <AboutTabs tab={aboutTab} setTab={setAboutTab} />

          {aboutTab === 'about' && (
            <div className="about-grid tab-panel" role="tabpanel" id="panel-about" aria-labelledby="tab-about">
              <div>
                {about.text.map((t, i) => <p key={t} className={i === 0 ? 'lead' : 'muted'}>{t}</p>)}
                <dl className="facts">
                  {about.facts.map(([k, v]) => (
                    <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
                  ))}
                </dl>
              </div>
              <div className="focus-grid">
                {about.focus.map((f, i) => (
                  <div key={f.title} className="card focus">
                    <span className="focus-num">0{i + 1}</span>
                    <h3>{f.title}</h3>
                    <p className="muted">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {aboutTab === 'skills' && <SkillsPanel />}
          {aboutTab === 'certifications' && <CertsPanel />}
        </Section>

        <Section id="experience" num={2} title={<>Where I've <em>worked</em>.</>}>
          <ol className="timeline">
            {experience.map((job) => (
              <li key={job.company + job.role} className="card">
                <div className="timeline-head">
                  <div>
                    <h3>{job.role}</h3>
                    <p className="at">{job.company}</p>
                  </div>
                  <span className="period pill">{job.period}</span>
                </div>
                <ul>{job.points.map((p) => <li key={p} className="muted">{p}</li>)}</ul>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="projects" num={3} title={<>Selected <em>projects</em>.</>}>
          <Works />
        </Section>

        <Section id="education" num={4} title={<>Where I've <em>studied</em>.</>}>
          <div className="edu-grid">
            {education.map((e) => (
              <div key={e.title} className="card edu">
                <div className="edu-top">
                  <span className="period pill">{e.period}</span>
                  {e.honours && <span className="status hack">{e.honours}</span>}
                </div>
                <h3>{e.title}</h3>
                <p className="at">{e.place}</p>
                <p className="muted">{e.note}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="contact" num={5} title={<>Let's build something <em>together</em>.</>}>
          <div className="contact-grid">
            <div className="contact-info">
              <p className="muted contact-lead">Looking for an internship, a junior role or a collaborator? My inbox is open.</p>
              <a className="email" href={`mailto:${profile.email}`}>
                <span>{profile.email}</span><span className="email-arrow">↗</span>
              </a>
              <dl className="contact-details">
                <div><dt>Location</dt><dd>{profile.location}</dd></div>
                <div><dt>Timezone</dt><dd>{profile.timezone}</dd></div>
              </dl>
              <div className="contact-actions">
                <Socials withLabels />
                {profile.resume && (
                  <a className="social social-cv" {...cvLink(openCv)}>
                    <DocIcon /><span>View CV</span>
                  </a>
                )}
              </div>
            </div>
            <ContactForm />
          </div>
        </Section>
      </main>

      <footer className="footer">
        <p className="footer-name" aria-hidden="true">{first}<em>.</em></p>
        <div className="footer-row">
          <p>© {new Date().getFullYear()} {profile.name}. All rights reserved. Built in Kathmandu.</p>
          <Socials />
          <a href="#top">Back to top ↑</a>
        </div>
      </footer>
    </>
  )
}

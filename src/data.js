// Edit everything about you here — the UI reads from this file.
export const profile = {
  name: 'Pranjali Prasai',
  role: 'Frontend & Full Stack Developer',
  roles: ['Frontend Developer', 'Full Stack Developer', 'UI / UX Enthusiast'], // typed one after another in the hero
  badge: 'BSc (Hons) Computing · First Class Honours · Open to opportunities',
  tagline: 'Building responsive, user-friendly web applications with React and the MERN stack.',
  location: 'Gaushala, Kathmandu, Nepal',
  timezone: 'UTC+5:45',
  email: 'pranjaliprasai1234@gmail.com',
  phone: '+977 9763234521',
  linkedin: 'https://www.linkedin.com/in/pranjali-p-0724a7346/',
  github: 'https://github.com/pranjaliprasai',
  resume: '/resume.pdf', // your CV in the public folder — replace public/resume.pdf to update it
  web3formsKey: '92fc535a-ae75-4e1f-a887-32876f3fe1cc', // paste your Web3Forms access key here — the contact form sends to your inbox once it's set
  photo: '/image.png', // your photo in the public folder — set to '' to show initials instead
  stack: ['React.js', 'JavaScript', 'Tailwind CSS', 'Node.js', 'MongoDB'],
}

export const about = {
  text: [
    'I hold a BSc (Hons) Computing with First Class Honours, with hands-on experience developing responsive web applications using HTML, CSS, JavaScript and React.',
    'I am passionate about frontend and full stack development, and have built academic and hackathon projects. I am looking for an opportunity to contribute to real-world software and keep learning modern web technologies.',
  ],
  focus: [
    { title: 'Frontend Development', desc: 'Responsive, accessible interfaces with React, HTML, CSS and Tailwind.' },
    { title: 'Full Stack (MERN)', desc: 'MongoDB, Express, React and Node.js applications from idea to launch.' },
    { title: 'UI / UX Design', desc: 'Designing in Figma and Canva and keeping design consistent across pages.' },
    { title: 'Teamwork & Delivery', desc: 'Agile collaboration, hackathons and shipping under tight deadlines.' },
  ],
  facts: [
    ['Based in', 'Gaushala, Kathmandu'],
    ['Degree', 'BSc (Hons) Computing, First Class Honours'],
    ['Focus', 'Frontend & Full Stack'],
  ],
}

export const experience = [
  {
    role: 'Frontend Developer',
    company: 'Semester Tech Company',
    period: 'Sep 2025 — Nov 2025',
    points: [
      'Developed and improved user interface components for web applications.',
      'Built responsive web pages using HTML, CSS, JavaScript, and frontend frameworks/tools.',
      'Collaborated with team members to improve user experience and website functionality.',
      'Fixed UI issues and maintained consistent design across pages.',
    ],
  },
]

// status: 'completed' or 'ongoing'
// hackathon: event name — adds a hackathon badge and puts it under the Hackathon tab ('' = not a hackathon)
// image: screenshot in the public folder, e.g. '/smartshelf.png' ('' = a generated cover is shown)
// link: live site — shows a "Visit project" button in the popup. Every project also links to your GitHub profile.
export const projects = [
  {
    title: 'SmartShelf',
    status: 'completed',
    hackathon: '',
    desc: 'eBook platform with a mobile app for readers and a web dashboard for admins, built on the MERN stack.',
    details: 'An eBook platform with a mobile app for readers and a web dashboard for admins. Includes highlights, bookmarks, text-to-speech, reading progress, subscriptions and personalised recommendations.',
    tags: ['MongoDB', 'Express', 'React', 'Node.js'],
    image: '',
    link: '',
  },
  {
    title: 'AutoSathi',
    status: 'completed',
    hackathon: '',
    desc: 'Vehicle parts sales and stock management system with Admin, Staff and Customer roles.',
    details: 'A vehicle parts sales and stock system with Admin, Staff and Customer roles. Features invoicing, financial reports, low-stock alerts, loyalty discounts and JWT-secured REST APIs.',
    tags: ['React', 'Vite', 'ASP.NET Core', 'C#', 'PostgreSQL', 'Entity Framework Core', 'JWT', 'Swagger'],
    image: '',
    link: '',
  },
  {
    title: 'Mero Dainiki',
    status: 'completed',
    hackathon: '',
    desc: 'Desktop journal diary app with one entry per day, mood tracking, analytics, PIN protection and PDF export.',
    details: 'A desktop journal diary app with one entry per day. Includes mood tracking, tags, calendar view, search, analytics, PIN protection and PDF export.',
    tags: ['.NET MAUI', 'C#', 'PostgreSQL', 'QuestPDF'],
    image: '',
    link: '',
  },
  {
    title: 'AI Book Recommendation System',
    status: 'completed',
    hackathon: '',
    desc: 'Book recommender combining popularity-based, content-based and collaborative filtering on Goodreads data.',
    details: 'Recommends books using popularity-based, content-based (TF-IDF) and collaborative filtering on Goodreads data. Built in Python and evaluated with Precision@K, HitRate@K and MRR.',
    tags: ['Python', 'Pandas', 'Scikit-learn', 'Surprise', 'Google Colab'],
    image: '',
    link: '',
  },
  {
    title: 'Kumari Cinemas Ticket Booking',
    status: 'completed',
    hackathon: '',
    desc: 'Movie ticket booking web app backed by a normalised Oracle database (UNF to 3NF).',
    details: 'A web-based movie ticket booking system for Kumari Cinemas, built with ASP.NET (C#) on an Oracle database designed from UNF to 3NF. Includes CRUD forms for movies, theaters, halls, shows and tickets, report forms, a dashboard and an automatic ticket cancellation rule.',
    tags: ['ASP.NET', 'C#', 'Oracle SQL', 'Bootstrap'],
    image: '',
    link: '',
  },
  {
    title: 'Eco-Sangraha',
    status: 'completed',
    hackathon: '48-hour Hackathon',
    desc: 'Website for students and college clubs to exchange reusable paper and event materials.',
    details: 'A website for students and college clubs to exchange reusable paper and event materials. Built as a responsive MERN app in a 48-hour hackathon.',
    tags: ['React', 'Node.js', 'Express', 'MongoDB'],
    image: '',
    link: '',
  },
  {
    title: 'Inventory Management System',
    status: 'completed',
    hackathon: '',
    desc: 'Warehouse management system for Global Tech Corporation with sales, purchase orders, user access and reports.',
    details: 'A warehouse system for sales, purchase orders, user access and reports. Planned with Gantt charts, WBS and UML diagrams.',
    tags: ['Software Engineering', 'UML', 'Project Planning'],
    image: '',
    link: '',
  },
  {
    title: 'Python Billing System',
    status: 'completed',
    hackathon: '',
    desc: 'Billing system written in Python for the Fundamentals of Computing module, planned with flowcharts.',
    details: 'A billing system written in Python for the Fundamentals of Computing module. Planned with flowcharts in Draw.io and written in IDLE.',
    tags: ['Python', 'IDLE', 'Draw.io'],
    image: '',
    link: '',
  },
]

export const skills = [
  { group: 'Languages', items: ['Python', 'Java', 'JavaScript', 'C#'] },
  { group: 'Frameworks & Web', items: ['React.js', 'Node.js', 'Express', 'ASP.NET Core', '.NET MAUI', 'HTML', 'CSS', 'Tailwind CSS', 'Vite'] },
  { group: 'Data & AI', items: ['Pandas', 'Scikit-learn', 'Google Colab'] },
  { group: 'Databases', items: ['MySQL', 'MongoDB', 'PostgreSQL', 'Oracle SQL', 'SQLite'] },
  { group: 'Tools & Software', items: ['Git', 'VS Code', 'Postman', 'Figma', 'Canva', 'IDLE'] },
  { group: 'Methodologies', items: ['Agile', 'MVC'] },
  { group: 'Operating Systems', items: ['Windows', 'Linux'] },
  { group: 'Soft Skills', items: ['Communication', 'Leadership', 'Teamwork', 'Time Management', 'Adaptability', 'Problem Solving'] },
]

export const education = [
  {
    title: 'BSc (Hons) Computing',
    place: 'London Metropolitan University',
    period: '2024 — 2026',
    honours: 'First Class Honours', // shows as a badge on the card
    note: 'BSc (Hons) Computing with First Class Honours, awarded by London Metropolitan University.',
  },
  {
    title: 'SEE',
    place: 'Sagarmatha English Medium School',
    period: '2020 — 2022',
    note: 'National Examination Board (NEB). Karkando, Nepalgunj, Banke.',
  },
  {
    title: 'SLC — Science',
    place: 'Adarsh Secondary School',
    period: '2020',
    note: 'National Examination Board (NEB). Nepalgunj, Banke.',
  },
]

// file: certificate image in public/certificates (view-only, no download) — preview thumbs live in public/certificates/thumbs
export const certifications = [
  { title: 'AWS Academy Cloud Foundations', issuer: 'Amazon Web Services', date: 'Nov 2024', detail: '20 hours', file: '/certificates/aws-cloud-foundations.webp' },
  { title: 'AWS Academy Data Engineering', issuer: 'Amazon Web Services', date: 'Nov 2024', detail: '40 hours', file: '/certificates/aws-data-engineering.webp' },
  { title: 'AWS Academy Machine Learning Foundations', issuer: 'Amazon Web Services', date: 'Nov 2024', detail: '20 hours', file: '/certificates/aws-ml-foundations.webp' },
  { title: 'AWS Academy Machine Learning for Natural Language Processing', issuer: 'Amazon Web Services', date: 'Dec 2024', detail: '20 hours', file: '/certificates/aws-ml-nlp.webp' },
  { title: 'Hack for Business — 48-hour Hackathon', issuer: 'Kathmandu University (KUSOM)', date: 'Jun 2025', detail: 'Participation', file: '/certificates/ku-hack-for-business.webp' },
  { title: 'Learning REST APIs', issuer: 'LinkedIn Learning', date: 'May 2026', detail: '1h 51m', file: '/certificates/linkedin-learning-rest-apis.webp' },
  { title: 'React: Ecosystems', issuer: 'LinkedIn Learning', date: 'May 2026', detail: '12 min', file: '/certificates/linkedin-react-ecosystems.webp' },
  { title: 'Communication Within Teams', issuer: 'LinkedIn Learning', date: 'May 2026', detail: '41 min', file: '/certificates/linkedin-communication-within-teams.webp' },
  { title: 'UX Design: 1 Overview', issuer: 'LinkedIn Learning', date: 'May 2026', detail: '13 min', file: '/certificates/linkedin-ux-design-overview.webp' },
]

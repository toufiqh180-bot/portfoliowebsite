export type StationKind = 'intro' | 'skill' | 'experience' | 'project' | 'contact';

export interface Station {
  id: string;
  kind: StationKind;
  /** grid coords of the building block */
  x: number;
  z: number;
  color: number;
  label: string;
  title: string;
  subtitle?: string;
  body: string;
  tags?: string[];
  link?: { href: string; text: string };
}

export const WORLD = { minX: -9, maxX: 9, minZ: -4, maxZ: 30 };

export const stations: Station[] = [
  {
    id: 'intro',
    kind: 'intro',
    x: 0,
    z: 2,
    color: 0xffc83d,
    label: 'START HERE',
    title: 'Toufiq Hasan',
    subtitle: 'Software Engineer • Full Stack • Mobile',
    body:
      "Welcome to my world! I'm a full-stack software engineer based in NYC who ships web and mobile products end to end — from APIs and databases to pixel-perfect UIs. Hop around to explore my skills, experience, and projects.",
    tags: ['NYC', 'Full Stack', 'Mobile', 'Open to work'],
  },

  // ---- Skills garden (left side) ----
  {
    id: 'skill-react',
    kind: 'skill',
    x: -6,
    z: 6,
    color: 0x61dafb,
    label: 'REACT',
    title: 'React & TypeScript',
    body: 'Component systems, state management, and reliable typed code across web and mobile. My daily drivers for building interfaces people love.',
    tags: ['React', 'TypeScript', 'Hooks', 'Design systems'],
  },
  {
    id: 'skill-mobile',
    kind: 'skill',
    x: -8,
    z: 9,
    color: 0x7b61ff,
    label: 'MOBILE',
    title: 'Expo / React Native',
    body: 'Shipping production mobile apps with Expo and React Native — shared code, native feel, and smooth release pipelines.',
    tags: ['Expo', 'React Native', 'iOS', 'Android'],
  },
  {
    id: 'skill-backend',
    kind: 'skill',
    x: -6,
    z: 12,
    color: 0x3fb950,
    label: 'NODE',
    title: 'Node.js & APIs',
    body: 'REST APIs, services, queues, and tooling. Backends that are fast to build on and dependable in production.',
    tags: ['Node.js', 'Express', 'REST', 'WebSockets'],
  },
  {
    id: 'skill-data',
    kind: 'skill',
    x: -8,
    z: 15,
    color: 0x336791,
    label: 'SQL',
    title: 'PostgreSQL & Data',
    body: 'Data modeling, query optimization, and dependable storage. Also Redis caching for speed where it counts.',
    tags: ['PostgreSQL', 'SQL', 'Redis', 'Data modeling'],
  },
  {
    id: 'skill-devops',
    kind: 'skill',
    x: -6,
    z: 18,
    color: 0xf97316,
    label: 'DEVOPS',
    title: 'DevOps & CI/CD',
    body: 'Docker, Kubernetes, Terraform, GitHub Actions, Fastlane. I automate the boring parts so releases are a non-event.',
    tags: ['Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Fastlane'],
  },
  {
    id: 'skill-testing',
    kind: 'skill',
    x: -8,
    z: 21,
    color: 0xec4899,
    label: 'TESTING',
    title: 'Testing & Quality',
    body: 'Jest, Cypress, and Playwright. Quality gates and automated tests that catch bugs before users do.',
    tags: ['Jest', 'Cypress', 'Playwright', 'Accessibility'],
  },

  // ---- Experience avenue (right side) ----
  {
    id: 'exp-stealth',
    kind: 'experience',
    x: 6,
    z: 6,
    color: 0x1f2937,
    label: 'STEALTH STARTUP',
    title: 'Full Stack Software Engineer — Stealth Startup',
    subtitle: 'Internship • Present',
    body:
      "Building the company's mobile app as a full-stack engineer. I pick up tickets in Jira and Linear and ship them end to end — features, fixes, and polish — collaborating with product and backend to keep releases moving.",
    tags: ['Expo', 'React Native', 'Full Stack', 'Jira', 'Linear'],
  },
  {
    id: 'exp-prospective',
    kind: 'experience',
    x: 8,
    z: 10,
    color: 0x2563eb,
    label: 'PROSPECTIVE LLC',
    title: 'Software Engineer — Prospective LLC',
    subtitle: '2024 — 2025',
    body:
      'Built website features, backend services, automated testing, accessibility improvements, and queue-driven workflows for production web systems.',
    tags: ['React', 'Node.js', 'SQL', 'Testing', 'Accessibility'],
  },
  {
    id: 'exp-ctp',
    kind: 'experience',
    x: 6,
    z: 14,
    color: 0x0ea5e9,
    label: 'CUNY TECH PREP',
    title: 'Software Development Fellow — CUNY Tech Prep',
    subtitle: '2025 — 2026',
    body:
      'Led a team on a LinkedIn-sponsored full-stack project — translating requirements into milestones, APIs, and a deployed product.',
    tags: ['Leadership', 'REST APIs', 'PostgreSQL', 'Deployment'],
  },
  {
    id: 'exp-interviewer',
    kind: 'experience',
    x: 8,
    z: 18,
    color: 0x9333ea,
    label: 'INTERVIEWER',
    title: 'Technical Interviewer — CUNY Tech Prep',
    subtitle: '2026',
    body:
      'Ran mock interviews for 250+ students and created evaluation rubrics focused on problem-solving, clarity, and complexity analysis.',
    tags: ['Mentorship', 'Algorithms', 'Communication'],
  },

  // ---- Projects plaza (center-far) ----
  {
    id: 'proj-confessions',
    kind: 'project',
    x: -3,
    z: 25,
    color: 0xef4444,
    label: 'CONFESSIONS',
    title: 'Confessions — 50,000+ active users',
    body:
      'Social platform with a scalable microservices backend, WebSockets for realtime, and Docker + Kubernetes for independent scaling and zero-downtime deploys.',
    tags: ['Microservices', 'WebSockets', 'Docker', 'Kubernetes'],
  },
  {
    id: 'proj-matterdesk',
    kind: 'project',
    x: 0,
    z: 27,
    color: 0x10b981,
    label: 'MATTER DESK',
    title: 'Matter Desk — 30% faster document review',
    body:
      'Secure legal document analysis app with optimized SQL, CI/CD, and testing workflows that cut review time and improved reliability.',
    tags: ['SQL', 'CI/CD', 'Security', 'Testing'],
  },
  {
    id: 'proj-news',
    kind: 'project',
    x: 3,
    z: 25,
    color: 0xfbbf24,
    label: 'NEWS AI',
    title: 'NY News AI Summarizer',
    body:
      'AI news aggregator using Python, Flask, OpenAI, Redis caching, and AWS Lambda — resilient daily summaries delivered by email.',
    tags: ['Python', 'OpenAI', 'Redis', 'AWS Lambda'],
  },

  // ---- Contact (end of road) ----
  {
    id: 'contact',
    kind: 'contact',
    x: 0,
    z: 30,
    color: 0xff5d8f,
    label: 'SAY HI!',
    title: "Let's build something",
    subtitle: 'Toufiq Hasan — open to full-time roles',
    body:
      "You made it to the end of the map! I'm always happy to talk about engineering, products, or opportunities. Reach out and let's connect.",
    tags: ['Email', 'LinkedIn', 'GitHub'],
    link: { href: 'mailto:toufiqhasan.dev@gmail.com', text: 'Email me' },
  },
];

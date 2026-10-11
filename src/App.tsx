const skills = [
  { name: 'React', detail: 'Interfaces, state, component systems' },
  { name: 'TypeScript', detail: 'Reliable full-stack feature delivery' },
  { name: 'Node.js', detail: 'APIs, services, queues, tooling' },
  { name: 'PostgreSQL', detail: 'Data modeling and dependable storage' },
  { name: 'Expo / React Native', detail: 'Mobile app delivery and shared code' },
  { name: 'CI/CD', detail: 'Fastlane, GitHub Actions, release pipelines' },
  { name: 'Testing', detail: 'Jest, Cypress, Playwright, quality gates' },
  { name: 'DevOps', detail: 'Docker, Kubernetes, Terraform, scaling' },
];

const experience = [
  {
    role: 'Mobile Engineer',
    company: 'Stealth Startup',
    period: '2026 — Present',
    summary:
      'Building the core mobile app with Expo and React Native, shipping tickets through Jira and Linear, and collaborating with product and backend teams to keep releases moving.',
    tags: ['Expo', 'React Native', 'Jira', 'Linear', 'Monorepo'],
  },
  {
    role: 'Software Engineer',
    company: 'Prospective LLC',
    period: '2024 — 2025',
    summary:
      'Built website features, backend services, automated testing, accessibility improvements, and queue-driven workflows for production web systems.',
    tags: ['React', 'Node.js', 'SQL', 'Testing', 'Accessibility'],
  },
  {
    role: 'Software Development Fellow',
    company: 'CUNY Tech Prep',
    period: '2025 — 2026',
    summary:
      'Led a team on a LinkedIn-sponsored full-stack project, translating requirements into milestones, APIs, and a deployed product.',
    tags: ['Leadership', 'REST APIs', 'PostgreSQL', 'Deployment'],
  },
  {
    role: 'Technical Interviewer',
    company: 'CUNY Tech Prep',
    period: '2026',
    summary:
      'Ran mock interviews for 250+ students and created evaluation rubrics focused on problem-solving, clarity, and complexity analysis.',
    tags: ['Mentorship', 'Algorithms', 'Communication'],
  },
];

const projects = [
  {
    name: 'Confessions',
    impact: '50,000+ active users',
    summary:
      'Social platform with a scalable microservices backend, WebSockets, Docker, and Kubernetes for independent scaling and zero-downtime deployments.',
  },
  {
    name: 'Matter Desk',
    impact: '30% faster document review',
    summary:
      'Secure legal document analysis app with optimized SQL, CI/CD, and testing workflows that reduced review time and improved reliability.',
  },
  {
    name: 'NY News AI Summarizer',
    impact: 'Daily automated delivery',
    summary:
      'AI news aggregator using Python, Flask, OpenAI, Redis caching, and AWS Lambda for resilient summaries by email.',
  },
];

const statBlocks = [
  { value: 'Full-Stack', label: 'Web, mobile, APIs, and DevOps' },
  { value: 'Launch-ready', label: 'Shipping features through release pipelines' },
  { value: 'Team-first', label: 'Tickets, feedback loops, and collaboration' },
];

function App() {
  return (
    <div className="page-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brick-logo" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div>
            <p className="eyebrow">Toufiq Hasan</p>
            <p className="subtle">Software Engineer • Mobile • Full Stack</p>
          </div>
        </div>

        <nav aria-label="Primary" className="nav-links">
          <a href="#skills">Skills</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Projects</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      <main>
        <section className="hero panel">
          <div className="hero-copy">
            <p className="section-kicker">Level 01 · Build Mode</p>
            <h1>
              I build software like a <span className="accent">LEGO game world</span> —
              modular, colorful, and easy to explore.
            </h1>
            <p className="hero-text">
              I’m a software engineer who ships polished experiences across mobile and web,
              from stealth-startup app work and Jira tickets to full-stack systems with React,
              Node.js, PostgreSQL, and DevOps tooling.
            </p>

            <div className="hero-actions">
              <a className="button primary" href="#projects">
                Enter the Build
              </a>
              <a className="button secondary" href="#contact">
                Contact Console
              </a>
            </div>

            <div className="stat-row">
              {statBlocks.map((stat) => (
                <article key={stat.label} className="stat-card">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </article>
              ))}
            </div>
          </div>

          <div className="hero-visual" aria-label="Lego-style game board illustration">
            <div className="board-grid" />
            <div className="mini-map">
              <div className="mini-node large">Ship</div>
              <div className="mini-node">Code</div>
              <div className="mini-node">Test</div>
              <div className="mini-node">Learn</div>
              <div className="mini-node highlight">Repeat</div>
            </div>
            <div className="floating-panel tower">
              <span className="panel-label">Current Quest</span>
              <h2>Mobile tickets → polished app features</h2>
              <p>Stealth startup work, layered carefully like bricks in a tower.</p>
            </div>
            <div className="floating-panel card-two">
              <span className="panel-label">Power-ups</span>
              <p>React Native • Expo • TypeScript • CI/CD • APIs</p>
            </div>
          </div>
        </section>

        <section id="skills" className="section-block">
          <div className="section-header">
            <p className="section-kicker">Inventory · Skill Bricks</p>
            <h2>Tooling that stacks cleanly across web, mobile, and infra.</h2>
          </div>
          <div className="skill-grid">
            {skills.map((skill, index) => (
              <article key={skill.name} className="skill-brick" style={{ animationDelay: `${index * 70}ms` }}>
                <div className="brick-studs" aria-hidden="true">
                  <span />
                  <span />
                </div>
                <h3>{skill.name}</h3>
                <p>{skill.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="experience" className="section-block">
          <div className="section-header">
            <p className="section-kicker">Quest Log · Experience Path</p>
            <h2>Career milestones arranged like a playable route.</h2>
          </div>
          <div className="timeline">
            {experience.map((item, index) => (
              <article key={item.role} className="timeline-card">
                <div className="timeline-marker">0{index + 1}</div>
                <div>
                  <p className="timeline-meta">
                    {item.company} · {item.period}
                  </p>
                  <h3>{item.role}</h3>
                  <p>{item.summary}</p>
                  <div className="tag-row">
                    {item.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section-block">
          <div className="section-header">
            <p className="section-kicker">Boss Levels · Featured Builds</p>
            <h2>Projects that show range, depth, and the ability to ship.</h2>
          </div>
          <div className="project-grid">
            {projects.map((project) => (
              <article key={project.name} className="project-card panel">
                <div className="project-top">
                  <span className="project-pill">{project.impact}</span>
                  <span className="project-name">{project.name}</span>
                </div>
                <p>{project.summary}</p>
                <div className="project-footer">
                  <span>Built with modern stack patterns</span>
                  <span>Playable from concept to production</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" className="contact panel">
          <div>
            <p className="section-kicker">Final Door · Contact Console</p>
            <h2>Want to hire the builder behind the bricks?</h2>
            <p>
              I’m open to roles where I can ship mobile features, full-stack products, and
              polished user experiences with strong engineering discipline.
            </p>
          </div>
          <div className="contact-links">
            <a href="mailto:toufiqh12@gmail.com" className="button primary">
              Email Me
            </a>
            <a href="https://github.com/toufiqh180-bot" target="_blank" rel="noreferrer" className="button secondary">
              GitHub
            </a>
            <a href="https://www.linkedin.com/in/toufiqh" target="_blank" rel="noreferrer" className="button secondary">
              LinkedIn
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
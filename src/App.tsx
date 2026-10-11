import { useEffect, useRef, useState } from 'react';
import { Game } from './game';
import { Station, stations } from './content';

const kindLabel: Record<string, string> = {
  intro: 'Welcome',
  skill: 'Skill',
  experience: 'Experience',
  project: 'Project',
  contact: 'Contact',
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [station, setStation] = useState<Station | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [visited, setVisited] = useState(0);
  const total = stations.length;

  useEffect(() => {
    if (!canvasRef.current) return;
    const game = new Game(canvasRef.current, {
      onStationEnter: (s) => setStation(s),
      onStationLeave: () => setStation(null),
      onFirstMove: () => setShowIntro(false),
      onProgress: (v) => setVisited(v),
    });
    gameRef.current = game;
    return () => game.dispose();
  }, []);

  const move = (dx: number, dz: number) => gameRef.current?.move(dx, dz);

  return (
    <div className="app">
      <canvas ref={canvasRef} className="game-canvas" />

      {/* Top HUD */}
      <header className="hud-top">
        <div className="hud-name">
          <h1>Toufiq Hasan</h1>
          <p>Software Engineer — Full Stack &amp; Mobile</p>
        </div>
        <div className="hud-progress" title="Places discovered">
          <span className="hud-progress-dot" />
          {visited}/{total} discovered
        </div>
      </header>

      {/* Intro overlay */}
      {showIntro && (
        <div className="intro-card">
          <h2>🧱 Welcome to my world</h2>
          <p>
            This portfolio is a tiny game. Hop around the map to discover my
            skills, experience, and projects.
          </p>
          <p className="intro-keys">
            Use <kbd>W</kbd>
            <kbd>A</kbd>
            <kbd>S</kbd>
            <kbd>D</kbd> or arrow keys — or tap the buttons on mobile.
          </p>
        </div>
      )}

      {/* Station info card */}
      {station && (
        <aside className={`station-card kind-${station.kind}`} key={station.id}>
          <span className="station-kind">{kindLabel[station.kind]}</span>
          <h2>{station.title}</h2>
          {station.subtitle && <p className="station-sub">{station.subtitle}</p>}
          <p className="station-body">{station.body}</p>
          {station.tags && (
            <div className="station-tags">
              {station.tags.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          )}
          {station.link && (
            <a className="station-link" href={station.link.href}>
              {station.link.text} →
            </a>
          )}
        </aside>
      )}

      {/* Touch controls */}
      <div className="dpad" aria-label="Movement controls">
        <button className="dpad-up" onClick={() => move(0, 1)} aria-label="Move forward">▲</button>
        <button className="dpad-left" onClick={() => move(-1, 0)} aria-label="Move left">◀</button>
        <button className="dpad-down" onClick={() => move(0, -1)} aria-label="Move back">▼</button>
        <button className="dpad-right" onClick={() => move(1, 0)} aria-label="Move right">▶</button>
      </div>

      <footer className="hud-bottom">
        <a href="mailto:toufiqhasan.dev@gmail.com">Email</a>
        <a href="https://www.linkedin.com/in/toufiqhasan" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/toufiqhasan" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </div>
  );
}

export default App;

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
  const [score, setScore] = useState(0);
  const [coins, setCoins] = useState(0);
  const [best, setBest] = useState(0);
  const total = stations.length;

  useEffect(() => {
    if (!canvasRef.current) return;
    const game = new Game(canvasRef.current, {
      onStationEnter: (s) => setStation(s),
      onStationLeave: () => setStation(null),
      onFirstMove: () => setShowIntro(false),
      onProgress: (v) => setVisited(v),
      onStats: (nextScore, nextCoins, nextBest) => {
        setScore(nextScore);
        setCoins(nextCoins);
        setBest(nextBest);
      },
    });
    gameRef.current = game;
    return () => game.dispose();
  }, []);

  const move = (dx: number, dz: number) => gameRef.current?.move(dx, dz);
  const moveDir = (direction: 'up' | 'left' | 'down' | 'right') => {
    switch (direction) {
      case 'up':
        return move(0, 1);
      case 'left':
        return move(1, 0);
      case 'down':
        return move(0, -1);
      case 'right':
        return move(-1, 0);
      default:
        return undefined;
    }
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} className="game-canvas" />

      <div className="ray-overlay" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      {/* Top HUD */}
      <header className="hud-top">
        <div className="hud-name">
          <h1>Toufiq Hasan</h1>
          <p>Software Engineer — Full Stack &amp; Mobile</p>
        </div>

        <div className="hud-right">
          <div className="hud-scoreboard">
            <span>Score</span>
            <strong>{score}</strong>
          </div>
          <div className="hud-scoreboard coin-box">
            <span>Coins</span>
            <strong>{coins}</strong>
          </div>
          <div className="hud-scoreboard best-box">
            <span>Best</span>
            <strong>{best}</strong>
          </div>
          <div className="hud-progress" title="Places discovered">
            <span className="hud-progress-dot" />
            {visited}/{total} discovered
          </div>
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
        <button className="dpad-up" onClick={() => moveDir('up')} aria-label="Move forward">▲</button>
        <button className="dpad-left" onClick={() => moveDir('left')} aria-label="Move left">◀</button>
        <button className="dpad-down" onClick={() => moveDir('down')} aria-label="Move back">▼</button>
        <button className="dpad-right" onClick={() => moveDir('right')} aria-label="Move right">▶</button>
      </div>

      <footer className="hud-bottom">
        <a href="mailto:toufiqh12@gmail.com">Email</a>
        <a href="https://www.linkedin.com/in/toufiqh/" target="_blank" rel="noreferrer">LinkedIn</a>
        <a href="https://github.com/toufiqh180-bot" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </div>
  );
}

export default App;

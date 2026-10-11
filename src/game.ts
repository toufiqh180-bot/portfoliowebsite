import * as THREE from 'three';
import { stations, Station, WORLD } from './content';

const TILE = 1;
const HOP_TIME = 0.18;

export interface GameCallbacks {
  onStationEnter: (station: Station) => void;
  onStationLeave: () => void;
  onFirstMove: () => void;
  onProgress: (visited: number, total: number) => void;
  onStats: (score: number, coins: number, best: number) => void;
}

function box(
  w: number,
  h: number,
  d: number,
  color: number,
  x = 0,
  y = 0,
  z = 0
): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color })
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** Lego stud — little cylinder on top of bricks */
function stud(color: number, x: number, y: number, z: number): THREE.Mesh {
  const m = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.11, 0.08, 12),
    new THREE.MeshLambertMaterial({ color })
  );
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}

function legoBrick(color: number, w = 1, d = 1, h = 0.45): THREE.Group {
  const g = new THREE.Group();
  g.add(box(w * 0.96, h, d * 0.96, color, 0, h / 2, 0));
  const sx = w === 1 ? [0] : [-w / 4, w / 4];
  const sz = d === 1 ? [0] : [-d / 4, d / 4];
  for (const ix of sx) for (const iz of sz) g.add(stud(color, ix, h + 0.04, iz));
  return g;
}

function makeTree(scale = 1): THREE.Group {
  const g = new THREE.Group();
  g.add(box(0.22, 0.5, 0.22, 0x8b5a2b, 0, 0.25, 0));
  const greens = [0x2f9e44, 0x37b24d, 0x40c057];
  let y = 0.5;
  const sizes = [0.8, 0.62, 0.42];
  sizes.forEach((s, i) => {
    g.add(box(s, 0.34, s, greens[i % greens.length], 0, y + 0.17, 0));
    y += 0.3;
  });
  g.scale.setScalar(scale);
  return g;
}

function makeTextSprite(text: string, bg: string): THREE.Sprite {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const font = '900 44px Nunito, sans-serif';
  ctx.font = font;
  const tw = ctx.measureText(text).width;
  canvas.width = Math.ceil(tw + 64);
  canvas.height = 88;
  const c = canvas.getContext('2d')!;
  const r = 24;
  c.fillStyle = bg;
  c.beginPath();
  c.roundRect(2, 2, canvas.width - 4, canvas.height - 4, r);
  c.fill();
  c.strokeStyle = 'rgba(0,0,0,0.25)';
  c.lineWidth = 4;
  c.stroke();
  c.font = font;
  c.fillStyle = '#ffffff';
  c.textAlign = 'center';
  c.textBaseline = 'middle';
  c.fillText(text, canvas.width / 2, canvas.height / 2 + 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
  );
  const s = 0.013;
  sprite.scale.set(canvas.width * s, canvas.height * s, 1);
  return sprite;
}

function makeStationBuilding(st: Station): THREE.Group {
  const g = new THREE.Group();
  // stacked lego bricks tower
  const heights: Record<string, number> = {
    intro: 2,
    skill: 2,
    experience: 3,
    project: 3,
    contact: 2,
  };
  const levels = heights[st.kind];
  let y = 0;
  for (let i = 0; i < levels; i++) {
    const shade = new THREE.Color(st.color).offsetHSL(0, 0, i * 0.06).getHex();
    const b = legoBrick(shade, 1.6 - i * 0.18, 1.6 - i * 0.18, 0.5);
    b.position.y = y;
    g.add(b);
    y += 0.5 + 0.04;
  }
  const sprite = makeTextSprite(st.label, '#' + new THREE.Color(st.color).getHexString());
  sprite.position.y = y + 0.9;
  g.add(sprite);

  // pulsing pad ring on the ground in front
  const pad = new THREE.Mesh(
    new THREE.RingGeometry(0.45, 0.62, 24),
    new THREE.MeshBasicMaterial({ color: st.color, transparent: true, opacity: 0.8, side: THREE.DoubleSide })
  );
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, 0.02, 0);
  pad.name = 'pad';
  g.add(pad);

  g.position.set(st.x * TILE, 0, st.z * TILE);
  return g;
}

function makeCharacter(): THREE.Group {
  const g = new THREE.Group();
  // legs
  g.add(box(0.16, 0.22, 0.2, 0x1d4ed8, -0.1, 0.11, 0));
  g.add(box(0.16, 0.22, 0.2, 0x1d4ed8, 0.1, 0.11, 0));
  // torso (hoodie)
  g.add(box(0.44, 0.34, 0.3, 0x10b981, 0, 0.39, 0));
  // arms
  g.add(box(0.1, 0.3, 0.18, 0x10b981, -0.27, 0.41, 0));
  g.add(box(0.1, 0.3, 0.18, 0x10b981, 0.27, 0.41, 0));
  // head
  g.add(box(0.34, 0.3, 0.3, 0xfcd9b8, 0, 0.73, 0));
  // hair
  g.add(box(0.36, 0.1, 0.32, 0x201a17, 0, 0.9, 0));
  // eyes
  g.add(box(0.05, 0.05, 0.02, 0x14120f, -0.08, 0.75, 0.16));
  g.add(box(0.05, 0.05, 0.02, 0x14120f, 0.08, 0.75, 0.16));
  // laptop under arm :)
  g.add(box(0.2, 0.05, 0.26, 0x9ca3af, 0.33, 0.3, 0));
  g.castShadow = true;
  g.traverse((o: THREE.Object3D) => (o.castShadow = true));
  return g;
}

export class Game {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.OrthographicCamera;
  private player: THREE.Group;
  private pads: THREE.Mesh[] = [];
  private pos = { x: 0, z: 0 }; // grid pos
  private hopping = false;
  private hopFrom = new THREE.Vector3();
  private hopTo = new THREE.Vector3();
  private hopT = 0;
  private queue: Array<[number, number]> = [];
  private activeStation: Station | null = null;
  private visited = new Set<string>();
  private moved = false;
  private clock = new THREE.Clock();
  private raf = 0;
  private occupied = new Set<string>();
  private cars: Array<{ mesh: THREE.Group; dir: 1 | -1; laneZ: number; speed: number; minX: number; maxX: number; offset: number }> = [];
  private coins: Array<{ mesh: THREE.Mesh; x: number; z: number; collected: boolean }> = [];
  private score = 0;
  private coinsCollected = 0;
  private bestScore = 0;
  private crashFlash = 0;
  private isDead = false;
  private audioCtx: AudioContext | null = null;
  private musicGain: GainNode | null = null;
  private musicStarted = false;
  private musicTimer = 0;
  private resetTimeout = 0;
  private sun!: THREE.DirectionalLight;

  constructor(private canvas: HTMLCanvasElement, private cb: GameCallbacks) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.scene.background = new THREE.Color(0xbfe8ff);
    this.scene.fog = new THREE.Fog(0xbfe8ff, 18, 40);

    const d = 7;
    this.camera = new THREE.OrthographicCamera(-d, d, d, -d, 0.1, 100);

    this.buildWorld();
    this.player = makeCharacter();
    this.player.position.set(0, 0, 0);
    this.scene.add(this.player);

    this.syncHud();
    this.initAudio();

    window.addEventListener('keydown', this.onKey);
    window.addEventListener('resize', this.onResize);
    this.onResize();
    this.loop();
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('keydown', this.onKey);
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    this.audioCtx?.close();
  }

  private initAudio() {
    if (typeof window === 'undefined') return;
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;
    this.audioCtx = new AudioCtor();
    this.musicGain = this.audioCtx.createGain();
    this.musicGain.gain.value = 0.06;
    this.musicGain.connect(this.audioCtx.destination);
  }

  private startMusic() {
    if (!this.audioCtx || !this.musicGain || this.musicStarted) return;
    this.musicStarted = true;
    const notes = [220, 277, 330, 392, 330, 277, 247, 220];
    let i = 0;
    const playNote = () => {
      if (!this.audioCtx || !this.musicGain) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = notes[i % notes.length];
      gain.gain.value = 0.0001;
      osc.connect(gain);
      gain.connect(this.musicGain);
      gain.gain.exponentialRampToValueAtTime(0.04, this.audioCtx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.22);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.23);
      i += 1;
    };
    const interval = window.setInterval(playNote, 220);
    (window as typeof window & { __musicInterval?: number }).__musicInterval = interval;
  }

  private syncHud() {
    this.cb.onStats(this.score, this.coinsCollected, this.bestScore);
  }

  private resetPlayerToStart() {
    this.pos.x = 0;
    this.pos.z = 0;
    this.player.position.set(0, 0, 0);
    this.player.rotation.y = 0;
    this.player.scale.set(1, 1, 1);
    this.isDead = false;
    this.queue = [];
    this.hopping = false;
    this.hopT = 0;
    this.activeStation = null;
    this.cb.onStationLeave();
    this.score = Math.max(0, this.score - 10);
    this.syncHud();
  }

  private spawnCoins() {
    const positions = [
      [-5, 4], [-3, 10], [0, 16], [4, 20], [0, 27],
      [-6, 18], [6, 8], [2, 13], [-2, 23], [7, 15],
    ];
    this.coins = positions.map(([x, z], index) => {
      const coin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.04, 12),
        new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xfbbf24, emissiveIntensity: 0.7 })
      );
      coin.rotation.z = Math.PI / 2;
      coin.position.set(x, 0.7 + (index % 2) * 0.05, z);
      this.scene.add(coin);
      return { mesh: coin, x, z, collected: false };
    });
  }

  private collectCoinIfNeeded() {
    for (const coin of this.coins) {
      if (coin.collected) continue;
      const dx = this.player.position.x - coin.mesh.position.x;
      const dz = this.player.position.z - coin.mesh.position.z;
      if (Math.abs(dx) < 0.6 && Math.abs(dz) < 0.6) {
        coin.collected = true;
        coin.mesh.visible = false;
        this.coinsCollected += 1;
        this.score += 25;
        if (this.score > this.bestScore) {
          this.bestScore = this.score;
        }
        this.syncHud();
        break;
      }
    }
  }

  private hitCar() {
    if (this.isDead) return;
    this.isDead = true;
    this.crashFlash = 1;
    this.resetTimeout = 0.9;
    this.score = 0;
    this.syncHud();
    this.resetPlayerToStart();
  }

  private buildWorld() {
    // lights
    const amb = new THREE.AmbientLight(0xffffff, 0.75);
    const sun = new THREE.DirectionalLight(0xfff6e0, 1.3);
    sun.position.set(-6, 12, -4);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -16;
    sun.shadow.camera.right = 16;
    sun.shadow.camera.top = 16;
    sun.shadow.camera.bottom = -16;
    this.scene.add(amb, sun);
    this.sun = sun;

    const roadRows = new Set([4, 8, 13, 17, 22]);
    const grassA = new THREE.MeshLambertMaterial({ color: 0x8ed14f });
    const grassB = new THREE.MeshLambertMaterial({ color: 0x7cc740 });
    const road = new THREE.MeshLambertMaterial({ color: 0x4b5563 });
    const tileGeo = new THREE.BoxGeometry(TILE, 0.2, TILE);

    for (let z = WORLD.minZ; z <= WORLD.maxZ + 2; z++) {
      for (let x = WORLD.minX - 2; x <= WORLD.maxX + 2; x++) {
        const mat = roadRows.has(z) ? road : (x + z) % 2 === 0 ? grassA : grassB;
        const t = new THREE.Mesh(tileGeo, mat);
        t.position.set(x * TILE, -0.1, z * TILE);
        t.receiveShadow = true;
        this.scene.add(t);
        if (roadRows.has(z) && ((x + 40) % 3 === 0)) {
          const stripe = box(0.5, 0.02, 0.12, 0xf8fafc, x * TILE, 0.01, z * TILE);
          stripe.castShadow = false;
          this.scene.add(stripe);
        }
      }
    }

    for (const st of stations) {
      const b = makeStationBuilding(st);
      this.scene.add(b);
      const pad = b.getObjectByName('pad') as THREE.Mesh;
      pad.userData.stationId = st.id;
      this.pads.push(pad);
      this.occupied.add(`${st.x},${st.z}`);
    }

    const rand = mulberry(42);
    for (let i = 0; i < 90; i++) {
      const x = Math.floor(rand() * (WORLD.maxX - WORLD.minX + 5)) + WORLD.minX - 2;
      const z = Math.floor(rand() * (WORLD.maxZ - WORLD.minZ + 6)) + WORLD.minZ;
      if (roadRows.has(z)) continue;
      if (Math.abs(x) <= 1 && z >= 0) continue;
      const key = `${x},${z}`;
      if (this.occupied.has(key)) continue;
      if (stations.some((s) => Math.abs(s.x - x) <= 1 && Math.abs(s.z - z) <= 1)) continue;
      this.occupied.add(key);
      const tree = makeTree(0.7 + rand() * 0.5);
      tree.position.set(x * TILE, 0, z * TILE);
      tree.rotation.y = rand() * Math.PI;
      this.scene.add(tree);
    }

    const roadLaneZ = Array.from(roadRows);
    for (const z of roadLaneZ) {
      const count = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const dir = i % 2 === 0 ? 1 : -1;
        const car = makeCar();
        car.position.set(dir === 1 ? WORLD.minX - 1 : WORLD.maxX + 1, 0.18, z * TILE);
        car.rotation.y = dir === 1 ? Math.PI * 0.5 : -Math.PI * 0.5;
        this.scene.add(car);
        this.cars.push({
          mesh: car,
          dir,
          laneZ: z,
          speed: 0.9 + Math.random() * 0.7,
          minX: WORLD.minX - 1,
          maxX: WORLD.maxX + 1,
          offset: i * 2.2,
        });
      }
    }

    this.spawnCoins();
  }

  private onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.renderer.setSize(w, h);
    const aspect = w / h;
    const d = w < 640 ? 6 : 7;
    this.camera.left = -d * aspect;
    this.camera.right = d * aspect;
    this.camera.top = d;
    this.camera.bottom = -d;
    this.camera.updateProjectionMatrix();
  };

  private onKey = (e: KeyboardEvent) => {
    const map: Record<string, [number, number]> = {
      ArrowUp: [0, 1],
      KeyW: [0, 1],
      ArrowDown: [0, -1],
      KeyS: [0, -1],
      ArrowLeft: [1, 0],
      KeyA: [1, 0],
      ArrowRight: [-1, 0],
      KeyD: [-1, 0],
    };
    const dir = map[e.code];
    if (!dir) return;
    e.preventDefault();
    this.startMusic();
    this.enqueue(dir);
  };

  /** public for touch controls */
  move(dx: number, dz: number) {
    this.startMusic();
    this.enqueue([dx, dz]);
  }

  private enqueue(dir: [number, number]) {
    if (this.isDead) return;
    if (this.queue.length < 2) this.queue.push(dir);
    if (!this.moved) {
      this.moved = true;
      this.cb.onFirstMove();
    }
  }

  private isCarAt(x: number, z: number) {
    return this.cars.some((car) => {
      const cx = Math.round(car.mesh.position.x);
      const cz = Math.round(car.mesh.position.z);
      return cx === x && cz === z;
    });
  }

  private tryHop(dx: number, dz: number) {
    if (this.isDead) return;
    const nx = this.pos.x + dx;
    const nz = this.pos.z + dz;
    if (nx < WORLD.minX || nx > WORLD.maxX || nz < WORLD.minZ || nz > WORLD.maxZ) return;
    if (this.isCarAt(nx, nz)) {
      this.hitCar();
      return;
    }
    this.player.rotation.y = Math.atan2(dx, dz);
    if (this.occupied.has(`${nx},${nz}`)) {
      this.hopFrom.copy(this.player.position);
      this.hopTo.copy(this.hopFrom);
      this.hopping = true;
      this.hopT = 0;
      return;
    }
    this.pos.x = nx;
    this.pos.z = nz;
    this.hopFrom.copy(this.player.position);
    this.hopTo.set(nx * TILE, 0, nz * TILE);
    this.hopping = true;
    this.hopT = 0;
    this.score += 5;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
    }
    this.syncHud();
  }

  private checkStation() {
    let nearest: Station | null = null;
    for (const st of stations) {
      const d = Math.abs(st.x - this.pos.x) + Math.abs(st.z - this.pos.z);
      if (d <= 1) {
        nearest = st;
        break;
      }
    }
    if (nearest && nearest !== this.activeStation) {
      this.activeStation = nearest;
      if (!this.visited.has(nearest.id)) {
        this.visited.add(nearest.id);
        this.cb.onProgress(this.visited.size, stations.length);
      }
      this.cb.onStationEnter(nearest);
    } else if (!nearest && this.activeStation) {
      this.activeStation = null;
      this.cb.onStationLeave();
    }
  }

  private loop = () => {
    this.raf = requestAnimationFrame(this.loop);
    const dt = Math.min(this.clock.getDelta(), 0.05);
    const t = this.clock.elapsedTime;

    if (this.resetTimeout > 0) {
      this.resetTimeout -= dt;
      if (this.resetTimeout <= 0) {
        this.resetPlayerToStart();
      }
    }

    if (!this.hopping && this.queue.length) {
      const [dx, dz] = this.queue.shift()!;
      this.tryHop(dx, dz);
    }

    if (this.hopping) {
      this.hopT += dt / HOP_TIME;
      const k = Math.min(this.hopT, 1);
      this.player.position.lerpVectors(this.hopFrom, this.hopTo, k);
      this.player.position.y = Math.sin(k * Math.PI) * 0.45;
      const squash = 1 + Math.sin(k * Math.PI) * 0.12;
      this.player.scale.set(1 / Math.sqrt(squash), squash, 1 / Math.sqrt(squash));
      if (k >= 1) {
        this.hopping = false;
        this.player.scale.set(1, 1, 1);
        this.player.position.y = 0;
        this.checkStation();
      }
    } else {
      this.player.scale.y = 1 + Math.sin(t * 3) * 0.015;
    }

    for (const car of this.cars) {
      car.mesh.position.x += car.dir * car.speed * dt * 1.8;
      if (car.mesh.position.x > car.maxX + 2) car.mesh.position.x = car.minX - 2;
      if (car.mesh.position.x < car.minX - 2) car.mesh.position.x = car.maxX + 2;
      car.mesh.position.z = car.laneZ * TILE + Math.sin(t * 2.3 + car.offset) * 0.05;
    }

    for (const pad of this.pads) {
      const s = 1 + Math.sin(t * 3 + pad.position.x) * 0.12;
      pad.scale.set(s, s, 1);
    }

    this.collectCoinIfNeeded();

    const px = this.player.position.x;
    const pz = this.player.position.z;
    const target = new THREE.Vector3(px + 7, 10, pz - 7);
    this.camera.position.lerp(target, 1 - Math.pow(0.001, dt));
    this.camera.lookAt(px, 0, pz);
    this.sun.position.set(px - 6, 12, pz - 4);
    this.sun.target.position.set(px, 0, pz);
    this.sun.target.updateMatrixWorld();

    this.renderer.toneMappingExposure = 1.1 + Math.sin(t * 2) * 0.08;
    this.renderer.render(this.scene, this.camera);
  };
}

function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeCar(): THREE.Group {
  const g = new THREE.Group();
  const body = box(0.56, 0.22, 0.28, 0xef4444, 0, 0.2, 0);
  g.add(body);
  g.add(box(0.24, 0.18, 0.18, 0xb8c7d8, 0, 0.32, 0.05));
  g.add(box(0.12, 0.08, 0.12, 0x1f2937, -0.18, 0.08, 0.17));
  g.add(box(0.12, 0.08, 0.12, 0x1f2937, 0.18, 0.08, 0.17));
  g.add(box(0.12, 0.08, 0.12, 0x1f2937, -0.18, 0.08, -0.17));
  g.add(box(0.12, 0.08, 0.12, 0x1f2937, 0.18, 0.08, -0.17));
  g.scale.setScalar(1.1);
  return g;
}

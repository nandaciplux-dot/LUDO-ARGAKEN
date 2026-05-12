// 15x15 standard clockwise Ludo track coordinates loop
const TRACK_COORDINATES = [
  { r: 6, c: 0 }, { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 },
  { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 },
  { r: 0, c: 7 },
  { r: 0, c: 8 }, { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 },
  { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, { r: 6, c: 14 },
  { r: 7, c: 14 },
  { r: 8, c: 14 }, { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 },
  { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 },
  { r: 14, c: 7 },
  { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 },
  { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, { r: 8, c: 0 },
  { r: 7, c: 0 }
];

// Safe zone loop indices (8 standard cells in Ludo)
const SAFE_INDICES = [1, 9, 14, 22, 27, 35, 40, 48];

// Starting indices of players in the outer loop
const PLAYER_START_INDICES = {
  red: 1,
  green: 14,
  yellow: 27,
  blue: 40
};

// Color theme values
const COLOR_HEX = {
  red: '#EF4444',
  green: '#22C55E',
  yellow: '#EAB308',
  blue: '#3B82F6'
};

// Synthesized sound effects using Web Audio API
class AudioFX {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  playRoll() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const t = now + i * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(120 + Math.random() * 150, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.06);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.06);
    }
  }

  playStep() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(420, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  playKill() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(280, now);
    osc1.frequency.linearRampToValueAtTime(50, now + 0.45);
    
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(140, now);
    osc2.frequency.linearRampToValueAtTime(30, now + 0.45);
    
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  }

  playStar() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const t = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);
    });
  }

  playBaseExit() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(330, now); // E4
    osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  playGoal() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const freqs = [392.00, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
    freqs.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.4);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.45);
    });
  }

  playWin() {
    if (this.muted) return;
    this.init();
    const now = this.ctx.currentTime;
    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 587.33, d: 0.12 }, // D5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.24 }, // G5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.4 }   // G5
    ];
    let start = now;
    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(n.f, start);
      gain.gain.setValueAtTime(0.2, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + n.d);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + n.d);
      start += n.d + 0.04;
    });
  }
}

// HTML5 Canvas dynamic particle system
class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    
    window.addEventListener('resize', () => this.resize());
    this.resize();
    this.startLoop();
  }

  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  }

  startLoop() {
    const loop = () => {
      this.update();
      this.draw();
      this.animationId = requestAnimationFrame(loop);
    };
    loop();
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.alpha -= p.decay;
      p.angle += p.spin;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles.forEach((p) => {
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fillStyle = p.color;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      
      if (p.type === 'star') {
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          this.ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * p.size, Math.sin((18 + i * 72) * Math.PI / 180) * p.size);
          this.ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (p.size / 2), Math.sin((54 + i * 72) * Math.PI / 180) * (p.size / 2));
        }
        this.ctx.closePath();
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      }
      this.ctx.restore();
    });
  }

  spawn(x, y, color, count = 25, type = 'star') {
    const rect = this.canvas.getBoundingClientRect();
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: canvasX,
        y: canvasY,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - (type === 'confetti' ? 4 : 0),
        gravity: type === 'confetti' ? 0.12 : 0.2,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        size: Math.random() * 6 + 5,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.25,
        color: color,
        type: type
      });
    }
  }

  spawnConfettiShower() {
    const colors = ['#EF4444', '#22C55E', '#EAB308', '#3B82F6', '#FF00FF', '#00FFFF'];
    for (let i = 0; i < 15; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: 0,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 4 + 2,
        gravity: 0.05,
        alpha: 1,
        decay: 0.008,
        size: Math.random() * 8 + 6,
        angle: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        type: 'confetti'
      });
    }
  }
}

// MAIN GAME MANAGER CLASS
class LudoGame {
  constructor() {
    this.players = [];
    this.activeTurn = 0;
    this.diceState = null;
    this.hasRolled = false;
    this.rollStreak6 = 0;
    this.isMovingPawn = false;
    this.isAITurn = false;
    this.sound = new AudioFX();
    this.particles = new ParticleEngine('particle-canvas');
    
    this.initDOM();
  }

  initDOM() {
    document.getElementById('btn-start-game').addEventListener('click', () => this.startGameFromSetup());
    document.getElementById('btn-roll-dice').addEventListener('click', () => this.handleUserRoll());
    document.getElementById('dice-click-area').addEventListener('click', () => this.handleUserRoll());
    
    const btnMute = document.getElementById('btn-mute');
    const muteIcon = document.getElementById('mute-icon');
    btnMute.addEventListener('click', () => {
      this.sound.init();
      const isMuted = this.sound.toggleMute();
      if (isMuted) {
        muteIcon.className = "fa-solid fa-volume-xmark text-slate-500";
        this.addLog("[Audio]", "Efek suara dimatikan.");
      } else {
        muteIcon.className = "fa-solid fa-volume-high text-green-400";
        this.addLog("[Audio]", "Efek suara diaktifkan.");
      }
    });

    document.getElementById('btn-reset').addEventListener('click', () => {
      if (confirm("Apakah Anda yakin ingin memulai ulang permainan? Semua kemajuan akan hilang.")) {
        location.reload();
      }
    });

    document.getElementById('btn-win-restart').addEventListener('click', () => {
      location.reload();
    });

    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.error(err);
        });
      } else {
        document.exitFullscreen();
      }
    });

    document.getElementById('btn-stats').addEventListener('click', () => {
      this.showStatsPanel(true);
    });

    document.getElementById('btn-close-stats').addEventListener('click', () => {
      this.showStatsPanel(false);
    });

    this.renderBoardGrid();
  }

  addLog(sender, message) {
    const logBox = document.getElementById('game-log-box');
    const entry = document.createElement('div');
    entry.className = "fade-in";
    entry.innerHTML = `<span class="text-amber-500 font-bold">${sender}</span> ${message}`;
    logBox.appendChild(entry);
    logBox.scrollTop = logBox.scrollHeight;
  }

  renderBoardGrid() {
    const board = document.getElementById('ludo-board');
    board.innerHTML = "";

    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        
        if (r === 0 && c === 0) {
          const base = document.createElement('div');
          base.className = "col-span-6 row-span-6 bg-gradient-to-br from-red-600 to-red-700 p-4 flex items-center justify-center border-b-2 border-r-2 border-slate-900";
          base.style.gridRow = "1 / 7";
          base.style.gridColumn = "1 / 7";
          base.innerHTML = `
            <div class="bg-white/95 rounded-2xl w-full h-full p-2 flex flex-wrap items-center justify-center gap-2.5 shadow-inner">
              <div class="w-[40%] h-[40%] rounded-full bg-red-50 border-4 border-red-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-red-0"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-red-50 border-4 border-red-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-red-1"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-red-50 border-4 border-red-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-red-2"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-red-50 border-4 border-red-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-red-3"></div>
            </div>
          `;
          board.appendChild(base);
          continue;
        }

        if (r === 0 && c === 9) {
          const base = document.createElement('div');
          base.className = "col-span-6 row-span-6 bg-gradient-to-br from-emerald-600 to-emerald-700 p-4 flex items-center justify-center border-b-2 border-l-2 border-slate-900";
          base.style.gridRow = "1 / 7";
          base.style.gridColumn = "10 / 16";
          base.innerHTML = `
            <div class="bg-white/95 rounded-2xl w-full h-full p-2 flex flex-wrap items-center justify-center gap-2.5 shadow-inner">
              <div class="w-[40%] h-[40%] rounded-full bg-emerald-50 border-4 border-emerald-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-green-0"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-emerald-50 border-4 border-emerald-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-green-1"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-emerald-50 border-4 border-emerald-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-green-2"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-emerald-50 border-4 border-emerald-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-green-3"></div>
            </div>
          `;
          board.appendChild(base);
          continue;
        }

        if (r === 9 && c === 9) {
          const base = document.createElement('div');
          base.className = "col-span-6 row-span-6 bg-gradient-to-br from-yellow-500 to-yellow-600 p-4 flex items-center justify-center border-t-2 border-l-2 border-slate-900";
          base.style.gridRow = "10 / 16";
          base.style.gridColumn = "10 / 16";
          base.innerHTML = `
            <div class="bg-white/95 rounded-2xl w-full h-full p-2 flex flex-wrap items-center justify-center gap-2.5 shadow-inner">
              <div class="w-[40%] h-[40%] rounded-full bg-yellow-50 border-4 border-yellow-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-yellow-0"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-yellow-50 border-4 border-yellow-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-yellow-1"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-yellow-50 border-4 border-yellow-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-yellow-2"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-yellow-50 border-4 border-yellow-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-yellow-3"></div>
            </div>
          `;
          board.appendChild(base);
          continue;
        }

        if (r === 9 && c === 0) {
          const base = document.createElement('div');
          base.className = "col-span-6 row-span-6 bg-gradient-to-br from-blue-600 to-blue-700 p-4 flex items-center justify-center border-t-2 border-r-2 border-slate-900";
          base.style.gridRow = "10 / 16";
          base.style.gridColumn = "1 / 7";
          base.innerHTML = `
            <div class="bg-white/95 rounded-2xl w-full h-full p-2 flex flex-wrap items-center justify-center gap-2.5 shadow-inner">
              <div class="w-[40%] h-[40%] rounded-full bg-blue-50 border-4 border-blue-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-blue-0"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-blue-50 border-4 border-blue-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-blue-1"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-blue-50 border-4 border-blue-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-blue-2"></div>
              <div class="w-[40%] h-[40%] rounded-full bg-blue-50 border-4 border-blue-500 shadow-sm flex items-center justify-center cell-container" data-cell="base-blue-3"></div>
            </div>
          `;
          board.appendChild(base);
          continue;
        }

        if (r === 6 && c === 6) {
          const goal = document.createElement('div');
          goal.className = "col-span-3 row-span-3 border-2 border-slate-900 relative";
          goal.style.gridRow = "7 / 10";
          goal.style.gridColumn = "7 / 10";
          goal.innerHTML = `
            <svg viewBox="0 0 120 120" class="w-full h-full absolute inset-0 z-0">
              <polygon points="60,60 0,0 120,0" fill="#22C55E" />
              <polygon points="60,60 120,0 120,120" fill="#EAB308" />
              <polygon points="60,60 120,120 0,120" fill="#3B82F6" />
              <polygon points="60,60 0,120 0,0" fill="#EF4444" />
              
              <circle cx="60" cy="60" r="14" fill="#FFFFFF" stroke="#0F172A" stroke-width="2.5" />
              <polygon points="60,51 63.5,58 71,58 65,62.5 67.5,70 60,65.5 52.5,70 55,62.5 49,58 56.5,58" fill="#EAB308" />
            </svg>
            
            <div class="absolute left-1.5 top-[35%] w-[30%] h-[30%] flex items-center justify-center cell-container" data-cell="goal-red" data-pawn-count="0"></div>
            <div class="absolute left-[35%] top-1.5 w-[30%] h-[30%] flex items-center justify-center cell-container" data-cell="goal-green" data-pawn-count="0"></div>
            <div class="absolute right-1.5 top-[35%] w-[30%] h-[30%] flex items-center justify-center cell-container" data-cell="goal-yellow" data-pawn-count="0"></div>
            <div class="absolute left-[35%] bottom-1.5 w-[30%] h-[30%] flex items-center justify-center cell-container" data-cell="goal-blue" data-pawn-count="0"></div>
          `;
          board.appendChild(goal);
          continue;
        }

        if (r < 6 && c < 6) continue;
        if (r < 6 && c >= 9) continue;
        if (r >= 9 && c >= 9) continue;
        if (r >= 9 && c < 6) continue;
        if (r >= 6 && r < 9 && c >= 6 && c < 9) continue;

        const cell = document.createElement('div');
        cell.className = "border border-slate-300 flex items-center justify-center cell-container relative transition duration-150";
        cell.style.gridRow = `${r + 1} / ${r + 2}`;
        cell.style.gridColumn = `${c + 1} / ${c + 2}`;

        const loopIndex = TRACK_COORDINATES.findIndex(coord => coord.r === r && coord.c === c);
        
        if (loopIndex !== -1) {
          cell.setAttribute('data-cell', `track-${loopIndex}`);
          
          if (loopIndex === PLAYER_START_INDICES.red) {
            cell.classList.add('bg-gradient-to-tr', 'from-red-500', 'to-red-400', 'border-slate-800');
            cell.innerHTML = `<i class="fa-solid fa-arrow-right text-[10px] text-white rotate-45 animate-pulse absolute z-0 pointer-events-none"></i>`;
          } else if (loopIndex === PLAYER_START_INDICES.green) {
            cell.classList.add('bg-gradient-to-tr', 'from-emerald-500', 'to-emerald-400', 'border-slate-800');
            cell.innerHTML = `<i class="fa-solid fa-arrow-down text-[10px] text-white rotate-45 animate-pulse absolute z-0 pointer-events-none"></i>`;
          } else if (loopIndex === PLAYER_START_INDICES.yellow) {
            cell.classList.add('bg-gradient-to-tr', 'from-yellow-400', 'to-yellow-300', 'border-slate-800');
            cell.innerHTML = `<i class="fa-solid fa-arrow-left text-[10px] text-slate-800 rotate-45 animate-pulse absolute z-0 pointer-events-none"></i>`;
          } else if (loopIndex === PLAYER_START_INDICES.blue) {
            cell.classList.add('bg-gradient-to-tr', 'from-blue-500', 'to-blue-400', 'border-slate-800');
            cell.innerHTML = `<i class="fa-solid fa-arrow-up text-[10px] text-white rotate-45 animate-pulse absolute z-0 pointer-events-none"></i>`;
          } else if (SAFE_INDICES.includes(loopIndex)) {
            cell.classList.add('star-bg', 'bg-slate-100');
          } else {
            cell.classList.add('bg-slate-50/50');
          }
        } else {
          if (r === 7 && c >= 1 && c <= 5) {
            cell.setAttribute('data-cell', `home-red-${c}`);
            cell.classList.add('bg-gradient-to-r', 'from-red-400', 'to-red-500', 'border-red-600/30');
          } else if (c === 7 && r >= 1 && r <= 5) {
            cell.setAttribute('data-cell', `home-green-${r}`);
            cell.classList.add('bg-gradient-to-b', 'from-emerald-400', 'to-emerald-500', 'border-emerald-600/30');
          } else if (r === 7 && c >= 9 && c <= 13) {
            cell.setAttribute('data-cell', `home-yellow-${14 - c}`);
            cell.classList.add('bg-gradient-to-l', 'from-yellow-400', 'to-yellow-500', 'border-yellow-600/30');
          } else if (c === 7 && r >= 9 && r <= 13) {
            cell.setAttribute('data-cell', `home-blue-${14 - r}`);
            cell.classList.add('bg-gradient-to-t', 'from-blue-400', 'to-blue-500', 'border-blue-600/30');
          }
        }

        board.appendChild(cell);
      }
    }
  }

  startGameFromSetup() {
    this.sound.init();

    const playersConfig = [];
    let activeCount = 0;

    for (let i = 0; i < 4; i++) {
      const color = ['red', 'green', 'yellow', 'blue'][i];
      const active = document.getElementById(`p-active-${i}`).checked;
      const nameInput = document.getElementById(`p-name-${i}`).value.trim();
      const type = document.getElementById(`p-type-${i}`).value;

      if (active) {
        activeCount++;
      }

      playersConfig.push({
        id: i,
        color: color,
        name: nameInput || `Ksatria ${color.toUpperCase()}`,
        type: type,
        active: active,
        pawns: [
          { id: 0, step: 0 },
          { id: 1, step: 0 },
          { id: 2, step: 0 },
          { id: 3, step: 0 }
        ],
        stats: {
          rolls: 0,
          kills: 0,
          finished: 0,
          stepsMoved: 0
        }
      });
    }

    if (activeCount < 2) {
      const errMsg = document.getElementById('setup-error-msg');
      errMsg.classList.remove('hidden');
      return;
    }

    document.getElementById('setup-screen').classList.add('opacity-0');
    setTimeout(() => {
      document.getElementById('setup-screen').style.display = 'none';
    }, 300);

    this.players = playersConfig;
    
    let firstTurn = 0;
    for (let i = 0; i < 4; i++) {
      if (this.players[i].active) {
        firstTurn = i;
        break;
      }
    }
    this.activeTurn = firstTurn;

    this.addLog("[System]", "Game dimulai! Semoga sukses.");
    this.renderPlayersHUD();
    this.renderPawns();
    this.startPlayerTurn();
  }

  renderPlayersHUD() {
    const hudContainer = document.getElementById('players-hud-container');
    hudContainer.innerHTML = "";

    this.players.forEach((p) => {
      if (!p.active) return;

      const hud = document.createElement('div');
      hud.id = `hud-player-${p.id}`;
      hud.className = "p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between transition duration-300 relative overflow-hidden shadow-md";
      
      let colorBorder = "border-l-4 border-l-red-500";
      let badgeBg = "bg-red-500/20 text-red-400 border border-red-500/40";
      if (p.color === 'green') {
        colorBorder = "border-l-4 border-l-emerald-500";
        badgeBg = "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40";
      } else if (p.color === 'yellow') {
        colorBorder = "border-l-4 border-l-yellow-500";
        badgeBg = "bg-yellow-500/20 text-yellow-400 border border-yellow-500/40";
      } else if (p.color === 'blue') {
        colorBorder = "border-l-4 border-l-blue-500";
        badgeBg = "bg-blue-500/20 text-blue-400 border border-blue-500/40";
      }

      hud.className += ` ${colorBorder}`;

      hud.innerHTML = `
        <div class="flex items-center gap-2.5">
          <span class="w-7 h-7 rounded-lg ${badgeBg} flex items-center justify-center font-black text-xs uppercase">${p.color[0]}</span>
          <div>
            <div class="text-sm font-extrabold flex items-center gap-1.5 text-slate-100">
              ${p.name}
              ${p.type === 'ai' ? '<span class="text-[9px] bg-indigo-600 px-1 py-0.5 rounded-md font-mono text-white">BOT AI</span>' : ''}
            </div>
            <div class="text-[10px] text-slate-400 font-bold" id="hud-status-${p.id}">Menunggu giliran...</div>
          </div>
        </div>
        
        <div class="flex items-center gap-1.5" id="hud-finished-${p.id}">
          <span class="text-xs font-black text-slate-300">0/4</span>
          <i class="fa-solid fa-flag-checkered text-slate-500 text-xs"></i>
        </div>
      `;

      hudContainer.appendChild(hud);
    });
  }

  startPlayerTurn() {
    const activePlayer = this.players[this.activeTurn];
    this.hasRolled = false;
    
    const boardWrapper = document.getElementById('ludo-board-wrapper');
    boardWrapper.className = boardWrapper.className.replace(/turn-glow-\w+/g, "");
    boardWrapper.classList.add(`turn-glow-${activePlayer.color}`);

    document.getElementById('turn-player-name').innerText = activePlayer.name;
    document.getElementById('turn-player-name').className = `text-${activePlayer.color === 'green' ? 'emerald' : activePlayer.color === 'yellow' ? 'yellow' : activePlayer.color === 'blue' ? 'blue' : 'red'}-400 font-black text-sm md:text-md uppercase`;
    
    this.players.forEach((p) => {
      if (!p.active) return;
      const hudCard = document.getElementById(`hud-player-${p.id}`);
      const hudStatus = document.getElementById(`hud-status-${p.id}`);
      
      if (p.id === this.activeTurn) {
        hudCard.classList.add('bg-slate-800/90', 'scale-[1.02]', 'shadow-lg');
        hudStatus.innerHTML = `<span class="text-amber-400 animate-pulse font-extrabold uppercase tracking-wide flex items-center gap-1"><i class="fa-solid fa-gamepad"></i> SEDANG ROLLING...</span>`;
      } else {
        hudCard.classList.remove('bg-slate-800/90', 'scale-[1.02]', 'shadow-lg');
        hudStatus.innerHTML = `Menunggu giliran...`;
      }
    });

    const helpText = document.getElementById('roll-help-text');
    const rollBtn = document.getElementById('btn-roll-dice');
    
    if (activePlayer.type === 'human') {
      this.isAITurn = false;
      helpText.innerText = "Kocok dadu sekarang dengan menekan Dadu 3D!";
      rollBtn.disabled = false;
      rollBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      this.isAITurn = true;
      helpText.innerText = "Komputer sedang berfikir...";
      rollBtn.disabled = true;
      rollBtn.classList.add('opacity-50', 'cursor-not-allowed');

      setTimeout(() => this.handleAIRoll(), 1100);
    }
  }

  async handleUserRoll() {
    if (this.isMovingPawn || this.isAITurn || this.hasRolled) return;
    await this.executeDiceRoll();
  }

  async handleAIRoll() {
    await this.executeDiceRoll();
  }

  async executeDiceRoll() {
    this.hasRolled = true;
    this.sound.playRoll();

    const diceCube = document.getElementById('dice-3d');
    diceCube.className = "cube rolling";
    
    document.getElementById('ludo-board-wrapper').classList.add('shake-effect');
    setTimeout(() => {
      document.getElementById('ludo-board-wrapper').classList.remove('shake-effect');
    }, 400);

    const rolledValue = Math.floor(Math.random() * 6) + 1;
    this.diceState = rolledValue;

    await new Promise(resolve => setTimeout(resolve, 650));

    diceCube.className = `cube show-${rolledValue}`;
    document.getElementById('last-roll-text').innerText = rolledValue;
    
    const activePlayer = this.players[this.activeTurn];
    activePlayer.stats.rolls++;
    this.addLog(activePlayer.name, `mengocok dadu dan mendapatkan angka <span class="font-bold underline">${rolledValue}</span>!`);

    if (rolledValue === 6) {
      this.rollStreak6++;
      if (this.rollStreak6 === 3) {
        this.addLog("[Kacau!]", `Giliran ${activePlayer.name} dilewati karena mendapatkan angka 6 tiga kali beruntun!`);
        this.particles.spawn(
          window.innerWidth / 2, 
          window.innerHeight / 2, 
          '#EF4444', 
          30, 
          'star'
        );
        this.rollStreak6 = 0;
        
        setTimeout(() => this.passTurn(), 1500);
        return;
      }
    } else {
      this.rollStreak6 = 0;
    }

    const validPawns = this.getValidMovablePawns(activePlayer, rolledValue);

    if (validPawns.length === 0) {
      this.addLog("[System]", `Tidak ada pion yang bisa digerakkan oleh ${activePlayer.name}!`);
      
      const nextDelay = activePlayer.type === 'ai' ? 1200 : 1500;
      setTimeout(() => {
        if (rolledValue === 6) {
          this.addLog("[Aturan]", `${activePlayer.name} mendapat kesempatan kocok ulang karena dadu bernilai 6!`);
          this.hasRolled = false;
          if (activePlayer.type === 'ai') {
            setTimeout(() => this.handleAIRoll(), 1000);
          } else {
            const rollBtn = document.getElementById('btn-roll-dice');
            rollBtn.disabled = false;
            rollBtn.classList.remove('opacity-50', 'cursor-not-allowed');
          }
        } else {
          this.passTurn();
        }
      }, nextDelay);
      return;
    }

    if (activePlayer.type === 'human') {
      this.highlightMovablePawns(validPawns);
    } else {
      setTimeout(() => this.executeAIMove(validPawns), 900);
    }
  }

  getValidMovablePawns(player, rolledValue) {
    const valid = [];
    player.pawns.forEach((p) => {
      if (p.step === 0) {
        if (rolledValue === 6) {
          valid.push(p);
        }
      } else {
        if (p.step + rolledValue <= 57) {
          valid.push(p);
        }
      }
    });
    return valid;
  }

  highlightMovablePawns(pawns) {
    this.clearPawnGlow();
    this.addLog("[Sistem]", "Pilih salah satu pion Anda yang berkedip untuk melangkah!");

    pawns.forEach((pawn) => {
      const pawnDOM = document.querySelector(`[data-pawn-color="${this.players[this.activeTurn].color}"][data-pawn-id="${pawn.id}"]`);
      if (pawnDOM) {
        pawnDOM.classList.add('active-pawn');
        pawnDOM.onclick = (e) => {
          e.stopPropagation();
          this.clearPawnGlow();
          this.moveSelectedPawn(pawn, this.diceState);
        };
      }
    });
  }

  clearPawnGlow() {
    document.querySelectorAll('.pawn-element').forEach((el) => {
      el.classList.remove('active-pawn');
      el.onclick = null;
    });
  }

  executeAIMove(movablePawns) {
    const activePlayer = this.players[this.activeTurn];
    const rolledValue = this.diceState;
    
    let selectedPawn = null;

    // Strategy 1: KILL OPPONENT
    for (let p of movablePawns) {
      const targetStep = p.step + rolledValue;
      const targetCoord = this.getPawnCoordinateString(activePlayer.color, p.id, targetStep);
      
      if (targetCoord.startsWith('track-')) {
        const trackIndex = parseInt(targetCoord.split('-')[1]);
        if (!SAFE_INDICES.includes(trackIndex)) {
          const opponentVulnerable = this.findOpponentPawnsAtTrackIndex(trackIndex, activePlayer.color);
          if (opponentVulnerable.length > 0) {
            selectedPawn = p;
            break;
          }
        }
      }
    }

    // Strategy 2: RELEASE FROM BASE ON 6
    if (!selectedPawn && rolledValue === 6) {
      const basePawn = movablePawns.find(p => p.step === 0);
      if (basePawn) {
        selectedPawn = basePawn;
      }
    }

    // Strategy 3: LAND PRECISELY IN GOAL FINISH
    if (!selectedPawn) {
      const finishPawn = movablePawns.find(p => p.step + rolledValue === 57);
      if (finishPawn) {
        selectedPawn = finishPawn;
      }
    }

    // Strategy 4: ESCAPE DANGER
    if (!selectedPawn) {
      for (let p of movablePawns) {
        if (p.step > 0) {
          const currentCoordStr = this.getPawnCoordinateString(activePlayer.color, p.id, p.step);
          if (currentCoordStr.startsWith('track-')) {
            const curTrackIdx = parseInt(currentCoordStr.split('-')[1]);
            if (!SAFE_INDICES.includes(curTrackIdx)) {
              const hasThreat = this.checkDangerThreatBehind(curTrackIdx, activePlayer.color);
              if (hasThreat) {
                selectedPawn = p;
                break;
              }
            }
          }
        }
      }
    }

    // Strategy 5: ADVANCE PAWN CLOSEST TO ENDING
    if (!selectedPawn) {
      let maxStep = -1;
      movablePawns.forEach((p) => {
        if (p.step > maxStep) {
          maxStep = p.step;
          selectedPawn = p;
        }
      });
    }

    if (!selectedPawn) {
      selectedPawn = movablePawns[0];
    }

    this.moveSelectedPawn(selectedPawn, rolledValue);
  }

  findOpponentPawnsAtTrackIndex(trackIdx, selfColor) {
    const vulnerable = [];
    this.players.forEach((opp) => {
      if (!opp.active || opp.color === selfColor) return;
      opp.pawns.forEach((p) => {
        if (p.step > 0 && p.step <= 51) {
          const oppTrackIdx = (PLAYER_START_INDICES[opp.color] + p.step - 1) % 52;
          if (oppTrackIdx === trackIdx) {
            vulnerable.push({ opponent: opp, pawn: p });
          }
        }
      });
    });
    return vulnerable;
  }

  checkDangerThreatBehind(trackIdx, selfColor) {
    for (let dist = 1; dist <= 6; dist++) {
      const lookBackIdx = (trackIdx - dist + 52) % 52;
      const opponents = this.findOpponentPawnsAtTrackIndex(lookBackIdx, selfColor);
      if (opponents.length > 0) {
        return true;
      }
    }
    return false;
  }

  async moveSelectedPawn(pawn, steps) {
    this.isMovingPawn = true;
    const activePlayer = this.players[this.activeTurn];
    
    let startStep = pawn.step;
    const endStep = pawn.step + steps;

    if (startStep === 0) {
      pawn.step = 1;
      activePlayer.stats.stepsMoved++;
      this.sound.playBaseExit();
      this.renderPawns();
      
      const pawnDOM = document.querySelector(`[data-pawn-color="${activePlayer.color}"][data-pawn-id="${pawn.id}"]`);
      if (pawnDOM) {
        const rect = pawnDOM.getBoundingClientRect();
        this.particles.spawn(rect.left + rect.width / 2, rect.top + rect.height / 2, COLOR_HEX[activePlayer.color], 15, 'star');
      }

      this.addLog(activePlayer.name, `mengeluarkan pion #${pawn.id + 1} dari markas!`);
      await new Promise(resolve => setTimeout(resolve, 350));
      this.resolvePawnLanding(pawn);
      return;
    }

    for (let s = startStep + 1; s <= endStep; s++) {
      pawn.step = s;
      activePlayer.stats.stepsMoved++;
      this.sound.playStep();
      this.renderPawns();
      
      await new Promise(resolve => setTimeout(resolve, 180));
    }

    this.resolvePawnLanding(pawn);
  }

  resolvePawnLanding(pawn) {
    const activePlayer = this.players[this.activeTurn];
    const lastRoll = this.diceState;
    let bonusTurn = false;

    const currentCoordStr = this.getPawnCoordinateString(activePlayer.color, pawn.id, pawn.step);
    const pawnDOM = document.querySelector(`[data-pawn-color="${activePlayer.color}"][data-pawn-id="${pawn.id}"]`);
    const pRect = pawnDOM ? pawnDOM.getBoundingClientRect() : null;

    if (pawn.step === 57) {
      activePlayer.stats.finished++;
      this.sound.playGoal();
      this.addLog("[Goal!]", `Pion #${pawn.id + 1} milik ${activePlayer.name} berhasil mencapai garis finish!`);
      
      if (pRect) {
        this.particles.spawn(pRect.left + pRect.width / 2, pRect.top + pRect.height / 2, '#F59E0B', 30, 'star');
      }

      const hudFinish = document.getElementById(`hud-finished-${activePlayer.id}`);
      if (hudFinish) {
        hudFinish.innerHTML = `<span class="text-xs font-black text-amber-400">${activePlayer.stats.finished}/4</span> <i class="fa-solid fa-flag-checkered text-emerald-400 text-xs animate-bounce"></i>`;
      }

      bonusTurn = true;
      this.addLog("[Bonus]", `${activePlayer.name} mendapatkan kesempatan lempar dadu tambahan karena berhasil finish!`);
    } 
    else if (currentCoordStr.startsWith('track-')) {
      const trackIdx = parseInt(currentCoordStr.split('-')[1]);
      
      if (!SAFE_INDICES.includes(trackIdx)) {
        const opponentsOnCell = this.findOpponentPawnsAtTrackIndex(trackIdx, activePlayer.color);
        
        if (opponentsOnCell.length > 0) {
          const victim = opponentsOnCell[0];
          
          victim.pawn.step = 0;
          activePlayer.stats.kills++;
          this.sound.playKill();
          this.addLog("[Killed!]", `${activePlayer.name} melindas pion #${victim.pawn.id + 1} milik ${victim.opponent.name}!`);
          
          if (pRect) {
            this.particles.spawn(pRect.left + pRect.width / 2, pRect.top + pRect.height / 2, COLOR_HEX[activePlayer.color], 35, 'star');
            this.particles.spawn(pRect.left + pRect.width / 2, pRect.top + pRect.height / 2, '#FFFFFF', 15, 'star');
          }

          document.getElementById('ludo-board-wrapper').classList.add('shake-effect');
          setTimeout(() => {
            document.getElementById('ludo-board-wrapper').classList.remove('shake-effect');
          }, 400);

          bonusTurn = true;
          this.addLog("[Bonus]", `${activePlayer.name} mendapat bonus giliran karena berhasil memakan lawan!`);
        }
      } else {
        this.sound.playStar();
        if (pRect) {
          this.particles.spawn(pRect.left + pRect.width / 2, pRect.top + pRect.height / 2, '#EAB308', 20, 'star');
        }
        this.addLog("[Aman]", `Pion #${pawn.id + 1} milik ${activePlayer.name} mendarat di safe zone.`);
      }
    }

    this.renderPawns();

    if (activePlayer.stats.finished === 4) {
      this.triggerGameWinner(activePlayer);
      return;
    }

    this.isMovingPawn = false;

    if (lastRoll === 6) {
      bonusTurn = true;
      this.addLog("[Aturan]", `${activePlayer.name} mendapat kocokan tambahan karena melempar angka 6!`);
    }

    if (bonusTurn) {
      this.hasRolled = false;
      if (activePlayer.type === 'ai') {
        setTimeout(() => this.handleAIRoll(), 1200);
      } else {
        const rollBtn = document.getElementById('btn-roll-dice');
        rollBtn.disabled = false;
        rollBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        document.getElementById('roll-help-text').innerText = "Lempar dadu tambahan sekarang!";
      }
    } else {
      this.passTurn();
    }
  }

  passTurn() {
    this.rollStreak6 = 0;
    
    let nextIdx = (this.activeTurn + 1) % 4;
    while (!this.players[nextIdx].active) {
      nextIdx = (nextIdx + 1) % 4;
    }
    
    this.activeTurn = nextIdx;
    this.startPlayerTurn();
  }

  getPawnCoordinateString(color, pawnIndex, step) {
    if (step === 0) {
      return `base-${color}-${pawnIndex}`;
    }
    if (step === 57) {
      return `goal-${color}`;
    }
    if (step >= 52 && step <= 56) {
      const homeStep = step - 51;
      return `home-${color}-${homeStep}`;
    }
    
    const startIdx = PLAYER_START_INDICES[color];
    const trackIdx = (startIdx + step - 1) % 52;
    return `track-${trackIdx}`;
  }

  renderPawns() {
    document.querySelectorAll('.pawn-element').forEach(el => el.remove());
    
    document.querySelectorAll('.cell-container').forEach((cell) => {
      cell.removeAttribute('data-pawn-count');
    });

    this.players.forEach((player) => {
      if (!player.active) return;
      
      player.pawns.forEach((pawn) => {
        const coordStr = this.getPawnCoordinateString(player.color, pawn.id, pawn.step);
        const cellContainer = document.querySelector(`[data-cell="${coordStr}"]`);
        
        if (cellContainer) {
          const pElem = document.createElement('div');
          pElem.className = "pawn-element rounded-full border-2 border-white shadow-[0_3px_6px_rgba(0,0,0,0.35)] flex items-center justify-center transition-all duration-200 relative";
          pElem.setAttribute('data-pawn-color', player.color);
          pElem.setAttribute('data-pawn-id', pawn.id);
          
          let gradient = "bg-gradient-to-tr from-red-700 via-red-500 to-red-300 ring-1 ring-red-400/40";
          let textHex = "text-white";
          if (player.color === 'green') {
            gradient = "bg-gradient-to-tr from-emerald-700 via-emerald-500 to-emerald-300 ring-1 ring-emerald-400/40";
          } else if (player.color === 'yellow') {
            gradient = "bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 ring-1 ring-yellow-400/50";
            textHex = "text-slate-900";
          } else if (player.color === 'blue') {
            gradient = "bg-gradient-to-tr from-blue-700 via-blue-500 to-blue-300 ring-1 ring-blue-400/40";
          }

          pElem.className += ` ${gradient}`;
          
          pElem.innerHTML = `
            <span class="text-[9px] font-black pointer-events-none ${textHex}">${pawn.id + 1}</span>
            <span class="absolute top-[10%] left-[10%] w-[35%] h-[35%] bg-white/40 rounded-full blur-[0.3px] pointer-events-none"></span>
          `;

          cellContainer.appendChild(pElem);
          
          const curCount = cellContainer.querySelectorAll('.pawn-element').length;
          cellContainer.setAttribute('data-pawn-count', curCount);
        }
      });
    });
  }

  showStatsPanel(show) {
    const panel = document.getElementById('stats-panel');
    if (show) {
      const container = document.getElementById('stats-list-container');
      container.innerHTML = "";

      this.players.forEach((p) => {
        if (!p.active) return;
        
        const card = document.createElement('div');
        card.className = "p-3.5 rounded-2xl bg-slate-850 border border-slate-700 flex items-center justify-between";
        
        let bulletColor = "bg-red-500";
        if (p.color === 'green') bulletColor = "bg-emerald-500";
        else if (p.color === 'yellow') bulletColor = "bg-yellow-500";
        else if (p.color === 'blue') bulletColor = "bg-blue-500";

        card.innerHTML = `
          <div class="flex items-center gap-2">
            <span class="w-3.5 h-3.5 rounded-full ${bulletColor}"></span>
            <span class="font-bold text-slate-100">${p.name}</span>
          </div>
          <div class="flex items-center gap-4 text-xs font-semibold text-slate-400">
            <div class="text-center">
              <p class="text-[9px] uppercase font-bold text-slate-500">Rolls</p>
              <p class="font-bold text-slate-200">${p.stats.rolls}</p>
            </div>
            <div class="text-center">
              <p class="text-[9px] uppercase font-bold text-slate-500">Langkah</p>
              <p class="font-bold text-slate-200">${p.stats.stepsMoved}</p>
            </div>
            <div class="text-center">
              <p class="text-[9px] uppercase font-bold text-slate-500">Kills</p>
              <p class="font-bold text-green-400">${p.stats.kills}</p>
            </div>
            <div class="text-center">
              <p class="text-[9px] uppercase font-bold text-slate-500">Goals</p>
              <p class="font-bold text-amber-400">${p.stats.finished}/4</p>
            </div>
          </div>
        `;
        container.appendChild(card);
      });

      panel.classList.remove('hidden');
    } else {
      panel.classList.add('hidden');
    }
  }

  triggerGameWinner(player) {
    this.sound.playWin();
    
    const interval = setInterval(() => {
      this.particles.spawnConfettiShower();
    }, 150);

    setTimeout(() => clearInterval(interval), 12000);

    document.getElementById('winner-name-display').innerText = player.name;
    document.getElementById('winner-name-display').className = `text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r ${player.color === 'red' ? 'from-red-400 to-red-600' : player.color === 'green' ? 'from-emerald-400 to-emerald-600' : player.color === 'yellow' ? 'from-amber-400 to-yellow-500' : 'from-blue-400 to-blue-600'} tracking-tight gaming-font uppercase mb-2`;
    
    document.getElementById('winner-stats-summary').innerHTML = `
      <div class="flex justify-between border-b border-white/5 pb-1">
        <span>Total Kocok Dadu:</span>
        <span class="font-black text-slate-100">${player.stats.rolls} kali</span>
      </div>
      <div class="flex justify-between border-b border-white/5 pb-1">
        <span>Total Langkah Pion:</span>
        <span class="font-black text-slate-100">${player.stats.stepsMoved} langkah</span>
      </div>
      <div class="flex justify-between">
        <span>Total Kills (Musuh Dilindas):</span>
        <span class="font-black text-green-400">${player.stats.kills} musuh</span>
      </div>
    `;

    document.getElementById('winner-overlay').classList.remove('hidden');
  }
}

// Initialize Game Engine on DOM Loaded
window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('loaded');
  window.gameEngine = new LudoGame();
});

// ==========================================================================
// WEB SHADOW: ROOFTOP NIGHTMARE - 2D ACTION PLATFORMER ENGINE
// Mobile Landscape 16:9 Canvas Platformer with HTML5 Audio & Web Audio API
// ==========================================================================

'use strict';

// --------------------------------------------------------------------------
// 1. SECTION & FLOOR CONFIGURATION (Per-Background Rooftop Geometry)
// --------------------------------------------------------------------------
const SECTION_CONFIG = {
    war1bg: {
        id: 1,
        name: 'WAR ZONE 1',
        subtitle: 'ROOFTOP INFILTRATION',
        worldStart: 0,
        worldEnd: 2400,
        floorY: 554,
        playerStartY: 554,
        playableLeft: 20,
        playableRight: 2380,
        bgKey: 'war1bg',
        musicKey: 'war1-music',
        gaps: [
            { start: 850, end: 1040 },
            { start: 1650, end: 1860 }
        ],
        floatingPlatforms: [
            { x: 880, y: 440, w: 110, h: 22 },
            { x: 1690, y: 430, w: 120, h: 22 }
        ],
        obstacles: [
            { x: 520, y: 554, w: 36, h: 36, type: 'steam_vent', timer: 0 }
        ],
        coins: [220, 380, 600, 890, 1180, 1400, 1710, 1950, 2200],
        hearts: [1300],
        enemies: [
            { x: 650, patrolLeft: 520, patrolRight: 800 },
            { x: 1350, patrolLeft: 1100, patrolRight: 1550 },
            { x: 2050, patrolLeft: 1900, patrolRight: 2300 }
        ]
    },
    war2bg: {
        id: 2,
        name: 'WAR ZONE 2',
        subtitle: 'INDUSTRIAL SKYLINE',
        worldStart: 2400,
        worldEnd: 5000,
        floorY: 540,
        playerStartY: 540,
        playableLeft: 2420,
        playableRight: 4980,
        bgKey: 'war2bg',
        musicKey: 'war2-music',
        gaps: [
            { start: 3050, end: 3380 },
            { start: 4050, end: 4420 }
        ],
        floatingPlatforms: [
            { x: 3090, y: 430, w: 100, h: 20 },
            { x: 3230, y: 360, w: 100, h: 20 },
            { x: 4090, y: 420, w: 110, h: 20 },
            { x: 4250, y: 350, w: 110, h: 20 }
        ],
        obstacles: [
            { x: 2750, y: 540, w: 32, h: 42, type: 'electric_box', timer: 0 },
            { x: 3750, y: 540, w: 32, h: 42, type: 'electric_box', timer: 0 }
        ],
        coins: [2550, 2850, 3100, 3240, 3500, 3850, 4100, 4260, 4650, 4850],
        hearts: [3600],
        enemies: [
            { x: 2650, patrolLeft: 2450, patrolRight: 2950 },
            { x: 3550, patrolLeft: 3450, patrolRight: 3900 },
            { x: 4550, patrolLeft: 4450, patrolRight: 4800 },
            { x: 4750, patrolLeft: 4600, patrolRight: 4950 }
        ]
    },
    war3bg: {
        id: 3,
        name: 'WAR ZONE 3',
        subtitle: 'CYBER DISTRICT RUN',
        worldStart: 5000,
        worldEnd: 7400,
        floorY: 535,
        playerStartY: 535,
        playableLeft: 5020,
        playableRight: 7380,
        bgKey: 'war3bg',
        musicKey: 'war3-music',
        gaps: [
            { start: 5600, end: 6020 },
            { start: 6600, end: 7050 }
        ],
        floatingPlatforms: [
            { x: 5640, y: 420, w: 90, h: 20 },
            { x: 5780, y: 340, w: 90, h: 20 },
            { x: 5920, y: 410, w: 90, h: 20 },
            { x: 6640, y: 420, w: 95, h: 20 },
            { x: 6790, y: 330, w: 95, h: 20 },
            { x: 6940, y: 410, w: 95, h: 20 }
        ],
        obstacles: [
            { x: 5300, y: 535, w: 26, h: 46, type: 'laser_trap', timer: 0 },
            { x: 6250, y: 535, w: 26, h: 46, type: 'laser_trap', timer: 0 },
            { x: 7200, y: 535, w: 26, h: 46, type: 'laser_trap', timer: 0 }
        ],
        coins: [5150, 5450, 5650, 5790, 6150, 6400, 6650, 6800, 7150, 7300],
        hearts: [6350],
        enemies: [
            { x: 5200, patrolLeft: 5050, patrolRight: 5500 },
            { x: 6200, patrolLeft: 6050, patrolRight: 6450 },
            { x: 6400, patrolLeft: 6250, patrolRight: 6550 },
            { x: 7150, patrolLeft: 7050, patrolRight: 7350 }
        ]
    },
    bosswarbg: {
        id: 4,
        name: 'FINAL SHOWDOWN',
        subtitle: 'CYBER OVERLORD ARENA',
        worldStart: 7400,
        worldEnd: 8800,
        floorY: 545,
        playerStartY: 545,
        playableLeft: 7450,
        playableRight: 8750,
        bgKey: 'bosswarbg',
        musicKey: 'boss-music',
        gaps: [],
        floatingPlatforms: [
            { x: 7700, y: 420, w: 120, h: 22 },
            { x: 8450, y: 420, w: 120, h: 22 }
        ],
        obstacles: [],
        coins: [7600, 7800, 8350, 8550],
        hearts: [7720, 8470],
        enemies: []
    }
};

// --------------------------------------------------------------------------
// 2. AUDIO MANAGER (HTML5 Audio + Procedural Web Audio API Fallback)
// --------------------------------------------------------------------------
class AudioManager {
    constructor() {
        this.soundEnabled = true;
        this.audioCtx = null;
        this.htmlAudioCache = {};
        this.currentMusicKey = null;
        this.currentMusicAudio = null;
        this.initialized = false;

        this.soundFiles = [
            'jump', 'attack', 'web', 'hit', 'enemy-hit', 'enemy-defeat',
            'coin', 'player-hurt', 'boss-hit', 'boss-defeat', 'game-over', 'victory'
        ];
        this.musicFiles = ['war1-music', 'war2-music', 'war3-music', 'boss-music'];
    }

    init() {
        if (this.initialized) return;
        this.initialized = true;

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                this.audioCtx = new AudioContextClass();
                if (this.audioCtx.state === 'suspended') {
                    this.audioCtx.resume();
                }
            }
        } catch (e) {
            console.warn('Web Audio API unavailable:', e);
        }

        // Cache HTML5 Audio objects
        [...this.soundFiles, ...this.musicFiles].forEach(name => {
            try {
                const audio = new Audio(`assets/audio/${name}.mp3`);
                audio.preload = 'auto';
                this.htmlAudioCache[name] = audio;
            } catch (e) {}
        });
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        if (!this.soundEnabled) {
            this.stopMusic();
        } else if (this.currentMusicKey) {
            this.playMusic(this.currentMusicKey);
        }
        return this.soundEnabled;
    }

    playSound(name) {
        if (!this.soundEnabled) return;
        this.init();

        const cached = this.htmlAudioCache[name];
        if (cached) {
            try {
                cached.currentTime = 0;
                const p = cached.play();
                if (p !== undefined) {
                    p.catch(() => this.synthesizeSound(name));
                    return;
                }
            } catch (e) {
                this.synthesizeSound(name);
                return;
            }
        }
        this.synthesizeSound(name);
    }

    playMusic(key, loop = true) {
        this.currentMusicKey = key;
        if (!this.soundEnabled) return;
        this.init();

        if (this.currentMusicAudio) {
            try {
                this.currentMusicAudio.pause();
                this.currentMusicAudio.currentTime = 0;
            } catch (e) {}
        }

        const audio = this.htmlAudioCache[key] || new Audio(`assets/audio/${key}.mp3`);
        audio.loop = loop;
        audio.volume = 0.5;
        this.currentMusicAudio = audio;

        try {
            const p = audio.play();
            if (p !== undefined) {
                p.catch(err => {
                    console.log('Autoplay policy caught, will play on user interaction');
                });
            }
        } catch (e) {}
    }

    stopMusic() {
        if (this.currentMusicAudio) {
            try {
                this.currentMusicAudio.pause();
                this.currentMusicAudio.currentTime = 0;
            } catch (e) {}
        }
    }

    synthesizeSound(name) {
        if (!this.audioCtx || this.audioCtx.state === 'suspended') return;
        try {
            const now = this.audioCtx.currentTime;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            switch (name) {
                case 'jump':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(160, now);
                    osc.frequency.exponentialRampToValueAtTime(500, now + 0.16);
                    gain.gain.setValueAtTime(0.15, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.16);
                    osc.start(now);
                    osc.stop(now + 0.16);
                    break;
                case 'attack':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    osc.frequency.linearRampToValueAtTime(30, now + 0.12);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.12);
                    osc.start(now);
                    osc.stop(now + 0.12);
                    break;
                case 'web':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(750, now);
                    osc.frequency.exponentialRampToValueAtTime(180, now + 0.2);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
                    osc.start(now);
                    osc.stop(now + 0.2);
                    break;
                case 'hit':
                case 'enemy-hit':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(110, now);
                    osc.frequency.linearRampToValueAtTime(35, now + 0.15);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.15);
                    osc.start(now);
                    osc.stop(now + 0.15);
                    break;
                case 'coin':
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(987, now);
                    osc.frequency.setValueAtTime(1318, now + 0.08);
                    gain.gain.setValueAtTime(0.2, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                    break;
                case 'player-hurt':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(120, now);
                    osc.frequency.linearRampToValueAtTime(45, now + 0.25);
                    gain.gain.setValueAtTime(0.3, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                    osc.start(now);
                    osc.stop(now + 0.25);
                    break;
                case 'enemy-defeat':
                case 'boss-hit':
                    osc.type = 'square';
                    osc.frequency.setValueAtTime(90, now);
                    osc.frequency.linearRampToValueAtTime(25, now + 0.35);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
                    osc.start(now);
                    osc.stop(now + 0.35);
                    break;
                case 'victory':
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(523, now);
                    osc.frequency.setValueAtTime(659, now + 0.15);
                    osc.frequency.setValueAtTime(783, now + 0.3);
                    osc.frequency.setValueAtTime(1046, now + 0.45);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 0.8);
                    osc.start(now);
                    osc.stop(now + 0.8);
                    break;
                case 'game-over':
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(293, now);
                    osc.frequency.setValueAtTime(277, now + 0.25);
                    osc.frequency.setValueAtTime(261, now + 0.5);
                    osc.frequency.setValueAtTime(220, now + 0.75);
                    gain.gain.setValueAtTime(0.25, now);
                    gain.gain.linearRampToValueAtTime(0.01, now + 1.2);
                    osc.start(now);
                    osc.stop(now + 1.2);
                    break;
            }
        } catch (e) {}
    }
}

// --------------------------------------------------------------------------
// 3. ASSET LOADER (Character Sprites & Section Backgrounds)
// --------------------------------------------------------------------------
class AssetManager {
    constructor() {
        this.images = {};
        this.loadedCount = 0;
        this.totalCount = 0;

        this.sources = {
            // Backgrounds (root and subfolder fallbacks)
            war1bg: 'war1bg.png',
            war2bg: 'war2bg.png',
            war3bg: 'war3bg.png',
            bosswarbg: 'bosswarbg.png',

            // Hero Sprites
            heroIdle: 'assets/characters/hero/idle.png',
            heroRun: 'assets/characters/hero/run.png',
            heroJump: 'assets/characters/hero/jump.png',
            heroFall: 'assets/characters/hero/fall.png',
            heroPunch: 'assets/characters/hero/punch.png',
            heroWeb: 'assets/characters/hero/webshoot.png',
            heroHurt: 'assets/characters/hero/hurt.png',
            heroDefeated: 'assets/characters/hero/defeated.png',

            // Root Character image fallbacks
            heroPng: 'hero.png',
            villain1Png: 'villain1.png',
            bossPng: 'boss.png',

            // Villain 1 Sprites
            villainIdle: 'assets/characters/villains/villain1/idle.png',
            villainPunch: 'assets/characters/villains/villain1/punch.png',
            villainHurt: 'assets/characters/villains/villain1/hurt.png',
            villainDefeated: 'assets/characters/villains/villain1/defeated.png',

            // Final Boss Sprites
            bossIdle: 'assets/characters/villains/finalBoss/idle.png',
            bossPunch: 'assets/characters/villains/finalBoss/punch.png',
            bossHurt: 'assets/characters/villains/finalBoss/hurt.png',
            bossDefeated: 'assets/characters/villains/finalBoss/defeated.png'
        };

        this.totalCount = Object.keys(this.sources).length;
    }

    loadAll(onProgress, onComplete) {
        for (const [key, src] of Object.entries(this.sources)) {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.loadedCount++;
                if (onProgress) onProgress(this.loadedCount, this.totalCount);
                if (this.loadedCount >= this.totalCount && onComplete) onComplete();
            };
            img.onerror = () => {
                // Secondary fallback path check
                if (key === 'war1bg') img.src = 'assets/backgrounds/war1bg.jpg';
                else if (key === 'war2bg') img.src = 'assets/backgrounds/war2bg.jpg';
                else if (key === 'war3bg') img.src = 'assets/backgrounds/war3bg.png';
                else if (key === 'bosswarbg') img.src = 'assets/backgrounds/bosswarbg.png';
                else {
                    this.loadedCount++;
                    if (onProgress) onProgress(this.loadedCount, this.totalCount);
                    if (this.loadedCount >= this.totalCount && onComplete) onComplete();
                }
            };
            this.images[key] = img;
        }
    }

    getImage(key) {
        return this.images[key] || null;
    }
}

// --------------------------------------------------------------------------
// 4. INPUT MANAGER (Pointer Events & Keyboard)
// --------------------------------------------------------------------------
class InputManager {
    constructor() {
        this.keys = {
            left: false,
            right: false,
            jump: false,
            attack: false,
            web: false
        };

        this.setupKeyboard();
        this.setupTouchControls();
    }

    setupKeyboard() {
        window.addEventListener('keydown', e => {
            if (e.repeat) return;
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = true;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                case 'Space':
                    this.keys.jump = true;
                    e.preventDefault();
                    break;
                case 'KeyZ':
                case 'KeyJ':
                    this.keys.attack = true;
                    break;
                case 'KeyX':
                case 'KeyK':
                    this.keys.web = true;
                    break;
            }
        });

        window.addEventListener('keyup', e => {
            switch (e.code) {
                case 'ArrowLeft':
                case 'KeyA':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.keys.right = false;
                    break;
                case 'ArrowUp':
                case 'KeyW':
                case 'Space':
                    this.keys.jump = false;
                    break;
                case 'KeyZ':
                case 'KeyJ':
                    this.keys.attack = false;
                    break;
                case 'KeyX':
                case 'KeyK':
                    this.keys.web = false;
                    break;
            }
        });
    }

    setupTouchControls() {
        const bindPointer = (elementId, keyName) => {
            const el = document.getElementById(elementId);
            if (!el) return;

            const handleDown = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.keys[keyName] = true;
                el.classList.add('active');
            };

            const handleUp = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.keys[keyName] = false;
                el.classList.remove('active');
            };

            el.addEventListener('pointerdown', handleDown);
            el.addEventListener('pointerup', handleUp);
            el.addEventListener('pointercancel', handleUp);
            el.addEventListener('pointerleave', handleUp);
        };

        bindPointer('touch-btn-left', 'left');
        bindPointer('touch-btn-right', 'right');
        bindPointer('touch-btn-jump', 'jump');
        bindPointer('touch-btn-attack', 'attack');
        bindPointer('touch-btn-web', 'web');
    }
}

// --------------------------------------------------------------------------
// 5. PARTICLE & VISUAL EFFECTS SYSTEM
// --------------------------------------------------------------------------
class ParticleSystem {
    constructor() {
        this.particles = [];
        this.textParticles = [];
    }

    addSparkles(x, y, color = '#38bdf8', count = 8, speed = 5) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const velocity = Math.random() * speed + 1.5;
            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * velocity,
                vy: Math.sin(angle) * velocity - 1,
                radius: Math.random() * 4 + 2,
                color,
                alpha: 1,
                decay: Math.random() * 0.03 + 0.02
            });
        }
    }

    addDamageText(x, y, text, color = '#ef4444') {
        this.textParticles.push({
            x,
            y,
            text,
            color,
            vy: -2,
            alpha: 1,
            life: 30
        });
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx * 60 * dt;
            p.y += p.vy * 60 * dt;
            p.vy += 0.15;
            p.alpha -= p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.textParticles.length - 1; i >= 0; i--) {
            const tp = this.textParticles[i];
            tp.y += tp.vy * 60 * dt;
            tp.life--;
            tp.alpha = tp.life / 30;
            if (tp.life <= 0) {
                this.textParticles.splice(i, 1);
            }
        }
    }

    draw(ctx, cameraX) {
        for (const p of this.particles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x - cameraX, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        for (const tp of this.textParticles) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, tp.alpha);
            ctx.fillStyle = tp.color;
            ctx.font = 'bold 16px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(tp.text, tp.x - cameraX, tp.y);
            ctx.restore();
        }
    }

    clear() {
        this.particles = [];
        this.textParticles = [];
    }
}

// --------------------------------------------------------------------------
// 6. HERO ENTITY (CHARACTER CONTROLLER)
// --------------------------------------------------------------------------
class Hero {
    constructor(game) {
        this.game = game;

        // Visual proportions (Internal 1280x720 coordinates)
        // Original sprite: 1227 x 1282 -> aspect ratio ~0.957
        this.renderHeight = 200;
        this.renderWidth = 184;
        this.feetPad = 3.5;

        // Physics & Hitbox
        this.worldX = 120;
        this.y = 554 - this.renderHeight + this.feetPad;
        this.vx = 0;
        this.vy = 0;
        this.speed = 7.2;
        this.jumpForce = -16.8;
        this.gravity = 0.72;
        this.isGrounded = true;

        // Direction & Animation state
        this.facing = 'right'; // 'right' or 'left'
        this.state = 'idle'; // 'idle', 'run', 'jump', 'fall', 'punch', 'web', 'hurt', 'dead'
        this.stateTimer = 0;

        // Health & Ammo
        this.maxHearts = 5;
        this.hearts = 5;
        this.invincibleTimer = 0;
        this.knockbackTimer = 0;

        this.maxWeb = 100;
        this.webAmmo = 100;

        // Combat Timers
        this.attackCooldown = 0;
        this.webCooldown = 0;
    }

    reset(startX = 120, startY = 554) {
        this.worldX = startX;
        this.y = startY - this.renderHeight + this.feetPad;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = true;
        this.facing = 'right';
        this.state = 'idle';
        this.stateTimer = 0;
        this.hearts = 5;
        this.invincibleTimer = 0;
        this.knockbackTimer = 0;
        this.webAmmo = 100;
        this.attackCooldown = 0;
        this.webCooldown = 0;
    }

    takeDamage(damageHearts = 1, knockbackDir = -1) {
        if (this.invincibleTimer > 0 || this.state === 'dead') return;

        this.hearts = Math.max(0, this.hearts - damageHearts);
        this.invincibleTimer = 65; // ~1 second invincibility
        this.knockbackTimer = 16;
        this.vx = knockbackDir * 8;
        this.vy = -6;
        this.state = 'hurt';
        this.stateTimer = 22;

        this.game.audio.playSound('player-hurt');
        this.game.particles.addSparkles(this.worldX + this.renderWidth / 2, this.y + this.renderHeight / 2, '#ef4444', 14);
        this.game.triggerScreenShake(12, 18);

        if (this.hearts <= 0) {
            this.state = 'dead';
            this.game.onHeroDeath();
        }
    }

    triggerAttack() {
        if (this.attackCooldown > 0 || this.state === 'hurt' || this.state === 'dead') return;
        this.state = 'punch';
        this.stateTimer = 18;
        this.attackCooldown = 22;
        this.game.audio.playSound('attack');

        // Melee Hitbox in front of hero
        const hitWidth = 70;
        const hitHeight = 60;
        const hitX = this.facing === 'right' ? this.worldX + this.renderWidth - 10 : this.worldX - hitWidth + 10;
        const hitY = this.y + 14;

        this.game.particles.addSparkles(hitX + hitWidth / 2, hitY + hitHeight / 2, '#ffffff', 5, 3);

        // Melee check on enemies
        this.game.enemies.forEach(enemy => {
            if (enemy.isAlive && enemy.checkMeleeCollision(hitX, hitY, hitWidth, hitHeight)) {
                enemy.receiveDamage(35, this.facing === 'right' ? 1 : -1);
                this.game.addScore(25);
                this.game.particles.addDamageText(enemy.worldX + enemy.renderWidth / 2, enemy.y, '-35');
            }
        });

        // Melee check on Boss
        if (this.game.boss && this.game.boss.isAlive) {
            if (this.game.boss.checkMeleeCollision(hitX, hitY, hitWidth, hitHeight)) {
                this.game.boss.receiveDamage(35, this.facing === 'right' ? 1 : -1);
                this.game.addScore(35);
                this.game.particles.addDamageText(this.game.boss.worldX + this.game.boss.renderWidth / 2, this.game.boss.y, '-35');
            }
        }
    }

    triggerWebShoot() {
        if (this.webCooldown > 0 || this.webAmmo < 20 || this.state === 'hurt' || this.state === 'dead') return;
        this.webAmmo -= 20;
        this.webCooldown = 25;
        this.state = 'web';
        this.stateTimer = 18;
        this.game.audio.playSound('web');

        const dir = this.facing === 'right' ? 1 : -1;
        const projX = this.facing === 'right' ? this.worldX + this.renderWidth : this.worldX - 30;
        const projY = this.y + 35;

        this.game.projectiles.push(new Projectile(this.game, projX, projY, dir * 15, 'hero'));
    }

    update(dt) {
        if (this.state === 'dead') return;

        if (this.invincibleTimer > 0) this.invincibleTimer--;
        if (this.attackCooldown > 0) this.attackCooldown--;
        if (this.webCooldown > 0) this.webCooldown--;

        // Regenerate Web Ammo slowly
        if (this.webAmmo < this.maxWeb) {
            this.webAmmo = Math.min(this.maxWeb, this.webAmmo + 0.18 * 60 * dt);
        }

        if (this.stateTimer > 0) {
            this.stateTimer--;
            if (this.stateTimer <= 0 && this.state !== 'dead') {
                this.state = 'idle';
            }
        }

        // Handle Horizontal Movement
        if (this.knockbackTimer > 0) {
            this.knockbackTimer--;
        } else {
            const input = this.game.input.keys;

            if (input.left) {
                this.vx = -this.speed;
                this.facing = 'left';
                if (this.isGrounded && this.stateTimer <= 0) this.state = 'run';
            } else if (input.right) {
                this.vx = this.speed;
                this.facing = 'right';
                if (this.isGrounded && this.stateTimer <= 0) this.state = 'run';
            } else {
                this.vx = 0;
                if (this.isGrounded && this.stateTimer <= 0) this.state = 'idle';
            }

            // Jump
            if (input.jump && this.isGrounded) {
                this.vy = this.jumpForce;
                this.isGrounded = false;
                this.state = 'jump';
                this.game.audio.playSound('jump');
                this.game.particles.addSparkles(this.worldX + this.renderWidth / 2, this.y + this.renderHeight, '#94a3b8', 6, 2);
            }

            if (input.attack) this.triggerAttack();
            if (input.web) this.triggerWebShoot();
        }

        // Apply Gravity
        this.vy += this.gravity * 60 * dt;
        this.worldX += this.vx * 60 * dt;
        this.y += this.vy * 60 * dt;

        if (!this.isGrounded && this.stateTimer <= 0) {
            this.state = this.vy < 0 ? 'jump' : 'fall';
        }

        // Collision detection on rooftop floor and floating platforms
        this.checkCollisions();

        // Level boundary constraints (Global instead of per-section to allow transitions)
        if (this.worldX < 20) {
            this.worldX = 20;
        }
        const maxGameX = 8750; // playableRight of bosswarbg
        if (this.worldX > maxGameX - this.renderWidth) {
            this.worldX = maxGameX - this.renderWidth;
        }

        // Gap pit death check (falling off rooftop)
        if (this.y > 760) {
            this.takeDamage(1, 0);
            const safeX = this.game.level.getSafeRespawnX(this.worldX);
            const sec = this.game.level.getCurrentSection(safeX);
            this.worldX = safeX;
            this.y = sec.floorY - this.renderHeight + this.feetPad;
            this.vy = 0;
            this.isGrounded = true;
        }
    }

    checkCollisions() {
        const footX = this.worldX + this.renderWidth / 2;
        const footY = this.y + this.renderHeight - this.feetPad;

        const currentSec = this.game.level.getCurrentSection(footX);
        const floorY = currentSec.floorY;
        const isOverGap = this.game.level.isPositionInGap(footX);

        this.isGrounded = false;

        // 1. Floating platforms
        const platforms = this.game.level.getPlatformsNear(footX);
        for (const plat of platforms) {
            if (this.vy >= 0 &&
                footX >= plat.x && footX <= plat.x + plat.w &&
                footY >= plat.y && footY <= plat.y + 18) {
                this.y = plat.y - this.renderHeight + this.feetPad;
                this.vy = 0;
                this.isGrounded = true;
                if (this.state === 'jump' || this.state === 'fall') this.state = 'idle';
                return;
            }
        }

        // 2. Solid Rooftop Floor
        if (!isOverGap) {
            if (footY >= floorY) {
                this.y = floorY - this.renderHeight + this.feetPad;
                this.vy = 0;
                this.isGrounded = true;
                if (this.state === 'jump' || this.state === 'fall') this.state = 'idle';
            }
        }
    }

    draw(ctx, cameraX) {
        if (this.invincibleTimer > 0 && Math.floor(this.invincibleTimer / 4) % 2 === 0) {
            return;
        }

        let spriteKey = 'heroIdle';
        switch (this.state) {
            case 'run':
                spriteKey = 'heroRun';
                break;
            case 'jump':
                spriteKey = 'heroJump';
                break;
            case 'fall':
                spriteKey = 'heroFall';
                break;
            case 'punch':
                spriteKey = 'heroPunch';
                break;
            case 'web':
                spriteKey = 'heroWeb';
                break;
            case 'hurt':
                spriteKey = 'heroHurt';
                break;
            case 'dead':
                spriteKey = 'heroDefeated';
                break;
            default:
                spriteKey = 'heroIdle';
        }

        const img = this.game.assets.getImage(spriteKey) || this.game.assets.getImage('heroPng') || this.game.assets.getImage('heroIdle');
        const drawX = Math.round(this.worldX - cameraX);
        const drawY = Math.round(this.y);

        ctx.save();
        if (this.facing === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(img, -drawX - this.renderWidth, drawY, this.renderWidth, this.renderHeight);
        } else {
            ctx.drawImage(img, drawX, drawY, this.renderWidth, this.renderHeight);
        }
        ctx.restore();
    }
}

// --------------------------------------------------------------------------
// 7. VILLAIN 1 (PATROL, DETECTION, MELEE ENEMY)
// --------------------------------------------------------------------------
class Enemy {
    constructor(game, config, floorY) {
        this.game = game;

        // Proportions (Original: 1024x1536, ~0.667 aspect ratio)
        this.renderHeight = 200;
        this.renderWidth = 124;
        this.feetPad = 2;

        this.worldX = config.x;
        this.floorY = floorY;
        this.y = floorY - this.renderHeight + this.feetPad;

        this.patrolLeft = config.patrolLeft || (this.worldX - 150);
        this.patrolRight = config.patrolRight || (this.worldX + 150);

        this.vx = -1.6;
        this.facing = 'left';
        this.maxHp = 70;
        this.hp = 70;
        this.isAlive = true;

        this.state = 'patrol';
        this.stateTimer = 0;
        this.attackCooldown = 0;
        this.knockbackTimer = 0;
        this.fadeAlpha = 1.0;
    }

    checkMeleeCollision(hitX, hitY, hitW, hitH) {
        return (
            hitX < this.worldX + this.renderWidth &&
            hitX + hitW > this.worldX &&
            hitY < this.y + this.renderHeight &&
            hitY + hitH > this.y
        );
    }

    receiveDamage(amount, knockDir = 1) {
        if (!this.isAlive) return;

        this.hp -= amount;
        this.game.audio.playSound('enemy-hit');
        this.game.particles.addSparkles(this.worldX + this.renderWidth / 2, this.y + this.renderHeight / 2, '#38bdf8', 8);

        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
            this.state = 'defeated';
            this.game.audio.playSound('enemy-defeat');
            this.game.addScore(100);
            this.game.particles.addDamageText(this.worldX + this.renderWidth / 2, this.y - 15, '+100', '#facc15');
            this.game.particles.addSparkles(this.worldX + this.renderWidth / 2, this.y + this.renderHeight / 2, '#ef4444', 15, 6);
        } else {
            this.state = 'hurt';
            this.stateTimer = 16;
            this.knockbackTimer = 10;
            this.vx = knockDir * 5;
        }
    }

    update(dt) {
        if (!this.isAlive) {
            if (this.fadeAlpha > 0) this.fadeAlpha -= 0.04;
            return;
        }

        if (this.attackCooldown > 0) this.attackCooldown--;

        if (this.knockbackTimer > 0) {
            this.knockbackTimer--;
            this.worldX += this.vx * 60 * dt;
            return;
        }

        if (this.stateTimer > 0) {
            this.stateTimer--;
            if (this.stateTimer <= 0) {
                this.state = 'patrol';
            }
            return;
        }

        const hero = this.game.hero;
        const distToHero = (hero.worldX + hero.renderWidth / 2) - (this.worldX + this.renderWidth / 2);
        const absDist = Math.abs(distToHero);

        // AI Detection & Chase
        if (absDist < 380 && hero.hearts > 0) {
            this.state = 'chase';
            this.facing = distToHero > 0 ? 'right' : 'left';
            const speed = 2.4;

            if (absDist > 55) {
                this.worldX += (distToHero > 0 ? 1 : -1) * speed * 60 * dt;
            } else {
                if (this.attackCooldown <= 0) {
                    this.state = 'punch';
                    this.stateTimer = 24;
                    this.attackCooldown = 55;
                    this.game.audio.playSound('attack');

                    if (hero.invincibleTimer <= 0) {
                        hero.takeDamage(1, this.facing === 'right' ? 1 : -1);
                    }
                }
            }
        } else {
            // Patrol
            this.state = 'patrol';
            this.worldX += this.vx * 60 * dt;

            if (this.worldX <= this.patrolLeft) {
                this.worldX = this.patrolLeft;
                this.vx = Math.abs(this.vx);
                this.facing = 'right';
            } else if (this.worldX >= this.patrolRight) {
                this.worldX = this.patrolRight;
                this.vx = -Math.abs(this.vx);
                this.facing = 'left';
            }
        }

        const currentSec = this.game.level.getCurrentSection(this.worldX);
        this.y = currentSec.floorY - this.renderHeight + this.feetPad;
    }

    draw(ctx, cameraX) {
        if (this.fadeAlpha <= 0) return;

        let spriteKey = 'villainIdle';
        if (!this.isAlive) spriteKey = 'villainDefeated';
        else if (this.state === 'punch') spriteKey = 'villainPunch';
        else if (this.state === 'hurt') spriteKey = 'villainHurt';

        const img = this.game.assets.getImage(spriteKey) || this.game.assets.getImage('villain1Png') || this.game.assets.getImage('villainIdle');
        const drawX = Math.round(this.worldX - cameraX);
        const drawY = Math.round(this.y);

        ctx.save();
        ctx.globalAlpha = this.fadeAlpha;

        if (this.facing === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(img, -drawX - this.renderWidth, drawY, this.renderWidth, this.renderHeight);
        } else {
            ctx.drawImage(img, drawX, drawY, this.renderWidth, this.renderHeight);
        }

        if (this.isAlive && this.hp < this.maxHp) {
            const barW = this.renderWidth;
            const barH = 6;
            const hpRatio = this.hp / this.maxHp;

            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(drawX, drawY - 12, barW, barH);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(drawX, drawY - 12, barW * hpRatio, barH);
            ctx.strokeStyle = '#334155';
            ctx.strokeRect(drawX, drawY - 12, barW, barH);
        }

        ctx.restore();
    }
}

// --------------------------------------------------------------------------
// 8. FINAL BOSS (CYBER OVERLORD)
// --------------------------------------------------------------------------
class Boss {
    constructor(game, floorY) {
        this.game = game;

        this.renderHeight = 250;
        this.renderWidth = 222;
        this.feetPad = 1;

        this.worldX = 8250;
        this.floorY = floorY;
        this.y = floorY - this.renderHeight + this.feetPad;
        this.vy = 0;
        this.gravity = 0.72;
        this.isGrounded = true;

        this.facing = 'left';
        this.maxHp = 1000;
        this.hp = 1000;
        this.isAlive = true;

        this.state = 'idle';
        this.stateTimer = 0;
        this.aiTimer = 60;
        this.rangedCooldown = 120;
        this.knockbackTimer = 0;
        this.fadeAlpha = 1.0;
    }

    checkMeleeCollision(hitX, hitY, hitW, hitH) {
        return (
            hitX < this.worldX + this.renderWidth &&
            hitX + hitW > this.worldX &&
            hitY < this.y + this.renderHeight &&
            hitY + hitH > this.y
        );
    }

    receiveDamage(amount, knockDir = 1) {
        if (!this.isAlive) return;

        this.hp -= amount;
        this.game.audio.playSound('boss-hit');
        this.game.particles.addSparkles(this.worldX + this.renderWidth / 2, this.y + this.renderHeight / 2, '#a855f7', 10);
        this.game.triggerScreenShake(6, 8);

        this.game.updateBossHud(this.hp, this.maxHp);

        if (this.hp <= 0) {
            this.hp = 0;
            this.isAlive = false;
            this.state = 'defeated';
            this.game.audio.playSound('boss-defeat');
            this.game.addScore(1500);
            this.game.particles.addSparkles(this.worldX + this.renderWidth / 2, this.y + this.renderHeight / 2, '#f59e0b', 40, 10);
            this.game.onBossDefeated();
        } else {
            if (this.state !== 'punch') {
                this.state = 'hurt';
                this.stateTimer = 12;
            }
        }
    }

    update(dt) {
        if (!this.isAlive) {
            if (this.fadeAlpha > 0) this.fadeAlpha -= 0.015;
            return;
        }

        const hero = this.game.hero;
        const distToHero = (hero.worldX + hero.renderWidth / 2) - (this.worldX + this.renderWidth / 2);
        const absDist = Math.abs(distToHero);

        this.facing = distToHero > 0 ? 'right' : 'left';

        // Apply Boss Gravity
        this.vy += this.gravity * 60 * dt;
        this.y += this.vy * 60 * dt;

        if (this.y >= this.floorY - this.renderHeight + this.feetPad) {
            this.y = this.floorY - this.renderHeight + this.feetPad;
            this.vy = 0;
            this.isGrounded = true;
        }

        if (this.stateTimer > 0) {
            this.stateTimer--;
            if (this.stateTimer <= 0) {
                this.state = 'idle';
            }
        }

        if (this.rangedCooldown > 0) this.rangedCooldown--;

        // AI Decision Tree
        this.aiTimer--;
        if (this.aiTimer <= 0 && this.stateTimer <= 0) {
            this.aiTimer = Math.floor(Math.random() * 40 + 45);
            const isEnraged = this.hp < 500;

            if (absDist < 95) {
                // Melee strike
                this.state = 'punch';
                this.stateTimer = 30;
                this.game.audio.playSound('attack');
                if (hero.invincibleTimer <= 0) {
                    hero.takeDamage(1, this.facing === 'right' ? 1 : -1);
                }
            } else if (absDist > 280 && this.rangedCooldown <= 0) {
                // Ranged attack
                this.state = 'punch';
                this.stateTimer = 25;
                this.rangedCooldown = isEnraged ? 75 : 120;
                this.game.audio.playSound('web');

                const dir = this.facing === 'right' ? 1 : -1;
                const blastX = this.facing === 'right' ? this.worldX + this.renderWidth : this.worldX - 25;
                const blastY = this.y + 70;

                this.game.projectiles.push(new Projectile(this.game, blastX, blastY, dir * 10, 'boss'));
            } else {
                // Jump slam or pursue
                if (Math.random() < (isEnraged ? 0.6 : 0.4) && this.isGrounded) {
                    this.state = 'idle';
                    this.vy = -14;
                    this.isGrounded = false;
                    this.game.audio.playSound('jump');
                } else {
                    this.state = 'idle';
                }
            }
        }

        if (this.state === 'idle' || !this.isGrounded) {
            const moveSpeed = this.hp < 500 ? 3.2 : 2.2;
            if (absDist > 75) {
                this.worldX += (distToHero > 0 ? 1 : -1) * moveSpeed * 60 * dt;
            }
        }

        const sec = SECTION_CONFIG.bosswarbg;
        if (this.worldX < sec.playableLeft + 50) this.worldX = sec.playableLeft + 50;
        if (this.worldX > sec.playableRight - this.renderWidth - 50) this.worldX = sec.playableRight - this.renderWidth - 50;
    }

    draw(ctx, cameraX) {
        if (this.fadeAlpha <= 0) return;

        let spriteKey = 'bossIdle';
        if (!this.isAlive) spriteKey = 'bossDefeated';
        else if (this.state === 'punch') spriteKey = 'bossPunch';
        else if (this.state === 'hurt') spriteKey = 'bossHurt';

        const img = this.game.assets.getImage(spriteKey) || this.game.assets.getImage('bossPng') || this.game.assets.getImage('bossIdle');
        const drawX = Math.round(this.worldX - cameraX);
        const drawY = Math.round(this.y);

        ctx.save();
        ctx.globalAlpha = this.fadeAlpha;

        if (this.hp < 500 && this.isAlive) {
            ctx.shadowColor = '#c084fc';
            ctx.shadowBlur = 18;
        }

        if (this.facing === 'left') {
            ctx.scale(-1, 1);
            ctx.drawImage(img, -drawX - this.renderWidth, drawY, this.renderWidth, this.renderHeight);
        } else {
            ctx.drawImage(img, drawX, drawY, this.renderWidth, this.renderHeight);
        }

        ctx.restore();
    }
}

// --------------------------------------------------------------------------
// 9. PROJECTILES (HERO WEBS & BOSS BLASTS)
// --------------------------------------------------------------------------
class Projectile {
    constructor(game, x, y, vx, owner = 'hero') {
        this.game = game;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.owner = owner;
        this.radius = owner === 'hero' ? 8 : 12;
        this.active = true;
        this.life = 85;
    }

    update(dt) {
        this.x += this.vx * 60 * dt;
        this.life--;
        if (this.life <= 0) this.active = false;

        if (this.owner === 'hero') {
            for (const enemy of this.game.enemies) {
                if (enemy.isAlive &&
                    this.x > enemy.worldX && this.x < enemy.worldX + enemy.renderWidth &&
                    this.y > enemy.y && this.y < enemy.y + enemy.renderHeight) {
                    this.active = false;
                    enemy.receiveDamage(25, Math.sign(this.vx));
                    this.game.addScore(15);
                    this.game.particles.addDamageText(enemy.worldX + enemy.renderWidth / 2, enemy.y, '-25');
                    this.game.particles.addSparkles(this.x, this.y, '#38bdf8', 10);
                    return;
                }
            }

            const boss = this.game.boss;
            if (boss && boss.isAlive &&
                this.x > boss.worldX && this.x < boss.worldX + boss.renderWidth &&
                this.y > boss.y && this.y < boss.y + boss.renderHeight) {
                this.active = false;
                boss.receiveDamage(25, Math.sign(this.vx));
                this.game.addScore(20);
                this.game.particles.addDamageText(boss.worldX + boss.renderWidth / 2, boss.y, '-25');
                this.game.particles.addSparkles(this.x, this.y, '#a855f7', 10);
                return;
            }
        }

        if (this.owner === 'boss') {
            const hero = this.game.hero;
            if (hero.hearts > 0 && hero.invincibleTimer <= 0 &&
                this.x > hero.worldX && this.x < hero.worldX + hero.renderWidth &&
                this.y > hero.y && this.y < hero.y + hero.renderHeight) {
                this.active = false;
                hero.takeDamage(1, Math.sign(this.vx));
                this.game.particles.addSparkles(this.x, this.y, '#ef4444', 12);
            }
        }
    }

    draw(ctx, cameraX) {
        const drawX = this.x - cameraX;
        ctx.save();
        if (this.owner === 'hero') {
            ctx.fillStyle = '#38bdf8';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(drawX, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(drawX - this.vx * 1.5, this.y);
            ctx.lineTo(drawX, this.y);
            ctx.stroke();
        } else {
            ctx.fillStyle = '#c084fc';
            ctx.shadowColor = '#a855f7';
            ctx.shadowBlur = 14;
            ctx.beginPath();
            ctx.arc(drawX, this.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
}

// --------------------------------------------------------------------------
// 10. COLLECTIBLES & OBSTACLES
// --------------------------------------------------------------------------
class Collectible {
    constructor(game, x, y, type = 'coin') {
        this.game = game;
        this.x = x;
        this.y = y;
        this.type = type;
        this.collected = false;
        this.animTimer = Math.random() * Math.PI * 2;
    }

    update(dt) {
        this.animTimer += 0.08;

        const hero = this.game.hero;
        const dist = Math.hypot(
            (hero.worldX + hero.renderWidth / 2) - this.x,
            (hero.y + hero.renderHeight / 2) - this.y
        );

        if (dist < 42 && !this.collected) {
            this.collected = true;
            if (this.type === 'coin') {
                this.game.addScore(50);
                this.game.audio.playSound('coin');
                this.game.particles.addSparkles(this.x, this.y, '#facc15', 10);
                this.game.particles.addDamageText(this.x, this.y - 10, '+50', '#facc15');
            } else if (this.type === 'heart') {
                if (hero.hearts < hero.maxHearts) {
                    hero.hearts++;
                    this.game.updateHeartsDisplay();
                }
                this.game.audio.playSound('coin');
                this.game.particles.addSparkles(this.x, this.y, '#ef4444', 12);
                this.game.particles.addDamageText(this.x, this.y - 10, '+1 HP', '#34d399');
            }
        }
    }

    draw(ctx, cameraX) {
        if (this.collected) return;
        const drawX = this.x - cameraX;
        const bobY = this.y + Math.sin(this.animTimer) * 5;

        ctx.save();
        if (this.type === 'coin') {
            const scaleX = Math.cos(this.animTimer * 1.5);
            ctx.translate(drawX, bobY);
            ctx.scale(scaleX, 1);
            ctx.fillStyle = '#facc15';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(0, 0, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ca8a04';
            ctx.lineWidth = 2;
            ctx.stroke();
        } else {
            ctx.font = '20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 10;
            ctx.fillText('❤️', drawX, bobY);
        }
        ctx.restore();
    }
}

class Obstacle {
    constructor(game, cfg) {
        this.game = game;
        this.x = cfg.x;
        this.y = cfg.y;
        this.w = cfg.w;
        this.h = cfg.h;
        this.type = cfg.type; // 'steam_vent', 'electric_box', 'laser_trap'
        this.timer = 0;
        this.isActiveHazard = false;
    }

    update(dt) {
        this.timer += 0.04;
        // Periodic hazard activation cycle
        this.isActiveHazard = (Math.sin(this.timer) > 0.3);

        const hero = this.game.hero;
        if (this.isActiveHazard && hero.invincibleTimer <= 0) {
            const hx = hero.worldX + hero.renderWidth / 2;
            const hy = hero.y + hero.renderHeight / 2;
            if (hx > this.x && hx < this.x + this.w && hy > this.y - this.h && hy < this.y + 10) {
                hero.takeDamage(1, hx > this.x + this.w / 2 ? 1 : -1);
            }
        }
    }

    draw(ctx, cameraX) {
        const drawX = this.x - cameraX;
        if (drawX + this.w < 0 || drawX > 1280) return;

        ctx.save();
        if (this.type === 'steam_vent') {
            // Metallic vent base
            ctx.fillStyle = '#475569';
            ctx.fillRect(drawX, this.y - 12, this.w, 12);
            if (this.isActiveHazard) {
                // Steam plume
                ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.beginPath();
                ctx.arc(drawX + this.w / 2, this.y - 25, 14, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.type === 'electric_box') {
            // Electric generator box
            ctx.fillStyle = '#334155';
            ctx.fillRect(drawX, this.y - this.h, this.w, this.h);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(drawX + 4, this.y - this.h + 4, this.w - 8, 8);

            if (this.isActiveHazard) {
                // Electric sparks
                ctx.strokeStyle = '#38bdf8';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(drawX + 4, this.y - this.h - 10);
                ctx.lineTo(drawX + this.w / 2, this.y - this.h - 22);
                ctx.lineTo(drawX + this.w - 4, this.y - this.h - 10);
                ctx.stroke();
            }
        } else if (this.type === 'laser_trap') {
            // Cyber laser emitter
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(drawX, this.y - this.h, this.w, this.h);
            if (this.isActiveHazard) {
                // Vertical red laser beam
                ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 12;
                ctx.fillRect(drawX + this.w / 2 - 2, this.y - this.h - 60, 4, 60);
            }
        }
        ctx.restore();
    }
}

// --------------------------------------------------------------------------
// 11. LEVEL MANAGER (Sections, Platforms, Gaps)
// --------------------------------------------------------------------------
class LevelManager {
    constructor(game) {
        this.game = game;
    }

    getCurrentSection(worldX) {
        if (worldX < SECTION_CONFIG.war1bg.worldEnd) return SECTION_CONFIG.war1bg;
        if (worldX < SECTION_CONFIG.war2bg.worldEnd) return SECTION_CONFIG.war2bg;
        if (worldX < SECTION_CONFIG.war3bg.worldEnd) return SECTION_CONFIG.war3bg;
        return SECTION_CONFIG.bosswarbg;
    }

    isPositionInGap(worldX) {
        const sec = this.getCurrentSection(worldX);
        if (!sec.gaps) return false;
        for (const gap of sec.gaps) {
            if (worldX >= gap.start && worldX <= gap.end) return true;
        }
        return false;
    }

    getPlatformsNear(worldX) {
        const sec = this.getCurrentSection(worldX);
        return sec.floatingPlatforms || [];
    }

    getSafeRespawnX(worldX) {
        const sec = this.getCurrentSection(worldX);
        if (sec.gaps) {
            for (const gap of sec.gaps) {
                if (worldX >= gap.start - 50 && worldX <= gap.end + 50) {
                    return Math.max(sec.worldStart + 60, gap.start - 60);
                }
            }
        }
        return Math.max(sec.worldStart + 60, worldX - 100);
    }
}

// --------------------------------------------------------------------------
// 12. CAMERA SYSTEM
// --------------------------------------------------------------------------
class Camera {
    constructor(viewportWidth = 1280, viewportHeight = 720) {
        this.viewportWidth = viewportWidth;
        this.viewportHeight = viewportHeight;
        this.x = 0;
        this.targetX = 0;
    }

    update(heroWorldX, currentSection) {
        this.targetX = heroWorldX - this.viewportWidth * 0.38;
        this.x += (this.targetX - this.x) * 0.12;

        if (this.x < 0) this.x = 0;

        if (currentSection.id === 4) {
            const minArenaX = currentSection.playableLeft - 50;
            const maxArenaX = currentSection.playableRight - this.viewportWidth + 50;
            if (this.x < minArenaX) this.x = minArenaX;
            if (this.x > maxArenaX) this.x = maxArenaX;
        }
    }
}

// --------------------------------------------------------------------------
// 13. MAIN GAME ENGINE
// --------------------------------------------------------------------------
class GameEngine {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        this.assets = new AssetManager();
        this.audio = new AudioManager();
        this.input = new InputManager();
        this.particles = new ParticleSystem();
        this.level = new LevelManager(this);
        this.camera = new Camera(1280, 720);

        this.hero = new Hero(this);
        this.enemies = [];
        this.boss = null;
        this.projectiles = [];
        this.collectibles = [];
        this.obstacles = [];

        this.gameState = 'START';
        this.score = 0;
        this.distance = 0;
        this.currentZoneId = 1;

        this.screenShake = 0;
        this.screenShakeIntensity = 0;
        this.lastTime = 0;

        this.setupDOM();
    }

    setupDOM() {
        document.getElementById('btn-start-game').addEventListener('click', () => {
            this.audio.init();
            this.startGame();
        });

        document.getElementById('btn-how-to-play').addEventListener('click', () => {
            document.getElementById('screen-start').classList.add('hidden');
            document.getElementById('screen-howtoplay').classList.remove('hidden');
        });

        document.getElementById('btn-close-howtoplay').addEventListener('click', () => {
            document.getElementById('screen-howtoplay').classList.add('hidden');
            document.getElementById('screen-start').classList.remove('hidden');
        });

        const updateSoundLabels = (enabled) => {
            const label = enabled ? 'ON' : 'OFF';
            const icon = enabled ? '🔊' : '🔇';
            document.getElementById('sound-state-label').textContent = label;
            document.getElementById('pause-sound-label').textContent = label;
            document.getElementById('btn-audio-toggle').textContent = icon;
        };

        document.getElementById('btn-sound-setting').addEventListener('click', () => {
            const enabled = this.audio.toggleSound();
            updateSoundLabels(enabled);
        });

        document.getElementById('btn-pause-sound').addEventListener('click', () => {
            const enabled = this.audio.toggleSound();
            updateSoundLabels(enabled);
        });

        document.getElementById('btn-audio-toggle').addEventListener('click', () => {
            const enabled = this.audio.toggleSound();
            updateSoundLabels(enabled);
        });

        document.getElementById('btn-pause').addEventListener('click', () => this.togglePause());
        document.getElementById('btn-resume').addEventListener('click', () => this.togglePause());

        document.getElementById('btn-restart').addEventListener('click', () => {
            document.getElementById('screen-pause').classList.add('hidden');
            this.startGame();
        });

        document.getElementById('btn-retry').addEventListener('click', () => {
            document.getElementById('screen-gameover').classList.add('hidden');
            this.startGame();
        });

        document.getElementById('btn-play-again').addEventListener('click', () => {
            document.getElementById('screen-victory').classList.add('hidden');
            this.startGame();
        });

        const returnToMenu = () => {
            document.getElementById('screen-pause').classList.add('hidden');
            document.getElementById('screen-gameover').classList.add('hidden');
            document.getElementById('screen-victory').classList.add('hidden');
            document.getElementById('screen-start').classList.remove('hidden');
            this.gameState = 'START';
            this.audio.stopMusic();
        };

        document.getElementById('btn-gameover-menu').addEventListener('click', returnToMenu);
        document.getElementById('btn-victory-menu').addEventListener('click', returnToMenu);
    }

    init() {
        this.assets.loadAll(
            (loaded, total) => {},
            () => {
                console.log('All Web Shadow assets loaded.');
                requestAnimationFrame(t => this.gameLoop(t));
            }
        );
    }

    startGame() {
        this.gameState = 'PLAYING';
        this.score = 0;
        this.distance = 0;
        this.currentZoneId = 1;

        document.getElementById('screen-start').classList.add('hidden');
        document.getElementById('screen-pause').classList.add('hidden');
        document.getElementById('screen-gameover').classList.add('hidden');
        document.getElementById('screen-victory').classList.add('hidden');
        document.getElementById('boss-hud-overlay').classList.add('hidden');

        this.hero.reset(120, SECTION_CONFIG.war1bg.playerStartY);
        this.camera.x = 0;
        this.particles.clear();
        this.projectiles = [];

        this.buildLevelEntities();
        this.updateHUD();
        this.audio.playMusic(SECTION_CONFIG.war1bg.musicKey);
    }

    buildLevelEntities() {
        this.enemies = [];
        this.collectibles = [];
        this.obstacles = [];
        this.boss = null;

        for (const [key, sec] of Object.entries(SECTION_CONFIG)) {
            if (sec.coins) {
                sec.coins.forEach(cx => {
                    this.collectibles.push(new Collectible(this, cx, sec.floorY - 60, 'coin'));
                });
            }
            if (sec.hearts) {
                sec.hearts.forEach(hx => {
                    this.collectibles.push(new Collectible(this, hx, sec.floorY - 60, 'heart'));
                });
            }
            if (sec.obstacles) {
                sec.obstacles.forEach(cfg => {
                    this.obstacles.push(new Obstacle(this, cfg));
                });
            }
            if (sec.enemies) {
                sec.enemies.forEach(cfg => {
                    this.enemies.push(new Enemy(this, cfg, sec.floorY));
                });
            }
        }

        this.boss = new Boss(this, SECTION_CONFIG.bosswarbg.floorY);
    }

    togglePause() {
        if (this.gameState === 'PLAYING') {
            this.gameState = 'PAUSED';
            document.getElementById('screen-pause').classList.remove('hidden');
            this.audio.stopMusic();
        } else if (this.gameState === 'PAUSED') {
            this.gameState = 'PLAYING';
            document.getElementById('screen-pause').classList.add('hidden');
            const sec = this.level.getCurrentSection(this.hero.worldX);
            this.audio.playMusic(sec.musicKey);
        }
    }

    triggerScreenShake(duration = 10, intensity = 8) {
        this.screenShake = duration;
        this.screenShakeIntensity = intensity;
    }

    addScore(pts) {
        this.score += pts;
        this.updateHUD();
    }

    updateHeartsDisplay() {
        const heartsContainer = document.getElementById('hearts-container');
        const heartSpans = heartsContainer.querySelectorAll('.heart');
        heartSpans.forEach((span, i) => {
            if (i < this.hero.hearts) {
                span.classList.remove('empty');
            } else {
                span.classList.add('empty');
            }
        });
    }

    updateBossHud(hp, maxHp) {
        const fill = document.getElementById('boss-hp-fill');
        const text = document.getElementById('boss-hp-text');
        const ratio = Math.max(0, hp / maxHp);
        fill.style.width = `${ratio * 100}%`;
        text.textContent = `${Math.max(0, hp)} / ${maxHp}`;
    }

    updateHUD() {
        this.updateHeartsDisplay();

        const webRatio = this.hero.webAmmo / this.hero.maxWeb;
        document.getElementById('web-ammo-bar').style.width = `${webRatio * 100}%`;

        document.getElementById('score-display').textContent = String(this.score).padStart(6, '0');
        this.distance = Math.max(0, Math.floor(this.hero.worldX));
        document.getElementById('distance-display').textContent = `${this.distance}m`;

        const currentSec = this.level.getCurrentSection(this.hero.worldX);
        document.getElementById('section-badge').textContent = currentSec.name;
        document.getElementById('section-subtitle').textContent = currentSec.subtitle;

        if (currentSec.id === 4) {
            document.getElementById('boss-hud-overlay').classList.remove('hidden');
        } else {
            document.getElementById('boss-hud-overlay').classList.add('hidden');
        }

        if (currentSec.id !== this.currentZoneId) {
            this.currentZoneId = currentSec.id;
            this.audio.playMusic(currentSec.musicKey);
            this.triggerScreenShake(8, 4);
        }
    }

    onHeroDeath() {
        this.gameState = 'GAMEOVER';
        this.audio.stopMusic();
        this.audio.playSound('game-over');

        document.getElementById('gameover-score').textContent = String(this.score).padStart(6, '0');
        document.getElementById('gameover-distance').textContent = `${this.distance}m`;
        const currentSec = this.level.getCurrentSection(this.hero.worldX);
        document.getElementById('gameover-zone').textContent = currentSec.name;
        document.getElementById('screen-gameover').classList.remove('hidden');
    }

    onBossDefeated() {
        setTimeout(() => {
            this.gameState = 'VICTORY';
            this.audio.stopMusic();
            this.audio.playSound('victory');

            document.getElementById('victory-score').textContent = String(this.score).padStart(6, '0');
            document.getElementById('victory-distance').textContent = `${this.distance}m`;
            document.getElementById('screen-victory').classList.remove('hidden');
        }, 1200);
    }

    update(dt) {
        if (this.gameState !== 'PLAYING') return;

        this.hero.update(dt);

        const currentSec = this.level.getCurrentSection(this.hero.worldX);
        this.camera.update(this.hero.worldX, currentSec);

        for (const obstacle of this.obstacles) {
            obstacle.update(dt);
        }

        for (const enemy of this.enemies) {
            enemy.update(dt);
        }

        if (this.boss) {
            this.boss.update(dt);
        }

        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.update(dt);
            if (!p.active) {
                this.projectiles.splice(i, 1);
            }
        }

        for (const item of this.collectibles) {
            item.update(dt);
        }

        this.particles.update(dt);

        if (this.screenShake > 0) this.screenShake--;

        this.updateHUD();
    }

    draw() {
        this.ctx.clearRect(0, 0, 1280, 720);

        this.ctx.save();

        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShakeIntensity;
            const shakeY = (Math.random() - 0.5) * this.screenShakeIntensity;
            this.ctx.translate(shakeX, shakeY);
        }

        const cameraX = this.camera.x;

        // 1. Draw Section Backgrounds
        this.drawBackgrounds(cameraX);

        // 2. Draw Obstacles & Hazards
        for (const obstacle of this.obstacles) {
            obstacle.draw(this.ctx, cameraX);
        }

        // 3. Draw Rooftop Gaps & Floating Platforms
        this.drawLevelPlatforms(cameraX);

        // 4. Draw Collectibles
        for (const item of this.collectibles) {
            item.draw(this.ctx, cameraX);
        }

        // 5. Draw Projectiles
        for (const p of this.projectiles) {
            p.draw(this.ctx, cameraX);
        }

        // 6. Draw Enemies
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx, cameraX);
        }

        // 7. Draw Boss
        if (this.boss) {
            this.boss.draw(this.ctx, cameraX);
        }

        // 8. Draw Hero
        this.hero.draw(this.ctx, cameraX);

        // 9. Draw Particles & Damage Numbers
        this.particles.draw(this.ctx, cameraX);

        this.ctx.restore();
    }

    drawBackgrounds(cameraX) {
        for (const [key, sec] of Object.entries(SECTION_CONFIG)) {
            const secStart = sec.worldStart;
            const secEnd = sec.worldEnd;

            if (secEnd < cameraX || secStart > cameraX + 1280) continue;

            const bgImg = this.assets.getImage(sec.bgKey);
            if (bgImg && bgImg.complete && bgImg.naturalWidth > 0) {
                const bgW = 720 * (bgImg.naturalWidth / bgImg.naturalHeight);
                const sectionLength = secEnd - secStart;
                const tilesNeeded = Math.ceil(sectionLength / bgW) + 1;

                for (let t = 0; t < tilesNeeded; t++) {
                    const tileX = secStart + t * bgW - cameraX;
                    if (tileX + bgW > 0 && tileX < 1280) {
                        this.ctx.drawImage(bgImg, Math.round(tileX), 0, Math.round(bgW), 720);
                    }
                }
            } else {
                const grad = this.ctx.createLinearGradient(0, 0, 0, 720);
                grad.addColorStop(0, '#0a0d1a');
                grad.addColorStop(1, '#1e293b');
                this.ctx.fillStyle = grad;
                this.ctx.fillRect(secStart - cameraX, 0, secEnd - secStart, 720);
            }
        }
    }

    drawLevelPlatforms(cameraX) {
        for (const [key, sec] of Object.entries(SECTION_CONFIG)) {
            if (sec.worldEnd < cameraX || sec.worldStart > cameraX + 1280) continue;

            // Draw deep drop shadow and warning stripes for rooftop gaps
            if (sec.gaps) {
                for (const gap of sec.gaps) {
                    const gapDrawX = gap.start - cameraX;
                    const gapW = gap.end - gap.start;

                    const shadowGrad = this.ctx.createLinearGradient(0, sec.floorY, 0, 720);
                    shadowGrad.addColorStop(0, 'rgba(0,0,0,0.85)');
                    shadowGrad.addColorStop(1, 'rgba(0,0,0,1)');
                    this.ctx.fillStyle = shadowGrad;
                    this.ctx.fillRect(gapDrawX, sec.floorY + 8, gapW, 720 - sec.floorY);

                    this.ctx.fillStyle = '#f59e0b';
                    this.ctx.fillRect(gapDrawX - 12, sec.floorY - 2, 12, 6);
                    this.ctx.fillRect(gapDrawX + gapW, sec.floorY - 2, 12, 6);
                }
            }

            // Draw floating cyber platforms
            if (sec.floatingPlatforms) {
                for (const plat of sec.floatingPlatforms) {
                    const platX = plat.x - cameraX;
                    if (platX + plat.w < 0 || platX > 1280) continue;

                    this.ctx.fillStyle = '#1e293b';
                    this.ctx.fillRect(platX, plat.y, plat.w, plat.h);

                    this.ctx.fillStyle = '#38bdf8';
                    this.ctx.shadowColor = '#38bdf8';
                    this.ctx.shadowBlur = 6;
                    this.ctx.fillRect(platX, plat.y, plat.w, 4);
                    this.ctx.shadowBlur = 0;

                    this.ctx.strokeStyle = '#475569';
                    this.ctx.lineWidth = 2;
                    this.ctx.strokeRect(platX, plat.y, plat.w, plat.h);
                }
            }
        }
    }

    gameLoop(time) {
        if (!this.lastTime) this.lastTime = time;
        const dt = Math.min(1 / 30, (time - this.lastTime) / 1000);
        this.lastTime = time;

        this.update(dt);
        this.draw();

        requestAnimationFrame(t => this.gameLoop(t));
    }
}

// --------------------------------------------------------------------------
// 14. BOOTSTRAP
// --------------------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
    const game = new GameEngine();
    game.init();
});
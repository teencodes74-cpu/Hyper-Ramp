import { PhysicsWorld } from './physics.js';
import { Camera } from './camera.js';
import { InputHandler } from './input.js';
import { Car } from '../vehicles/car.js';

const { Events, Body, Composite } = Matter;

export class GameEngine {
  constructor(canvas, levelLoader, saveSystem, hud) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.loader = levelLoader;
    this.save = saveSystem;
    this.hud = hud;
    this.physics = new PhysicsWorld();
    this.camera = new Camera(canvas);
    this.input = new InputHandler();
    this.level = 1;
    this.running = false;
    this.attemptStart = 0;
    this.dynamicBodies = [];
    this.sfx = createAudio();

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyR') this.restartLevel();
    });
  }

  startLevel(levelNumber) {
    this.level = levelNumber;
    this.save.recordAttempt(levelNumber);
    this.buildLevel(this.loader.getLevel(levelNumber));
    this.running = true;
    this.attemptStart = performance.now();
    this.loop();
  }

  restartLevel() {
    this.startLevel(this.level);
  }

  buildLevel(level) {
    this.currentLevel = level;
    this.physics.reset();
    this.dynamicBodies = [];

    const ground = this.physics.rectangle(0, 760, 10000, 120, { isStatic: true, friction: 0.9 });
    this.physics.addBody(ground);

    level.objects.forEach((o) => {
      const body = this.physics.rectangle(o.x, o.y, o.width, o.height, {
        isStatic: !o.moving && !o.rotating,
        angle: o.angle || 0,
        friction: 0.95,
        label: o.type
      });
      if (o.moving || o.rotating) {
        body.plugin = { baseX: o.x, baseY: o.y, phase: Math.random() * Math.PI * 2, moving: o.moving, rotating: o.rotating };
        this.dynamicBodies.push(body);
      }
      this.physics.addBody(body);
    });

    this.finish = this.physics.rectangle(level.finish.x, level.finish.y, level.finish.width, level.finish.height, {
      isStatic: true,
      isSensor: true,
      label: 'finish'
    });
    this.physics.addBody(this.finish);

    this.car = new Car(this.physics, level.start.x, level.start.y, this.save.data.selectedVehicle);

    Events.off(this.physics.engine, 'collisionStart');
    Events.on(this.physics.engine, 'collisionStart', (e) => {
      e.pairs.forEach(({ bodyA, bodyB }) => {
        const labels = [bodyA.label, bodyB.label];
        if (labels.includes('finish') && this.car.bodies.includes(bodyA) || labels.includes('finish') && this.car.bodies.includes(bodyB)) {
          this.completeLevel();
        }
      });
    });
  }

  completeLevel() {
    if (!this.running) return;
    const time = (performance.now() - this.attemptStart) / 1000;
    const stars = this.car.crashed ? 1 : time <= this.currentLevel.timeLimit ? 3 : 2;
    this.save.recordWin(this.level, stars, time);
    this.sfx.levelComplete();
    this.running = false;
    setTimeout(() => this.startLevel(this.level + 1), 500);
  }

  update(dt) {
    if (!this.running) return;
    this.dynamicBodies.forEach((body) => {
      if (body.plugin.moving) {
        Body.setPosition(body, {
          x: body.plugin.baseX + Math.sin(performance.now() * 0.001 + body.plugin.phase) * 120,
          y: body.plugin.baseY
        });
      }
      if (body.plugin.rotating) {
        Body.setAngle(body, Math.sin(performance.now() * 0.0015 + body.plugin.phase) * 0.8);
      }
    });

    this.car.update(this.input);
    if (this.input.isPressed('ArrowUp') || this.input.isPressed('ArrowDown')) this.sfx.engine();

    if (this.car.crashed) {
      this.sfx.crash();
      this.running = false;
      setTimeout(() => this.restartLevel(), 800);
    }

    this.camera.follow(this.car.chassis);

    const time = (performance.now() - this.attemptStart) / 1000;
    this.hud.update({
      level: this.level,
      time,
      attempts: this.save.data.attempts[this.level],
      vehicle: this.car.cfg.name
    });
  }

  drawBody(body) {
    const vertices = body.vertices;
    this.ctx.beginPath();
    this.ctx.moveTo(vertices[0].x, vertices[0].y);
    for (let i = 1; i < vertices.length; i += 1) this.ctx.lineTo(vertices[i].x, vertices[i].y);
    this.ctx.closePath();
    this.ctx.fillStyle = body.isSensor ? '#f59e0b' : '#334155';
    this.ctx.fill();
  }

  draw() {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.camera.apply(ctx);
    Composite.allBodies(this.physics.engine.world).forEach((body) => this.drawBody(body));
    this.camera.reset(ctx);
  }

  loop() {
    if (!this.running && !this.car) return;
    const frame = () => {
      this.update(1 / 60);
      this.draw();
      if (this.running) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

function createAudio() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  let cooldown = 0;
  const blip = (freq, type = 'sine', duration = 0.05, gain = 0.03) => {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.value = gain;
    osc.connect(amp).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  };
  return {
    engine: () => {
      if (performance.now() < cooldown) return;
      cooldown = performance.now() + 70;
      blip(90 + Math.random() * 20, 'sawtooth', 0.03, 0.01);
    },
    crash: () => blip(50, 'square', 0.2, 0.06),
    jump: () => blip(300, 'triangle', 0.1, 0.03),
    levelComplete: () => {
      blip(520, 'sine', 0.06, 0.04);
      setTimeout(() => blip(700, 'sine', 0.09, 0.04), 70);
    }
  };
}

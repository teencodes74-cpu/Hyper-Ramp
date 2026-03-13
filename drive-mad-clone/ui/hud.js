export class Hud {
  constructor(onRestart, onMenu) {
    this.root = document.getElementById('hud');
    this.level = document.getElementById('hudLevel');
    this.timer = document.getElementById('hudTimer');
    this.attempts = document.getElementById('hudAttempts');
    this.vehicle = document.getElementById('hudVehicle');
    document.getElementById('restartBtn').onclick = onRestart;
    document.getElementById('backToMenuBtn').onclick = onMenu;
  }

  update({ level, time, attempts, vehicle }) {
    this.level.textContent = String(level);
    this.timer.textContent = time.toFixed(2);
    this.attempts.textContent = String(attempts || 0);
    this.vehicle.textContent = vehicle;
  }

  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }
}

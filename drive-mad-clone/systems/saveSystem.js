const KEY = 'drive-mad-clone-save-v1';

export const defaultSave = {
  unlockedLevel: 1,
  stars: {},
  bestTimes: {},
  attempts: {},
  customLevels: [],
  selectedVehicle: 'starter'
};

export class SaveSystem {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      return { ...defaultSave, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
    } catch {
      return structuredClone(defaultSave);
    }
  }

  persist() {
    localStorage.setItem(KEY, JSON.stringify(this.data));
  }

  reset() {
    this.data = structuredClone(defaultSave);
    this.persist();
  }

  recordAttempt(level) {
    this.data.attempts[level] = (this.data.attempts[level] || 0) + 1;
    this.persist();
  }

  recordWin(level, stars, time) {
    this.data.unlockedLevel = Math.max(this.data.unlockedLevel, level + 1);
    this.data.stars[level] = Math.max(this.data.stars[level] || 0, stars);
    if (!this.data.bestTimes[level] || time < this.data.bestTimes[level]) {
      this.data.bestTimes[level] = time;
    }
    const tier = Math.floor((level - 1) / 100);
    const vehicles = ['starter', 'monster', 'buggy', 'racer'];
    this.data.selectedVehicle = vehicles[Math.min(tier, vehicles.length - 1)];
    this.persist();
  }

  addCustomLevel(level) {
    this.data.customLevels.push(level);
    this.persist();
  }
}

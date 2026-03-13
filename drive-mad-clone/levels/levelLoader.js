import { generateProceduralLevel } from './levelGenerator.js';

export class LevelLoader {
  constructor(levels) {
    this.levels = levels;
  }

  getLevel(index) {
    if (index <= this.levels.length) return this.levels[index - 1];
    return generateProceduralLevel(index, Math.ceil(index / 50));
  }

  get count() {
    return this.levels.length;
  }
}

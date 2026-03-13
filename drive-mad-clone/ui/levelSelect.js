export class LevelSelect {
  constructor(onChoose, onBack) {
    this.root = document.getElementById('levelSelectScreen');
    this.grid = document.getElementById('levelGrid');
    document.getElementById('closeLevelSelect').onclick = onBack;
    this.onChoose = onChoose;
  }

  render(total, unlocked, stars) {
    this.grid.innerHTML = '';
    for (let i = 1; i <= total; i += 1) {
      const cell = document.createElement('button');
      const rating = stars[i] || 0;
      cell.className = `level-cell ${i > unlocked ? 'locked' : ''}`;
      cell.innerHTML = `<div>${i}</div><div class="star-row">${'★'.repeat(rating)}${'☆'.repeat(3 - rating)}</div>`;
      cell.onclick = () => this.onChoose(i);
      this.grid.appendChild(cell);
    }
  }

  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }
}

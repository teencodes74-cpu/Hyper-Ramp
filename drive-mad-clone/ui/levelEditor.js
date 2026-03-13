export class LevelEditor {
  constructor(saveSystem, canvas) {
    this.root = document.getElementById('levelEditorScreen');
    this.tool = document.getElementById('editorTool');
    this.objects = [];
    this.saveSystem = saveSystem;

    canvas.addEventListener('click', (e) => {
      if (this.root.classList.contains('hidden')) return;
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (canvas.width / rect.width);
      const y = (e.clientY - rect.top) * (canvas.height / rect.height);
      this.addObject(x, y);
    });

    document.getElementById('editorSaveBtn').onclick = () => this.save();
    document.getElementById('editorExportBtn').onclick = () => this.export();
    document.getElementById('editorClearBtn').onclick = () => { this.objects = []; };
  }

  addObject(x, y) {
    const map = {
      ramp: { width: 220, height: 30, angle: -0.25 },
      platform: { width: 240, height: 28, angle: 0 },
      obstacle: { width: 50, height: 90, angle: 0 }
    };
    this.objects.push({ type: this.tool.value, x, y, ...map[this.tool.value] });
  }

  save() {
    const level = this.getLevel();
    this.saveSystem.addCustomLevel(level);
    alert('Custom level saved.');
  }

  export() {
    const blob = new Blob([JSON.stringify(this.getLevel(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'custom-level.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  getLevel() {
    return {
      id: `custom-${Date.now()}`,
      name: 'Custom Level',
      start: { x: 150, y: 520 },
      finish: { x: 2200, y: 500, width: 50, height: 160 },
      objects: this.objects,
      timeLimit: 90
    };
  }

  show() { this.root.classList.remove('hidden'); }
  hide() { this.root.classList.add('hidden'); }
}

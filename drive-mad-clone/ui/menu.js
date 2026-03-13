export class MenuUI {
  constructor(onAction) {
    this.menu = document.getElementById('menuScreen');
    document.getElementById('playBtn').onclick = () => onAction('play');
    document.getElementById('levelSelectBtn').onclick = () => onAction('select');
    document.getElementById('levelEditorBtn').onclick = () => onAction('editor');
    document.getElementById('resetProgressBtn').onclick = () => onAction('reset');
  }

  show() { this.menu.classList.remove('hidden'); this.menu.classList.add('visible'); }
  hide() { this.menu.classList.add('hidden'); this.menu.classList.remove('visible'); }
}

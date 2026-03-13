import { LevelLoader } from './levels/levelLoader.js';
import { SaveSystem } from './systems/saveSystem.js';
import { MenuUI } from './ui/menu.js';
import { Hud } from './ui/hud.js';
import { LevelSelect } from './ui/levelSelect.js';
import { LevelEditor } from './ui/levelEditor.js';
import { GameEngine } from './engine/gameEngine.js';

const levels = await fetch('./levels/levels.json').then((r) => r.json());
const save = new SaveSystem();
const loader = new LevelLoader([...levels, ...save.data.customLevels]);
const canvas = document.getElementById('gameCanvas');

const hud = new Hud(() => engine.restartLevel(), () => showMenu());
const engine = new GameEngine(canvas, loader, save, hud);
const menu = new MenuUI(handleMenuAction);
const selector = new LevelSelect((level) => {
  if (level <= save.data.unlockedLevel) startGame(level);
}, showMenu);
const editor = new LevelEditor(save, canvas);

function handleMenuAction(action) {
  if (action === 'play') startGame(save.data.unlockedLevel);
  if (action === 'select') {
    selector.render(loader.count, save.data.unlockedLevel, save.data.stars);
    menu.hide();
    selector.show();
  }
  if (action === 'editor') {
    menu.hide();
    editor.show();
  }
  if (action === 'reset') {
    if (confirm('Reset all progress?')) {
      save.reset();
      location.reload();
    }
  }
}

document.getElementById('closeEditorBtn').onclick = showMenu;

function startGame(level) {
  menu.hide();
  selector.hide();
  editor.hide();
  hud.show();
  engine.startLevel(level);
}

function showMenu() {
  hud.hide();
  selector.hide();
  editor.hide();
  menu.show();
}

showMenu();

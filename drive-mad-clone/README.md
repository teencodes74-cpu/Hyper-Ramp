# Drive Mad Clone (Browser Physics Driving Game)

A modular, production-ready browser game inspired by Drive Mad, built using HTML5, CSS3, ES6 modules, Matter.js, and Canvas.

## Features
- 500 handcrafted/generated campaign levels in `levels/levels.json`
- Procedural level generation for infinite extra levels
- Physics-based driving with suspension, torque, gravity, momentum, crash and collision detection
- Multiple vehicles with stat differences and unlock progression every 100 levels
- Level editor with save + JSON export
- Main menu, HUD, level select (locked levels + stars)
- Persistent progress using LocalStorage (unlocked level, stars, best times, attempts, custom levels)
- Static hosting friendly (all relative paths, no backend)

## Controls
- `↑` accelerate
- `↓` reverse
- `←` tilt left
- `→` tilt right
- `R` restart level

## Run Locally
Open `index.html` directly, or serve the folder with a static web server:

```bash
cd drive-mad-clone
python -m http.server 8080
```

Then open `http://localhost:8080`.

## GitHub Pages Deployment
1. Upload this project to a GitHub repository.
2. Go to **Repository Settings → Pages**.
3. Set source to **Deploy from a branch**.
4. Choose branch **main** and folder **/ (root)**.
5. Save and open the provided GitHub Pages URL.

Because this project uses only static assets and relative paths, it runs on GitHub Pages with no changes.

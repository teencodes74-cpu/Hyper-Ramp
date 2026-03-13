export class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = 0;
    this.y = 0;
    this.zoom = 1;
  }

  follow(target) {
    this.x += (target.position.x - this.canvas.width * 0.35 - this.x) * 0.08;
    this.y += (target.position.y - this.canvas.height * 0.65 - this.y) * 0.08;
  }

  apply(ctx) {
    ctx.setTransform(this.zoom, 0, 0, this.zoom, -this.x * this.zoom, -this.y * this.zoom);
  }

  reset(ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

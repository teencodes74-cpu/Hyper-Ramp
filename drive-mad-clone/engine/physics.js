const { Engine, Runner, World, Bodies, Body, Constraint, Composite } = Matter;

export class PhysicsWorld {
  constructor() {
    this.engine = Engine.create({ gravity: { x: 0, y: 1 } });
    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
  }

  reset() {
    Composite.clear(this.engine.world, false);
    this.engine.gravity.y = 1;
  }

  addBody(body) {
    World.add(this.engine.world, body);
    return body;
  }

  addBodies(bodies) {
    World.add(this.engine.world, bodies);
    return bodies;
  }

  rectangle(x, y, w, h, options = {}) {
    return Bodies.rectangle(x, y, w, h, options);
  }

  circle(x, y, r, options = {}) {
    return Bodies.circle(x, y, r, options);
  }

  constraint(options) {
    return Constraint.create(options);
  }

  setVelocity(body, velocity) {
    Body.setVelocity(body, velocity);
  }
}

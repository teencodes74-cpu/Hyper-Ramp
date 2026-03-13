const { Body, Composite, Events } = Matter;

export const VEHICLE_TYPES = {
  starter: { name: 'Starter Car', torque: 0.00085, maxSpeed: 14, suspension: 0.6, stability: 0.004 },
  monster: { name: 'Monster Truck', torque: 0.0012, maxSpeed: 12, suspension: 0.9, stability: 0.005 },
  buggy: { name: 'Offroad Buggy', torque: 0.001, maxSpeed: 16, suspension: 0.7, stability: 0.006 },
  racer: { name: 'Speed Racer', torque: 0.0014, maxSpeed: 20, suspension: 0.45, stability: 0.003 }
};

export class Car {
  constructor(physics, x, y, type = 'starter') {
    this.physics = physics;
    this.cfg = VEHICLE_TYPES[type] || VEHICLE_TYPES.starter;
    this.crashed = false;
    this.chassis = physics.rectangle(x, y, 130, 32, { density: 0.002, friction: 0.7, restitution: 0.05 });
    this.wheelA = physics.circle(x - 45, y + 25, 22, { density: 0.0025, friction: 1.2 });
    this.wheelB = physics.circle(x + 45, y + 25, 22, { density: 0.0025, friction: 1.2 });
    this.axleA = physics.constraint({ bodyA: this.chassis, bodyB: this.wheelA, length: 25, stiffness: this.cfg.suspension });
    this.axleB = physics.constraint({ bodyA: this.chassis, bodyB: this.wheelB, length: 25, stiffness: this.cfg.suspension });
    physics.addBodies([this.chassis, this.wheelA, this.wheelB, this.axleA, this.axleB]);
  }

  update(input) {
    const torque = this.cfg.torque;
    const left = input.isPressed('ArrowLeft');
    const right = input.isPressed('ArrowRight');
    const up = input.isPressed('ArrowUp');
    const down = input.isPressed('ArrowDown');

    if (up) {
      Body.setAngularVelocity(this.wheelA, Math.min(this.cfg.maxSpeed, this.wheelA.angularVelocity + torque * 1000));
      Body.setAngularVelocity(this.wheelB, Math.min(this.cfg.maxSpeed, this.wheelB.angularVelocity + torque * 1000));
    }
    if (down) {
      Body.setAngularVelocity(this.wheelA, Math.max(-this.cfg.maxSpeed, this.wheelA.angularVelocity - torque * 1000));
      Body.setAngularVelocity(this.wheelB, Math.max(-this.cfg.maxSpeed, this.wheelB.angularVelocity - torque * 1000));
    }

    if (left) Body.applyForce(this.chassis, this.chassis.position, { x: 0, y: -this.cfg.stability });
    if (right) Body.applyForce(this.chassis, this.chassis.position, { x: 0, y: this.cfg.stability });

    this.crashed = Math.abs(this.chassis.angle) > 1.8 || this.chassis.position.y > 2500;
  }

  get bodies() {
    return [this.chassis, this.wheelA, this.wheelB];
  }
}

import { Vector2, VectorMath2 } from "./Vector2.js";

export class Rectangle {
    constructor(length, width, mass, pos, vel, angle = 0, angularVel = 0) {
        this.length = length;
        this.width = width;
        this.mass = mass;
        this.massInv = 1 / mass;
        this.pos = pos;
        this.vel = vel;
        this.angle = angle;
        this.angularVel = angularVel;
        this.inertia = (1 / 12) * mass * (length ** 2) + (1 / 12) * mass * (width ** 2);
        this.inertiaInv = 1 / this.inertia;
        this.vertices = this.getVertices();
    }

    simulate(dt, gravity) {
        this.vel.add(gravity, dt);
        this.pos.add(this.vel, dt);
        this.angle += this.angularVel * dt;
        this.vertices = this.getVertices();
    }

    getVertices() {
        var half = this.size / 2;
        var cosA = Math.cos(this.angle);
        var sinA = Math.sin(this.angle);

        return [
            new Vector2(this.pos.x + half * cosA - half * sinA, this.pos.y + half * sinA + half * cosA),
            new Vector2(this.pos.x - half * cosA - half * sinA, this.pos.y + half * sinA - half * cosA),
            new Vector2(this.pos.x - half * cosA + half * sinA, this.pos.y - half * sinA - half * cosA),
            new Vector2(this.pos.x + half * cosA + half * sinA, this.pos.y - half * sinA + half * cosA)
        ];
        //counter-clockwise
    }

    getAxes() {
        var axes = [];
        for (let i = 0; i < 4; i++) {
            let edge = this.corners[(i + 1) % 4].subtract(this.corners[i]);
            axes.push(edge.perpendicular().times(1 / edge.length()));
        }
        //axis vectors point inward
        return axes;
    }

    
}

export class Circle {

}
import { Vector2, VectorMath2 } from "./Vector2.js";

export class Rectangle {
    constructor(
        length,
        width,
        resistitution = 0,
        mass = null,
        pos = VectorMath2.zero(),
        vel = VectorMath2.zero(),
        angle = 0,
        angularVel = 0,
        colour = "#00FF00"
    ) {
        this.type = "rectangle";

        this.length = length;
        this.width = width;
        if(resistitution === undefined || resistitution === null)
            this.resistitution = resistitution;

        if(mass === undefined || mass === null)
            this.mass = length * width;
        this.massInv = 1 / mass;
        this.inertia = (1 / 12) * mass * (length ** 2) + (1 / 12) * mass * (width ** 2);
        this.inertiaInv = 1 / this.inertia;

        this.pos = pos;
        this.vel = vel;
        this.angle = angle;
        this.angularVel = angularVel;

        this.vertices = this.getVertices();
        this.colour=colour;
    }

    setStatic() {
        this.mass = Infinity;
        this.inertia = Infinity;
        this.massInv = 0;
        this.inertiaInv = 0;
    }

    /**
     * @param {number} dt
     * @param {Vector2} gravity
     */
    simulate(dt, gravity) {
        this.vel.add(gravity.times(dt));
        this.pos.add(this.vel.times(dt));
        this.angle += this.angularVel * dt;
        this.vertices = this.getVertices();
    }

    getVertices() {
        var halfWidth = this.width / 2;
        var halfLength = this.length / 2;
        var cosA = Math.cos(this.angle);
        var sinA = Math.sin(this.angle);

        return [
            new Vector2(
                this.pos.x + halfWidth * cosA - halfLength * sinA,
                this.pos.y + halfWidth * sinA + halfLength * cosA
            ),//Top-Right
            new Vector2(
                this.pos.x - halfWidth * cosA - halfLength * sinA,
                this.pos.y + halfWidth * sinA - halfLength * cosA
            ),//Top-Left
            new Vector2(
                this.pos.x - halfWidth * cosA + halfLength * sinA, 
                this.pos.y - halfWidth * sinA - halfLength * cosA
            ),//Bottom-Left
            new Vector2(
                this.pos.x + halfWidth * cosA + halfLength * sinA, 
                this.pos.y - halfWidth * sinA + halfLength * cosA
            )//Bottom-Right
        ];
        //counter-clockwise
    }
}

export class Circle {
    constructor(
        radius, 
        resistitution = 1, 
        mass=null,
        pos = VectorMath2.zero(),
        vel = VectorMath2.zero(),
        colour = "#FF0000"
    ) {
        this.radius = radius
        this.resistitution = resistitution;
        if (mass == null)
            this.mass = Math.PI * radius ** 2;
        this.massInv = 1 / mass;
        this.pos = pos;
        this.vel = vel;
        this.colour = colour;
        this.type = "circle";
    }

    setStatic() {
        this.mass = Infinity;
        this.massInv = 0;
    }

    /**
     * @param {any} dt
     * @param {Vector2} gravity
     */
    simulate(dt, gravity) {
        this.vel.add(gravity.times(dt));
        this.pos.add(this.vel.times(dt));
    }
}
import { Vector2, VectorMath2 } from "./Vector2.js";

export class Rectangle {
    constructor(
        width,
        length,
        restitution = 0,
        mass = 0,
        pos = VectorMath2.zero(),
        vel = VectorMath2.zero(),
        angle = 0,
        angularVel = 0,
        colour = "#007F00"
    ) {
        this.id=null;
        this.type = "Rectangle";

        this.length = length;
        this.width = width;

        this.restitution = restitution;
        
        this.mass = mass;
        if(!mass)
        {
            this.mass = length * width;
        }

        this.massInv = 1 / this.mass;
        this.inertia = (1 / 12) * this.mass * (this.length ** 2) + (1 / 12) * this.mass * (this.width ** 2);
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
        this.vel = VectorMath2.zero();
    }

    /**
     * @param {number} dt
     * @param {Vector2} gravity
     */
    simulate(dt, gravity) {
        // console.log(gravity,dt);
        // console.log(this.width,this.length);
        this.vel.addEqual(gravity,dt);
        if(this.mass===Infinity) this.vel=VectorMath2.zero();
        this.pos.addEqual(this.vel,dt);
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
            ), // Top-Right
    
            new Vector2(
                this.pos.x - halfWidth * cosA - halfLength * sinA,
                this.pos.y - halfWidth * sinA + halfLength * cosA
            ), // Top-Left
    
            new Vector2(
                this.pos.x - halfWidth * cosA + halfLength * sinA,
                this.pos.y - halfWidth * sinA - halfLength * cosA
            ), // Bottom-Left
    
            new Vector2(
                this.pos.x + halfWidth * cosA + halfLength * sinA,
                this.pos.y + halfWidth * sinA - halfLength * cosA
            )  // Bottom-Right
        ];
    }
}

export class Circle {
    constructor(
        radius, 
        restitution = 1, 
        mass=null,
        pos = VectorMath2.zero(),
        vel = VectorMath2.zero(),
        colour = "#FF0000"
    ) {
        this.id=null;
        this.radius = radius
        this.restitution = restitution;
        if (mass == null)
            this.mass = Math.PI * radius ** 2;
        this.massInv = 1 / mass;
        this.pos = pos;
        this.vel = vel;
        this.colour = colour;
        this.type = "Circle";
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
        this.vel.addEqual(gravity.times(dt));
        this.pos.addEqual(this.vel.times(dt));
    }
}
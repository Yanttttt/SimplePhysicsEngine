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
        this.id = null;
        this.type = "Rectangle";

        this.length = length;
        this.width = width;

        this.restitution = restitution;

        this.mass = mass;
        if (!mass) {
            this.mass = length * width;
        }

        this.massInv = 1 / this.mass;
        this.inertia = (1 / 12) * this.mass * (this.length ** 2) + (1 / 12) * this.mass * (this.width ** 2);
        this.inertiaInv = 1 / this.inertia;

        this.pos = pos.clone();
        this.vel = vel.clone();
        this.angle = angle;
        this.angularVel = angularVel;

        this.vertices = this.getVertices();
        this.colour = colour; // String is passed by value. Strange.
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
        this.vel.addEqual(gravity, dt);
        if (this.mass === Infinity) this.vel = VectorMath2.zero();
        this.pos.addEqual(this.vel, dt);
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

export class Polygon {
    /**
     * 
     * @param {Vector2[]} vertices 
     */
    constructor(
        vertices = [],
        restitution = 0,
        mass = 0,
        vel = VectorMath2.zero(),
        angle = 0,
        angularVel = 0,
        colour = "#007F00"
    ) {
        this.id = null;
        this.type = "Polygon";
        this.colour = colour;

        this.verticesLocal = vertices.map(v => new Vector2(v.x, v.y));
        // Shallow copy. Avoid modifying original arr

        this.pos = Polygon.computeCentroid(vertices);
        this.vel = vel.clone();
        this.angle = angle;
        this.angularVel = angularVel;
        this.restitution = restitution;

        if (!mass) {
            this.mass = Polygon.computeMass(vertices);
        } else {
            this.mass = mass;
        }

        this.massInv = 1 / this.mass;
        this.inertia = Polygon.computeInertia(vertices, this.mass, this.pos);
        this.inertiaInv = 1 / this.inertia;
        this.vertices = this.getVertices();
    }

    static computeCentroid(vertices) {
        var sumX = 0, sumY = 0;
        vertices.forEach(v => {
            sumX += v.x;
            sumY += v.y;
        });
        return new Vector2(sumX / vertices.length, sumY / vertices.length);
    }

    static computeMass(vertices) {
        return Math.abs(Polygon.computeArea(vertices));
    }

    static computeArea(vertices) {
        var area = 0;
        for (let i = 0; i < vertices.length; i++) {
            let j = (i + 1) % vertices.length;
            area += vertices[i].x * vertices[j].y - vertices[j].x * vertices[i].y;
        }
        return area / 2;
    }

    static computeInertia(vertices, mass, centroid) {
        var inertia = 0;
        for (let i = 0; i < vertices.length; i++) {
            let j = (i + 1) % vertices.length;
            let p1 = vertices[i].sub(centroid);
            let p2 = vertices[j].sub(centroid);
            let cross = Math.abs(p1.x * p2.y - p2.x * p1.y);
            inertia += (p1.dot(p1) + p1.dot(p2) + p2.dot(p2)) * cross;
        }
        return (mass * inertia) / 6;
    }

    getVertices() {
        let cosA = Math.cos(this.angle);
        let sinA = Math.sin(this.angle);
        return this.verticesLocal.map(v => new Vector2(
            this.pos.x + v.x * cosA - v.y * sinA,
            this.pos.y + v.x * sinA + v.y * cosA
        ));
    }
}

export class Circle {
    constructor(
        radius,
        restitution = 1,
        mass = null,
        pos = VectorMath2.zero(),
        vel = VectorMath2.zero(),
        colour = "#FF0000"
    ) {
        this.id = null;
        this.radius = radius
        this.restitution = restitution;
        if (!mass)
            this.mass = Math.PI * radius ** 2;
        this.massInv = 1 / this.mass;
        this.pos = pos.clone();
        this.vel = vel.clone();
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
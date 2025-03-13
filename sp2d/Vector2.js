class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    addEqual(v, s = 1.0) {
        this.x += v.x * s;
        this.y += v.y * s;
    }
    add(v) {
        return new Vector2(this.x + v.x, this.y + v.y);
    }
    subtract(v) {
        return new Vector2(this.x - v.x, this.y - v.y);
    }
    subtractEqual(v, s = 1.0) {
        this.x -= s * v.x;
        this.y -= s * v.y;
    }
    timesEqual(s) {
        this.x *= s;
        this.y *= s;
    }
    times(s) {
        return new Vector2(this.x * s, this.y * s);
    }
    dot(v) {
        return this.x * v.x + this.y * v.y;
    }
    cross(v) {
        return this.x * v.y - this.y * v.x;
    }
    perpendicular() {
        return new Vector2(-this.y, this.x);
        //90 degrees counter-clockwise
    }
    length() {
        return Math.hypot(this.x, this.y);
        //hypotenuse, sqrt(x^2+y^2)
    }
    normalise() {
        let len = this.length();
        if (len == 0) {
            return new Vector2(0, 0);
        }
        return this.times(1 / len);
    }
    normaliseEqual() {
        let len = this.length();
        if (len == 0) {
            this = new Vector2(0, 0);
        }
        this.timesEqual(1 / len);
    }
    clone() {
        return new Vector2(this.x, this.y);
    }
}

const VectorMath2 = {
    add: (v1, v2) =>
        new Vector2(v1.x + v2.x, v1.y + v2.y),
    subtract: (v1, v2) =>
        new Vector2(v1.x - v2.x, v1.y - v2.y),
    times: (v, s) =>
        new Vector2(v.x * s, v.y * s),
    dot: (v1, v2) =>
        v1.x * v2.x + v1.y * v2.y,
    cross: (v1, v2) =>
        v1.x * v2.y - v1.y * v2.x,
};

export { Vector2, VectorMath2 };

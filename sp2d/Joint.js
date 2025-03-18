import { Vector2, VectorMath2 } from "./Vector2.js";
import * as Draw from "./Draw.js";
import * as Entity from "./Entity.js";
import * as PhysicsScene from "./PhysicsScene.js";

export class Joint {
    //base class
    /**
     * @param {Vector2} anchorA
     * @param {Vector2} anchorB
     * @param {Entity.Circle | Entity.Rectangle | Entity.Polygon} bodyA
     * @param {Entity.Circle | Entity.Rectangle | Entity.Polygon} bodyB
     * @param {boolean} visibility
     * @param {string} colour
     */
    constructor(bodyA, bodyB, anchorA, anchorB, visibility, colour = "#000000") {
        this.id = null;

        this.bodyA = bodyA;
        this.anchorA = anchorA.clone();

        this.bodyB = bodyB;
        this.anchorB = anchorB.clone();
        //anchor point on entity. The coordinates are relative to the object

        this.visibility = visibility;
        //draw or not

        this.colour = colour;
    }

    apply() { }

    draw() { }
}

export class Distance extends Joint {
    //keep a distance between two entities. allow rotation
    /**
     * @param {Vector2} anchorA
     * @param {Vector2} anchorB
     * @param {Entity.Circle|Entity.Rectangle|Entity.Polygon} bodyA
     * @param {Entity.Circle|Entity.Rectangle|Entity.Polygon} bodyB
     */
    constructor(bodyA, bodyB, anchorA, anchorB, visibility = false, colour) {
        super(bodyA, bodyB, anchorA, anchorB, visibility, colour);
        // this.length = anchorA.subtract(anchorB).length();
        this.id = null;
        this.length = anchorA.add(bodyA.pos).subtract(anchorB.add(bodyB.pos)).length();
    }

    apply() {
        // a joint is actually a collision
        var corrFactor = 0.3 / PhysicsScene.substep;

        var b = this.bodyA;
        var a = this.bodyB;
        var Pa = this.bodyA.pos.add(this.anchorA);
        //Absolute coordinates of unconstrained entity
        var Pb = this.bodyB.pos.add(this.anchorB);

        var diff = Pb.subtract(Pa);
        var currentLength = diff.length();
        var normal = diff.normalise();
        var depth = currentLength - this.length;

        var e = 0;
        var r_ap = Pa.subtract(a.pos);
        var r_bp = Pb.subtract(b.pos);
        var v_a = a.vel.add(r_ap.perpendicular(), a.angularVel);
        var v_b = b.vel.add(r_bp.perpendicular(), b.angularVel);
        var v_rel = v_b.subtract(v_a);
        var v_rel_n = v_rel.dot(normal);

        if (v_rel_n > 0) { return; }//seperating

        var r_ap_cross_n = r_ap.cross(normal);
        var r_bp_cross_n = r_bp.cross(normal);

        var denom = 0;
        if (a.mass !== Infinity) {
            denom += a.massInv + (r_ap_cross_n * r_ap_cross_n) * a.inertiaInv;
        }
        if (b.mass !== Infinity) {
            denom += b.massInv + (r_bp_cross_n * r_bp_cross_n) * b.inertiaInv;
        }

        var J = -(1 + e) * v_rel_n / denom;
        var impulse = normal.times(J);

        if (a.mass !== Infinity) {
            a.vel.addEqual(impulse.times(-a.massInv));
            a.angularVel -= r_ap.cross(impulse) * a.inertiaInv;
        }
        if (b.mass !== Infinity) {
            b.vel.addEqual(impulse.times(b.massInv));
            b.angularVel += r_bp.cross(impulse) * b.inertiaInv;
        }

        var totalMassInv = (a.mass !== Infinity ? a.massInv : 0) + (b.mass !== Infinity ? b.massInv : 0);
        if (totalMassInv > 0) {
            var corr = normal.times(depth * corrFactor / totalMassInv);
            if (a.mass !== Infinity) {
                a.pos.addEqual(corr.times(-a.massInv));
            }
            if (b.mass !== Infinity) {
                b.pos.addEqual(corr.times(b.massInv));
            }
        }
    }

    draw() {
        var worldAnchorA = this.bodyA.pos.add(this.anchorA);
        var worldAnchorB = this.bodyB.pos.add(this.anchorB);
        Draw.drawSpring(worldAnchorA, worldAnchorB, 1, 0, this.colour); //straight line
    }
}

export class Spring extends Joint {
    /**
     * @param {Entity.Circle|Entity.Rectangle|Entity.Polygon} bodyA
     * @param {Entity.Circle|Entity.Rectangle|Entity.Polygon} bodyB
     * @param {Vector2} anchorA
     * @param {Vector2} anchorB
     * @param {number} stiffness
     * @param {number} damping
     * @param {boolean} visibility
     * @param {string} colour
     */
    constructor(bodyA, bodyB, anchorA, anchorB, width, stiffness, damping, visibility = false, colour = "#000000") {
        super(bodyA, bodyB, anchorA, anchorB, visibility, colour);
        this.id = null;
        this.width=width;
        this.stiffness = stiffness; //aka spring constant
        this.damping = damping; //you know what it is
        this.restLength = anchorA.add(bodyA.pos).subtract(anchorB.add(bodyB.pos)).length(); // 计算自然长度
    }

    apply() {
        var dt=PhysicsScene.dt/PhysicsScene.substep;
        var a = this.bodyA;
        var b = this.bodyB;
        
        var worldAnchorA = a.pos.add(this.anchorA);
        var worldAnchorB = b.pos.add(this.anchorB);
        var diff = worldAnchorB.subtract(worldAnchorA);

        var currentLength = diff.length();
        if (currentLength === 0) return;

        var normal = diff.normalise();
        var stretch = currentLength - this.restLength;

        // Hooke's law
        var springForce = normal.times(-this.stiffness * stretch*dt);

        var r_ap = worldAnchorA.subtract(a.pos);
        var r_bp = worldAnchorB.subtract(b.pos);

        var v_a = a.vel.add(r_ap.perpendicular().times(a.angularVel));
        var v_b = b.vel.add(r_bp.perpendicular().times(b.angularVel));

        var v_rel = v_b.subtract(v_a);
        var dampingForce = normal.times(-this.damping * dt * v_rel.dot(normal));

        var force = springForce.add(dampingForce);

        if (a.mass !== Infinity) {
            a.vel.addEqual(force.times(-a.massInv));
            a.angularVel -= r_ap.cross(force) * a.inertiaInv;
        }
        if (b.mass !== Infinity) {
            b.vel.addEqual(force.times(b.massInv));
            b.angularVel += r_bp.cross(force) * b.inertiaInv;
        }
    }

    draw() {
        var worldAnchorA = this.bodyA.pos.add(this.anchorA);
        var worldAnchorB = this.bodyB.pos.add(this.anchorB);
        Draw.drawSpring(worldAnchorA, worldAnchorB, 10,this.width, this.colour); 
    }
}
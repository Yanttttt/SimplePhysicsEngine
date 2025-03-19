import { Vector2, VectorMath2 } from "./Vector2.js";
import * as Draw from "./Draw.js";
import * as Entity from "./Entity.js";
import * as PhysicsScene from "./PhysicsScene.js";

export class Joint {
    //base class. fixed joint
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

    apply() {}

    draw() {}
}

export class Weld extends Joint{
    //base class. fixed joint
    /**
     * @param {Vector2} anchorA
     * @param {Vector2} anchorB
     * @param {Entity.Circle | Entity.Rectangle | Entity.Polygon} bodyA
     * @param {Entity.Circle | Entity.Rectangle | Entity.Polygon} bodyB
     * @param {boolean} visibility
     * @param {string} colour
     */
    constructor(bodyA, bodyB, anchorA, anchorB, visibility, colour = "#000000") {
        super(bodyA, bodyB, anchorA, anchorB, visibility, colour);
        
        this.id = null;
        this.length = anchorA.add(bodyA.pos).subtract(anchorB.add(bodyB.pos)).length();

        this.visibility = visibility;
        //draw or not

        this.colour = colour;

        this.angleOffset = this.bodyB.angle - this.bodyA.angle;
    }

    apply() {
        var a = this.bodyA;
        var b = this.bodyB;

        if (a.mass === Infinity && b.mass === Infinity) return;

        var rA = this.anchorA.rotate(a.angle);
        var rB = this.anchorB.rotate(b.angle);
        var worldAnchorA = a.pos.add(rA);
        var worldAnchorB = b.pos.add(rB);

        var diff = worldAnchorB.subtract(worldAnchorA);
        var normal = diff.normalise();
        var depth = diff.length();

        // 计算质量和惯性倒数
        var mA = a.massInv, mB = b.massInv;
        var iA = a.inertiaInv, iB = b.inertiaInv;

        // 计算雅可比矩阵的 3x3 质量矩阵 K
        var K = [
            [mA + mB + rA.y * rA.y * iA + rB.y * rB.y * iB, -rA.y * rA.x * iA - rB.y * rB.x * iB, -rA.y * iA - rB.y * iB],
            [-rA.y * rA.x * iA - rB.y * rB.x * iB, mA + mB + rA.x * rA.x * iA + rB.x * rB.x * iB, rA.x * iA + rB.x * iB],
            [-rA.y * iA - rB.y * iB, rA.x * iA + rB.x * iB, iA + iB]
        ];

        // 计算相对速度
        var vA = a.vel.add(rA.perpendicular().times(a.angularVel));
        var vB = b.vel.add(rB.perpendicular().times(b.angularVel));
        var vRel = vB.subtract(vA);

        // 计算角度误差
        var angleError = (b.angle - a.angle - this.angleOffset);

        // 计算右侧项 (误差修正)
        var bVec = [-vRel.x, -vRel.y, -angleError];

        // 计算拉格朗日乘数 λ = K⁻¹ * (-J·V)
        var lambda = this.solve3x3(K, bVec);

        // 计算冲量
        var impulse = new Vector2(lambda[0], lambda[1]);
        var angularImpulse = lambda[2];

        // 施加冲量
        if (a.mass !== Infinity) {
            a.vel.addEqual(impulse.times(-a.massInv));
            a.angularVel -= rA.cross(impulse) * a.inertiaInv;
            a.angularVel -= angularImpulse * a.inertiaInv;
        }

        if (b.mass !== Infinity) {
            b.vel.addEqual(impulse.times(b.massInv));
            b.angularVel += rB.cross(impulse) * b.inertiaInv;
            b.angularVel += angularImpulse * b.inertiaInv;
        }
    }

    /**
     * 求解 3x3 线性方程组 Ax = b
     * @param {number[][]} A - 3x3 矩阵
     * @param {number[]} b - 右侧列向量
     * @returns {number[]} - 解向量
     */
    solve3x3(A, b) {
        var detA =
            A[0][0] * (A[1][1] * A[2][2] - A[1][2] * A[2][1]) -
            A[0][1] * (A[1][0] * A[2][2] - A[1][2] * A[2][0]) +
            A[0][2] * (A[1][0] * A[2][1] - A[1][1] * A[2][0]);

        if (Math.abs(detA) < 1e-6) return [0, 0, 0];

        var invA = [
            [
                (A[1][1] * A[2][2] - A[1][2] * A[2][1]) / detA,
                (A[0][2] * A[2][1] - A[0][1] * A[2][2]) / detA,
                (A[0][1] * A[1][2] - A[0][2] * A[1][1]) / detA
            ],
            [
                (A[1][2] * A[2][0] - A[1][0] * A[2][2]) / detA,
                (A[0][0] * A[2][2] - A[0][2] * A[2][0]) / detA,
                (A[0][2] * A[1][0] - A[0][0] * A[1][2]) / detA
            ],
            [
                (A[1][0] * A[2][1] - A[1][1] * A[2][0]) / detA,
                (A[0][1] * A[2][0] - A[0][0] * A[2][1]) / detA,
                (A[0][0] * A[1][1] - A[0][1] * A[1][0]) / detA
            ]
        ];

        return [
            invA[0][0] * b[0] + invA[0][1] * b[1] + invA[0][2] * b[2],
            invA[1][0] * b[0] + invA[1][1] * b[1] + invA[1][2] * b[2],
            invA[2][0] * b[0] + invA[2][1] * b[1] + invA[2][2] * b[2]
        ];
    }

    draw() {
        var worldAnchorA = this.bodyA.pos.add(this.anchorA);
        var worldAnchorB = this.bodyB.pos.add(this.anchorB);
        if(this.visibility)
            Draw.drawSpring(worldAnchorA, worldAnchorB, 1, 0, this.colour);
    }
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

        //if (v_rel_n > 0) { return; }//seperating

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
        if(this.visibility)
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
        if(this.visibility) 
            Draw.drawSpring(worldAnchorA, worldAnchorB, 10,this.width, this.colour); 
    }
}
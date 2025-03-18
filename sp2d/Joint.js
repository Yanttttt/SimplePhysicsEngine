import { Vector2, VectorMath2 } from "./Vector2.js";
import * as Draw from "./Draw.js";
import * as Entity from "./Entity.js";

export class Joint {
    //base class
    /**
     * @param {Vector2} anchorA
     * @param {Vector2} anchorB
     * @param {Entity.Circle | Entity.Rectangle | Entity.Polygon} bodyA
     * @param {Entity.Circle | Entity.Rectangle | Entity.Polygon} bodyB
     * @param {boolean} visibility
     */
    constructor(bodyA, bodyB, anchorA, anchorB, visibility) {
        this.id=null;

        this.bodyA = bodyA;
        this.anchorA = anchorA.clone();

        this.bodyB = bodyB;
        this.anchorB = anchorB.clone();
        //anchor point on entity. The coordinates are relative to the object

        this.visibility=visibility;
        //draw or not
    }

    apply() {}

    draw() {}
}

export class Distance extends Joint {
    //keep a distance between two entities. allow rotation
    /**
     * @param {Vector2} anchorA
     * @param {Vector2} anchorB
     * @param {Entity.Circle|Entity.Rectangle|Entity.Polygon} bodyA
     * @param {Entity.Circle|Entity.Rectangle|Entity.Polygon} bodyB
     */
    constructor(bodyA, bodyB, anchorA, anchorB, visible=false) {
        super(bodyA, bodyB, anchorA, anchorB, visible);
        // this.length = anchorA.subtract(anchorB).length();
        this.id=null;
        this.length = anchorA.add(bodyA.pos).subtract(anchorB.add(bodyB.pos)).length();
    }

    apply() {
        var worldAnchorA = this.bodyA.pos.add(this.anchorA);
        //Absolute coordinates of unconstrained entity
        var worldAnchorB = this.bodyB.pos.add(this.anchorB);
        
        var diff = worldAnchorB.subtract(worldAnchorA);
        var currentLength = diff.length();
        var corr = diff.normalise().times(currentLength - this.length);

        var massSumInv = this.bodyA.massInv + this.bodyB.massInv;
        if (massSumInv === 0)
        {
            return;
        }

        var corrA = corr.times(this.bodyA.massInv / massSumInv);
        var corrB = corr.times(-this.bodyB.massInv / massSumInv);

        //console.log(corrA,corrB);

        if (this.bodyA.mass !== Infinity) {
            console.log("A is moving");
            this.bodyA.pos.addEqual(corrA);
        }
        if (this.bodyB.mass !== Infinity) {
            this.bodyB.pos.addEqual(corrB);
        }
    }

    draw() {
        var worldAnchorA = this.bodyA.pos.add(this.anchorA);
        var worldAnchorB = this.bodyB.pos.add(this.anchorB);
        Draw.drawSpring(worldAnchorA, worldAnchorB, 1, 0, "#0000FF"); //straight line
    }
}
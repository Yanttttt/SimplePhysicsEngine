import {Vector2, VectorMath2} from "./Vector2.js";
import * as Entity from "./Entity.js";

export class Collision
{
    /**
     * @param {any} entity1
     * @param {any} entity2
     * @param {Vector2} normal
     * @param {number} depth
     * @param {Vector2} contactPoint
     */
    constructor(entity1,entity2,normal,depth,contactPoint)
    {
        this.entity1=entity1; //nested object, parameter passed by reference
        this.entity2=entity2;
        this.normal=normal; //supposed to be e1 -> e2
        this.depth=depth;
        this.contactPoint=contactPoint;
    }

    resolve()
    {
        var corrFactor=0.8;
        if(this.entity1.type==="Circle" && this.entity2.type==="Circle")
        {
            this.resolveCircles(corrFactor);
        }
        if(this.entity1.type==="Rectangle" && this.entity2.type==="Rectangle")
        {
            this.resolveRectangles(corrFactor);
        }
        if(this.entity1.type==="Circle" && this.entity2.type==="Rectangle")
        {
            this.resolveCircleRectangle(corrFactor);
        }
    }

    resolveRectangles(corrFactor=0.8)
    {
        var e1 = this.entity1;
        var e2 = this.entity2;
        var normal = this.normal;
        var depth = this.depth;

        // var P = collision.contactPoint;

        // var r_ap = P.subtract(a.pos);
        // var r_bp = P.subtract(b.pos);

        // var v_a = a.vel.plus(r_ap.perpendicular(), a.angularVelocity);
        // var v_b = b.vel.plus(r_bp.perpendicular(), b.angularVelocity);

        // var v_rel = v_b.subtract(v_a);
        // var v_rel_n = v_rel.dot(normal);

        // if (v_rel_n > 0) return;

        // var r_ap_cross_n = r_ap.cross(normal);
        // var r_bp_cross_n = r_bp.cross(normal);

        // var denom = a.massInv + b.massInv +
        //     (r_ap_cross_n * r_ap_cross_n) * a.inertiaInv +
        //     (r_bp_cross_n * r_bp_cross_n) * b.inertiaInv;

        // var J = -(1 + restitution) * v_rel_n / denom;

        // var impulse = normal.times(J);

        // a.vel.add(impulse.times(-a.massInv));
        // b.vel.add(impulse.times(b.massInv));

        // a.angularVelocity += r_ap.cross(impulse) * a.inertiaInv;
        // b.angularVelocity -= r_bp.cross(impulse) * b.inertiaInv;

        // a.angularVelocity = Math.min(
        //     Math.max(a.angularVelocity, -physicsScene.maxAngularVel),
        //     physicsScene.maxAngularVel
        // );
        // b.angularVelocity = Math.min(
        //     Math.max(b.angularVelocity, -physicsScene.maxAngularVel),
        //     physicsScene.maxAngularVel
        // );

        // //avoid penetration
        // var factor = 1;
        // var corr = normal.times(depth * factor / (a.massInv + b.massInv));

        // a.pos.add(corr.times(-a.massInv));
        // b.pos.add(corr.times(b.massInv));

        if(e1.mass===Infinity && e2.mass===Infinity)
        {
            return;
        }// 2 static entities

        if(VectorMath2.subtract(e2.vel,e1.vel).dot(normal)>1e-5)// separating
        {
            return;
        }

        console.log("collision resolving!")
        console.log("collison is ", this);
        
        var e=Math.min(e1.resistitution,e2.resistitution);
        console.log(e);

        var v1=e1.vel.dot(normal);
        var v2=e2.vel.dot(normal);

        var m1=e1.mass;
        var m2=e2.mass;

        var corr = depth*corrFactor;
        console.log(corr);

        if(e1.mass==Infinity) {
            e2.pos.addEqual(normal, 2*corr);
            e2.vel.addEqual(normal,-v2*e);
            return;
        }
        else if(e2.mass===Infinity) {
            e1.pos.addEqual(normal, -2*corr);
            e1.vel.addEqual(normal,-v1*e);
            return;
        }//1000 lines achieved

        e1.pos.addEqual(normal, -corr);
        e2.pos.addEqual(normal, corr);
        
        var v1f=(m1*v1+m2*(2*v2-v1))*e/(m1+m2);
        var v2f=(m2*v2+m1*(2*v1-v2))*e/(m1+m2);

        if(!v1f) v1f=0;
        if(!v2f) v2f=0;

        console.log(v1f,v2f);

        //error;

        e1.vel.addEqual(normal,v1f-v1);
        e2.vel.addEqual(normal,v2f-v2);
    }

    resolveCircleRectangle(corrFactor=0.8)
    {
        var e1=this.entity1;
        var e2=this.entity2;

        var normal=this.normal;
        var depth=this.depth;

        if(e1.mass===Infinity && e2.mass===Infinity)
        {
            return;
        }// 2 static entities

        if(VectorMath2.subtract(e2.vel,e1.vel).dot(normal)>1e-5)// separating
        {
            return;
        }

        console.log("collision resolving!")
        console.log("collison is ", this);
        
        var e=Math.min(e1.resistitution,e2.resistitution);
        console.log(e);

        var v1=e1.vel.dot(normal);
        var v2=e2.vel.dot(normal);

        var m1=e1.mass;
        var m2=e2.mass;

        var corr = depth*corrFactor;
        console.log(corr);

        if(e1.mass==Infinity) {
            e2.pos.addEqual(normal, 2*corr);
            e2.vel.addEqual(normal,-v2*e);
            return;
        }
        else if(e2.mass===Infinity) {
            e1.pos.addEqual(normal, -2*corr);
            e1.vel.addEqual(normal,-v1*e);
            return;
        }//1000 lines achieved

        e1.pos.addEqual(normal, -corr);
        e2.pos.addEqual(normal, corr);
        
        var v1f=(m1*v1+m2*(2*v2-v1))*e/(m1+m2);
        var v2f=(m2*v2+m1*(2*v1-v2))*e/(m1+m2);

        if(!v1f) v1f=0;
        if(!v2f) v2f=0;

        console.log(v1f,v2f);

        //error;

        e1.vel.addEqual(normal,v1f-v1);
        e2.vel.addEqual(normal,v2f-v2);
    }

    resolveCircles(corrFactor=0.8)
    {
        var e1=this.entity1;
        var e2=this.entity2;

        var normal=this.normal;
        var depth=this.depth;

        if(e1.mass===Infinity && e2.mass===Infinity)
        {
            return;
        }// 2 static entities

        if(VectorMath2.subtract(e2.vel,e1.vel).dot(normal)>1e-5)// separating
        {
            return;
        }

        console.log("collision resolving!")
        console.log("collison is ", this);
        
        var e=Math.min(e1.resistitution,e2.resistitution);
        console.log(e);

        var v1=e1.vel.dot(normal);
        var v2=e2.vel.dot(normal);

        var m1=e1.mass;
        var m2=e2.mass;

        var corr = depth*corrFactor;
        console.log(corr);

        if(e1.mass==Infinity) {
            e2.pos.addEqual(normal, 2*corr);
            e2.vel.addEqual(normal,-v2*e);
            return;
        }
        else if(e2.mass===Infinity) {
            e1.pos.addEqual(normal, -2*corr);
            e1.vel.addEqual(normal,-v1*e);
            return;
        }//1000 lines achieved

        e1.pos.addEqual(normal, -corr);
        e2.pos.addEqual(normal, corr);
        
        var v1f=(m1*v1+m2*(2*v2-v1))*e/(m1+m2);
        var v2f=(m2*v2+m1*(2*v1-v2))*e/(m1+m2);

        if(!v1f) v1f=0;
        if(!v2f) v2f=0;

        console.log(v1f,v2f);

        //error;

        e1.vel.addEqual(normal,v1f-v1);
        e2.vel.addEqual(normal,v2f-v2);
    }
}

export function detect(entity1,entity2)
{
    if(entity1.type==="Circle" && entity2.type==="Circle")
    {
        return detectCircles(entity1,entity2);
    }
    if(entity1.type==="Rectangle" && entity2.type==="Rectangle")
    {
        return detectRectangles(entity1,entity2);
    }
    if((entity1.type==="Circle" && entity2.type==="Rectangle"))
    {
        return detectCircleRectangle(entity1,entity2);
    }
    if(entity1.type==="Rectangle" && entity2.type==="Circle")
    {
        return detectCircleRectangle(entity2,entity1);
    }
}

/**
 * @param {Entity.Circle} c1
 * @param {Entity.Circle} c2
 */
export function detectCircles(c1, c2)
{
    var dist = VectorMath2.subtract(c2.pos, c1.pos);
    if(dist.length() < c1.radius + c2.radius)
    {
        var depth=c1.radius + c2.radius-dist.length();
        var normal=dist.normalise();
        return new Collision(
            c1,
            c2,
            normal,
            depth,
            normal.times(c1.radius).add(c1.pos)
        );
    }
}

/**
 * @param {Entity.Circle} c
 * @param {Entity.Rectangle} r
 */
export function detectCircleRectangle(c,r)
{
    var normal = VectorMath2.zero();
    var depth = Number.MAX_VALUE;
    
    var axis=VectorMath2.zero()
    var overlap=0;

    for(let i=0;i<4;i++)
    {
        let va=r.vertices[i];
        let vb=r.vertices[(i+1)%4];

        let edge=VectorMath2.subtract(vb,va);
        axis=edge.perpendicular().normalise();

        var projA=projectVertices(r,axis);
        var projB=projectCircle(c,axis);

        if(projA.min>=projB.max || projB.min>=projA.max)
        {
            return null;
        }

        overlap=Math.min(
            projA.max-projB.min,
            projB.max-projA.min
        );

        if(overlap<depth)
        {
            depth=overlap;
            normal=axis;
        }
    }

    var minDist=Number.MAX_VALUE;
    var nearest=VectorMath2.zero();

    for(let i=0;i<4;i++)
    {
        let v=r.vertices[i];
        let dist=VectorMath2.distance(c.pos,v);

        if(dist<minDist)
        {
            minDist=dist;
            nearest=v;
        }
    }// find the nearest point on the rectangle

    axis=VectorMath2.subtract(nearest,c.pos).normalise();
    projA=projectVertices(r,axis);
    projB=projectCircle(c,axis);

    if(projA.min>=projB.max || projB.min>=projA.max)
    {
        return null;
    }

    overlap=Math.min(
        projA.max-projB.min,
        projB.max-projA.min
    );

    if(overlap<depth)
    {
        depth=overlap;
        normal=axis;
    }

    var dir=VectorMath2.subtract(c.pos,r.pos);
    if(dir.dot(normal)<0) normal=normal.times(-1);

    return new Collision(
        c,
        r,
        normal,
        depth,
        null
    );
}

/**
 * @param {Entity.Rectangle} b1
 * @param {Entity.Rectangle} b2
 */
export function detectRectangles(b1, b2)
{

    // if(b1.id==0||b1.id==1||b1.id==2||b1.id==3)
    //     {
    //         if(b2.id==0||b2.id==1||b2.id==2||b2.id==3){}
    //         else{
    //             console.log("wall detecting");
    //         }
    //     }
    
    //     if(b2.id==0||b2.id==1||b2.id==2||b2.id==3)
    //     {
    //         if(b1.id==0||b1.id==1||b1.id==2||b1.id==3){}
    //         else{
    //             console.log("wall detecting");
    //         }
    //     }

    var normal=new Vector2(0,0);
    var depth=Number.MAX_VALUE;

    for(let i=0;i<4;i++)
    {
        let va=b1.vertices[i];
        let vb=b1.vertices[(i+1)%4];

        let edge=VectorMath2.subtract(vb,va);
        let axis=edge.perpendicular().normalise();
        // Vertices go around the centre counter-clockwisely.
        // So axis points inward.

        var projA=projectVertices(b1,axis);
        var projB=projectVertices(b2,axis);

        if (!projA || !projB)
        {
            console.log("null proj vector!");
            return null;
        }

        if(projA.min>=projB.max || projB.min>=projA.max)
        {
            return null;
        }

        let overlap=Math.min(
            projA.max-projB.min,
            projB.max-projA.min
        );

        if(overlap<depth)
        {
            depth=overlap;
            normal=axis;
        }
    }

    // Based on Seperating Axis Theorem
    // Only work for convex shapes
    // I will put it as a linear time algorithm
    // Since it only depends on the number of edges
    // In O(n^2) time

    for(let i=0;i<4;i++)
    {
        let va=b2.vertices[i];
        let vb=b2.vertices[(i+1)%4];

        let edge=VectorMath2.subtract(vb,va);
        let axis=edge.perpendicular().normalise();

        projA=projectVertices(b1,axis);
        projB=projectVertices(b2,axis);


        if (!projA || !projB)
        {
            console.log("null proj vector!");
        }

        if(projA.min>=projB.max || projB.min>=projA.max)
        {
            return null;
        }

        let overlap=Math.min(
            projA.max-projB.min,
            projB.max-projA.min
        );

        if(overlap<depth)
        {
            depth=overlap;
            normal=axis;
        }
    }

    var dir=VectorMath2.subtract(b2.pos,b1.pos);

    if(dir.dot(normal)<0)
    {
        normal=normal.times(-1);
    }// make sure normal points from b1 to b2

    //var contactPoint=new Vector2(0,0);
    
    // if(b1.id==0||b1.id==1||b1.id==2||b1.id==3)
    // {
    //     if(b2.id==0||b2.id==1||b2.id==2||b2.id==3){}
    //     else{
    //         console.log("wall collided");
    //     }
    // }

    // if(b2.id==0||b2.id==1||b2.id==2||b2.id==3)
    // {
    //     if(b1.id==0||b1.id==1||b1.id==2||b1.id==3){}
    //     else{
    //         console.log("wall collided");
    //     }
    // }

    return new Collision(
        b1,
        b2,
        normal,
        depth,
        null
    );
}

/**
 * @param {Entity.Rectangle} b
 * @param {Vector2} axis
 */
function projectVertices(b, axis)
{
    var min=Number.MAX_VALUE;
    var max=-Number.MAX_VALUE;
    for(let v of b.vertices)
    {
        let proj=v.dot(axis);
        min=Math.min(min,proj);
        max=Math.max(max,proj);
    }
    return {min:min,max:max};
}

/**
 * @param {Entity.Circle} c 
 * @param {Vector2} axis 
 */
function projectCircle(c, axis)
{
    var p1=c.pos.add(axis,c.radius);
    var p2=c.pos.add(axis,-c.radius);

    var res1=VectorMath2.dot(p1,axis);
    var res2=VectorMath2.dot(p2,axis);

    return {min:Math.min(res1,res2),max:Math.max(res1,res2)};
}
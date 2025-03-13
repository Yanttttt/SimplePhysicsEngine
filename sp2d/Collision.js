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
    }

    resolveRectangles(corrFactor=0.8)
    {
        
    }

    resolveCircles(corrFactor=0.8)
    {
        var e1=this.entity1;
        var e2=this.entity2;

        var normal=this.normal;
        var depth=this.depth;

        var e=Math.min(e1.restitution,e2.restitution);

        if(e1.mass===Infinity && e2.mass===Infinity)
        {
            return;
        }// 2 static entities

        if(VectorMath2.subtract(e2.vel,e1.vel).dot(normal)>0)// separating
        {
            return;
        }

        var corr = depth*corrFactor;
        e1.pos.add(normal, -corr);
        e2.pos.add(normal, corr);

        var v1=e1.vel.dot(normal);
        var v2=e2.vel.dot(normal);

        var m1=e1.mass;
        var m2=e2.mass;

        var v1f=(m1*v1+m2*(2*v2-v1))*e/(m1+m2);
        var v2f=(m2*v2+m1*(2*v1-v2))*e/(m1+m2);

        e1.vel.add(normal,v1f-v1);
        e2.vel.add(normal,v2f-v2);
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
 * @param {Entity.Rectangle} b1
 * @param {Entity.Rectangle} b2
 */
export function detectRectangles(b1, b2)
{
    var normal=new Vector2(0,0);
    var depth=Number.MAX_VALUE;

    for(let i=0;i<4;i++)
    {
        let va=b1.vertices[i];
        let vb=b1.vertices[(i+1)%4];

        let edge=VectorMath2.subtract(vb,va);
        let axis=edge.perpendicular().normalise();

        var projA=projectVertices(b1,axis);
        var projB=projectVertices(b2,axis);

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

    for(let i=0;i<4;i++)
    {
        let va=b2.vertices[i];
        let vb=b2.vertices[(i+1)%4];

        let edge=VectorMath2.subtract(vb,va);
        let axis=edge.perpendicular().normalise();

        projA=projectVertices(b1,axis);
        projB=projectVertices(b2,axis);

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
    

    return new Collision(
        b1,
        b2,
        normal,
        depth,
        null
    );
}

export function detect(entity1,entity2)
{
    if(entity1.type==="circle" && entity2.type==="circle")
    {
        return detectCircles(entity1,entity2);
    }
    else if(entity1.type==="rectangle" && entity2.type==="rectangle")
    {
        return detectRectangles(entity1,entity2);
    }
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

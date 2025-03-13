import {Vector2, VectorMath2} from "./Vector2.js";

export class Collision
{
    constructor()
    {
        constructor(entity1,entity2,normal,depth,contactPoint)
        {
            this.entity1=entity1;
            this.entity2=entity2;
            this.normal=normal; //supposed to be e1 -> e2
            this.depth=depth;
            this.contactPoint=contactPoint;
        }
    }
}

export function detectCircles(c1, c2)
{
    var dist = VectorMath2.subtract(c2.pos, c1.pos);
    if(dist.length() < c1.radius + c2.radius);
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

    var contactPoint=new Vector2(0,0);
    

    return new Collision(
        b1,
        b2,
        normal,
        depth,
        
    );
}

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

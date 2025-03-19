import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as Collision from "./sp2d/Collision.js";
import * as Joint from "./sp2d/Joint.js";

var div = 2;

function setupScene() {
    Draw.init("myCanvas", Math.min(window.innerWidth - 20, window.innerHeight - 20), Math.min(window.innerWidth - 20, window.innerHeight - 20), 2);
    PhysicsScene.init(undefined, new Vector2(0.0, -9.8), 0.1);
}
window.setupScene = setupScene;

function buildChain2()
{
    var numLinks=25;
    var linkLength=0.1;
    var linkWidth=0.05;

    var startPos=new Vector2(0.3,1);

    var start=new Entity.Circle(0.01, 1, 0, undefined,
        startPos,
        VectorMath2.zero(),
        1,
        0,
        "#9F0000"
    )
    start.setStatic();
    PhysicsScene.addEntity(start);

    var prev;

    for (let i = 0; i < numLinks; i++) {
        let pos = new Vector2(startPos.x + 0.5 * linkLength + i * linkLength*0.8,
            startPos.y
        );

        let link = new Entity.Rectangle(linkLength,
            linkWidth,
            0.2,
            0,
            undefined,
            pos,
            VectorMath2.zero(),
            0,
            0,
            "#7f7f7f"
        );
        PhysicsScene.addEntity(link);

        if(i===0)
        {
            let joint = new Joint.Distance(
                start, 
                link, 
                new Vector2(0,0), 
                new Vector2(-linkLength/2+0.1*linkLength,0),
                false,
                "#FFFFFF"
            );
            PhysicsScene.addJoint(joint);

            PhysicsScene.disableCollision(start.id,link.id);
        }
        else
        {
            let joint = new Joint.Distance(
                prev, 
                link, 
                new Vector2(linkLength / 2-0.1*linkLength,0), 
                new Vector2(-linkLength/2+0.1*linkLength,0),
                // new Vector2(linkLength / 2,0), 
                // new Vector2(-linkLength/2,0),
                false,
                "#FFFFFF"
            );
            PhysicsScene.addJoint(joint);
    
            PhysicsScene.disableCollision(prev.id,link.id);
        }

        prev = link;
    }

    var endPos=new Vector2(2.32,1);

    var end=new Entity.Circle(0.01, 1, 0, undefined,
        endPos,
        VectorMath2.zero(),
        1,
        0,
        "#9F0000"
    )
    end.setStatic();
    PhysicsScene.addEntity(end);

    let joint = new Joint.Distance(
        prev, 
        end, 
        new Vector2(linkLength / 2,0), 
        new Vector2(0,0),
        true,
        "#FFFFFF"
    );
    PhysicsScene.addJoint(joint);

    end.pos.addEqual(new Vector2(-0.7,0));
}

function buildChain1()
{
    var numLinks=11;
    var linkLength=0.1;
    var linkWidth=0.05;

    var startPos=new Vector2(1,1.7);

    var start=new Entity.Circle(0.01, 1, 0, undefined,
        startPos,
        VectorMath2.zero(),
        1,
        0,
        "#9F0000"
    )
    start.setStatic();
    PhysicsScene.addEntity(start);

    var prev;

    for (let i = 0; i < numLinks; i++) {
        let pos = new Vector2(startPos.x + 0.5 * linkLength + i * linkLength*0.8,
            startPos.y
        );

        let link = new Entity.Rectangle(linkLength,
            linkWidth,
            0.2,
            0.1,
            undefined,
            pos,
            VectorMath2.zero(),
            0,
            0,
            "#7f7f7f"
        );
        PhysicsScene.addEntity(link);

        if(i===0)
        {
            let joint = new Joint.Distance(
                start, 
                link, 
                new Vector2(0,0), 
                new Vector2(-linkLength/2+0.1*linkLength,0),
                false,
                "#FFFFFF"
            );
            PhysicsScene.addJoint(joint);

            PhysicsScene.disableCollision(start.id,link.id);
        }
        else
        {
            let joint = new Joint.Distance(
                prev, 
                link, 
                new Vector2(linkLength / 2-0.1*linkLength,0), 
                new Vector2(-linkLength/2+0.1*linkLength,0),
                // new Vector2(linkLength / 2,0), 
                // new Vector2(-linkLength/2,0),
                false,
                "#FFFFFF"
            );
            PhysicsScene.addJoint(joint);
    
            PhysicsScene.disableCollision(prev.id,link.id);
        }

        prev = link;
    }

    var endPos=new Vector2(2.14,1.8);

    var end=new Entity.Circle(0.2, 1, 0, undefined,
        endPos,
        VectorMath2.zero(),
        1,
        0,
        "#9F0000"
    )
    //end.setStatic();
    PhysicsScene.addEntity(end);

    var joint = new Joint.Spring(
        prev, 
        end, 
        new Vector2(linkLength / 2,0), 
        new Vector2(0,0),
        0.03,
        5,
        0.01,
        true,
        "#3f3f3f"
    );
    PhysicsScene.addJoint(joint);

    end.pos.addEqual(new Vector2(-0.22,0));
}

function updateFrame()
{
    //console.log(PhysicsScene.entities);
    PhysicsScene.simulate(50);
    PhysicsScene.draw();
    //PhysicsScene.drawVertex();
    PhysicsScene.drawAnchorPoint();
    //error;
    requestAnimationFrame(updateFrame);
}

setupScene();
buildChain1();
buildChain2();
updateFrame();
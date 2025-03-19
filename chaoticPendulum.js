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

/**
 * @param {Vector2} pos
 */
function addPendulum(pos)
{
    var hinge=new Entity.Circle(0.005, 1, 0, Infinity,
        pos,
        VectorMath2.zero(),
        0,
        0,
        "#3f3f3f"
    )
    hinge.setStatic();
    PhysicsScene.addEntity(hinge);

    var length=0.3;

    var ball1=new Entity.Circle(0.05, 1, 0, undefined,
        pos.add(new Vector2(0,-0.3)),
        VectorMath2.zero(),
        0,
        0,
        "#9F0000"
    )
    PhysicsScene.addEntity(ball1);

    var rope1=new Joint.Distance(hinge, ball1,
        VectorMath2.zero(),
        new Vector2(0,0),
        true,
        "#111111"
    );
    PhysicsScene.addJoint(rope1);

    var ball2=new Entity.Circle(0.05, 1, 0, undefined,
        pos.add(new Vector2(0,-0.7)),
        VectorMath2.zero(),
        0,
        0,
        "#009F00"
    )
    PhysicsScene.addEntity(ball2);

    var rope2=new Joint.Distance(ball1, ball2,
        VectorMath2.zero(),
        new Vector2(0,0),
        true,
        "#111111"
    );
    PhysicsScene.addJoint(rope2);

    var ball3=new Entity.Circle(0.05, 1, 0, undefined,
        pos.add(new Vector2(0,-0.12)),
        VectorMath2.zero(),
        0,
        0,
        "#00009F"
    )
    var id=PhysicsScene.addEntity(ball3);

    var rope3=new Joint.Distance(ball2, ball3,
        VectorMath2.zero(),
        new Vector2(0,0),
        true,
        "#111111"
    );
    PhysicsScene.addJoint(rope3);
    return id;
}

function hangPendulum()
{
    var mid=new Vector2(1,1.5);
    var plug=addPendulum(mid);
    PhysicsScene.entities[plug].vel.addEqual(new Vector2(-4,0));
}

function updateFrame()
{
    //console.log(PhysicsScene.entities);
    PhysicsScene.simulate(100);
    PhysicsScene.draw();
    //PhysicsScene.drawVertex();
    PhysicsScene.drawAnchorPoint();
    requestAnimationFrame(updateFrame);
}

setupScene();
hangPendulum();
updateFrame();
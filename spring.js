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
    var hinge=new Entity.Circle(0.05, 0, 0, Infinity,
        pos,
        VectorMath2.zero(),
        0,
        0,
        "#3f3f3f"
    )
    hinge.setStatic();
    PhysicsScene.addEntity(hinge);

    var length=0.5;

    var stick= new Entity.Rectangle(
        0.02,
        0.2,
        1,
        0,
        undefined,
        pos.add(new Vector2(0,-length-0.1)),
        new Vector2(0,0),
        0,
        0,
        "#7f3f00"
    );
    PhysicsScene.addEntity(stick);

    var ball=new Entity.Circle(0.1, 1, 0, undefined,
        pos.add(new Vector2(0,-length-0.2-0.05)),
        VectorMath2.zero(),
        0,
        0,
        "#9F0000"
    )
    var id=PhysicsScene.addEntity(ball);

    var rope=new Joint.Spring(hinge, stick,
        VectorMath2.zero(),
        new Vector2(0,0.1),
        0.05,
        2,
        0.01,
        true,
        "#111111"
    );
    PhysicsScene.addJoint(rope);

    var weld1=new Joint.Distance(stick, ball,
        new Vector2(-0.1,0.2),
        VectorMath2.zero(),
        false,
        "#111111"
    );

    var weld2=new Joint.Distance(stick, ball,
        new Vector2(0.1,0.2),
        VectorMath2.zero(),
        false,
        "#111111"
    );
    PhysicsScene.addJoint(weld1);
    PhysicsScene.addJoint(weld2);
    PhysicsScene.disableCollision(ball.id,stick.id);
    //weld the ball to the stick
    return id;
}

function hangPendulum()
{
    var mid=new Vector2(1,1.5);
    var plug=addPendulum(mid);
    PhysicsScene.entities[plug].vel.addEqual(new Vector2(-5,0));
}

function updateFrame()
{
    //console.log(PhysicsScene.entities);
    PhysicsScene.simulate(50);
    PhysicsScene.draw();
    //PhysicsScene.drawVertex();
    //PhysicsScene.drawContactPoint();
    requestAnimationFrame(updateFrame);
}

setupScene();
hangPendulum();
updateFrame();
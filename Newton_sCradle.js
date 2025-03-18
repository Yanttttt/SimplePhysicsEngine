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

    var length=1;

    var ball=new Entity.Circle(0.1, 0, 0, undefined,
        pos.add(new Vector2(0,-length)),
        VectorMath2.zero(),
        0,
        0,
        "#9F0000"
    )
    var id=PhysicsScene.addEntity(ball);

    var rope=new Joint.Distance(hinge, ball, VectorMath2.zero(), VectorMath2.zero(), true);
    PhysicsScene.addJoint(rope);
    return id;
}

function hangPendulum()
{
    var mid=new Vector2(1,1.5);
    addPendulum(mid);

    var diff=new Vector2(0.2,0);

    var plug=0;

    for(let i=1;i<=2;i++)
    {
        addPendulum(mid.add(diff.times(i)));
        plug=addPendulum(mid.add(diff.times(-i)));
    }
    //console.log(PhysicsScene.entities);

    PhysicsScene.entities[plug].vel.addEqual(new Vector2(-1,0));
}

function updateFrame()
{
    PhysicsScene.simulate(10);
    PhysicsScene.draw();
    PhysicsScene.drawVertex();
    PhysicsScene.drawContactPoint();
    requestAnimationFrame(updateFrame);
}

setupScene();
hangPendulum();
updateFrame();
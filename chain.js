import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as Collision from "./sp2d/Collision.js";
import * as Joint from "./sp2d/Joint.js";

var div = 2;

function setupScene() {
    Draw.init("myCanvas", Math.min(window.innerWidth - 20, window.innerHeight - 20), Math.min(window.innerWidth - 20, window.innerHeight - 20), 2);
    PhysicsScene.init(undefined, new Vector2(0.0, 0));
    PhysicsScene.setWallCollision(1,0);
}
window.setupScene = setupScene;


function createStick()
{
    var ball=new Entity.Circle(0.1, 1, 0, undefined,
        new Vector2(1,1.3),
        VectorMath2.zero(),
        0,
        0,
        "#9F0000"
    )
    PhysicsScene.addEntity(ball);

    var block= new Entity.Rectangle(
        0.1,
        0.1,
        1,
        0,
        undefined,
        new Vector2(0.7,1),
        new Vector2(0.7,1),
        0,
        0,
        "#0000FF"
    );
    PhysicsScene.addEntity(block);

    var stick=new Joint.Weld(
        ball,
        block,
        new Vector2(0,0),
        new Vector2(0,0),
        true,
        "#3f3f3f"
    );
    PhysicsScene.addJoint(stick);
}

function updateFrame()
{
    //console.log(PhysicsScene.entities);
    PhysicsScene.simulate(30);
    PhysicsScene.draw();
    PhysicsScene.drawVertex();
    PhysicsScene.drawContactPoint();
    requestAnimationFrame(updateFrame);
}

setupScene();
createStick();
updateFrame();
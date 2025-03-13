import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as collision from "./sp2d/Collision.js";

Draw.init("myCanvas");
PhysicsScene.init();

function addBlock() {
    var size = Math.random() * 0.2 + 0.1;
    var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
    var vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
    var angularVel = Math.random() * 2 - 1;

    var block = new Entity.Rectangle(size, size, null, null, pos, vel, 0, angularVel);

    PhysicsScene.addEntity(block);
}

// function addBall() {
//     var size = Math.random() * 0.2 + 0.1;
//     var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
//     var vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);

//     var ball = new Entity.Circle(size, null, null, pos, vel);

//     PhysicsScene.addEntity(ball);
// }





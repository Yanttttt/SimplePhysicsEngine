import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as Collision from "./sp2d/Collision.js";

var div = 2;

function setupScene() {
    Draw.init("myCanvas", Math.min(window.innerWidth - 20, window.innerHeight - 20), Math.min(window.innerWidth - 20, window.innerHeight - 20), 2);
    PhysicsScene.init(undefined, new Vector2(0.0, -9.8), 0.1);
    PhysicsScene.setFloorCollision(0.1, 0.1);
}
window.setupScene = setupScene;

function buildSeesaw() {
    var ver = [
        new Vector2(1 - 0.1, 0),
        new Vector2(1 + 0.1, 0),
        new Vector2(1, 0.17),
    ];
    var stand = new Entity.Polygon(ver, 0, 0.3, Infinity, VectorMath2.zero(), 0, 0, "#0000FF");
    var board = new Entity.Rectangle(
        1.5, 0.02, 0, 0.1,
        undefined,
        new Vector2(1, 0.17 + 0.01),
        VectorMath2.zero(),
        0,
        0,
        "#7F0000"
    );
    PhysicsScene.addEntity(stand);
    PhysicsScene.addEntity(board);
}

function layBlocks() {
    var level = 0.17 + 0.02;
    var s = 0.4;
    var n = 5, m = 3;
    var size = 0.1;
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < m; j++) {
            let pos = new Vector2(s + size/2+ i * size, level + size/2 + j * size);
            let block = new Entity.Rectangle(size, size, 0.1, 0.1, undefined, pos, VectorMath2.zero(), 0, 0, "#3F3FFF");
            PhysicsScene.addEntity(block);
        }
    }

    //right hand side
    level = 0.17 + 0.02;
    s = 1.4;
    n = 3, m = 3;
    size = 0.1;
    for (let i = 0; i < n; i++)
    {
        for (let j = 0; j < m; j++)
        {
            let pos = new Vector2(s + size/2+ i * size, level + size/2 + j * size);
            let block = new Entity.Rectangle(size, size, 0.1, 0.1, undefined, pos, VectorMath2.zero(), 0, 0, "#3F3FFF");
            PhysicsScene.addEntity(block);
        }
    }

    // let block = new Entity.Rectangle(0.2, 0.4, 0.1, 0.1, undefined, new Vector2(1.5, level + 0.2), VectorMath2.zero(), 0, 0, "#3F3FFF");
    //         PhysicsScene.addEntity(block);

    var ball = new Entity.Circle(0.2, 0, 0.1, undefined, new Vector2(1.7, 7),
        new Vector2(0, 0), 0, 0, "#3F3F3F");
    PhysicsScene.addEntity(ball);

    var ball = new Entity.Rectangle(0.2, 0.4, 0.1, 0.5, undefined, new Vector2(0.2, 0.1), VectorMath2.zero(), 0, 0, "#009F00");
    PhysicsScene.addEntity(ball);
}

function updateFrame() {
    //console.log(PhysicsScene.entities);
    PhysicsScene.simulate(10);
    PhysicsScene.draw();
    for (let e of PhysicsScene.entities) {
        if (e.type === "Rectangle" || e.type === "Polygon") {
            let v = e.getVertices();
            for (let i of v) {
                Draw.drawCircle(i, 0.007, "#FF0000");
            }
        }
        if (e.type === "Circle") {
            let x = Math.cos(e.angle);
            let y = Math.sin(e.angle);
            //console.log(e.angle);
            Draw.drawCircle((new Vector2(x, y)).times(e.radius).add(e.pos), 0.007, "#0000FF");
        }
        Draw.drawCircle(e.pos, 0.007, "#FF00FF");
    }
    // for (let c of PhysicsScene.collisions) {
    //     Draw.drawCircle(c.contactPoint, 0.007, "#FFFF00");
    // }
    requestAnimationFrame(updateFrame); //recursive call, default 60Hz
}

setupScene();
buildSeesaw();
layBlocks();
updateFrame();


import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as Collision from "./sp2d/Collision.js";

Draw.init("myCanvas");
PhysicsScene.init(undefined,new Vector2(0.0, -9.8));
//setWallCollision();
PhysicsScene.setThickWallCollision(1);

function addBlock() {
    var size = Math.random() * 0.2 + 0.1;
    var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
    var vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
    var angularVel = Math.random() * 2 - 1;

    var block = new Entity.Rectangle(size, size, 1, 0, pos, vel, 0, angularVel);

    console.log(block);
    console.log('Block added');
    PhysicsScene.addEntity(block);
}

window.addBlock = addBlock;

function addBall() {
    var size = (Math.random() * 0.2 + 0.1)/2;
    var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
    var vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);

    var ball = new Entity.Circle(size, undefined, undefined, pos, vel, "#CF0000");

    PhysicsScene.addEntity(ball);
}

window.addBall = addBall;

function setupScene() {
    PhysicsScene.init(undefined,new Vector2(0.0, -9.8));
    //setWallCollision();
    PhysicsScene.setWallCollision(1);
}
window.setupScene = setupScene;

function setWallCollision(restitution=0) {
    var simHeight=PhysicsScene.simHeight;
    var simWidth=PhysicsScene.simWidth;
    var top=new Entity.Rectangle(
        simWidth/2,
        0.1,
        restitution,
        Infinity,
        new Vector2(simWidth/2,simHeight*3/4),
        VectorMath2.zero(),
        0,
        0
    );
    top.setStatic();
    PhysicsScene.addEntity(top);

    var bottom=new Entity.Rectangle(
        simWidth/2,
        0.1,
        restitution,
        Infinity,
        new Vector2(simWidth/2,simHeight/4),
        VectorMath2.zero(),
        0,
        0
    );
    bottom.setStatic();
    PhysicsScene.addEntity(bottom);

    var left=new Entity.Rectangle(
        0.1,
        simHeight/2,
        restitution,
        Infinity,
        new Vector2(simWidth/4,simHeight/2),
        VectorMath2.zero(),
        0,
        0
    );
    left.setStatic();
    PhysicsScene.addEntity(left);

    var right=new Entity.Rectangle(
        0.1,
        simHeight/2,
        restitution,
        Infinity,
        new Vector2(simWidth*3/4,simHeight/2),
        VectorMath2.zero(),
        0,
        0
    );
    right.setStatic();
    PhysicsScene.addEntity(right);

    console.log(top.getVertices());
}

document.getElementById("restitutionSlider").oninput = function () {
    for(let i=0;i<PhysicsScene.entities.length;i++)
    {
        PhysicsScene.entities[i].restitution = this.value / 10.0;
    }
};

//console.log('addBlock is defined:', typeof addBlock === 'function');

function updateFrame() {
    //console.log(PhysicsScene.entities);
    PhysicsScene.simulate(4);
    PhysicsScene.draw();
    for(let e of PhysicsScene.entities)
    {
        if(e.type === "Rectangle") {
            let v = e.getVertices();
            for(let i of v) {
                Draw.drawCircle(i,0.01, "#FF0000");
            }
        }
    }
    for(let c of PhysicsScene.collisions)
    {
        Draw.drawCircle(c.contactPoint,0.01, "#FFFF00");
    }
    requestAnimationFrame(updateFrame); //recursive call, default 60Hz
}

updateFrame();


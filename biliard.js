import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as Collision from "./sp2d/Collision.js";

Draw.init("myCanvas",window.innerWidth-20,window.innerHeight-140,2);
PhysicsScene.init(undefined,new Vector2(0.0, 0),0.1);
//setWallCollision();
PhysicsScene.setWallCollision(1);

function addBlock() {
    var size1 = Math.random() * 0.2 + 0.1;
    var size2 = Math.random() * 0.2 + 0.1;
    var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
    var vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
    var angularVel = Math.random() * 2 - 1;

    var block = new Entity.Rectangle(size1, size2, 1, 0, undefined, pos, vel, 0, angularVel);

    console.log(block);
    console.log('Block added');
    PhysicsScene.addEntity(block);
}
window.addBlock = addBlock;

function addTriangle() {

    var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);

    //console.log(pos);

    var vertices=[];
    var p=[Math.random(),Math.random(),Math.random()];
    var tp=p[0]+p[1]+p[2];

    var angle=0;

    for(let i=0;i<3;i++)
    {
        let radius=Math.random() * 0.1 + 0.1;
        angle+=2*Math.PI*p[i]/tp;
        vertices.push(pos.add(new Vector2(
                Math.cos(angle)*radius,
                Math.sin(angle)*radius
            )));
    }

    //console.log(vertices);

    var vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
    var angularVel = Math.random() * 2 - 1;

    var triangle = new Entity.Polygon(vertices, 1, 0, undefined, vel, 0, angularVel);

    //console.log(triangle);
    //console.log(JSON.parse(JSON.stringify(triangle)));
    // console.log("mass:",triangle.mass);
    // //console.log(triangle.localVertices);
    // console.log("vertices",triangle.vertices);
    // console.log("pos",triangle.pos);
    console.log('Triangle added');

    // console.log(triangle);

    PhysicsScene.addEntity(triangle);
    // error;
    // console.log(PhysicsScene.entities);
}
window.addTriangle = addTriangle;

function addBall() {
    var size = (Math.random() * 0.2 + 0.1)/2;
    var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
    var vel = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);

    var ball = new Entity.Circle(size, 1, 0, undefined, pos, vel, "#CF0000");

    PhysicsScene.addEntity(ball);
}

window.addBall = addBall;

function setupScene() {
    PhysicsScene.init(undefined,new Vector2(0.0, -1.0));
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

document.getElementById("frictionSlider").oninput = function () {
    for(let i=0;i<PhysicsScene.entities.length;i++)
    {
        PhysicsScene.entities[i].friction = this.value/20;
    }
};

// document.addEventListener("click", (event) => {
//     var pos=new Vector2(event.clientX-10, event.clientY-10);

//     var rect = new Entity.Rectangle(
//         0.1, 0.1,
//         0.1, 0.1,
//         1,
//         new Vector2(pos.x/Draw.scale, 
//             (Draw.canvas.height-pos.y)/Draw.scale),// where the mouse is clicked in world
//         new Vector2(0, 0),
//         0,
//         0,
//         "#FF0000"
//     );
//     console.log("clicked!",pos.x/Draw.scale, (Draw.canvas.height-pos.y)/Draw.scale);
//     PhysicsScene.addEntity(rect);
// });

//console.log('addBlock is defined:', typeof addBlock === 'function');

function updateFrame() {
    //console.log(PhysicsScene.entities);
    PhysicsScene.simulate(20);
    PhysicsScene.draw();
    for(let e of PhysicsScene.entities)
    {
        if(e.type === "Rectangle"||e.type === "Polygon") {
            let v = e.getVertices();
            for(let i of v) {
                Draw.drawCircle(i,0.01, "#FF0000");
            }
        }
        if (e.type === "Circle")
        {
            let x = Math.cos(e.angle);
            let y = Math.sin(e.angle);
            //console.log(e.angle);
            Draw.drawCircle((new Vector2(x,y)).times(e.radius).add(e.pos),0.01, "#0000FF");
        }
        Draw.drawCircle(e.pos,0.01, "#FF00FF");
    }
    for(let c of PhysicsScene.collisions)
    {
        Draw.drawCircle(c.contactPoint,0.01, "#FFFF00");
    }
    requestAnimationFrame(updateFrame); //recursive call, default 60Hz
}

updateFrame();


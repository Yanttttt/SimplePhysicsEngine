import { Vector2, VectorMath2 } from "./sp2d/sp2d.js";
import { Draw, PhysicsScene, Entity, Collision, Joint } from "./sp2d/sp2d.js";

var jellos = [];

function setupScene() {
    Draw.init("myCanvas",
        Math.min(window.innerWidth - 20, window.innerHeight - 20),
        Math.min(window.innerWidth - 20, window.innerHeight - 20), 2
    );
    PhysicsScene.init(undefined, new Vector2(0.0, -5));
    //PhysicsScene.setWallCollision(0.5, 0.1);
}
window.setupScene = setupScene;

function slides() {
    var pos = new Vector2(0.7, 1.6);
    var slide1 = new Entity.Rectangle(
        1.4,
        0.08,
        0,
        0.2,
        Infinity,
        pos,
        VectorMath2.zero(),
        -0.13,
        0,
        "#5f3f1f"
    )
    slide1.setStatic();
    PhysicsScene.addEntity(slide1);

    pos = new Vector2(1.3, 0.7);
    var slide2 = new Entity.Rectangle(
        1.2,
        0.08,
        0,
        0.2,
        Infinity,
        pos,
        VectorMath2.zero(),
        0.1,
        0,
        "#5f3f1f"
    )
    slide2.setStatic();
    PhysicsScene.addEntity(slide2);

    pos = new Vector2(0.2, 0.05);
    var platform = new Entity.Rectangle(
        0.35,
        0.05,
        0.1,
        0.1,
        Infinity,
        pos,
        VectorMath2.zero(),
        0,
        0,
        "#00306f"
    )
    platform.setStatic();
    PhysicsScene.addEntity(platform);

    pos = new Vector2(0, 0.08);
    var platform = new Entity.Rectangle(
        0.05,
        0.11,
        0.1,
        0.1,
        Infinity,
        pos,
        VectorMath2.zero(),
        0,
        0,
        "#00306f"
    )
    platform.setStatic();
    PhysicsScene.addEntity(platform);

    pos = new Vector2(0.4, 0.08);
    var platform = new Entity.Rectangle(
        0.05,
        0.11,
        0.1,
        0.1,
        Infinity,
        pos,
        VectorMath2.zero(),
        0,
        0,
        "#00306f"
    )
    platform.setStatic();
    PhysicsScene.addEntity(platform);
}

function buildTrampoline() {
    var scale=5;

    var row = 2 * scale + 1;
    var col = 3 * scale + 1;

    var spacing = 0.1 / scale;
    var radius = 0.35 * spacing;

    var start = new Vector2(0.05, 0.4);

    var mass = ((row - 1) * (col - 1)) * spacing * spacing / row / col;
    //console.log(mass);

    var stiffness = 20;
    var damping = 0.02;
    //var start = new Vector2(1, 1.5);

    var particles = [];
    var ver = [];

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            var pos = new Vector2(
                start.x + j * spacing,
                start.y - i * spacing
            );
            var particle = new Entity.Particle(
                radius,
                0.1,
                0.1,
                mass,
                pos,
                new Vector2(0, 0),
                0,
                0,
                "#ffffff"
            );
            PhysicsScene.addEntity(particle);
            //console.log(particle);
            particles.push(particle);

            // if (i === 0 || i === row - 1) {
            //     ver.push(particle);
            // }
            // else if (j === 0 || j === col - 1)
            // {
            //     ver.push(particle);
            // }
        }

    }

    //console.log(PhysicsScene.entities);

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            var id = i * col + j;
            if (j < col - 1) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        false,
                        "#3f3f3f"
                    )
                ); //connect rtight
                PhysicsScene.disableCollision(particles[id].id, particles[id + 1].id);
            }

            if (i < row - 1) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        false,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col].id);
                //connect below
            }

            if (i < row - 1 && j < col - 1) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col + 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        false,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col + 1].id);
                // connect right-below
            }

            if (i < row - 1 && j > 0) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col - 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        false,
                        "#ffffff"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col - 1].id);
                // connect left-below
            }
        }
    }

    for (let i = 0; i < row; i++) {
        ver.push(particles[i * col]);
    }

    for (let i = 1; i < col; i++) {
        ver.push(particles[(row - 1) * col + i]);
    }

    // console.log(ver);
    // for (let vertex of ver)
    // {
    //     Draw.drawCircle(vertex.pos, 0.01, "#ff0000");
    //     console.log(vertex.pos);
    // }

    for (let i = row - 2; i >= 0; i--) {
        ver.push(particles[i * col + col - 1]);
    }

    for (let i = col - 2; i > 0; i--) {
        ver.push(particles[i]);
    }

    jellos.push(
        {
            vertices: ver,
            colour: "#00ef00"
        }
    );

    //console.log(ver);
}

/**
 * @param {Vector2} pos
 */
function buildPinwheel(pos)
{
    var blade1=new Entity.Rectangle(
        0.3,
        0.03,
        0.1,
        0.1,
        undefined,
        pos,
        VectorMath2.zero(),
        0,
        2,
        "#9f0000"
    );
    PhysicsScene.addEntity(blade1);
    var blade2=new Entity.Rectangle(
        0.3,
        0.03,
        0.1,
        0.1,
        undefined,
        pos,
        VectorMath2.zero(),
        Math.PI/2,
        0,
        "#9f0000"
    );
    PhysicsScene.addEntity(blade2);

    var axle=new Joint.Distance(
        blade1,
        blade2,
        new Vector2(0,0),
        new Vector2(0,0),
        false,
        "#ffffff"
    );
    PhysicsScene.addJoint(axle);

    var weld1=new Joint.Distance(
        blade1,
        blade2,
        new Vector2(0,0.15),
        new Vector2(0.15,0),
        false,
        "#3f3f3f"
    );
    PhysicsScene.addJoint(weld1);

    var weld2=new Joint.Distance(
        blade1,
        blade2,
        new Vector2(0,-0.15),
        new Vector2(-0.15,0),
        false,
        "#3f3f3f"
    );
    PhysicsScene.addJoint(weld2);

    PhysicsScene.disableCollision(blade1.id,blade2.id);

    return blade1;
}

function hangPinwheel()
{
    var posx=1.7;

    var pushpin= new Entity.Circle(
        0.005,
        0,
        0,
        Infinity,
        new Vector2(posx,1.95),
        VectorMath2.zero(),
        0,
        0,
        "#3f3f3f"
    );
    PhysicsScene.addEntity(pushpin);

    var pos1=new Vector2(posx,1.5);

    var pinwheel1=buildPinwheel(pos1);

    var spring=new Joint.Spring(
        pushpin,
        pinwheel1,
        VectorMath2.zero(),
        VectorMath2.zero(),
        0.03,
        10,
        0.02,
        true,
        "#3f3f3f"
    );
    PhysicsScene.addJoint(spring);

    var pos2=new Vector2(posx, 1.1);
    var pinwheel2=buildPinwheel(pos2);

    var rope=new Joint.Distance(
        pinwheel1,
        pinwheel2,
        new Vector2(0,0),
        new Vector2(0,0),
        true,
        "#3f3f3f"
    );
    PhysicsScene.addJoint(rope);

}

function buildScene() {
    slides();
    buildTrampoline();
    hangPinwheel();
}

function addBlock(pos) {
    var size1 = Math.random() * 0.05 + 0.05;
    var size2 = Math.random() * 0.05 + 0.05;
    //var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
    var vel = new Vector2(0,0);
    var angularVel = Math.random() * 2 - 1;

    var block = new Entity.Rectangle(size1, size2, 0.1, 0, undefined, pos, vel, 0, angularVel, Draw.getRandomColour());

    console.log(block);
    console.log('Block added');
    PhysicsScene.addEntity(block);
}
window.addBlock = addBlock;

function addBall(pos) {
    var size = (Math.random() * 0.05 + 0.05)/2;
    //var pos = new Vector2(Math.random() * PhysicsScene.worldSize.x, Math.random() * PhysicsScene.worldSize.y);
    var vel = new Vector2(0,0);

    var ball = new Entity.Circle(size, 0.1, 0, undefined, pos, vel, 0, 0, Draw.getRandomColour());

    PhysicsScene.addEntity(ball);
}

function updateFrame() {
    // console.log(PhysicsScene.entities);
    Draw.clear();
    PhysicsScene.simulate(10);
    PhysicsScene.draw();
    //PhysicsScene.drawVertex();
    //PhysicsScene.drawContactPoint();
    for(let e of PhysicsScene.entities)
    {
        if (e.type === "Circle") {
            let x = Math.cos(e.angle);
            let y = Math.sin(e.angle);
            //console.log(e.angle);
            Draw.drawCircle((new Vector2(x, y)).times(e.radius).add(e.pos), 0.003, "#ff0000");
        }
    }
    
    for (let jello of jellos) {
        var vertices = [];
        for (let i = 0; i < jello.vertices.length;i++)
        {
            vertices.push(jello.vertices[i].pos);
            //.add(jello.verCorr[i])
        }
        Draw.drawPolygon(vertices, jello.colour);
    }
    //error;
    requestAnimationFrame(updateFrame);
}

document.addEventListener("click", (event) => {
    var pos=new Vector2(event.clientX-10, event.clientY-10);
    var cvtpos=new Vector2(pos.x/Draw.scale, 
        (Draw.canvas.height-pos.y)/Draw.scale);


    var r=Math.floor(Math.random() * 2) + 1;

    var vx=10*Math.random()-5;
    var vy=10*Math.random()-5;

    switch(r)
    {
        case 1:
            addBall(cvtpos);
            break;
        case 2:
            addBlock(cvtpos);
            break;
    }
    //console.log("clicked!",pos.x/Draw.scale, (Draw.canvas.height-pos.y)/Draw.scale);
});

setupScene();
buildScene();
updateFrame();

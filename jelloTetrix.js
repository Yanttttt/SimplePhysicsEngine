import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as Collision from "./sp2d/Collision.js";
import * as Joint from "./sp2d/Joint.js";

var div = 2;

function setupScene() {
    Draw.init("myCanvas", Math.min(window.innerWidth - 20, window.innerHeight - 20), Math.min(window.innerWidth - 20, window.innerHeight - 20), 2);
    PhysicsScene.init(undefined, new Vector2(0.0, -9.8));
    PhysicsScene.setWallCollision(0.5,0);
}
window.setupScene = setupScene;

var jellos=[];


function jello1()
{
    var row=3;
    var col=3;
    var spacing =0.1;
    var radius=0.4*spacing;
    var mass=((row-1)*(col-1))*spacing*spacing/row/col;
    //console.log(mass);

    var stiffness=30;
    var damping=0.05;
    var start=new Vector2(1,1.5);

    var particles=[];

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            var pos = new Vector2(
                start.x + j * spacing,
                start.y - i * spacing
            );
            var particle = new Entity.Circle(
                radius,
                0.1,
                0,
                mass,
                pos,
                new Vector2(0,0),
                0,
                0,
                "#ff0000"
            );
            PhysicsScene.addEntity(particle);
            console.log(particle);
            particles.push(particle);
        }
    }

    console.log(PhysicsScene.entities);

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col; j++) {
            var id = i * col + j;
            if (j < col - 1) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id+1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        true,
                        "#3f3f3f"
                    )
                ); //connect rtight
                PhysicsScene.disableCollision(particles[id].id,particles[id+1].id);
            }

            if (i < row - 1) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id+col],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        true,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id,particles[id+col].id);
                //connect below
            }

            if (i < row - 1 && j < col - 1) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id+col+1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        true,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id,particles[id+col+1].id);
                // connect right-below
            }

            if (i < row - 1 && j > 0) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id+col-1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        true,
                        "#ffffff"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id,particles[id+col-1].id);
                // connect left-below
            }
        }
    }

    var vertices=[
        particles[0].pos.add(new Vector2(-radius/1.4,+radius/1.4)),
        particles[(row-1)*col].pos.add(
            new Vector2(-radius/1.4,-radius/1.4)
        ),
        particles[(row-1)*(col+1)].pos.add(new Vector2(radius/1.4, -radius/1.4)),
        particles[col-1].pos.add(new Vector2(radius/1.4,radius/1.4))
    ];
    
    jellos.push(vertices);
}

function updateFrame()
{
    // console.log(PhysicsScene.entities);
    PhysicsScene.simulate(30);
    PhysicsScene.draw();
    //PhysicsScene.drawVertex();
    PhysicsScene.drawContactPoint();
    for(let vertices of jellos)
    {
        Draw.drawPolygon(vertices,"#007f00");
    }
    //error;
    requestAnimationFrame(updateFrame);
}

setupScene();
jello1();
updateFrame();
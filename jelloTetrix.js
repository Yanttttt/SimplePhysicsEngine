import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as Collision from "./sp2d/Collision.js";
import * as Joint from "./sp2d/Joint.js";

var div = 2;

function setupScene() {
    Draw.init("myCanvas");
    PhysicsScene.init(undefined, new Vector2(0.0, -3));
    PhysicsScene.setWallCollision(0.5, 0.1);
}
window.setupScene = setupScene;

var jellos = [];

function jelloSquare(startx=1,starty=1.5,dragx=10,dragy=10) {
    var row = 7;
    var col = 7;

    var spacing = 0.05;
    var radius = 0.4 * spacing;

    var start = new Vector2(startx, starty);

    var mass = ((row - 1) * (col - 1)) * spacing * spacing / row / col;
    //console.log(mass);

    var stiffness = 20;
    var damping = 0.03;
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
            console.log(particle);
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

    console.log(PhysicsScene.entities);

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

    for (let i = 0; i < row; i++)
    {
        ver.push(particles[i * col]);
    }

    for (let i = 1; i < col; i++)
    {
        ver.push(particles[(row-1) * col + i]);
    }

    // console.log(ver);
    // for (let vertex of ver)
    // {
    //     Draw.drawCircle(vertex.pos, 0.01, "#ff0000");
    //     console.log(vertex.pos);
    // }

    for (let i = row-2; i >=0; i--)
    {
        ver.push(particles[i * col + col - 1]);
    }

    for (let i = col - 2; i > 0; i--) {
        ver.push(particles[i]);
    }

    // var ver = [
    //     particles[0],
    //     particles[(row - 1) * col],
    //     particles[(row - 1) * (col + 1)],
    //     particles[col - 1]
    // ];

    var corr = [
        new Vector2(-radius / 1.4, +radius / 1.4),
        new Vector2(-radius / 1.4, -radius / 1.4),
        new Vector2(radius / 1.4, -radius / 1.4),
        new Vector2(radius / 1.4, radius / 1.4)
    ];

    jellos.push(
        {
            vertices: ver,
            verCorr: corr,
            colour: Draw.getRandomColour() 
        }
    );

    console.log(ver);
    
    particles[0].vel.addEqual(new Vector2(dragx, dragy));
}

function jelloLong(startx=1,starty=1.5,dragx=10,dragy=10) {
    var row = 16;
    var col = 4;

    var spacing = 0.05;
    var radius = 0.4 * spacing;

    var start = new Vector2(startx, starty);

    var mass = ((row - 1) * (col - 1)) * spacing * spacing / row / col;
    //console.log(mass);

    var stiffness = 20;
    var damping = 0.03;
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
            console.log(particle);
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

    console.log(PhysicsScene.entities);

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

    for (let i = 0; i < row; i++)
    {
        ver.push(particles[i * col]);
    }

    for (let i = 1; i < col; i++)
    {
        ver.push(particles[(row-1) * col + i]);
    }

    // console.log(ver);
    // for (let vertex of ver)
    // {
    //     Draw.drawCircle(vertex.pos, 0.01, "#ff0000");
    //     console.log(vertex.pos);
    // }

    for (let i = row-2; i >=0; i--)
    {
        ver.push(particles[i * col + col - 1]);
    }

    for (let i = col - 2; i > 0; i--) {
        ver.push(particles[i]);
    }

    // var ver = [
    //     particles[0],
    //     particles[(row - 1) * col],
    //     particles[(row - 1) * (col + 1)],
    //     particles[col - 1]
    // ];

    var corr = [
        new Vector2(-radius / 1.4, +radius / 1.4),
        new Vector2(-radius / 1.4, -radius / 1.4),
        new Vector2(radius / 1.4, -radius / 1.4),
        new Vector2(radius / 1.4, radius / 1.4)
    ];

    jellos.push(
        {
            vertices: ver,
            verCorr: corr,
            colour: Draw.getRandomColour() 
        }
    );
    
    particles[0].vel.addEqual(new Vector2(dragx, dragy));
}

function jelloT(startx=1,starty=1.5,dragx=10,dragy=10) {
    var row = 10;
    var col=[
        4, 4, 4,
        7, 7, 7, 7,
        4, 4, 4
    ];

    var num = 4 * 6 + 7 * 4;
    var area = 3 * 3 * 4 * spacing ** 2;

    var spacing = 0.05;
    var radius = 0.4 * spacing;

    var start = new Vector2(startx, starty);

    var mass = area/num;
    //console.log(mass);

    var stiffness = 20;
    var damping = 0.03;
    //var start = new Vector2(1, 1.5);

    var particles = [];
    var ver = [];

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col[i]; j++) {
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
            console.log(particle);
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

    console.log(PhysicsScene.entities);

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col[i]; j++) {
            var id = i * col[i] + j;
            if (j < col[i] - 1) {
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
                        particles[id + col[i]],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        false,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i]].id);
                //connect below
            }

            if (i < row - 1 && j < col[i] - 1) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col[i] + 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        false,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i] + 1].id);
                // connect right-below
            }

            if (i < row - 1 && j > 0) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col[i] - 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.01,
                        stiffness,
                        damping,
                        false,
                        "#ffffff"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i] - 1].id);
                // connect left-below
            }
        }
    }

    for (let i = 0; i < row; i++)
    {
        ver.push(particles[i * col[i]]);
    }

    for (let i = 1; i < col[i]; i++)
    {
        ver.push(particles[(row-1) * col[i] + i]);
    }

    // console.log(ver);
    // for (let vertex of ver)
    // {
    //     Draw.drawCircle(vertex.pos, 0.01, "#ff0000");
    //     console.log(vertex.pos);
    // }

    for (let i = row-2; i >=0; i--)
    {
        ver.push(particles[i * col + col - 1]);
    }

    for (let i = col - 2; i > 0; i--) {
        ver.push(particles[i]);
    }

    // var ver = [
    //     particles[0],
    //     particles[(row - 1) * col],
    //     particles[(row - 1) * (col + 1)],
    //     particles[col - 1]
    // ];

    var corr = [
        new Vector2(-radius / 1.4, +radius / 1.4),
        new Vector2(-radius / 1.4, -radius / 1.4),
        new Vector2(radius / 1.4, -radius / 1.4),
        new Vector2(radius / 1.4, radius / 1.4)
    ];

    jellos.push(
        {
            vertices: ver,
            verCorr: corr,
            colour: Draw.getRandomColour() 
        }
    );

    console.log(ver);
    
    particles[0].vel.addEqual(new Vector2(dragx, dragy));
}

function updateFrame() {
    // console.log(PhysicsScene.entities);
    Draw.clear();
    PhysicsScene.simulate(10);
    PhysicsScene.draw();
    //PhysicsScene.drawVertex();
    //PhysicsScene.drawContactPoint();
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

setupScene();
jelloSquare(0.8,2,10,10);
jelloLong(1,1.5,10,10);

//jelloT(1,1.5,10,10);

updateFrame();
import { Vector2, VectorMath2 } from "./sp2d/Vector2.js";
import * as Draw from "./sp2d/Draw.js";
import * as PhysicsScene from "./sp2d/PhysicsScene.js";
import * as Entity from "./sp2d/Entity.js";
import * as Collision from "./sp2d/Collision.js";
import * as Joint from "./sp2d/Joint.js";

//I initially want to write the soft body as a class
//But due to the tight schedule, I can only make it as a demo.
//So it may take slightly larger more lines to implement it.

var div = 2;

function setupScene() {
    Draw.init("myCanvas",Math.min(window.innerWidth - 20, window.innerHeight - 20), Math.min(window.innerWidth - 20, window.innerHeight - 20), 2);
    PhysicsScene.init(undefined, new Vector2(0.0, -2));
    PhysicsScene.setWallCollision(0.5, 0.1);
}
window.setupScene = setupScene;

var jellos = [];

var scale=3;

var vis=true;

function jelloSquare(startx=1,starty=1.5,dragx=10,dragy=10) {
    var row = 2*scale+1;
    var col = 2*scale+1;

    var spacing = 0.1/scale;
    var radius = 0.35 * spacing;

    var start = new Vector2(startx, starty);

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

    //console.log(ver);
    
    particles[0].vel.addEqual(new Vector2(dragx, dragy));
}

function jelloLong(startx=1,starty=1.5,dragx=10,dragy=10) {
    var row = 4*scale+1;
    var col = 1*scale+1;

    var spacing = 0.1/scale;
    var radius = 0.4 * spacing;

    var start = new Vector2(startx, starty);

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

function jelloL(startx=1,starty=1.5,dragx=10,dragy=10) {
    var row = 3*scale+1;
    var col=[];

    var num = 0;

    for(let i=0;i<row;i++)
    {
        if(i>=2*scale&&i<=3*scale)
        {
            col.push(2*scale+1);
            num+=2*scale+1;
        }
        else{
            num+=2*scale+1;
            col.push(scale+1);
        }
    }

    //console.log(col);

    var area = scale * scale * 4 * spacing ** 2;

    var spacing = 0.1/scale;
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
                "#ff0000"
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

    //PhysicsScene.draw();
    var idc=0;

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col[i]; j++) {
            
            var id = idc + j;
            //console.log("id:",id);

            if (j < col[i] - 1) {
                // Draw.clear();
                // console.log(i);
                // PhysicsScene.draw();
                // Draw.drawCircle(particles[id].pos,0.01,"#00FF00");
                // Draw.drawCircle(particles[id + 1].pos,0.01,"#00FF00");
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.001,
                        stiffness,
                        damping,
                        vis,
                        "#3f3f3f"
                    )
                ); //connect rtight
                PhysicsScene.disableCollision(particles[id].id, particles[id + 1].id);
            }

            if (i < row - 1&&j < col[i+1]) {
                // Draw.clear();
                // PhysicsScene.draw();
                // Draw.drawCircle(particles[id].pos,0.01,"#00FF00");
                // Draw.drawCircle(particles[id + col[i+1]].pos,0.01,"#00FF00");
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col[i]],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.001,
                        stiffness,
                        damping,
                        vis,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i+1]].id);
                //connect below
            }

            if (i < row - 1 && j < col[i+1] - 1 && j+1<Math.min(col[i+1],col[i])) {
                // Draw.clear();
                // console.log(i);
                // PhysicsScene.draw();
                // Draw.drawCircle(particles[id].pos,0.01,"#00FF00");
                // Draw.drawCircle(particles[id + col[i+1]+1].pos,0.01,"#00FF00");
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col[i] + 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.001,
                        stiffness,
                        damping,
                        vis,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i+1] + 1].id);
                // connect right-below
            }

            if (i < row - 1 && j > 0 && j<col[i+1]) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col[i] - 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.001,
                        stiffness,
                        damping,
                        vis,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i+1] - 1].id);
                // connect left-below
            }
        }
        idc+=col[i];
    }

    idc=0;

    //add vertices along edges anticlockwise

    for (let i = 0; i < row; i++)
    {
        ver.push(particles[idc]);
        idc+=col[i];
    }//left

    idc-=col[row-1];
    for (let i = 1; i < col[row-1]; i++)
    {
        ver.push(particles[idc + i]);
    }//bottom

    for (let i = row-2; i >=2*scale; i--)
    {
        idc-=col[i];
        ver.push(particles[idc+col[i+1]-1]);
    }//right1

    for (let i = 2*scale-1; i > scale-1; i--)
    {
        ver.push(particles[idc + i]);
    }//right2

    for (let i = 2*scale-1; i >=0; i--)
    {
        idc-=col[i];
        ver.push(particles[idc+col[i]-1]);
    }//right3

    for (let i = scale-1; i > 0; i--)
    {
        ver.push(particles[idc + i]);
    }//right4
    
    // console.log(ver);
    // for (let vertex of ver)
    // {
    //     Draw.drawCircle(vertex.pos, 0.01, "#ff0000");
    //     console.log(vertex.pos);
    // }
    // error;


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

    //console.log(ver);
    
    //particles[0].vel.addEqual(new Vector2(dragx, dragy));
}

function jelloT(startx=1,starty=1.5,dragx=10,dragy=10) {
    var row = 3*scale+1;
    var col=[];

    var num = 0;

    for(let i=0;i<row;i++)
    {
        if(i>=scale&&i<=2*scale)
        {
            col.push(2*scale+1);
            num+=2*scale+1;
        }
        else{
            num+=2*scale+1;
            col.push(scale+1);
        }
    }

    //console.log(col);

    var area = scale * scale * 4 * spacing ** 2;

    var spacing = 0.1/scale;
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
                "#ff0000"
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

    //PhysicsScene.draw();
    var idc=0;

    for (let i = 0; i < row; i++) {
        for (let j = 0; j < col[i]; j++) {
            
            var id = idc + j;
            //console.log("id:",id);

            if (j < col[i] - 1) {
                // Draw.clear();
                // console.log(i);
                // PhysicsScene.draw();
                // Draw.drawCircle(particles[id].pos,0.01,"#00FF00");
                // Draw.drawCircle(particles[id + 1].pos,0.01,"#00FF00");
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.001,
                        stiffness,
                        damping,
                        vis,
                        "#3f3f3f"
                    )
                ); //connect rtight
                PhysicsScene.disableCollision(particles[id].id, particles[id + 1].id);
            }

            if (i < row - 1&&j < col[i+1]) {
                // Draw.clear();
                // PhysicsScene.draw();
                // Draw.drawCircle(particles[id].pos,0.01,"#00FF00");
                // Draw.drawCircle(particles[id + col[i+1]].pos,0.01,"#00FF00");
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col[i]],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.001,
                        stiffness,
                        damping,
                        vis,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i+1]].id);
                //connect below
            }

            if (i < row - 1 && j < col[i+1] - 1 && j+1<Math.min(col[i+1],col[i])) {
                // Draw.clear();
                // console.log(i);
                // PhysicsScene.draw();
                // Draw.drawCircle(particles[id].pos,0.01,"#00FF00");
                // Draw.drawCircle(particles[id + col[i+1]+1].pos,0.01,"#00FF00");
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col[i] + 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.001,
                        stiffness,
                        damping,
                        vis,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i+1] + 1].id);
                // connect right-below
            }

            if (i < row - 1 && j > 0 && j<col[i+1]) {
                PhysicsScene.addJoint(
                    new Joint.Spring(
                        particles[id],
                        particles[id + col[i] - 1],
                        VectorMath2.zero(),
                        VectorMath2.zero(),
                        0.001,
                        stiffness,
                        damping,
                        vis,
                        "#3f3f3f"
                    )
                );
                PhysicsScene.disableCollision(particles[id].id, particles[id + col[i+1] - 1].id);
                // connect left-below
            }
        }
        idc+=col[i];
    }

    idc=0;

    //add vertices along edges anticlockwise

    for (let i = 0; i < row; i++)
    {
        ver.push(particles[idc]);
        idc+=col[i];
    }//left

    idc-=col[row-1];
    for (let i = 1; i < col[row-1]; i++)
    {
        ver.push(particles[idc + i]);
    }//bottom

    for (let i = row-2; i >=2*scale; i--)
    {
        idc-=col[i];
        ver.push(particles[idc+col[i+1]-1]);
    }//right1

    for (let i = col[0]; i < 2*scale+1; i++)
    {
        ver.push(particles[idc + i]);
    }//right2

    for (let i = 2*scale; i >scale; i--)
    {
        idc-=col[i];
        ver.push(particles[idc+col[i]-1]);
    }//right3

    for (let i = 2*scale-1; i > scale-1; i--)
    {
        ver.push(particles[idc + i]);
    }//right4

    for (let i = scale-1; i >=0; i--)
    {
        idc-=col[i];
        ver.push(particles[idc+col[i]-1]);
    }//right5

    for (let i = scale-1; i > 0; i--)
    {
        ver.push(particles[idc + i]);
    }//right6
    
    // console.log(ver);
    // for (let vertex of ver)
    // {
    //     Draw.drawCircle(vertex.pos, 0.01, "#ff0000");
    //     console.log(vertex.pos);
    // }
    // error;


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

    //console.log(ver);
    
    //particles[0].vel.addEqual(new Vector2(dragx, dragy));
}

function updateFrame() {
    // console.log(PhysicsScene.entities);
    Draw.clear();
    PhysicsScene.simulate(7);
    //PhysicsScene.draw();
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

document.addEventListener("click", (event) => {
    var pos=new Vector2(event.clientX-10, event.clientY-10);
    var cvtpos=new Vector2(pos.x/Draw.scale, 
        (Draw.canvas.height-pos.y)/Draw.scale);


    var r=Math.floor(Math.random() * 4) + 1;

    var vx=10*Math.random()-5;
    var vy=10*Math.random()-5;

    switch(r)
    {
        case 1:
            jelloSquare(cvtpos.x,cvtpos.y,vx,vy);
            break;
        case 2:
            jelloLong(cvtpos.x,cvtpos.y,vx,vy);
            break;
        case 3:
            jelloL(cvtpos.x,cvtpos.y,vx,vy);
            break;
        case 4:
            jelloT(cvtpos.x,cvtpos.y,vx,vy);
            break;
    }
    //console.log("clicked!",pos.x/Draw.scale, (Draw.canvas.height-pos.y)/Draw.scale);
});

setupScene();
// jelloSquare(0.8,2,5,5);
// jelloLong(1,1.5,10,10);

//jelloL(1,1.5,10,10);

updateFrame();
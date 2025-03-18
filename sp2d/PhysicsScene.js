import * as Draw from "./Draw.js";
import * as Entity from "./Entity.js";
import * as Collision from "./Collision.js";
import { Vector2, VectorMath2 } from "./Vector2.js";

export var simWidth;
export var simHeight;

export var gravity = new Vector2(0, -9.8);
export var dt = 1.0 / 60;
export var worldSize = new Vector2(0, 0); // Initialize with default values
export var paused = true;
export var airResistance = 0.0;
/**  @type {Entity.Rectangle[]|Entity.Circle[]} */
export var entities = [];
/** @type {Collision.Collision[]} */
export var collisions = [];
//export var maxAngularVel = 10.0;

export function init(worldSize_ = null, gravity_ = new Vector2(0.0, -9.8), airResistance_=0.0) {
    simWidth = Draw.canvas.width / Draw.scale;
    simHeight = Draw.canvas.height / Draw.scale;

    gravity = gravity_;
    worldSize = worldSize_;
    airResistance = airResistance_;
    //maxAngularVel = maxAngularVel_;

    paused = false;

    entities = [];
    collisions = [];

    dt = 1.0 / 60;

    if (worldSize == null) {
        worldSize = new Vector2(simWidth, simHeight);
    }

    console.log("Simulation width:", simWidth, "Simulation height:", simHeight);
}

export function addEntity(entity) {
    entity.id = entities.length;
    entities.push(entity);
    return entity.id;
    // Passing by reference, id has been changed. 
    // But it may make some convenience.
}

export function addCollision(collision) {
    collisions.push(collision);
}

export function togglePause() {
    paused = !paused;
}

export function setPaused(p) {
    paused = p;
}

export function setGravity(g) {
    gravity = g;
}

export function setDt(d) {
    dt = d;
}

export function setFloorCollision(restitution = 0, friction = 0) {
    var thickness = 0.5;
    var bottom = new Entity.Rectangle(
        simWidth,
        thickness,
        restitution,
        friction,
        Infinity,
        new Vector2(simWidth / 2, -thickness / 2),
        //new Vector2(simWidth/2,0),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    bottom.setStatic();
    addEntity(bottom);
}

export function setWallCollision(restitution = 0, friction = 0) {
    var thickness = 0.5;
    var top = new Entity.Rectangle(
        simWidth,
        thickness,
        restitution,
        friction,
        Infinity,
        new Vector2(simWidth / 2, simHeight + thickness / 2),
        //new Vector2(simWidth/2,simHeight),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    top.setStatic();
    addEntity(top);

    var bottom = new Entity.Rectangle(
        simWidth,
        thickness,
        restitution,
        friction,
        Infinity,
        new Vector2(simWidth / 2, -thickness / 2),
        //new Vector2(simWidth/2,0),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    bottom.setStatic();
    addEntity(bottom);

    var left = new Entity.Rectangle(
        thickness,
        simHeight,
        restitution,
        friction,
        Infinity,
        new Vector2(-thickness / 2, simHeight / 2),
        //new Vector2(0,simHeight/2),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    left.setStatic();
    addEntity(left);

    var right = new Entity.Rectangle(
        thickness,
        simHeight,
        restitution,
        friction,
        Infinity,
        //new Vector2(simWidth,simHeight/2),
        new Vector2(simWidth + thickness / 2, simHeight / 2),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    right.setStatic();
    addEntity(right);
}

export function setThickWallCollision(restitution = 0,friction = 0) {
    var thickness = 0.5;
    var top = new Entity.Rectangle(
        simWidth,
        thickness,
        restitution,
        friction,
        Infinity,
        //new Vector2(simWidth/2,simHeight+thickness/2),
        new Vector2(simWidth / 2, simHeight),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    top.setStatic();
    addEntity(top);

    var bottom = new Entity.Rectangle(
        simWidth,
        thickness,
        restitution,
        friction,
        Infinity,
        //new Vector2(simWidth/2,-thickness/2),
        new Vector2(simWidth / 2, 0),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    bottom.setStatic();
    addEntity(bottom);

    var left = new Entity.Rectangle(
        thickness,
        simHeight,
        restitution,
        friction,
        Infinity,
        //new Vector2(-thickness/2,simHeight/2),
        new Vector2(0, simHeight / 2),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    left.setStatic();
    addEntity(left);

    var right = new Entity.Rectangle(
        thickness,
        simHeight,
        restitution,
        friction,
        Infinity,
        new Vector2(simWidth, simHeight / 2),
        // new Vector2(simWidth+thickness/2,simHeight/2),
        VectorMath2.zero(),
        0,
        0,
        "#4F4F4F"
    );
    right.setStatic();
    addEntity(right);
}

export function simulate(substep = 1) {
    if (paused) return;

    collisions = [];

    // substep indicates how many times we simulate in 1 frame.
    for (let k = 0; k < substep; k++) {
        for (let i = 0; i < entities.length; i++) {
            //console.log(entities[i].pos);
            var p = entities[i].pos.clone();
            if ((p.x > 2 * simWidth || p.x < -simWidth) && (p.y < -simHeight || p.y > 2 * simHeight)) continue;
            entities[i].simulate(dt / substep, gravity);
        }

        for (let i = 0; i < entities.length; i++) {
            for (let j = i + 1; j < entities.length; j++) {
                var collision = Collision.detect(entities[i], entities[j]);
                if (collision != null) {
                    //console.log(collision);
                    //error;
                    addCollision(collision);
                }
            }
        }

        for (let i = 0; i < collisions.length; i++) {
            collisions[i].resolve();
        }
    }
}

export function draw() {
    Draw.clear();
    for (let i = 0; i < entities.length; i++) {
        entities[i].draw();
    }
}
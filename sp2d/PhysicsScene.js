import * as Draw from "./Draw.js";
import * as Entities from "./Entity.js";
import * as Collision from "./Collision.js";
import { Vector2, VectorMath2 } from "./Vector2.js";

var simWidth;
var simHeight;

export var gravity = new Vector2(0, -5);
export var dt = 1.0 / 60;
export var worldSize = new Vector2(0, 0); // Initialize with default values
export var paused = true;
var entities = [/** @type {Entity.Entity} */];
var collisions = [/** @type {Collision.Collision} */];
var maxAngularVel = 10.0;

export function init(worldSize_ = null, gravity_ = new Vector2(0.0, -9.8), maxAngularVel_ = 10.0) {
    simWidth = Draw.canvas.width / Draw.scale;
    simHeight = Draw.canvas.height / Draw.scale;

    gravity = gravity_;
    worldSize = worldSize_;
    maxAngularVel = maxAngularVel_;

    entities = [];
    collisions = [];

    if (worldSize == null) {
        worldSize = new Vector2(simWidth, simHeight);
    }

    console.log("Simulation width:", simWidth, "Simulation height:", simHeight);
}

export function addEntity(entity) {
    entities.push(entity);
}

export function addCollision(collision) {
    collisions.push(collision);
}

export function simulate() {
    if (paused) return;

    for (let i = 0; i < entities.length; i++) {
        entities[i].simulate(dt, gravity);
    }

    for (let i = 0; i < entities.length; i++) {
        for (let j = i + 1; j < i; j++) {
            var collision = Collision.detect(entities[i],entities[j]);
            if (collision != null) {
                addCollision(collision);
            }
        }
    }

    for (let i = 0; i < collisions.length; i++) {
        collisions[i].resolve();
    }

    collisions = [];
}
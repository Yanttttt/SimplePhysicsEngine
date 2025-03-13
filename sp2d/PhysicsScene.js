export function init()
{
    canvas = document.getElementById(canvasID);
    ctx = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;

    var div = 2;
    var scale = Math.min(canvas.width, canvas.height) / div;
    var simWidth = canvas.width / scale;
    var simHeight = canvas.height / scale;
}

var physicsScene = {
    gravity: new Vector2(0, -5),
    dt: 1.0 / 60,
    worldSize: new Vector2(simWidth, simHeight),
    paused: true,
    blocks: [],
    collisions: [],
    restitution: 1.0,
    maxAngularVel: 10.0
};
//import * as body from "./Body.js";

export var canvas;
export var ctx;
export var scale;

/**
 * @param {string} canvasID
 */
export function init(canvasID, width=window.innerWidth - 20, height=window.innerHeight - 100, div=2)
{
    canvas = /** @type {HTMLCanvasElement} */ (document.getElementById(canvasID));
    ctx = /** @type {HTMLCanvasElement} */ (canvas).getContext("2d");
    canvas.width = width;
    canvas.height = height;

    scale = Math.min(canvas.width, canvas.height) / div;
}

function convertX(pos)
{
    return pos.x * scale;
}

function convertY(pos)
{
    return canvas.height - pos.y * scale;
}


export function drawRectangle(r)
{
    ctx.fillStyle=r.colour;

    ctx.save();
    ctx.translate(convertX(r.pos), convertY(r.pos));
    ctx.rotate(r.angle);
    ctx.fillRect(
        -scale * r.width / 2,
        -scale * r.length / 2,
        scale * r.width,
        scale * r.length
    );
    ctx.restore();
}

export function drawCircle(r)
{
    ctx.fillStyle=r.colour;

    ctx.beginPath();
    ctx.arc(
        convertX(r.pos),
        convertY(r.pos),
        scale * r.radius,
        0,
        2 * Math.PI
    );
    ctx.closePath();
    ctx.fill();
}

export function clear()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
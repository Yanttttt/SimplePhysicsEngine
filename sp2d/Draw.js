import * as Entity from "./Entity.js";

export var canvas;
export var ctx;
export var scale;
export var div;

/**
 * @param {string} canvasID
 */
export function init(canvasID, width=window.innerWidth - 20, height=window.innerHeight - 100, div_=2)
{
    div=div_;
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

export function getRandomColour() {
    let r = Math.floor(Math.random() * 256).toString(16);
    let g = Math.floor(Math.random() * 256).toString(16);
    let b = Math.floor(Math.random() * 256).toString(16);

    r = r.length === 1 ? "0" + r : r;
    g = g.length === 1 ? "0" + g : g;
    b = b.length === 1 ? "0" + b : b;

    return "#"+(r + g + b).toUpperCase();
}



export function drawRectangle(pos,angle,width,length,colour)
{
    ctx.fillStyle=colour;

    ctx.save();
    ctx.translate(convertX(pos), convertY(pos));
    ctx.rotate(-angle);
    ctx.fillRect(
        -scale * width / 2,
        -scale * length / 2,
        scale * width,
        scale * length
    );
    ctx.restore();
}

export function drawCircle(pos,radius,colour)
{
    ctx.fillStyle=colour;

    ctx.beginPath();
    ctx.arc(
        convertX(pos),
        convertY(pos),
        scale * radius,
        0,
        2 * Math.PI
    );
    //ctx.closePath();
    ctx.fill();
}

export function drawPolygon(vertices, colour = "#FF0000") {
    if (!vertices || vertices.length < 3) return;
    // at least need 3 vertices.

    ctx.fillStyle = colour;
    ctx.beginPath();

    var v0 = vertices[0];
    ctx.moveTo(convertX(v0), convertY(v0));

    for (let i = 1; i < vertices.length; i++) {
        let v = vertices[i];
        ctx.lineTo(convertX(v),convertY(v));
    }

    ctx.closePath();
    ctx.fill();
}

export function clear()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
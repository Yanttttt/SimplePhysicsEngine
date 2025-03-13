var canvas;
var ctx;
var scale;

export function init(canvasID, width=window.innerWidth - 20, height=window.innerHeight - 100, scale)
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

function cx(pos) {
    return pos.x * scale;
}

function cy(pos) {
    return canvas.height - pos.y * scale;
}

export function drawRectangle()
{
    ctx.save();
    ctx.translate(cx(block.pos), cy(block.pos));
    ctx.rotate(block.angle);
    ctx.fillRect(
        -scale * block.size / 2,
        -scale * block.size / 2,
        scale * block.size,
        scale * block.size
    );
    ctx.restore();
}
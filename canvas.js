function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function resizeToFit() {
    var width = parseFloat(window.getComputedStyle(canvas).width);
    var height = parseFloat(window.getComputedStyle(canvas).height);
    resizeCanvas(width, height);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(var i = 0; i < p_stack.length; i++){
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "orange";
        ctx.arc(p_stack[i].x, p_stack[i].y, p_stack[i].radius, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var p_stack = [];
var point = {
    x: "",
    y: "",
    radius: 3
};
var enableInsert = false;
var move = point;

resizeToFit();
function insert(){
    enableInsert = true;
}

function del(){
    p_stack.pop();
    draw();
}

function modify() {

}

function findPoint(click){
    for(var i = 0; i <p_stack.length; i++){
        var v = {
            x: p_stack[i].x - click.x,
            y: p_stack[i].y - click.y
        };
        if(Math.sqrt(v.x * v.x + v.y * v.y) <=3){
            return p_stack[i];
        }
    }
    return null;
}

canvas.addEventListener('mousedown', function(e) {
    move = findPoint({
        x: e.offsetX,
        y: e.offsetY
    });
});

canvas.addEventListener('mousemove', function(e) {
    if (move !== null) {
        move.x = e.offsetX;
        move.y = e.offsetY;
        draw();
    }
});

canvas.addEventListener('mouseup', function(e) {
    move = false;
});







canvas.addEventListener("click", function(e) {
    if(enableInsert){
        point.x = e.offsetX;
        point.y = e.offsetY;
        p_stack.push(point);
        draw();
    }
    enableInsert = false;
});


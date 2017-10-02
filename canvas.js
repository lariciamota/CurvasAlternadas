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
    drawPoints();
    drawPolygonal();
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var button_Points = document.getElementById('pontos');
var button_Polygonal = document.getElementById('poligonal');

var p_stack = [];
var move = null;
var hidePoints = false;
var hidePolygonal = false;

resizeToFit();

canvas.addEventListener("click", function(e) {
    if(findPoint(e) === null){
        var d = {
            x: "",
            y: ""
        };
        d.x = e.offsetX;
        d.y = e.offsetY;
        p_stack.push(d);
        draw();
    }

});

function findPoint(click){
    for(var i = 0; i <p_stack.length; i++){
        var v = {
            x: p_stack[i].x - click.x,
            y: p_stack[i].y - click.y
        };
        if(Math.sqrt(v.x * v.x + v.y * v.y) <= 5){
            return p_stack[i]; //retornar o ponto que foi clicado e sera movido
        }
    }
    return null;
}

canvas.addEventListener('dblclick', function(e){
    var x = findPoint(e);
    if(x !== null){
        p_stack.splice(p_stack.indexOf(x), 1);
        draw();
    }
});

canvas.addEventListener('mousedown', function(e) {
    move = findPoint(e); //verificar se a coord clicada corresponde a algum ponto
});

canvas.addEventListener('mousemove', function(e) {
    if (move !== null) { //se foi clicado num ponto existente, atualiza nova coord
        move.x = e.offsetX;
        move.y = e.offsetY;
        draw();
    }
});

canvas.addEventListener('mouseup', function() {
    move = null;
});

function drawPoints() {
    for(var i = 0; i < p_stack.length; i++){
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "orange";
        ctx.arc(p_stack[i].x, p_stack[i].y, 5, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}

function drawPolygonal() {
    for(var j = 0; j < p_stack.length-1; j++){
        ctx.beginPath();
        ctx.strokeStyle = "orange";
        ctx.moveTo(p_stack[j].x, p_stack[j].y);
        ctx.lineTo(p_stack[j+1].x, p_stack[j+1].y);
        ctx.stroke();
    }
}
function points() {
    if(hidePoints){
        hidePoints = false;
    } else {
        hidePoints = true;
    }
}
function polyonal() {
    if(hidePolygonal){
        hidePolygonal = false;
    } else {
        hidePolygonal = true;
    }
}
button_Points.onclick = function hidePoint() {
    points();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(hidePoints && !hidePolygonal){
        drawPolygonal();
    } else if(!hidePoints && !hidePolygonal){
        draw();
    } else if(!hidePoints && hidePolygonal){
        drawPoints();
    }
};

button_Polygonal.onclick = function hidePolygon(){
    polyonal();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(hidePolygonal && !hidePoints){
        drawPoints();
    } else if(!hidePolygonal && !hidePoints){
        draw();
    } else if(!hidePolygonal && hidePoints){
        drawPolygonal();
    }
};

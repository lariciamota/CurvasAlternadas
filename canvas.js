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
    drawCurve();
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var button_Points = document.getElementById('pontos');
var button_Polygonal = document.getElementById('poligonal');
var button_Curve = document.getElementById('curva');

var p_stack = []; //pontos de controle
var c_stack = []; //pontos da curva de Bezier
//var b = [][]; //pontos calculados em de decasteljau
var move = null;
var hidePoints = false;
var hidePolygonal = false;
var hideCurve = false;
var n_Aval = document.getElementById('avaliacoes');

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

function drawCurve(){
    for(var z = 0; z < c_stack.length - 1; z++){
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.moveTo(c_stack[z].x, c_stack[z].y);
        ctx.lineTo(c_stack[z+1].x, c_stack[z+1].y);
        ctx.stroke();
    }
}

function points() {
    hidePoints = !hidePoints;
}
function polyonal() {
    hidePolygonal = !hidePolygonal;
}
function curve(){
    hideCurve = !hideCurve;
}
button_Points.onclick = function hidePoint() {
    points();
    conditions();
};
button_Polygonal.onclick = function hidePolygon(){
    polyonal();
    conditions();
};
button_Curve.onclick = function hideCurv() {
    curve();
    conditions();
};

function conditions(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(hidePoints && hidePolygonal && !hideCurve){
        drawCurve();
    } else if(hidePoints && !hidePolygonal && hideCurve){
        drawPolygonal();
    } else if(!hidePoints && hidePolygonal && hideCurve){
        drawPoints();
    } else if(!hidePoints && !hidePolygonal && hideCurve){
        drawPoints();
        drawPolygonal();
    } else if(!hidePoints && hidePolygonal && !hideCurve){
        drawPoints();
        drawCurve();
    } else if(hidePoints && !hidePolygonal && !hideCurve){
        drawPolygonal();
        drawCurve();
    } else if(!hidePoints && !hidePolygonal && !hideCurve){
        draw();
    }
}

function bezier(){
    var b = [p_stack.length][p_stack.length];
    for(var m = 0; m < p_stack.length; m++) b[0][m] = p_stack[m];
    return deDecasteljau(b)
}

function alternada(){
    var b = [p_stack.length][p_stack.length];
    for(var m = 0; m < p_stack.length; m = m+2){
        if(m+1 !== p_stack.length){
            b[0][m] = p_stack[m+1];
            b[0][m+1] = p_stack[m];
        } else {
            b[0][m] = p_stack[m];
        }
    }
    return deDecasteljau(b);
}

function  deDecasteljau(b){
    for(var z = 0, t = 0; z < n_Aval, t <= 1; z++, t = t + (1/(n_Aval-1))){
        for(var i = 1; i < p_stack.length; i++){
            for(var j = 0; j < p_stack.length - i; j++){
                b[i][j] = ((1-t) * b[i-1][j]) + (t * b[i-1][j+1]);
            }
            if(i === p_stack.length - 1) c_stack[z] = b[i][j];
        }
    }
    return c_stack;
}
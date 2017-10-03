function resizeCanvas(width, height) {
    canvas.width = width;
    canvas.height = height;
}

function resizeToFit() {
    var width = parseFloat(window.getComputedStyle(canvas).width);
    var height = parseFloat(window.getComputedStyle(canvas).height);
    resizeCanvas(width, height);
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var button_Points = document.getElementById('pontos');
var button_Polygonal = document.getElementById('poligonal');
var button_Curve = document.getElementById('curva');

var p_stack = []; //pontos de controle
var c_stack = []; //pontos da curva de Bezier
var move = null;
var hidePoints = false;
var hidePolygonal = false;
var hideCurve = false;
var n_Aval = 0;
resizeToFit();

//Eventos
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

//Funcoes para desenhar no canvas
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPoints();
    drawPolygonal();
    drawBezier();
    drawAlternada();
}

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
    ctx.strokeStyle = "orange";
    connectDots(p_stack);
}

function drawBezier(){
    var array = bezier();
    ctx.strokeStyle = "black";
    connectDots(array);
}

function drawAlternada() {
    var array = alternada();
    ctx.strokeStyle = "indigo";
    connectDots(array);
}

function connectDots(array) {
    for(var z = 0; z < array.length - 1; z++){
        ctx.beginPath();
        ctx.moveTo(array[z].x, array[z].y);
        ctx.lineTo(array[z+1].x, array[z+1].y);
        ctx.stroke();
    }
}

//Esconder/exibir
button_Points.onclick = function hidePoint() {
    hidePoints = !hidePoints;
    conditions();
};
button_Polygonal.onclick = function hidePolygon(){
    hidePolygonal = !hidePolygonal;
    conditions();
};
button_Curve.onclick = function hideCurv() {
    hideCurve = !hideCurve;
    conditions();
};

function conditions(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(hidePoints && hidePolygonal && !hideCurve){
        drawBezier();
        drawAlternada();
    } else if(hidePoints && !hidePolygonal && hideCurve){
        drawPolygonal();
        drawAlternada()
    } else if(!hidePoints && hidePolygonal && hideCurve){
        drawPoints();
        drawAlternada()
    } else if(!hidePoints && !hidePolygonal && hideCurve){
        drawPoints();
        drawPolygonal();
        drawAlternada()
    } else if(!hidePoints && hidePolygonal && !hideCurve){
        drawPoints();
        drawBezier();
        drawAlternada()
    } else if(hidePoints && !hidePolygonal && !hideCurve){
        drawPolygonal();
        drawBezier();
        drawAlternada()
    } else if(!hidePoints && !hidePolygonal && !hideCurve){
        draw();
    }
}

//Funcoes para montar as curvas
function nAval() {
    n_Aval = document.getElementById("avaliacoes").elements[0].value;
}

function bezier(){
    var b = [p_stack.length][p_stack.length];
    for(var m = 0; m < p_stack.length; m++) b[0][m] = p_stack[m];
    return deDecasteljau(b)
}

function alternada(){
    var a = [p_stack.length][p_stack.length];
    for(var m = 0; m < p_stack.length; m = m+2){
        if(m+1 !== p_stack.length){
            a[0][m] = p_stack[m+1];
            a[0][m+1] = p_stack[m];
        } else {
            a[0][m] = p_stack[m];
        }
    }
    return deDecasteljau(a);
}

function  deDecasteljau(b){
    for(var z = 0, t = 0; z < n_Aval, t <= 1; z++, t = t + (1/(n_Aval-1))){
        for(var i = 1; i < p_stack.length; i++){
            for(var j = 0; j < p_stack.length - i; j++){
                b[i][j] = {
                    x: ((1-t) * b[i-1][j].x) + (t * b[i-1][j+1].x),
                    y: ((1-t) * b[i-1][j].y) + (t * b[i-1][j+1].y)
                };
            }
            if(i === p_stack.length - 1) c_stack[z] = b[i][j];
        }
    }
    return c_stack;
}

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
var move = null;
var hidePoints = false;
var hidePolygonal = false;
var hideCurve = false;
var n_Aval = document.getElementById('avaliacao');
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
    for(var i = 0; i < p_stack.length; i++){
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
    var array = [];
    array = bezier();
    ctx.strokeStyle = "black";
    connectDots(array);
}

function drawAlternada() {
    var array = [];
    array = alternada();
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
    n_Aval = parseInt(n_Aval.value);
}

function bezier(){
    var b = [];
    for(var m = 0; m < p_stack.length; m++) {
        b[m] = {
            x: p_stack[m].x,
            y: p_stack[m].y
        };
    }
    return deCasteljau(b);
}

function alternada(){
    var a = [];
    for(var m = 0; m < p_stack.length; m = m+2){
        if(m+1 !== p_stack.length){
            a[m] = p_stack[m+1];
            a[m+1] = p_stack[m];
        } else {
            a[m] = p_stack[m];
        }
    }
    return deCasteljau(a);
}

function  deCasteljau(b){
    var c_stack = []; //pontos da curva de Bezier

    for(var t = 0; t <= 1; t += (1/(n_Aval-1))){
        var anterior = b.slice();
        var nova = [];
        for(var j = 0; j < b.length - 1; j++){
            for(var i = 0; i < anterior.length - 1; i++){
                nova[i] = {
                    x: (anterior[i].x * (1 - t)) + (t * anterior[i + 1].x),
                    y: (anterior[i].y * (1 - t)) + (t * anterior[i + 1].y)
                };

            }
            anterior = nova.slice();
            nova = [];
        }
        c_stack.push(anterior[0]);
    }
    return c_stack;
}


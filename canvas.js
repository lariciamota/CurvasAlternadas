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
       // console.log(p_stack[i]);
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.fillStyle = "orange";
        ctx.arc(p_stack[i].x, p_stack[i].y, 3, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var p_stack = [];
var pixel = {
    x: "",
    y: ""
};
var enableInsert = false;

resizeToFit();
function insert(){
    enableInsert = true;
}

function del(){
    p_stack.pop();
    draw();
}

canvas.addEventListener("click", function(e) {
    if(enableInsert){
        var d = {
            x: "",
            y: ""
        };
        d.x = e.offsetX;
        d.y = e.offsetY;
        p_stack.push(d);
        draw();
    }
    enableInsert = false;
});


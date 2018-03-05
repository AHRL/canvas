var canvas = document.querySelector("#canvas");
var WIDTH = document.body.clientWidth,
    HEIGHT = document.documentElement.clientHeight || document.body.clientHeight;
canvas.setAttribute("width", WIDTH);
canvas.setAttribute("height", HEIGHT);
canvas.width = WIDTH;
canvas.Height = HEIGHT;
var context = canvas.getContext("2d");
context.fillStyle = "white";
context.lineWidth = 0.3;
context.strokeStyle = "white";
var circleNum = 80;
var circleArr = [];
var maxR = 5;
var minR = 1;
var distance = 100;
//球的构造函数
function Circle(x, y, r, moveX, moveY, neighbor) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.moveX = moveX;
    this.moveY = moveY;
    this.neighbor = neighbor;
}
//画悬浮球
function drawCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}
//画线
function drawLine(ctx, x, y, s, t) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(s, t);
    ctx.stroke();
}
//获得随机数
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
//获得鼠标位置
function mousePosition(ev) {
    return { x: ev.pageX, y: ev.pageY };
}
//判断一个圆附近的圆
function neighborCircle() {
    for (var i = 0; i < circleArr.length; i++) {
        circleArr[i].neighbor = [];
    }
    for (var i = 0; i < circleArr.length; i++) {
        for (var j = 0; j < circleArr.length; j++) {
            if (adjustDis(circleArr[i].x, circleArr[i].y, circleArr[j].x, circleArr[j].y) < distance) {
                circleArr[i].neighbor.push(circleArr[j]);
            }
        }
    }
    for (var i = 0; i < circleArr.length; i++) {
        for (var j = 0; j < circleArr[i].neighbor.length; j++) {
            drawLine(context, circleArr[i].x, circleArr[i].y, circleArr[i].neighbor[j].x,
                circleArr[i].neighbor[j].y);
        }
    }
}
//鼠标附近的球被吸引
function attract() {
    var mouseNeighbor = [];
    var mousePos = {};
    document.onmousemove = function(ev) {
        ev = ev || window.event;
        mousePos = mousePosition(ev);
        mouseNeighbor.push(mousePos.x);
        mouseNeighbor.push(mousePos.y);
        for (var i = 0; i < circleArr.length; i++) {
            if (adjustDis(circleArr[i].x, circleArr[i].y, mousePos.x, mousePos.y) <= distance) {
                mouseNeighbor.push(circleArr[i]);
            }
        }
        for (var i = 0; i < mouseNeighbor.length; i++) {
            drawLine(context, mousePos.x, mousePos.y,
                mouseNeighbor[i].x, mouseNeighbor[i].y);
            if (adjustDis(mouseNeighbor[i].x, mouseNeighbor[i].y, mousePos.x, mousePos.y) >= distance - 10) {
                mouseNeighbor[i].moveX = (mousePos.x - mouseNeighbor[i].x) / (2 * distance);
                mouseNeighbor[i].moveY = (mousePos.y - mouseNeighbor[i].y) / (2 * distance);
            }
            if (adjustDis(mouseNeighbor[i].x, mouseNeighbor[i].y, mousePos.x, mousePos.y) < distance - 10) {
                mouseNeighbor[i].moveX = (mouseNeighbor[i].x - mousePos.x) / (2 * distance);
                mouseNeighbor[i].moveY = (mouseNeighbor[i].y - mousePos.y) / (2 * distance);
            }
        }
    }
    console.log(mousePos);
}
//计算距离
function adjustDis(x, y, s, t) {
    return Math.floor(Math.sqrt(Math.pow(x - s, 2) + Math.pow(y - t, 2)));
}
//初始化得到一个圆的数组
function init() {
    for (var i = 0; i < circleNum; i++) {
        var circle = new Circle(randomNum(0, WIDTH), randomNum(0, HEIGHT), randomNum(minR, maxR),
            randomNum(-10, 10) / 40, randomNum(-10, 10) / 40, []);
        circleArr.push(circle);
    }
}
//讲canvas画上页面
function draw() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < circleNum; i++) {
        circleArr[i].x += circleArr[i].moveX;
        circleArr[i].y += circleArr[i].moveY;
        if (circleArr[i].x > WIDTH) {
            circleArr[i].x = 0;
        } else {
            if (circleArr[i].x < 0) {
                circleArr[i].x = WIDTH;
            }
        }
        if (circleArr[i].y > HEIGHT) {
            circleArr[i].y = 0;
        } else {
            if (circleArr[i].y < 0) {
                circleArr[i].y = HEIGHT;
            }
        }
        drawCircle(context, circleArr[i].x, circleArr[i].y, circleArr[i].r);
    }
}
//页面加载完成后，加载canvas
window.onload = function() {
    init();
    setInterval(function() {
        draw();
        neighborCircle();
        attract();
    }, 16)
}
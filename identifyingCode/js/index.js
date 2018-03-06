//生成一个随机色
function randomColor(max, min) {
    var r = randomNum(max, min);
    var g = randomNum(max, min);
    var b = randomNum(max, min);
    return "rgb(" + r + "," + g + "," + b + ")";
}
// 画干扰线
function drawLine(ctx, x, y, s, t) {
    ctx.strokeStyle = randomColor(40, 180);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(s, t);
    ctx.stroke();
}
//画干扰点
function drawPoint(ctx, x, y, radius) {
    ctx.fillStyle = randomColor(225, 0);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
}
//画验证码
function drawCode(ctx, c, i) {
    ctx.fillStyle = randomColor(50, 160);
    ctx.font = randomNum(100, 80) + 'px SimHei';
    var x = 30 + i * 70;
    var y = randomNum(130, 100);
    var deg = randomNum(45, -45);
    //修改坐标原点和旋转角度
    ctx.translate(x, y);
    ctx.rotate(deg * Math.PI / 180);
    ctx.fillText(c, 0, 0);
    //恢复坐标原点和旋转角度
    ctx.rotate(-deg * Math.PI / 180);
    ctx.translate(-x, -y);
}
// 生成一个随机数
function randomNum(max, min) {
    return Math.floor((Math.random()) * (max - min) + min);
}

function init() {
    var canvas = document.querySelector("#identifyBox");
    var width = canvas.width;
    var height = canvas.height;
    var context = canvas.getContext("2d");
    var codeArr = [];
    context.textBaseline = "bottom";
    context.fillStyle = randomColor(240, 180);
    context.fillRect(0, 0, width, height);
    var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
    var codeNum = 4;
    for (var i = 0; i < codeNum; i++) {
        var mark = randomNum(code.length, 0);
        codeArr.push(code[mark]);
        drawCode(context, code[mark], i);
    }
    for (var i = 0; i < 8; i++) {
        drawLine(context, randomNum(300, 0), randomNum(300, 0), randomNum(300, 0), randomNum(300, 0));
    }
    for (var i = 0; i < 100; i++) {
        context.fillStyle = randomColor(0, 255);
        context.beginPath();
        context.arc(randomNum(width, 0), randomNum(height, 0), 1, 0, 2 * Math.PI);
        context.fill();
    }
    //看不清，换一张
    var change = document.querySelector("#change");
    change.onclick = function() {
            context.clearRect(0, 0, width, height);
            init();
        }
        //注册时验证验证码
    var sub = document.querySelector("#register");
    sub.onsubmit = function() {
        var flag = true;
        var value = document.querySelector("#identifyCode").value;
        if (value.length !== codeArr.length) {
            flag = false;
        } else {
            for (var i = 0; i < value.length; i++) {
                if (value[i].toLowerCase() !== codeArr[i].toLowerCase()) {
                    flag = false;
                }
            }
        }
        if (flag === false) {
            alert("验证码错误");
            init();
            return false;
        }
        alert("注册成功！");
    }
}
window.onload = function() {
    init();
}
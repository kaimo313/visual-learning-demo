// 创建正多边形，返回顶点
function regularShape(x, y, r, edges = 3) {
    const points = [];
    const delta = (2 * Math.PI) / edges;
    for (let i = 0; i < edges; i++) {
        const theta = i * delta;
        points.push([x + r * Math.sin(theta), y + r * Math.cos(theta)]);
    }
    return points;
}

// 根据顶点绘制图形
function drawShape(context, points) {
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(...points[i]);
    }
    context.closePath();
    context.stroke();
    context.fill();
}

// 多边形类型，包括正三角形、正四边形、正五边形、正六边形和正100边形以及正500边形
// 用 -1 代替正 500 边形
const shapeTypes = [3, 4, 5, 6, 100, -1];
const COUNT = 1000;
const TAU = Math.PI * 2;

// 创建缓存的函数
function createCache() {
    const ret = [];
    for (let i = 0; i < shapeTypes.length; i++) {
        const cacheCanvas = new OffscreenCanvas(20, 20);
        const type = shapeTypes[i];
        const context = cacheCanvas.getContext("2d");
        context.fillStyle = "red";
        context.strokeStyle = "black";
        if (type > 0) {
            const points = regularShape(10, 10, 10, type);
            drawShape(context, points);
        } else {
            context.beginPath();
            context.arc(10, 10, 10, 0, TAU);
            context.stroke();
            context.fill();
        }
        ret.push(cacheCanvas);
    }
    return ret;
}

// 执行绘制
function draw(ctx, shapes) {
    const canvas = ctx.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < COUNT; i++) {
        const shape = shapes[Math.floor(Math.random() * shapeTypes.length)];
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        ctx.drawImage(shape, x, y);
    }
    requestAnimationFrame(draw.bind(null, ctx, shapes));
}

// 监听message
console.log('self------>', self)
self.addEventListener("message", (evt) => {
    console.log('message--->', evt)
    if (evt.data.type === "init") {
        const canvas = evt.data.canvas;
        if (canvas) {
            const ctx = canvas.getContext("2d");
            const shapes = createCache();
            draw(ctx, shapes);
        }
    }
});

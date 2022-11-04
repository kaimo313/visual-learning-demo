// 根据点来绘制图形
function draw(
    points,
    context,
    { strokeStyle = "salmon", fillStyle = null, close = false } = {}
) {
    context.strokeStyle = strokeStyle;
    context.beginPath();
    context.moveTo(...points[0]);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(...points[i]);
    }
    if (close) context.closePath();
    if (fillStyle) {
        context.fillStyle = fillStyle;
        context.fill();
    }
    context.stroke();
}

// 导出高阶函数绘图模块：zFunc是坐标映射函数，通过它可以将任意坐标映射为直角坐标
export function parametric(xFunc, yFunc, zFunc) {
    /**
     * start、end 表示参数方程中关键参数范围的参数
     * seg 表示采样点个数的参数，当 seg 默认 100 时，就表示在 start、end 范围内采样 101（seg+1）个点
     * ...args 后续其他参数是作为常数传给参数方程的数据。
     * */ 
    return function (start, end, seg = 100, ...args) {
        const points = [];
        for (let i = 0; i <= seg; i++) {
            const p = i / seg;
            const t = start * (1 - p) + end * p;
            const x = xFunc(t, ...args); // 计算参数方程组的x
            const y = yFunc(t, ...args); // 计算参数方程组的y
            if (zFunc) {
                points.push(zFunc(x, y));
            } else {
                points.push([x, y]);
            }
        }
        return {
            draw: draw.bind(null, points),
            points, // 生成的顶点数据
        };
    };
}

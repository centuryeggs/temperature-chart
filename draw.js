const width = 630 // 画布宽度
const height = 600  // 画布高度
const w = 15 // 小方格宽度
const data = {
  title: 'xxxx医院',
  baseInfo: [
    { label: '姓名', value: '张三' },
    { label: '年龄', value: '25' },
    { label: '科别', value: '骨科' },
    { label: '床号', value: '001' },
    { label: '住院病历号', value: '123456' },
    { label: '入院日期', value: '2021-12-01' }
  ],
  mouthLineData: [[3,36.2], [9,36.5], [15, 36.3], [21,37.1], [27,37], [34,37.2], [40,36.9]],
  anusLineData: [[2,36.1], [8,36.4], [17, 36.3], [20,37.2], [26,37.4], [35,37.1], [41,37.4]],
  pulseLineData: [[4,40],[11,50],[15,60],[21,60],[27,80],[35,70],[40,160]],
  heartLineData: [[5,72],[10,73],[15,78],[19,69],[25,90],[33,87],[41,84]]
}
const mouthLineData = data.mouthLineData.map(i => {
  return [timeToX(i[0]), temperatureToY(i[1])]
})
const anusLineData = data.anusLineData.map(i => {
  return [timeToX(i[0]), temperatureToY(i[1])]
})
const pulseLineData = data.pulseLineData.map(i => {
  return [timeToX(i[0]), frequencyToY(i[1])]
})
console.log(pulseLineData);
const heartLineData = data.heartLineData.map(i => {
  return [timeToX(i[0]), frequencyToY(i[1])]
})
const canvas = document.getElementById('canvas')
let billScale = window.devicePixelRatio * 1.5
canvas.style.width = width + "px"
canvas.style.height = height + "px"
let ctx = canvas.getContext('2d')
canvas.width = Math.floor(width * billScale)
canvas.height = Math.floor(height * billScale)
ctx.scale(billScale, billScale)
window.onresize = function (e) {
  if (billScale !== window.devicePixelRatio) {
    window.location.reload()
  }
}
drawGrid(ctx)
drawPolyline(ctx, mouthLineData, 'black')
// drawPolyline(ctx, pulseLineData, 'red')
// 绘制直线
function drawLine (ctx, x1 = 0, y1 = 0, x2 = 0, y2 = 0, strokeStyle = 'black', lineWidth = 1) {
  ctx.beginPath()
  ctx.strokeStyle = strokeStyle
  ctx.lineWidth = lineWidth
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.closePath()
}
// 绘制网格
function drawGrid (ctx) {
  // 绘制横线
  for (let i = 1; i < 40; i++) {
    if (i % 5 === 0) {
      drawLine(ctx, 0, i*w, width, i*w, 'black', 2)
    } else {
      drawLine(ctx, 0, i*w, width, i*w)
    }
  }
  // 绘制竖线
  for (let i = 1; i < 42; i++) {
    if (i % 6 === 0) {
      drawLine(ctx, (i-1)*w + (w-1), 0, (i-1)*w + (w-1), height, 'red', 2)
    } else {
      drawLine(ctx, (i-1)*w + (w-0.5), 0, (i-1)*w + (w-0.5), height)
    }
  }
}

// 绘制折线
function drawPolyline (ctx, data, color) {  
  for (let i = 0; i < data.length - 1; i++) {
    drawLine(ctx, data[i][0], data[i][1], data[i+1][0], data[i+1][1], color)
  }
}

// 时间日期转化为x轴坐标
function timeToX (time) {
  // 校验格式 YYYY-MM-DD HH:mm:ss
  return time
}

// 温度转化为y轴坐标
function temperatureToY (temperature) {
  return Math.floor(600 - (temperature - 34) * 75)
}

// 频率转化为y轴坐标
function frequencyToY (frequency) {
  return Math.floor(600 - (frequency - 20) * 75)
}
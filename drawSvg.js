const width = 630 // 画布宽度
const height = 600  // 画布高度
const w = 15 // 小方格宽度
const data = { // 数据
  title: 'xxxx医院',
  baseInfo: [
    { label: '姓名', value: '张三' },
    { label: '年龄', value: '25' },
    { label: '科别', value: '骨科' },
    { label: '床号', value: '001' },
    { label: '住院病历号', value: '123456' },
    { label: '入院日期', value: '2021-12-01' }
  ],
  mouthLineData: [
    ['2021-12-01 04:00:00',36.2],
    ['2021-12-02 08:00:00',36.5],
    ['2021-12-03 12:00:00',36.3],
    ['2021-12-04 16:00:00',37.1],
    ['2021-12-05 20:00:00',37],
    ['2021-12-06 24:00:00',37.2],
    ['2021-12-07 16:00:00',36.9]
  ],
  armpitLineData: [
    ['2021-12-01 14:00:00',38],
    ['2021-12-02 14:00:00',38.2],
    ['2021-12-03 14:00:00',38.4],
    ['2021-12-04 14:00:00',38.6],
    ['2021-12-05 14:00:00',38.8],
    ['2021-12-06 14:00:00',39],
    ['2021-12-07 14:00:00',39.2]
  ],
  anusLineData: [
    ['2021-12-01 04:00:00',37.1],
    ['2021-12-02 08:00:00',37.4],
    ['2021-12-03 12:00:00',37.3],
    ['2021-12-04 16:00:00',38.2],
    ['2021-12-05 20:00:00',38.4],
    ['2021-12-06 24:00:00',38.1],
    ['2021-12-07 16:00:00',38.4]
  ],
  heartLineData: [
    ['2021-12-01 08:00:00',150],
    ['2021-12-02 08:00:00',130],
    ['2021-12-03 08:00:00',124],
    ['2021-12-04 08:00:00',124],
    ['2021-12-05 08:00:00',130],
    ['2021-12-06 08:00:00',138],
    ['2021-12-07 08:00:00',160]
  ],
  pulseLineData: [
    ['2021-12-01 08:00:00',140],
    ['2021-12-02 08:00:00',150],
    ['2021-12-03 08:00:00',140],
    ['2021-12-04 08:00:00',130],
    ['2021-12-05 08:00:00',130],
    ['2021-12-06 08:00:00',138],
    ['2021-12-07 08:00:00',160]
  ]
}
const startDate = new Date(data.baseInfo.find(i => i.label === '入院日期').value)
const mouthLineData = data.mouthLineData.map(i => {
  return [timeToX(i[0]), temperatureToY(i[1])]
})
const armpitLineData = data.armpitLineData.map(i => {
  return [timeToX(i[0]), temperatureToY(i[1])]
})
const anusLineData = data.anusLineData.map(i => {
  return [timeToX(i[0]), temperatureToY(i[1])]
})
const pulseLineData = data.pulseLineData.map(i => {
  return [timeToX(i[0]), frequencyToY(i[1])]
})
const heartLineData = data.heartLineData.map(i => {
  return [timeToX(i[0]), frequencyToY(i[1])]
})
init(document.getElementById('svg'))
// 初始化
function init(svg) {
  drawGrid(svg)
  drawPolyline(svg, mouthLineData, 'black')
  drawPolyline(svg, armpitLineData, 'black')
  drawPolyline(svg, anusLineData, 'black')
  drawPolyline(svg, heartLineData, 'red')
  drawPolyline(svg, pulseLineData, 'red')
  drawPoints(svg, mouthLineData, 0)
  drawPoints(svg, armpitLineData, 1)
  drawPoints(svg, anusLineData, 2)
  drawPoints(svg, heartLineData, 3)
  drawPoints(svg, pulseLineData, 4)
}
// 绘制网格
function drawGrid (svg) {
  // 横线
  for (let i = 1; i < 40; i++) {
    if (i % 5 === 0) {
      addSvgElement(svg, 'line', {
        x1: 0,
        y1: i*w,
        x2: width,
        y2: i*w,
        stroke: 'black',
        'stroke-width': 2
      })
    } else {
      addSvgElement(svg, 'line', {
        x1: 0,
        y1: i*w,
        x2: width,
        y2: i*w,
        stroke: 'black',
        'stroke-width': 1
      })
    }
  }
  // 竖线
  for (let i = 1; i < 42; i++) {
    if (i % 6 === 0) {
      addSvgElement(svg, 'line', {
        x1: (i-1)*w + (w-1),
        y1: 0,
        x2: (i-1)*w + (w-1),
        y2: height,
        stroke: 'red',
        'stroke-width': 2
      })
    } else {
      addSvgElement(svg, 'line', {
        x1: (i-1)*w + (w-0.5),
        y1: 0,
        x2: (i-1)*w + (w-0.5),
        y2: height,
        stroke: 'black',
        'stroke-width': 1
      })
    }
  }
}
// 绘制折线
function drawPolyline (svg, data, color) {
  for (let i = 0; i < data.length - 1; i++) {
    addSvgElement(svg, 'line', {
      x1: data[i][0],
      y1: data[i][1],
      x2: data[i+1][0],
      y2: data[i+1][1],
      stroke: color,
      'stroke-width': 2
    })
  }
}
// 绘制点
function drawPoints (svg, data, style = 0) {
  const pointSize = 5
  for (let i = 0; i < data.length; i++) {
    switch (style) {
      case 0: // 口表，黑色实心圆
        addSvgElement(svg, 'circle', {
          cx: data[i][0],
          cy: data[i][1],
          r: pointSize,
          fill: 'black'
        })
        break
      case 1: // 腋表，蓝色交叉
        const diff = pointSize
        // const diff = Math.sqrt(Math.pow(pointSize, 2) / 2)
        addSvgElement(svg, 'line', {
          x1: data[i][0] - diff,
          y1: data[i][1] + diff,
          x2: data[i][0] + diff,
          y2: data[i][1] - diff,
          stroke: 'blue',
          'stroke-width': 2
        })
        addSvgElement(svg, 'line', {
          x1: data[i][0] + diff,
          y1: data[i][1] + diff,
          x2: data[i][0] - diff,
          y2: data[i][1] - diff,
          stroke: 'blue',
          'stroke-width': 2
        })
        break
      case 2: // 肛表，黑色空心圆
        addSvgElement(svg, 'circle', {
          cx: data[i][0],
          cy: data[i][1],
          r: pointSize,
          fill: 'black'
        })
        addSvgElement(svg, 'circle', {
          cx: data[i][0],
          cy: data[i][1],
          r: pointSize - 1,
          fill: 'white'
        })
        break
      case 3: // 心率，红色空心圆
        addSvgElement(svg, 'circle', {
          cx: data[i][0],
          cy: data[i][1],
          r: pointSize,
          fill: 'red'
        })
        addSvgElement(svg, 'circle', {
          cx: data[i][0],
          cy: data[i][1],
          r: pointSize - 1,
          fill: 'white'
        })
        break;
      case 4: // 脉搏，红色实心圆
        addSvgElement(svg, 'circle', {
          cx: data[i][0],
          cy: data[i][1],
          r: pointSize,
          fill: 'red'
        })
      default:
        break
    }
  }
}
// 时间日期转化为x轴坐标
function timeToX (time) {
  const currentDate = new Date(time.substring(0, 10))
  const diffDays = (currentDate - startDate) / 1000 / 60 / 60 / 24
  const timeNums = new Date(time).getHours()
  return diffDays * 90 + 7.5 + (timeNums / 4 - 1) * 15
}
// 温度转化为y轴坐标
function temperatureToY (temperature) {
  return Math.floor(600 - (temperature - 34) * 75)
}
// 频率转化为y轴坐标
function frequencyToY (frequency) {
  return Math.floor(600 - (frequency - 20) * (75 / 20))
}
// 创建svg子元素
function addSvgElement (svg, tagName, attributes) {
  let el = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  for (let attr in attributes) {
    el.setAttribute(attr, attributes[attr])
  }
  svg.appendChild(el)
}
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
    ['2021-12-01 04:00:01',36.2],
    ['2021-12-02 00:00:00',36.5],
    ['2021-12-03 12:00:00',36.3],
    ['2021-12-04 16:00:00',37.1],
    ['2021-12-05 20:00:00',37],
    ['2021-12-06 23:59:59',37.2],
    ['2021-12-07 24:00:00',36.9]
  ],
  armpitLineData: [
    ['2021-12-01 16:00:00',38.2],
    ['2021-12-02 16:00:00',38],
    ['2021-12-03 16:00:00',37.8],
    ['2021-12-04 16:00:00',37.6],
    ['2021-12-05 16:00:00',37.4],
    ['2021-12-06 16:00:00',37.9],
    ['2021-12-07 16:00:00',36.5]
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
    ['2021-12-01 08:00:00',140],
    ['2021-12-02 08:00:00',120],
    ['2021-12-03 08:00:00',114],
    ['2021-12-04 08:00:00',114],
    ['2021-12-05 08:00:00',120],
    ['2021-12-06 08:00:00',128],
    ['2021-12-07 08:00:00',130]
  ],
  pulseLineData: [
    ['2021-12-01 08:00:00',110],
    ['2021-12-02 08:00:00',130],
    ['2021-12-03 08:00:00',120],
    ['2021-12-04 08:00:00',110],
    ['2021-12-05 08:00:00',110],
    ['2021-12-06 08:00:00',118],
    ['2021-12-07 08:00:00',140]
  ],
  textRemarks: [
    ['2021-12-01 08:00:00', '手术入院—八时零分'],
    ['2021-12-02 08:00:00', '手术'],
    ['2021-12-06 08:00:00', '分娩'],
    ['2021-12-06 12:00:00', '手术'],
    ['2021-12-06 16:12:00', '手术分娩—十六时十二分']
  ]
}
const startDate = new Date(data.baseInfo.find(i => i.label === '入院日期').value + ' 00:00:00')
const mouthLineData = data.mouthLineData.map(i => {
  return [i[0], i[1], timeToX(i[0]), temperatureToY(i[1])]
})
const armpitLineData = data.armpitLineData.map(i => {
  return [i[0], i[1], timeToX(i[0]), temperatureToY(i[1])]
})
const anusLineData = data.anusLineData.map(i => {
  return [i[0], i[1], timeToX(i[0]), temperatureToY(i[1])]
})
const pulseLineData = data.pulseLineData.map(i => {
  return [i[0], i[1], timeToX(i[0]), frequencyToY(i[1])]
})
const heartLineData = data.heartLineData.map(i => {
  return [i[0], i[1], timeToX(i[0]), frequencyToY(i[1])]
})
const textData = data.textRemarks.map(i => {
  return [timeToX(i[0]), i[1]]
})
const tooltip = document.getElementById('tooltip')
const svg = document.getElementById('svg')
init(svg)
// 初始化
function init(svg) {
  svg.addEventListener('mouseenter', function(e) {
    svg.addEventListener('mousemove', hoverPiont)
  })
  svg.addEventListener('mouseleave', function(e) {
    svg.removeEventListener('mousemove', hoverPiont)
  })
  drawGrid(svg)
  drawTextRemarks(svg, textData)
  drawPolyline(svg, mouthLineData, 'black')
  drawPolyline(svg, armpitLineData, 'black')
  drawPolyline(svg, anusLineData, 'black')
  drawPolyline(svg, heartLineData, 'red')
  drawPolyline(svg, pulseLineData, 'red')
  drawPoints(svg, mouthLineData, '口表')
  drawPoints(svg, armpitLineData, '腋表')
  drawPoints(svg, anusLineData, '肛表')
  drawPoints(svg, heartLineData, '心率')
  drawPoints(svg, pulseLineData, '脉搏')
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
  let points = ''
  for (let i = 0; i < data.length; i++) {
    points += `${data[i][2]} ${data[i][3]},`
  }
  addSvgElement(svg, 'polyline', {
    points: points.substring(0, points.length - 1),
    fill: "none",
    stroke: color,
    'stroke-width': 2
  })
}
// 绘制点
function drawPoints (svg, data, style = '口表') {
  const pointSize = 5
  for (let i = 0; i < data.length; i++) {
    const [centerX, centerY] = [data[i][2], data[i][3]]
    switch (style) {
      case '口表': // 口表，黑色实心圆
        data[i][1] = '口表：' + data[i][1] + ' °C'
        addSvgElement(svg, 'circle', {
          class: 'point',
          'data-tip': data[i],
          cx: centerX,
          cy: centerY,
          r: pointSize,
          fill: 'black'
        })
        break
      case '腋表': // 腋表，蓝色交叉
        data[i][1] = '腋表：' + data[i][1] + ' °C'
        const diff = pointSize
        // const diff = Math.sqrt(Math.pow(pointSize, 2) / 2)
        addSvgElement(svg, 'line', {
          x1: centerX-diff,
          y1: centerY+diff,
          x2: centerX+diff,
          y2: centerY-diff,
          stroke: 'blue',
          'stroke-width': 2
        })
        addSvgElement(svg, 'line', {
          x1: centerX+diff,
          y1: centerY+diff,
          x2: centerX-diff,
          y2: centerY-diff,
          stroke: 'blue',
          'stroke-width': 2
        })
        // 透明的hover区域
        addSvgElement(svg, 'circle', {
          class: 'point',
          'data-tip': data[i],
          cx: centerX,
          cy: centerY,
          r: pointSize + 1,
          fill: 'transparent',
          stroke: 'transparent'
        })
        break
      case '肛表': // 肛表，黑色空心圆
        data[i][1] = '肛表：' + data[i][1] + ' °C'
        addSvgElement(svg, 'circle', {
          class: 'point',
          'data-tip': data[i],
          cx: centerX,
          cy: centerY,
          r: pointSize,
          fill: 'white',
          stroke: 'black'
        })
        break
      case '心率': // 心率，红色空心圆
        data[i][1] = '心率：' + data[i][1] + ' 次/分'
        addSvgElement(svg, 'circle', {
          class: 'point',
          'data-tip': data[i],
          cx: centerX,
          cy: centerY,
          r: pointSize,
          fill: 'white',
          stroke: 'red'
        })
        break;
      case '脉搏': // 脉搏，红色实心圆
      data[i][1] = '脉搏：' + data[i][1] + ' 次/分'
        addSvgElement(svg, 'circle', {
          class: 'point',
          'data-tip': data[i],
          cx: centerX,
          cy: centerY,
          r: pointSize,
          fill: 'red'
        })
      default:
        break
    }
  }
}
// 绘制文字说明
function drawTextRemarks (svg, data) {
  for (let i = 0; i < data.length; i++) {
    const [x, text] = [data[i][0], data[i][1]]
    addSvgElement(svg, 'text', {
      x: x,
      y: 1.5,
      'font-size': '15',
      fill: 'black'
    }, text)
  }
}
// 时间日期转化为x轴坐标
function timeToX (time) {
  const currentDate = new Date(time)
  let num = Math.ceil((currentDate - startDate) / 1000 / 60 / 60 / 4)
  if (num % 6 === 0 && time.split(' ')[1] === '00:00:00') {
    num = num + 1
  }
  return (num - 1) * 15 + 7.5
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
function addSvgElement (svg, tagName, attributes, innerText) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tagName)
  for (let attr in attributes) {
    el.setAttribute(attr, attributes[attr])
  }
  if (innerText) {
    el.textContent = innerText
  }
  svg.appendChild(el)
}
// hoverPoint时显示坐标信息
function hoverPiont (e) {
  if (e.target.classList.contains('point')) {
    const [forwardText, backText, x, y] = e.target.dataset.tip.split(',')
    tooltip.innerText = `${forwardText}\n${backText}`
    tooltip.style.visibility = 'visible'
    tooltip.style.left = x + "px"
    tooltip.style.top = y - 13 + "px"
  } else if (tooltip.style.visibility !== 'hidden') {
    tooltip.style.visibility = 'hidden'
  }
}
// 节流函数
function throttle (fn) {
  let isRun = false
  return function () {
    if (isRun) return
    isRun = true
    setTimeout(() => {
      fn.apply(this, arguments)
      isRun = false
    }, 100)
  }
}
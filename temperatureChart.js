class TemperatureChart {
  constructor (rootNode, originData) {
    this.svgWidth = 630
    this.svgHeight = 600
    this.title = originData.title
    this.baseInfo = originData.baseInfo
    this.tableHeadData = originData.tableHeadData
    this.tableFootData = originData.tableFootData
    this.startDate = new Date(originData.tableHeadData[0]['日期'][0] + ' 00:00:00')
    this.mouthLineData = originData.mouthTemperature.map(i => {
      return [i[0], i[1], this.timeToX(i[0]), this.temperatureToY(i[1])]
    })
    this.armpitLineData = originData.armpitTemperature.map(i => {
      return [i[0], i[1], this.timeToX(i[0]), this.temperatureToY(i[1])]
    })
    this.anusLineData = originData.anusTemperature.map(i => {
      return [i[0], i[1], this.timeToX(i[0]), this.temperatureToY(i[1])]
    })
    this.pulseLineData = originData.pulseFrequency.map(i => {
      return [i[0], i[1], this.timeToX(i[0]), this.frequencyToY(i[1])]
    })
    this.heartLineData = originData.heartFrequency.map(i => {
      return [i[0], i[1], this.timeToX(i[0]), this.frequencyToY(i[1])]
    })
    this.textData = originData.textRemarks.map(i => {
      return [this.timeToX(i[0]), i[1]]
    })
    this.pointsInfo = []
    this.container = document.createElement('div')
    this.container.classList.add('container')
    rootNode.appendChild(this.container)
    this.init()
  }
  // 初始化
  init () {
    this.createTitle()
    this.createHeadForm()
    this.createMainTable()
    this.createPagination()
  }
  // 添加标题
  createTitle () {
    const title = document.createElement('div')
    title.classList.add('title')
    title.innerText = this.title
    this.container.appendChild(title)
  }
  // 添加表头form 标题与表格之间的基础信息
  createHeadForm () {
    const headForm = document.createElement('div')
    headForm.classList.add('head-form')
    let innerHTML = ''
    this.baseInfo.forEach(i => {
      innerHTML += `
        <div class="item">
          <div class="label">${i.label}</div>
          <div class="value">${i.value}</div>
        </div>`
    })
    headForm.innerHTML = innerHTML
    this.container.appendChild(headForm)
  }
  // 添加表格主体
  createMainTable () {
    const table = document.createElement('div')
    table.classList.add('table')
    let tableInnerHTML = ''
    tableInnerHTML = this.createLabelRowsStr(this.tableHeadData)
    tableInnerHTML += this.creteXaxisRowStr()
    tableInnerHTML += this.creteMainRow()
    tableInnerHTML += this.createLabelRowsStr(this.tableFootData)
    table.innerHTML = tableInnerHTML
    this.container.appendChild(table)
    this.initSvg(document.getElementById('svg'))
  }
  // 生成带label的行
  createLabelRowsStr (rows) {
    let result = ''
    rows.forEach(row => {
      let valueCells = ''
      for (let label in row) {
        row[label].forEach(i => {
          if (Object.prototype.toString.call(i) === '[object Array]') {
            let positionTrigger = true
            for (let j = 0; j < i.length; j++) {
              // 呼吸行特殊处理,每天的第一次呼吸显示在格子上部，往后的错开分布
              if (label.includes('呼吸')) {
                if (i[j] !== '') positionTrigger = !positionTrigger
                valueCells += `<div class="cell w-1/${i.length}"><div class="${positionTrigger ? 'bottom': 'top'}">${i[j]}</div></div>`
              } else {
                valueCells += `<div class="cell w-1/${i.length}">${i[j]}</div>`
              }
            }
          } else {
            valueCells += `<div class="cell">${i}</div>`
          }
        })
        result +=
        `<div class="row">
          <div class="label cell">${label}</div>
          <div class="values">
            ${valueCells}
          </div>
        </div>`
      }
    })
    return result
  }
  // 生成x轴时间坐标行
  creteXaxisRowStr (label = '时间') {
    let upInnerHTML = ''
    let downInnerHTML = ''
    for (let i = 0; i < 7; i++) {
      upInnerHTML += `<div>上午</div><div>下午</div>`
      downInnerHTML += `<div>4</div><div>8</div><div>12</div><div>16</div><div>20</div><div>24</div>`
    }
    return `
    <div class="row">
      <div class="label cell">${label}</div>
      <div class="values x-axis">
        <div class="up">${upInnerHTML}</div>
        <div class="down">${downInnerHTML}</div>
      </div>
    </div>`
  }
  // 生成主体行（左侧y轴坐标，右侧网格折线图）
  creteMainRow () {
    return `
    <div class="row">
      <div class="label cell y-axis">
        <div class="icons">
          <div class="icon">口表
            <svg width="10" height="10">
              <circle r="5" cx="5" cy="5" />
            </svg>
          </div>
          <div class="icon">腋表
            <svg width="10" height="10">
              <g stroke="blue" stroke-width="2">
                <line x1="0" y1="0" x2="10" y2="10" />
                <line x1="0" y1="10" y2="0" x2="10" />
              </g>
            </svg>
          </div>
          <div class="icon">肛表
            <svg width="10" height="10">
              <circle r="5" cx="5" cy="5" />
              <circle r="3.8" cx="5" cy="5" fill="#fff" />
            </svg>
          </div>
          <div class="icon">心率
            <svg width="10" height="10">
              <circle r="5" cx="5" cy="5" />
              <circle r="5" cx="5" cy="5" fill="red" />
              <circle r="3.8" cx="5" cy="5" fill="#fff" />
            </svg>
          </div>
          <div class="icon">脉搏
            <svg width="10" height="10">
              <circle r="5" cx="5" cy="5" fill="red" />
            </svg>
          </div>
        </div>
        <div class="pulse">
          <div>P</div>
          <div>(次/分)</div>
          <div class="axis-nums">
            <div>160</div>
            <div>140</div>
            <div>120</div>
            <div>100</div>
            <div>80</div>
            <div>60</div>
            <div>40</div>
          </div>
        </div>
        <div class="temperature">
          <div>T</div>
          <div>(°C)</div>
          <div class="axis-nums">
            <div>41</div>
            <div>40</div>
            <div>39</div>
            <div>38</div>
            <div>37</div>
            <div>36</div>
            <div>35</div>
          </div>
        </div>
      </div>
      <div class="values" style="position: relative;">
        <svg id="svg" width="${this.svgWidth}" height="${this.svgHeight}" xmlns="http://www.w3.org/2000/svg"></svg>
        <div id="tooltip"></div>
      </div>
    </div>`
  }
  // 初始化svg
  initSvg (svg) {
    const _this = this
    svg.addEventListener('mouseenter', function(e) {
      svg.addEventListener('mousemove', _this.hoverPiont)
    })
    svg.addEventListener('mouseleave', function(e) {
      svg.removeEventListener('mousemove', _this.hoverPiont)
    })
    this.drawGrid(svg)
    console.log(this.textData);
    this.drawTextRemarks(svg, this.textData)
    this.drawPolyline(svg, this.mouthLineData, 'black')
    this.drawPolyline(svg, this.armpitLineData, 'black')
    this.drawPolyline(svg, this.anusLineData, 'black')
    this.drawPolyline(svg, this.heartLineData, 'red')
    this.drawPolyline(svg, this.pulseLineData, 'red')
    this.drawPoints(svg, this.mouthLineData, '口表')
    this.drawPoints(svg, this.armpitLineData, '腋表')
    this.drawPoints(svg, this.anusLineData, '肛表')
    this.drawPoints(svg, this.heartLineData, '心率')
    this.drawPoints(svg, this.pulseLineData, '脉搏')
  }
  // 绘制网格
  drawGrid (svg) {
    // 横线
    for (let i = 1; i < 40; i++) {
      if (i % 5 === 0) {
        this.addSvgElement(svg, 'line', {
          x1: 0,
          y1: i*15,
          x2: this.svgWidth,
          y2: i*15,
          stroke: 'black',
          'stroke-width': 2
        })
      } else {
        this.addSvgElement(svg, 'line', {
          x1: 0,
          y1: i*15,
          x2: this.svgWidth,
          y2: i*15,
          stroke: 'black',
          'stroke-width': 1
        })
      }
    }
    // 竖线
    for (let i = 1; i < 42; i++) {
      if (i % 6 === 0) {
        this.addSvgElement(svg, 'line', {
          x1: (i-1)*15 + (15-1),
          y1: 0,
          x2: (i-1)*15 + (15-1),
          y2: this.svgHeight,
          stroke: 'red',
          'stroke-width': 2
        })
      } else {
        this.addSvgElement(svg, 'line', {
          x1: (i-1)*15 + (15-0.5),
          y1: 0,
          x2: (i-1)*15 + (15-0.5),
          y2: this.svgHeight,
          stroke: 'black',
          'stroke-width': 1
        })
      }
    }
  }
  // 绘制折线
  drawPolyline (svg, data, color) {
    let points = ''
    for (let i = 0; i < data.length; i++) {
      points += `${data[i][2]} ${data[i][3]},`
    }
    this.addSvgElement(svg, 'polyline', {
      points: points.substring(0, points.length - 1),
      fill: "none",
      stroke: color,
      'stroke-width': 2
    })
  }
  // 绘制点
  drawPoints (svg, data, style = '口表') {
    this.pointsInfo = this.pointsInfo.concat(data)
    const pointSize = 5
    for (let i = 0; i < data.length; i++) {
      const [centerX, centerY] = [data[i][2], data[i][3]]
      let overlappingPoints = this.pointsInfo.filter(item => item[2] === centerX && item[3] === centerY)
      let dataTips
      switch (style) {
        case '口表': // 口表，黑色实心圆
          data[i][1] = '口表：' + data[i][1] + ' °C'
          dataTips = overlappingPoints.map(item => item[1]).join('\n')
          this.addSvgElement(svg, 'circle', {
            class: 'point',
            'data-tip': [data[i][0], dataTips, data[i][2], data[i][3]],
            cx: centerX,
            cy: centerY,
            r: pointSize,
            fill: 'black'
          })
          break
        case '腋表': // 腋表，蓝色交叉
          data[i][1] = '腋表：' + data[i][1] + ' °C'
          dataTips = overlappingPoints.map(item => item[1]).join('\n')
          const diff = pointSize
          // const diff = Math.sqrt(Math.pow(pointSize, 2) / 2)
          this.addSvgElement(svg, 'line', {
            x1: centerX-diff,
            y1: centerY+diff,
            x2: centerX+diff,
            y2: centerY-diff,
            stroke: 'blue',
            'stroke-width': 2
          })
          this.addSvgElement(svg, 'line', {
            x1: centerX+diff,
            y1: centerY+diff,
            x2: centerX-diff,
            y2: centerY-diff,
            stroke: 'blue',
            'stroke-width': 2
          })
          // 透明的hover区域
          this.addSvgElement(svg, 'circle', {
            class: 'point',
            'data-tip': [data[i][0], dataTips, data[i][2], data[i][3]],
            cx: centerX,
            cy: centerY,
            r: pointSize + 1,
            fill: 'transparent',
            stroke: 'transparent'
          })
          break
        case '肛表': // 肛表，黑色空心圆
          data[i][1] = '肛表：' + data[i][1] + ' °C'
          dataTips = overlappingPoints.map(item => item[1]).join('\n')
          this.addSvgElement(svg, 'circle', {
            class: 'point',
            'data-tip': [data[i][0], dataTips, data[i][2], data[i][3]],
            cx: centerX,
            cy: centerY,
            r: pointSize,
            fill: 'white',
            stroke: 'black'
          })
          break
        case '心率': // 心率，红色空心圆
          data[i][1] = '心率：' + data[i][1] + ' 次/分'
          dataTips = overlappingPoints.map(item => item[1]).join('\n')
          this.addSvgElement(svg, 'circle', {
            class: 'point',
            'data-tip': [data[i][0], dataTips, data[i][2], data[i][3]],
            cx: centerX,
            cy: centerY,
            r: pointSize,
            fill: 'white',
            stroke: 'red'
          })
          break;
        case '脉搏': // 脉搏，红色实心圆
        data[i][1] = '脉搏：' + data[i][1] + ' 次/分'
        dataTips = overlappingPoints.map(item => item[1]).join('\n')
        this.addSvgElement(svg, 'circle', {
            class: 'point',
            'data-tip': [data[i][0], dataTips, data[i][2], data[i][3]],
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
  drawTextRemarks (svg, data) {
    for (let i = 0; i < data.length; i++) {
      const [x, text] = [data[i][0], data[i][1]]
      this.addSvgElement(svg, 'text', {
        x: x,
        y: 1.5,
        'font-size': '15',
        fill: 'black'
      }, text)
    }
  }
  // 创建svg子元素
  addSvgElement (svg, tagName, attributes, innerText) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tagName)
    for (let attr in attributes) {
      el.setAttribute(attr, attributes[attr])
    }
    if (innerText) el.textContent = innerText
    svg.appendChild(el)
  }
  // hoverPoint时显示坐标信息
  hoverPiont (e) {
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
  // 时间日期转化为x轴坐标
  timeToX (time) {
    const currentDate = new Date(time)
    let num = Math.ceil((currentDate - this.startDate) / 1000 / 60 / 60 / 4)
    if (num % 6 === 0 && time.split(' ')[1] === '00:00:00') {
      num = num + 1
    }
    return (num - 1) * 15 + 7.5
  }
  // 温度转化为y轴坐标
  temperatureToY (temperature) {
    return Math.floor(600 - (temperature - 34) * 75)
  }
  // 频率转化为y轴坐标
  frequencyToY (frequency) {
    return Math.floor(600 - (frequency - 20) * (75 / 20))
  }
  // 添加页码
  createPagination (pageNum = 1) {
    const pagination = document.createElement('div')
    pagination.classList.add('pagination')
    pagination.innerText = `第 ${pageNum} 页`
    this.container.appendChild(pagination)
  }
  // 数据变更
  update (text) {
    console.log(text)
  }
}
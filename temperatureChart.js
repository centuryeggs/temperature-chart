class TemperatureChart {
  constructor (rootNode, originData) {
    this.defaultData = {
      title: '体温单',
      baseInfo: [
        { label: '姓名', value: '' },
        { label: '年龄', value: '' },
        { label: '科别', value: '' },
        { label: '床号', value: '' },
        { label: '住院病历号', value: '' },
        { label: '入院日期', value: '' }
      ],
      tableHeadData: [
        { '日期': ['', '', '', '', '', '', ''] },
        { '住院日数': ['', '', '', '', '', '', ''] },
        { '手术或产后日数': ['', '', '', '', '', '', ''] }
      ],
      tableFootData: [
        { '呼吸(次/分)': [
          ['','','','','',''],
          ['','','','','',''],
          ['','','','','',''],
          ['','','','','',''],
          ['','','','','',''],
          ['','','','','',''],
          ['','','','','','']
        ]},
        { '血压(mmHg)': [
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
          ['', ''],
        ] },
        { '总入液量(ml)': ['', '', '', '', '', '', ''] },
        { '大便(次)': ['', '', '', '', '', '', ''] },
        { '尿量(ml)': ['', '', '', '', '', '', ''] },
        { '其它排出量': ['', '', '', '', '', '', ''] },
        { '体重(kg)': ['', '', '', '', '', '', ''] },
        { '皮试': ['', '', '', '', '', '', ''] },
        { '血糖(mmol/L)': ['', '', '', '', '', '', ''] },
        { '其它': ['', '', '', '', '', '', ''] }
      ],
      mouthTemperature: [],
      armpitTemperature: [],
      anusTemperature: [],
      pulseFrequency: [],
      heartFrequency: [],
      textRemarks: []
    }
    this.svgWidth = 630
    this.svgHeight = 600
    this.pointsInfo = []
    this.rootNode = rootNode
    this.init(originData)
  }
  // 初始化
  init (originData) {
    this.container = document.createElement('div')
    this.container.classList.add('container')
    this.rootNode.appendChild(this.container)
    originData = originData || this.defaultData
    this.title = originData && originData.title || '体温单'
    this.baseInfo = originData && originData.baseInfo || []
    this.tableHeadData = originData && originData.tableHeadData || []
    this.tableFootData = originData && originData.tableFootData || []
    this.startDate = originData && new Date(originData.tableHeadData[0]['日期'][0] + ' 00:00:00')
    if (this.startDate) {
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
    } else {
      console.error("tableHeadData[0]['日期'][0],不是一个有效的日期(YYYY-MM-DD")
    }
    this.createTitle()
    this.createHeadForm()
    this.createMainTable()
    this.createPagination()
  }
  // 销毁
  destory () {
    this.pointsInfo = []
    this.container.remove()
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
    // 点击图示，隐藏或显示对应折线
    this.container.querySelector('.icons').addEventListener('click', e => {
      this.triggerVisible(e.target)
    })
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
          <div class="icon" data-label="mouth">口表
            <svg width="10" height="10">
              <circle r="5" cx="5" cy="5" />
            </svg>
          </div>
          <div class="icon" data-label="armpit">腋表
            <svg width="10" height="10">
              <g stroke="blue" stroke-width="2">
                <line x1="0" y1="0" x2="10" y2="10" />
                <line x1="0" y1="10" y2="0" x2="10" />
              </g>
            </svg>
          </div>
          <div class="icon" data-label="anus">肛表
            <svg width="10" height="10">
              <circle r="5" cx="5" cy="5" />
              <circle r="3.8" cx="5" cy="5" fill="#fff" />
            </svg>
          </div>
          <div class="icon" data-label="heart">心率
            <svg width="10" height="10">
              <circle r="5" cx="5" cy="5" />
              <circle r="5" cx="5" cy="5" fill="red" />
              <circle r="3.8" cx="5" cy="5" fill="#fff" />
            </svg>
          </div>
          <div class="icon" data-label="pulse">脉搏
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
    this.drawTextRemarks(svg, this.textData)
    this.drawPolyline(svg, this.mouthLineData, 'mouth')
    this.drawPolyline(svg, this.armpitLineData, 'armpit')
    this.drawPolyline(svg, this.anusLineData, 'anus')
    this.drawPolyline(svg, this.heartLineData, 'heart')
    this.drawPolyline(svg, this.pulseLineData, 'pulse')
    this.handlePointsData(svg, {
      mouth: this.mouthLineData,
      armpit: this.armpitLineData,
      anus: this.anusLineData,
      heart: this.heartLineData,
      pulse: this.pulseLineData
    })
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
  drawPolyline (svg, data, type) {
    let color
    switch (type) {
      case 'mouth':
        color = 'black'
        break
      case 'armpit':
        color = 'black'
        break
      case 'anus':
        color = 'black'
        break
      case 'heart':
        color = 'red'
        break
      case 'pulse':
        color = 'red'
        break
    }
    let points = ''
    for (let i = 0; i < data.length; i++) {
      points += `${data[i][2]} ${data[i][3]},`
    }
    this.addSvgElement(svg, 'polyline', {
      'data-type': type,
      points: points.substring(0, points.length - 1),
      fill: "none",
      stroke: color,
      'stroke-width': 2
    })
  }
  // 显示隐藏折线
  triggerVisible (dom) {
    // 点击图示切换样式，隐藏时显示中间横线
    if (dom.style.textDecoration === 'line-through red') {
      dom.style.textDecoration = ''
    } else {
      dom.style.textDecoration = 'line-through red'
    }
    let type = dom.dataset.label.trim()
    this.container.querySelectorAll(`[data-type='${type}']`).forEach(item => {
      item.style.display = item.style.display === 'none' ? 'block' : 'none'
    })
  }
  // 绘制点之前，对点数据进行处理：重叠点处理，和data-tip处理
  handlePointsData (svg, data) {
    let allPoints = []
    Object.keys(data).forEach(key => {
      for (let i = 0; i < data[key].length; i++) {
        // 判断是否有重复点
        let overlappingPointIndex = allPoints.findIndex(item => {
          return item.tipsValue.length > 0 && item.x === data[key][i][2] && item.y === data[key][i][3]
        })
        if (overlappingPointIndex > -1) {
          allPoints.push({
            type: key,
            time: data[key][i][0],
            tipsValue: [...allPoints[overlappingPointIndex].tipsValue, {type: key, value: data[key][i][1]}],
            x: data[key][i][2],
            y: data[key][i][3]
          })
          allPoints[overlappingPointIndex].tipsValue.push({type: key, value: data[key][i][1]})
        } else {
          allPoints.push({
            type: key,
            time: data[key][i][0],
            tipsValue: [{type: key, value: data[key][i][1]}],
            x: data[key][i][2],
            y: data[key][i][3]
          })
        }
      }
      this.drawPoints(svg, allPoints)
    })
  }
  // 绘制点
  drawPoints (svg, data) {
    const pointSize = 5
    for (let i = 0; i < data.length; i++) {
      const [centerX, centerY] = [data[i].x, data[i].y]
      switch (data[i].type) {
        case 'mouth': // 口表，黑色实心圆
          this.addSvgElement(svg, 'circle', {
            'data-type': data[i].type,
            cx: centerX,
            cy: centerY,
            r: pointSize,
            fill: 'black'
          })
          break
        case 'armpit': // 腋表，蓝色交叉
          const diff = pointSize
          // const diff = Math.sqrt(Math.pow(pointSize, 2) / 2)
          this.addSvgElement(svg, 'line', {
            'data-type': data[i].type,
            x1: centerX-diff,
            y1: centerY+diff,
            x2: centerX+diff,
            y2: centerY-diff,
            stroke: 'blue',
            'stroke-width': 2
          })
          this.addSvgElement(svg, 'line', {
            'data-type': data[i].type,
            x1: centerX+diff,
            y1: centerY+diff,
            x2: centerX-diff,
            y2: centerY-diff,
            stroke: 'blue',
            'stroke-width': 2
          })
          break
        case 'anus': // 肛表，黑色空心圆
          this.addSvgElement(svg, 'circle', {
            'data-type': data[i].type,
            cx: centerX,
            cy: centerY,
            r: pointSize,
            fill: 'white',
            stroke: 'black'
          })
          break
        case 'heart': // 心率，红色空心圆
          this.addSvgElement(svg, 'circle', {
            'data-type': data[i].type,
            cx: centerX,
            cy: centerY,
            r: pointSize,
            fill: 'white',
            stroke: 'red'
          })
          break;
        case 'pulse': // 脉搏，红色实心圆
        this.addSvgElement(svg, 'circle', {
            'data-type': data[i].type,
            cx: centerX,
            cy: centerY,
            r: pointSize,
            fill: 'red'
          })
        default:
          break
      }
      // 透明的hover区域
      this.addSvgElement(svg, 'circle', {
        class: 'point',
        'data-type': data[i].type,
        'data-tip': JSON.stringify([data[i].time, data[i].tipsValue, centerX, centerY]),
        cx: centerX,
        cy: centerY,
        r: pointSize + 1,
        fill: 'transparent',
        stroke: 'transparent'
      })
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
      const [time, tipsArr, x, y] = JSON.parse(e.target.dataset.tip)
      if (tipsArr.length === 0) return

      let hiddenTypes = []
      document.querySelectorAll('.icon').forEach(item => {
        if (item.style.textDecoration === 'line-through red') {
          hiddenTypes.push(item.dataset.label.trim())
        }
      })
      let showTipsArr = tipsArr.filter(i => !hiddenTypes.includes(i.type))
      let showTipsStr = showTipsArr.map(p => {
        const typeMapping = {
          mouth: '口表',
          armpit: '腋表',
          anus: '肛表',
          heart: '心率',
          pulse: '脉搏'
        }
        const unitMapping = {
          mouth: '°C',
          armpit: '°C',
          anus: '°C',
          heart: '次/分',
          pulse: '次/分'
        }
        return typeMapping[p.type] + ': ' + p.value + unitMapping[p.type]
      }).join('\n')
      tooltip.innerText = `${time}\n${showTipsStr}`
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
  update (newData) {
    this.destory()
    this.init(newData)
  }
}

const numberToWord = ['零','一','二','三','四','五','六','七','八','九']
const inTimeArea = {
  '00': 5, '01': 5, '02': 0, '03': 0,
  '04': 0, '05': 0, '06': 1, '07': 1,
  '08': 1, '09': 1, '10': 2, '11': 2,
  '12': 2, '13': 2, '14': 3, '15': 3,
  '16': 3, '17': 3, '18': 4, '19': 4,
  '20': 4, '21': 4, '22': 5, '23': 5
}
let textArr = ['2021-10-18', '2021-10-18', '2021-10-18', '2021-10-18', '2021-10-18', '2021-10-18', '2021-10-18']
let bloodArr = new Array(14).fill('118/42')
let breathArr = new Array(42).fill(42)
let tempArr = [
  { val: '35', type: '0' },
  { val: '36.9', type: '1' },
  { val: '', type: '2' },
  { val: '38', type: '0' },
  { val: '39', type: '1' }
]
let pulseTestArr = ['160', '', '88', '156', '77']
let billWidth = 900 // 单据宽度，也是canvas宽度
let leftRightInterval = 18 //单据左右间距
let tableTop = 155 //表格开始高度
let topRowHeight = 24 //表格头部/底部行高
let topRowNum = 3 //表格头部数量
let squareWidth = 18 //一个刻度高度
let fontSize = 12 //普通文字大小
let timeArr = [4, 8, 12, 16, 20, 24] //时间刻度
let midRow = 40 //中部行数
let pulseArr = [160, 140, 120, 100, 80, 60, 40]
let temperature = [41, 40, 39, 38, 37, 36, 35]
let bottomProp = [
  { name: '总入液量', prop: '' },
  { name: '大便(次)', prop: '' },
  { name: '尿量(ml)', prop: '' },
  { name: '其他排出量', prop: '' },
  { name: '体重(kg)', prop: '' },
  { name: '皮试', prop: '' },
  { name: '其它', prop: '' }
]
let billScale = window.devicePixelRatio * 1.5
let adt = '2021-10-18 10:18:12'
let timeHeight = squareWidth * 2
let middleStartHeight = tableTop + topRowHeight * topRowNum + timeHeight
let bottomStartHeight = middleStartHeight + squareWidth * midRow
let leftStartWidth = leftRightInterval + squareWidth * 6
let canvas = document.getElementById('canvas')
canvas.style.width = "900px"
canvas.style.height = "1250px"
let ctx = canvas.getContext('2d')
canvas.width = Math.floor(900 * billScale);
canvas.height = Math.floor(1250 * billScale);
ctx.scale(billScale, billScale)
window.onresize = function (e) {
  if (billScale !== window.devicePixelRatio) {
    // window.location.reload()
  }
}
drawBill()
function drawBill () {
  // 副标题
  drawWord(ctx, '体       温       单', '30', 350, 90, '#666')
  // 标题
  drawWord(ctx, 'XXXXXXXXXXXXXXXX医院', 'normal bold 40', 150, 50)
  // 首行病人信息
  drawWord(ctx, '姓名:    年龄:    性别:    科别:    床号:    住院病例号:    入院日期:    ', fontSize, 20, 150, )
  // 绘制表格头部
  drawBillHead(ctx)
  // 绘制表格中部
  drawMiddle(ctx)
  // 绘制表格底部
  drawBottom(ctx)
  pulseLine(ctx, pulseTestArr)
  pulsePoint(ctx, pulseTestArr)
  tempLine(ctx, tempArr)
  tempPoint(ctx, tempArr)
  breath(ctx, breathArr)
  inhosDay(ctx, textArr)
  operationDay(ctx, textArr)
  inhosDate(ctx, textArr)
  bloodPress(ctx, bloodArr)
  drawInhosDate(ctx, adt)
  // ctx.draw()
}
// canvas描绘直线方法
function drawLine (
  ctx, startIndex = 0, startY = 0, endX = 0, endY = 0, color = 'black',
) {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.lineWidth = 1
  ctx.moveTo( startIndex, startY)
  ctx.lineTo(endX, endY)
  ctx.stroke()
  ctx.closePath()
}
function drawWord (
  ctx, text = '', fontSize = 0, x = 0, y = 0, color = 'black'
) {
  ctx.fillStyle = color
  ctx.font = fontSize + 'px Arial'
  ctx.fillText(text, x, y)
  ctx.stroke()
}
// 绘制中间空白圆
function drawCircle (ctx, startIndex = 0, startY = 0, color = 'black') {
  ctx.beginPath()
  ctx.strokeStyle = 'black'
  ctx.fillStyle = '#fff'
  ctx.lineWidth = 3
  ctx.arc(
    startIndex, startY, 6, 0, 2 * Math.PI
  )
  ctx.stroke()
  ctx.fill()
  ctx.closePath()
}
// 绘制实心圆
function drawFillCircle (ctx, startIndex = 0, startY = 0, color = 'red') {
  ctx.beginPath()
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 0.001
  ctx.arc(
    startIndex, startY, 7, 0, 2 * Math.PI
  )
  ctx.fill()
  ctx.closePath()
}
// 绘制口表圆
function mouthCircle (ctx, startIndex = 0, startY = 0) {
  drawFillCircle(ctx, startIndex, startY, '#409eff')
}
// 绘制脉搏圆
function pulseCircle (ctx, startIndex = 0, startY = 0) {
  drawFillCircle(ctx, startIndex, startY, 'red')
}
// 绘制肛表圆
function anusCircle (ctx, startIndex = 0, startY = 0) {
  drawCircle(ctx, startIndex, startY)
}
// 绘制腋表交叉
function axilCross (ctx, startIndex = 0, startY = 0) {
  drawLine(
    ctx, startIndex, startY, startIndex + 5, startY + 5, 'blue'
  )
  drawLine(
    ctx, startIndex, startY, startIndex - 5, startY + 5, 'blue'
  )
  drawLine(
    ctx, startIndex, startY, startIndex + 5, startY - 5, 'blue'
  )
  drawLine(
    ctx, startIndex, startY, startIndex - 5, startY - 5, 'blue'
  )
}
// 绘制表格头部
function drawBillHead (ctx) {
  let headArr = [ '日 期', '住院日数', '手术或产后日数', '时间' ]
  for (let i = 0;i <= 3;i++){
    drawLine(
      ctx,
      leftRightInterval,
      tableTop + topRowHeight * i,
      billWidth - leftRightInterval,
      tableTop + topRowHeight * i
    )
    // 绘制标题文字
    drawWord(
      ctx, headArr[i],
      fontSize,
      leftRightInterval + 2,
      tableTop + topRowHeight * (i + 1) - topRowHeight / 2 + fontSize / 2
    )
  }
  // 绘制时间头部行
  drawLine(
    ctx,
    leftRightInterval,
    tableTop + topRowHeight * topRowNum + timeHeight,
    billWidth - leftRightInterval,
    tableTop + topRowHeight * topRowNum + timeHeight,
  )
  // 绘制竖线
  for (let i = 0;i <= 8;i++){
    let endY = (i === 0 || i === 1 || i === 8) ?
      tableTop + topRowHeight * topRowNum + timeHeight :
      tableTop + topRowHeight * topRowNum
    drawLine(
      ctx,
      leftRightInterval + squareWidth * timeArr.length * i,
      tableTop,
      leftRightInterval + squareWidth * timeArr.length * i,
      endY
    )
  }
  // 绘制时间上下分线
  drawLine(
    ctx,
    leftRightInterval + squareWidth * timeArr.length,
    tableTop + topRowHeight * topRowNum + timeHeight / 2,
    billWidth - leftRightInterval,
    tableTop + topRowHeight * topRowNum + timeHeight / 2
  )
  // 绘制上下午
  let word = '上   午'
  for (let i = 0;i < 14;i++){
    drawWord(
      ctx,
      word,
      fontSize,
      leftRightInterval + squareWidth * (timeArr.length + 0.5) + squareWidth * 3 * i,
      tableTop + timeHeight + topRowHeight * topRowNum - timeHeight / 2 - timeHeight / 4 + fontSize / 2
    )
    word = word === '上   午' ? '下   午' : '上   午'
  }
  // 绘制时间刻度竖线
  for (let i = 1;i <= 42;i++){
    let startY = i % timeArr.length === 0 ?
      (tableTop + topRowHeight * topRowNum) :
      (tableTop + topRowHeight * topRowNum + timeHeight / 2)
    let lineColor = (i % timeArr.length === 0 && i !== 42) ? 'red' : 'black'
    drawLine(
      ctx,
      leftRightInterval + squareWidth * timeArr.length + squareWidth * i,
      startY,
      leftRightInterval + squareWidth * timeArr.length + squareWidth * i,
      tableTop + topRowHeight * topRowNum + timeHeight,
      lineColor
    )
    let timeIndex = (i - 1) % timeArr.length
    // 绘制时间刻度
    let wordX = (timeIndex === 0 || timeIndex === 1) ?
      (6 + timeArr.length * squareWidth + squareWidth * i) :
      (2 + timeArr.length * squareWidth + squareWidth * i)
    drawWord(
      ctx,
      timeArr[timeIndex],
      fontSize,
      wordX,
      tableTop + topRowHeight * topRowNum + timeHeight - timeHeight / 4 + fontSize / 2
    )
  }
}
// 绘制中部行格
function drawMiddle (ctx) {
  // 绘制横线
  for (let i = 0;i < midRow;i++){
    let lineColor = (i + 1) % 5 === 0 ? 'black' : '#999'
    drawLine(
      ctx,
      leftRightInterval + squareWidth * 6,
      middleStartHeight + squareWidth * (i + 1),
      billWidth - leftRightInterval,
      middleStartHeight + squareWidth * (i + 1),
      lineColor
    )
  }
  // 绘制竖线
  for (let i = 1;i <= 42;i++){
    let lineColor = (i % timeArr.length === 0 && i !== 42) ? 'red' : '#999'
    if (i === 42){
      lineColor = 'black'
    }
    drawLine(
      ctx,
      leftRightInterval + squareWidth * timeArr.length + squareWidth * i,
      tableTop + topRowHeight * topRowNum + timeHeight,
      leftRightInterval + squareWidth * timeArr.length + squareWidth * i,
      tableTop + topRowHeight * topRowNum + timeHeight + squareWidth * midRow,
      lineColor
    )
  }
  // 绘制左侧坐标竖线
  drawLine(
    ctx,
    leftRightInterval,
    middleStartHeight,
    leftRightInterval,
    bottomStartHeight
  )
  drawLine(
    ctx,
    leftRightInterval + squareWidth * 4,
    middleStartHeight,
    leftRightInterval + squareWidth * 4,
    bottomStartHeight
  )
  drawLine(
    ctx,
    leftRightInterval + squareWidth * 6,
    middleStartHeight,
    leftRightInterval + squareWidth * 6,
    bottomStartHeight
  )
  // 左侧底部横线
  drawLine(
    ctx,
    leftRightInterval,
    bottomStartHeight,
    leftRightInterval + squareWidth * 6,
    bottomStartHeight
  )
  // 左侧坐标文字
  drawWord(
    ctx,
    '脉 搏',
    'bold ' + fontSize,
    leftRightInterval + squareWidth * 2 + 4,
    middleStartHeight + fontSize,
    'red'
  )
  drawWord(
    ctx,
    '体 温',
    'bold ' + fontSize,
    leftRightInterval + squareWidth * 4 + 4,
    middleStartHeight + fontSize,
    'blue'
  )
  for (let i = 0;i < pulseArr.length;i++){
    drawWord(
      ctx,
      pulseArr[i],
      'bold ' + fontSize,
      leftRightInterval + squareWidth * 2.5,
      middleStartHeight + squareWidth * 5 * (i + 1) + fontSize / 2
    )
    drawWord(
      ctx,
      temperature[i],
      'bold ' + fontSize,
      leftRightInterval + squareWidth * 4.5,
      middleStartHeight + squareWidth * 5 * (i + 1) + fontSize / 2
    )
  }
  // 温度图示
  drawWord(
    ctx,
    '口表',
    'bold ' + fontSize,
    leftRightInterval + 4,
    bottomStartHeight - 110
  )
  drawWord(
    ctx,
    '腋表',
    'bold ' + fontSize,
    leftRightInterval + 4,
    bottomStartHeight - 80
  )
  drawWord(
    ctx,
    '肛表',
    'bold ' + fontSize,
    leftRightInterval + 4,
    bottomStartHeight - 50
  )
  drawWord(
    ctx,
    '脉搏',
    'bold ' + fontSize,
    leftRightInterval + 4,
    bottomStartHeight - 20
  )
  mouthCircle(ctx,
    leftRightInterval + squareWidth * 2 + 2,
    bottomStartHeight - 115)
  axilCross(ctx,
    leftRightInterval + squareWidth * 2 + 2,
    bottomStartHeight - 85)
  anusCircle(ctx,
    leftRightInterval + squareWidth * 2 + 2,
    bottomStartHeight - 55)
  pulseCircle(ctx,
    leftRightInterval + squareWidth * 2 + 2,
    bottomStartHeight - 25)
}
// 绘制底部
function drawBottom (ctx) {
  // 绘制呼吸血压横线
  drawLine(
    ctx,
    leftRightInterval,
    bottomStartHeight + timeHeight,
    billWidth - leftRightInterval,
    bottomStartHeight + timeHeight
  )
  drawLine(
    ctx,
    leftRightInterval,
    bottomStartHeight + timeHeight * 2,
    billWidth - leftRightInterval,
    bottomStartHeight + timeHeight * 2
  )
  // 绘制底部总体竖线
  drawLine(
    ctx,
    leftRightInterval,
    bottomStartHeight,
    leftRightInterval,
    bottomStartHeight + timeHeight * 2 + topRowHeight * bottomProp.length
  )
  for (let i = 0;i <= 42;i++){
    let endY = 0
    let color = '#999'
    switch (i / 3){
    case 0:
    case 2:
    case 4:
    case 6:
    case 8:
    case 10:
    case 12:
    case 14:
      endY = bottomStartHeight + timeHeight * 2 + topRowHeight * bottomProp.length
      color = 'black'
      break
    case 1:
    case 3:
    case 5:
    case 7:
    case 9:
    case 11:
    case 13:
      endY = bottomStartHeight + timeHeight * 2
      break
    default:
      endY = bottomStartHeight + timeHeight
    }
    drawLine(
      ctx,
      leftStartWidth + squareWidth * i,
      bottomStartHeight,
      leftStartWidth + squareWidth * i,
      endY,
      color
    )
  }
  // 绘制底部横线
  for (let i = 0;i < bottomProp.length;i++){
    drawLine(
      ctx,
      leftRightInterval,
      bottomStartHeight + timeHeight * 2 + topRowHeight * (i + 1),
      billWidth - leftRightInterval,
      bottomStartHeight + timeHeight * 2 + topRowHeight * (i + 1)
    )
  }
  // 绘制呼吸、血压文字
  drawWord(
    ctx, '呼吸',
    'bold ' + fontSize,
    leftRightInterval + 2,
    bottomStartHeight + timeHeight / 2 + fontSize / 2
  )
  drawWord(
    ctx, '血压',
    'bold ' + fontSize,
    leftRightInterval + 2,
    bottomStartHeight + timeHeight * 2 - timeHeight / 2 + fontSize / 2
  )
  // 绘制其他信息行标题
  for (let i = 0;i < bottomProp.length;i++){
    drawWord(
      ctx, bottomProp[i].name,
      'bold ' + fontSize,
      leftRightInterval + 2,
      bottomStartHeight + timeHeight * 2 + topRowHeight * (i + 1) - topRowHeight / 2 + fontSize / 2
    )
  }
}
// 绘制住院日期
function inhosDate (ctx, arr) {
  for (let i = 0;i < arr.length;i++){
    drawWord(
      ctx,
      arr[i],
      'bold ' + fontSize,
      leftStartWidth + 2 + squareWidth * 6 * i,
      tableTop + topRowHeight / 2 + fontSize / 2
    )
  }
}
// 绘制住院日数
function inhosDay (ctx, arr) {
  for (let i = 0;i < arr.length;i++){
    drawWord(
      ctx,
      arr[i],
      'bold ' + fontSize,
      leftStartWidth + 2 + squareWidth * 6 * i,
      tableTop + topRowHeight + topRowHeight / 2 + fontSize / 2
    )
  }
}
// 绘制手术或产后日数
function operationDay (ctx, arr) {
  for (let i = 0;i < arr.length;i++){
    drawWord(
      ctx,
      arr[i],
      'bold ' + fontSize,
      leftStartWidth + 2 + squareWidth * 6 * i,
      tableTop + topRowHeight * 2 + topRowHeight / 2 + fontSize / 2
    )
  }
}
// 绘制呼吸
function breath (ctx, arr) {
  let upPosition = bottomStartHeight + fontSize + 3
  let downPosition = bottomStartHeight + timeHeight - 5
  let yposition = upPosition
  for (let i = 0;i < arr.length;i++){
    drawWord(
      ctx,
      arr[i],
      'bold ' + fontSize,
      leftStartWidth + squareWidth * i + 2,
      yposition
    )
    yposition = yposition === upPosition ? downPosition : upPosition
  }
}
// 绘制血压
function bloodPress (ctx, arr) {
  for (let i = 0;i < arr.length;i++){
    drawWord(
      ctx,
      arr[i],
      'bold ' + fontSize,
      leftStartWidth + squareWidth * 3 * i + 4,
      bottomStartHeight + timeHeight + timeHeight / 2 + fontSize / 2,
    )
  }
}
// 绘制入院日期
function drawInhosDate (ctx, date) {
  let time = date.split(' ')[1].split(':')
  let hours = timeToWordMethod(time[0])
  let minite = timeToWordMethod(time[1])
  // '入院||' +
  let timelStr = hours + '时' + minite + '分'
  let xMove = inTimeArea[time[1]]
  let wordX = leftStartWidth + 3 + xMove * squareWidth
  let lineX = leftStartWidth + squareWidth / 2 + xMove * squareWidth
  drawWord(
    ctx,
    '入',
    'bold ' + fontSize,
    wordX,
    middleStartHeight + squareWidth - fontSize / 2,
    'red'
  )
  drawWord(
    ctx,
    '院',
    'bold ' + fontSize,
    wordX,
    middleStartHeight + squareWidth * 2 - fontSize / 2,
    'red'
  )
  drawLine(
    ctx,
    lineX,
    middleStartHeight + squareWidth * 2 + 4,
    lineX,
    middleStartHeight + squareWidth * 4 - 4,
    'red'
  )
  for (let i = 0;i < timelStr.length;i++){
    drawWord(
      ctx,
      timelStr[i],
      'bold ' + fontSize,
      wordX,
      middleStartHeight + squareWidth * (i + 5) - fontSize / 2,
      'red'
    )
  }
}
// 绘制体温曲线
function tempLine (ctx, arr) {
  let single = 1 / 5
  let startIndex = -1
  let endIndex = -1
  for (let i = 0;i < arr.length;i++){
    // 绘制连线
    if (arr[i].val){
      if ( startIndex === -1){
        startIndex = i
      } else {
        endIndex = i
        drawLine(
          ctx,
          leftStartWidth + squareWidth * ( startIndex + 1 - 0.5),
          middleStartHeight + ( 42 - Number(arr[startIndex].val)) / single * squareWidth,
          leftStartWidth + squareWidth * (endIndex + 1 - 0.5),
          middleStartHeight + ( 42 - Number(arr[endIndex].val)) / single * squareWidth,
          'blue'
        )
        startIndex = endIndex
      }
    }
  }
}
// 由于canvas画图没层级概念，只有先来后到概念，需要先画完全部连线再标点
function tempPoint (ctx, arr) {
  let single = 1 / 5
  for (let i = 0;i < arr.length;i++){
    let x = leftStartWidth + squareWidth * (i + 1 - 0.5)
    let y = middleStartHeight + ( 42 - Number(arr[i].val)) / single * squareWidth
    switch (arr[i].type){
    case '0':
      mouthCircle(ctx, x, y)
      break
    case '1':
      axilCross(ctx, x, y)
      break
    case '2':
      anusCircle(ctx, x, y)
      break
    }
  }
}
function pulseLine (ctx, arr) {
  let single = 20 / 5
  let startIndex = -1
  let endIndex = -1
  for (let i = 0;i < arr.length;i++){
    // 绘制连线
    if (arr[i]){
      if ( startIndex === -1){
        startIndex = i
      } else {
        endIndex = i
        drawLine(
          ctx,
          leftStartWidth + squareWidth * ( startIndex + 1 - 0.5),
          middleStartHeight + ( 180 - Number(arr[startIndex])) / single * squareWidth,
          leftStartWidth + squareWidth * (endIndex + 1 - 0.5),
          middleStartHeight + ( 180 - Number(arr[endIndex])) / single * squareWidth,
          'red'
        )
        startIndex = endIndex
      }
    }
  }
}
function pulsePoint (ctx, arr) {
  let single = 20 / 5
  for (let i = 0;i < arr.length;i++){
    let x = leftStartWidth + squareWidth * (i + 1 - 0.5)
    let y = middleStartHeight + ( 180 - Number(arr[i])) / single * squareWidth
    pulseCircle(ctx, x, y)
  }
}
function timeToWordMethod(time) {
  switch (time[0]) {
    case '0':
      return numberToWord[time[1]]
    case '1':
      if (time[1] === '0') {
        return '十'
      }
      return '十' + numberToWord[time[1]]
    default:
      if (time[1] === '0') {
        return numberToWord[time[0]] + '十'
      }
      return numberToWord[time[0]] + '十' + numberToWord[time[1]]
  }
}

## Temperature chart
### 预览：[在线预览](https://centuryeggs.github.io/temperature-chart/)
![](./preview.png)

### 使用：
```
<link rel="stylesheet" href="style.css">
<script src="temperatureChart.js"></script>
<div id="A4"></div>
<script>
  const el = document.getElementsById('A4');
  const originData = {
    title: ..., // 标题
    baseInfo: ..., // 基本信息
    tableHeadData: ..., // 表格头部
    mouthTemperature: ..., // 口表温度数据
    armpitTemperature: ..., // 腋表温度数据
    anusTemperature: ..., // 肛表温度数据
    pulseFrequency: ..., // 脉搏数据
    heartFrequency: ..., // 心率数据
    textRemarks: ..., // 出入院，手术等红色文字数据
    tableFootData: ... // 表格尾部
    // 详细数据格式，请参照index.html
  };
  new TemperatureChart(el, originData);
</script>
```
### 功能：
|   | 描述 | 状态 |
|---|-------|-------|
| 1 | hover显示坐标信息 | 完成 |
| 2 | 底部table若入参类型为数组，则根据数组length自动均分单元格 | 完成 |
| 3 | 呼吸行上下错开显示（且每天首次显示在格子上部） | 完成 |
| 4 | 不同折线的点重合时，合并坐标信息 | 未完成 |
| 5 | 点击左下角图示，控制对应折线的显示隐藏 | 未完成 |
| 6 | 通过update方法，局部更新表格内容 | 未完成 |

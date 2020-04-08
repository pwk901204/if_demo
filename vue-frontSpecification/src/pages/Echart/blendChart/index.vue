<template>
  <div class="page-header-index-wide page-chart">
    <a-row class="fly" :gutter="12">
      <a-col :span="12">
        <div class="chart-item">
          <div class="chart-title">
            <h2>多个横坐标折线图</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="multipleAbscChart"></div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="chart-item">
          <div class="chart-title">
            <h2>叠加柱形折线混合图</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="overlyingChart"></div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import chartModel from '@/common/utils/chartModel'
import { abscData, overlyingData } from './abscData'
import echartsConfig from './echartsConfig'
export default {
  name: 'PieChart',
  components: {
  },
  data () {
    return {
      gridArray: [],
      xAxisArray: [],
      yAxisArray: [],
      seriesArray: []
    }
  },
  mounted () {
    this.initMultipleAbscChart(abscData)  // 多个横坐标折线图
    this.initOverlyingChart(overlyingData)
  },
  methods: {
    // 多个横坐标折线图
    initMultipleAbscChart (data) {
      let dom = document.getElementById('multipleAbscChart')
      let chart = echarts.init(dom)
      if (dom) {
        for (var i = 0; i < data.length; i++) {
          data[i].lastNum = data[i].hgjjCommonDtos.length ? data[i].hgjjCommonDtos[data[i].hgjjCommonDtos.length - 1].normVlaue : 0
        }
        let compareByAttr = function (property) {
          return function (a, b) {
            var value1 = a[property]
            var value2 = b[property]
            return value2 - value1
          }
        }
        data.sort(compareByAttr('lastNum')).reverse()

        var nameStr
        var configChart = this.getConfigChart()
        for (var i = 0; i < 11; i++) {
          this.gridArray.push({
            x: (7 + 8 * i) + '%',
            y: '9%',
            width: '8%',
            height: '80%'
          })
          nameStr = data[i].areaName
          if (nameStr == '江北集中区') {
            nameStr = '江北集 中区'.split(' ').join('\n')
          } else if (nameStr == '长江大桥开发区') {
            nameStr = '长江大 桥开发区'.split(' ').join('\n')
          }
          this.xAxisArray.push({
            gridIndex: i,
            type: 'category',
            data: this.getNeedAttrArr(data[i].hgjjCommonDtos, 'year'),
            name: nameStr,
            nameLocation: 'center',
            axisTick: {
              show: true,
              interval: 11
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#666',
              }
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: '#f0f0f0 ',
              }
            },
            axisLabel: {
              textStyle: {
                color: '#4c4c4c',
                fontWeight: 'normal',
                fontSize: '12',
              },
              interval: 0, // 横轴信息全部显示
              rotate: 30
            },
            triggerEvent: true,
            axisLabel: {
              color: 'transparent',
            }
          })

          if (i == 0) {
            this.yAxisArray.push({
              gridIndex: 0,
              type: 'value',
              name: '亿元',
              axisTick: {
                show: true
              },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#666',
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f0f0f0 ',
                }
              },
              axisLabel: {
                textStyle: {
                  color: '#4c4c4c',
                  fontWeight: 'normal',
                  fontSize: '12',
                },
                formatter: '{value}'
              },
              min: 0,
              max: 70
            })
          } else {
            this.yAxisArray.push({
              gridIndex: i,
              type: 'value',
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#f0f0f0 ',
                }
              },
              axisLabel: {
                show: false
              },
              min: 0,
              max: 70
            })
          }

          this.seriesArray.push({
            xAxisIndex: i,
            yAxisIndex: i,
            data: this.getNeedAttrArr(data[i].hgjjCommonDtos, 'normVlaue'),
            type: 'line',
            color: configChart.color[i]
          })

        }
        let option = chartModel.multipleAbscChart({
          gridArray: this.gridArray,
          xAxisArray: this.xAxisArray,
          yAxisArray: this.yAxisArray,
          seriesArray: this.seriesArray
        })
        chartModel.initCharts('multipleAbscChart', option)
      } else {
        setTimeout(() => {
          this.initMultipleAbscChart()
        }, 200)
      }
    },

    // 配置信息
    getConfigChart: function () {
      return {
        areaName: ['长江大 桥开发区', '江北集 中区', '三山区', '弋江区', '鸠江区', '镜湖区', '经开区', '南陵县', '芜湖县', '繁昌县', '无为县'],
        color: ['#fede77', '#f8b753', '#ff6462', '#d964d9', '#a0729f', '#698ebb', '#4f8ddb', '#4eafff', '#25ceed', '#4ad5ab', '#8ffbbd']
      }
    },

    // 去掉多余的属性
    getNeedAttrArr: function (arr, name) {
      var newArr = []
      for (var i = 0; i < arr.length; i++) {
        newArr.push(arr[i][name])
      }
      return newArr
    },

    // 叠加柱形折线混合图
    initOverlyingChart: function (data) {
      let dom = document.getElementById('overlyingChart')
      let echartObj = echarts.init(dom)
      // 设置基础option配置
      let legendData = this.getNeedAttrArr(data, 'normName')
      let xAxisData = this.getNeedAttrArr(data[0].hgjjCommonDtos, 'year')

      let option = chartModel.overlyingChart({
        legendData: this.getNeedAttrArr(data, 'normName'),
        xAxis: [echartsConfig.getTickxAxis(xAxisData), echartsConfig.getNodexAxis(xAxisData)],
        seriesData: [
          this.getNeedAttrArr(data[0].hgjjCommonDtos, 'normVlaue'),
          this.getNeedAttrArr(data[1].hgjjCommonDtos, 'normVlaue'),
          echartsConfig.getLineSeries(legendData[2], this.getNeedAttrArr(data[2].hgjjCommonDtos, 'normVlaue'), 1)
        ]
      })

      chartModel.initCharts('overlyingChart', option)
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>

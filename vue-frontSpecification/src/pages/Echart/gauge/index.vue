<template>
  <div class="page-header-index-wide page-chart">
    <a-row class="fly" :gutter="12">
      <a-col :span="12" >
        <div class="chart-item">
          <div class="chart-title">
            <h2>当前毕业率</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="dqbyl"></div>
          </div>
        </div>
      </a-col>
      <a-col :span="12" > 
        <div class="chart-item">
          <div class="chart-title">
            <h2>完成率</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="wcl"></div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="fly" :gutter="12">
      <a-col :span="24" >
        <div class="chart-item">
          <div class="chart-title">
            <h2>合格率</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="hgl"></div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>

import chartModel from '@/common/utils/chartModel'
// 当前毕业率
const dqbylData = [
  {value: 50, name: '当前毕业率'}
]
// 完成率
const wclData = [
  {value: 75, name: '完成率'}
]
// 合格率
const hglData = [
  {value: 60, name: '合格率'}
]
export default {
  name: 'Gauge',
  components: {
  },
  data () {
    return {

    }
  },
  mounted () {
    this.initChartDqbyl() // 当前毕业率
    this.initChartWcl() // 完成率
    this.initChartHgl() // 合格率
  },
  methods: {
    // 初始化当前毕业率
    initChartDqbyl () {
      let dom = document.getElementById('dqbyl')
      if (dom) {
        let legendData = []
        for (let item of dqbylData) {
          legendData.push(item.name)
        }
        let option = chartModel.gaugeCharts({
          color: [[0.2, '#00d8ed'], [0.8, '#00e0e1'], [1, '#01e9d4']],
          legendData: legendData,
          data: dqbylData,
          name: '当前毕业率'
        })
        option.series[0].min = 0
        option.series[0].max = 16
        option.series[0].splitNumber = 8
        //仪表盘刻度标签
        option.series[0].axisLabel = {
          formatter: function (value) {
            return value + 'W'
          } 
        },
        // 仪表盘指针
        option.series[0].itemStyle = {
          opacity: 0
        }
        // 仪表盘标题
        option.series[0].title = {
          offsetCenter: [0, '-15%'],
          fontSize: 16,
          color: '#aaaaaa'
        }
        // 仪表盘数值
        option.series[0].detail = {
          offsetCenter: [0, '15%'],
          fontSize: 30,
          formatter: function (value) {
            return value + '%'
          }
        }
        chartModel.initCharts('dqbyl', option) 
      } else {
        setTimeout(() => {
          this.initChartDqbyl()
        }, 200);
      }
    },
    // 初始化完成率仪表盘
    initChartWcl () {
      let dom = document.getElementById('wcl')
      if (dom) {
        let legendData = []
        for (let item of wclData) {
          legendData.push(item.name)
        }
        let option = chartModel.gaugeCharts({
          color: [[0.2, '#9a58f3'], [0.8, '#b45ce4'], [1, '#d661d2']],
          legendData: legendData,
          data: wclData,
          name: '完成率'
        })
        option.series[0].splitNumber = 4
        // 仪表盘标题
        option.series[0].title = {
          offsetCenter: [0, '60%'],
          fontSize: 16,
          color: '#aaaaaa'
        }
        // 仪表盘数值
        option.series[0].detail = {
          offsetCenter: [0, '80%'],
          fontSize: 24,
          formatter: function (value) {
            return value + '%'
          }
        }
        chartModel.initCharts('wcl', option) 
      } else {
        setTimeout(() => {
          this.initChartWcl()
        }, 200);
      }
    },
    // 初始化合格率仪表盘
    initChartHgl () {
      let dom = document.getElementById('hgl')
      if (dom) {
        let legendData = []
        for (let item of hglData) {
          legendData.push(item.name)
        }
        let option = chartModel.gaugeCharts({
          color: [[0.2, '#ff8c93'], [0.8, '#ff8091'], [1, '#ffb99c']],
          legendData: legendData,
          data: hglData,
          name: '合格率'
        })
        option.series[0].splitNumber = 4
        // 仪表盘标题
        option.series[0].title = {
          offsetCenter: [0, '60%'],
          fontSize: 16,
          color: '#aaaaaa'
        }
        // 仪表盘数值
        option.series[0].detail = {
          offsetCenter: [0, '80%'],
          fontSize: 24,
          formatter: function (value) {
            return value + '%'
          }
        }
        chartModel.initCharts('hgl', option) 
      } else {
        setTimeout(() => {
          this.initChartHgl()
        }, 200);
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

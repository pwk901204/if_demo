<template>
  <div class="page-header-index-wide page-chart">
    <a-row class="fly" :gutter="12">
      <a-col :span="12">
        <div class="chart-item">
          <div class="chart-title">
            <h2>社会管理</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="shglPie"></div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="chart-item">
          <div class="chart-title">
            <h2>新增人数</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="xzrsPie"></div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="fly" :gutter="12">
      <a-col :span="12">
        <div class="chart-item">
          <div class="chart-title">
            <h2>年龄分布</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="nlfbPie"></div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="chart-item">
          <div class="chart-title">
            <h2>城管网络</h2>
          </div>
          <div class="chart-content">
            
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import chartModel from '@/common/utils/chartModel'

// 社会管理
const shglData = [
  { name: '消防安全', value: 420 },
  { name: '社区管理', value: 380 },
  { name: '市场监管', value: 390 },
  { name: '公共安全', value: 200 },
  { name: '矛盾调解', value: 300 }
]
// 新增人数
const xzrsData = [
  { name: '在岗', value: 234444 },
  { name: '下岗', value: 154545 },
  { name: '自由职业', value: 48844 }
]

// 年龄分布
const nlfbData = [
  { name: '40-50', value: 520 },
  { name: '小于20岁', value: 220 },
  { name: '20-30', value: 150 },
  { name: '大于50岁', value: 120 }
]
export default {
  name: 'PieChart',
  components: {
  },
  data () {
    return {

    }
  },
  mounted () {
    this.initChartShgl()  // 社会管理
    this.initChartXzrs()  // 新增人数
    this.initChartNlfb()  // n年龄分布
  },
  methods: {
    // 初始化社会管理饼图
    initChartShgl () {
      let dom = document.getElementById('shglPie')
      if (dom) {
        let legendData = []
        for (let item of shglData) {
          legendData.push(item.name)
        }
        let pieOption = chartModel.pieCharts({
          color: ['#00d9eb', '#fccf64', '#ff91ae', '#a0a8fa', '#69e9ea'],
          legendData: legendData,
          data: shglData,
          name: '社会管理'
        })
        chartModel.initCharts('shglPie', pieOption) 
      } else {
        setTimeout(() => {
          this.initChartShgl()
        }, 200);
      }
    },
    // 初始化新增人数饼图
    initChartXzrs () {
      let dom = document.getElementById('xzrsPie')
      if (dom) {
        let legendData = []
        for (let item of xzrsData) {
          legendData.push(item.name)
        }
        let pieOption = chartModel.pieCharts({
          color: ['#00d9eb', '#a0a8fa', '#ff91ae'],
          legendData: legendData,
          data: xzrsData,
          name: '新增人数'
        })
        pieOption.legend.show = false
        pieOption.series[0].radius = '55%'
        pieOption.series[0].labelLine = {
          normal: {
              show: true
          }
        }
        pieOption.series[0].label = {
          normal: {
            show: true,
            position: 'outside',
            formatter: '{c} {b}'
          }
        }
        chartModel.initCharts('xzrsPie', pieOption) 
      } else {
        setTimeout(() => {
          this.initChartXzrs()
        }, 200);
      }
    },
    // 初始化年龄分布饼图
    initChartNlfb () {
      let dom = document.getElementById('nlfbPie')
      if (dom) {
        let legendData = []
        for (let item of nlfbData) {
          legendData.push(item.name)
        }
        let pieOption = chartModel.pieCharts({
          color: ['#00d9eb', '#69e9ea', '#a0a8fa', '#ff91ae'],
          legendData: legendData,
          data: nlfbData,
          name: '年龄分布'
        })
        pieOption.legend.show = false
        pieOption.series[0].roseType = 'radius'
        pieOption.series[0].labelLine = {
          normal: {
              show: true
          }
        }
        pieOption.series[0].label = {
          normal: {
            show: true,
            position: 'outside'
          }
        }
        chartModel.initCharts('nlfbPie', pieOption) 
      } else {
        setTimeout(() => {
          this.initChartNlfb()
        }, 200);
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

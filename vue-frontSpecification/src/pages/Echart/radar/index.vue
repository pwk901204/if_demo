<template>
  <div class="page-header-index-wide page-chart">
    <a-row class="fly"
           :gutter="12">
      <a-col :span="12">
        <div class="chart-item">
          <div class="chart-title">
            <h2>事项情况</h2>
          </div>
          <div class="chart-content"
               :style="contentStyle">
            <div class="chart-chart"
                 id="sxqkPie"></div>
          </div>
        </div>
      </a-col>
      <a-col :span="12">
        <div class="chart-item">
          <div class="chart-title">
            <h2>实际预期</h2>
          </div>
          <div class="chart-content"
               :style="contentStyle">
            <div class="chart-chart"
                 id="sjyqPie"></div>
          </div>
        </div>
      </a-col>
    </a-row>
    <a-row class="fly"
           :gutter="12">
      <a-col :span="24">
        <div class="chart-item">
          <div class="chart-title">
            <h2>预期情况</h2>
          </div>
          <div class="chart-content"
               :style="contentStyle">
            <div class="chart-chart"
                 id="yqPie"></div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import chartModel from '@/common/utils/chartModel'

// 事项情况
const sxqkData = [
  { name: '已发布事项', value: 3624 },
  { name: '未运行事项', value: 2416 },
  { name: '实际运行事项', value: 1208 }
]
// 实际预期
const sjyqData = {
  yq: [
    { value: 60, name: '访问' },
    { value: 40, name: '咨询' },
    { value: 20, name: '订单' },
    { value: 80, name: '点击' },
    { value: 100, name: '展现' }
  ],
  sj: [
    { value: 30, name: '访问' },
    { value: 10, name: '咨询' },
    { value: 5, name: '订单' },
    { value: 50, name: '点击' },
    { value: 80, name: '展现' }
  ]
}

// 预期情况
const yqData = [
  { value: 100, name: '展示预期' },
  { value: 60, name: '点击预期' },
  { value: 20, name: '访问预期' },
  { value: 20, name: '订单预期' }
]
export default {
  name: 'Funnel',
  components: {
  },
  data () {
    return {

    }
  },
  computed: {
    contentStyle () {
      let style = {
        minHeight: window.innerHeight / 2 + 'px'
      }
      return style
    }
  },
  mounted () {
    this.initChartSxqk() // 事项情况
    this.initChartsSjyq() // 实际预期
    this.initChartyqqk() // 预期情况
  },
  methods: {
    // 初始化事项情况漏斗图
    initChartSxqk () {
      let dom = document.getElementById('sxqkPie')
      if (dom) {
        let legendData = []
        for (let item of sxqkData) {
          legendData.push(item.name)
        }
        let option = chartModel.funnelCharts({
          color: ['#00d9eb', '#a0a8fa', '#ff91ae'],
          legendData: legendData,
          data: sxqkData,
          name: '事项情况'
        })
        option.legend.show = false
        option.tooltip.formatter = function (item) {
          return item.name + '数:' + item.value + '<br />' + item.name + ':' + item.percent + '%'
        }
        option.series[0].max = 3624
        chartModel.initCharts('sxqkPie', option)
      } else {
        setTimeout(() => {
          this.initChartSxqk()
        }, 200)
      }
    },
    // 初始化实际预期漏斗图
    initChartsSjyq () {
      let dom = document.getElementById('sjyqPie')
      if (dom) {
        let legendData = []
        for (let item of sjyqData.yq) {
          legendData.push(item.name)
        }
        let option = chartModel.funnelCharts({
          color: ['#00d9eb', '#69e9ea', '#a0a8fa', '#ff91ae', '#fccf64'],
          legendData: legendData,
          data: sjyqData.yq,
          name: '预期'
        })
        option.legend.show = false
        option.series[0].max = 100
        option.series[0].label = {
          normal: {
            formatter: '{b}预期'
          },
          emphasis: {
            position: 'inside',
            formatter: '{b}预期: {c}%'
          }
        }
        option.series[0].labelLine = {
          normal: {
            show: false
          }
        }
        option.series[0].itemStyle = {
          normal: {
            opacity: 0.7
          }
        }
        option.series.push({
          name: '实际',
          type: 'funnel',
          left: '10%',
          width: '80%',
          maxSize: '80%',
          label: {
            normal: {
              position: 'inside',
              formatter: '{c}%',
              textStyle: {
                color: '#fff'
              }
            },
            emphasis: {
              position: 'inside',
              formatter: '{b}实际: {c}%'
            }
          },
          itemStyle: {
            normal: {
              opacity: 0.5,
              borderColor: '#fff',
              borderWidth: 2
            }
          },
          data: sjyqData.sj
        })
        chartModel.initCharts('sjyqPie', option)
      } else {
        setTimeout(() => {
          this.initChartsSjyq()
        }, 200)
      }
    },
    // 初始化预期情况漏斗图
    initChartyqqk () {
      let dom = document.getElementById('yqPie')
      if (dom) {
        let legendData = []
        for (let item of yqData) {
          legendData.push(item.name)
        }
        let option = chartModel.funnelCharts({
          color: ['#00d9eb', '#69e9ea', '#ff91ae', '#fccf64'],
          legendData: legendData,
          data: yqData,
          name: '预期情况'
        })
        option.legend.show = false
        option.series[0].max = 100
        option.series[0].left = '25%'
        option.series[0].width = '50%'
        option.series[0].label = {
          show: true,
          position: 'outside',
          formatter: '{b}:{d}%'
        }
        option.series[0].labelLine = {
          length: 30
        }
        chartModel.initCharts('yqPie', option)
      } else {
        setTimeout(() => {
          this.initChartyqqk()
        }, 200)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

<template>
  <div class="page-header-index-wide page-chart">
    <a-row class="fly" :gutter="12">
      <a-col :span="24">
        <div class="chart-item">
          <div class="chart-title">
            <h2>流动人口地域图</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="MigrationMap"></div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import chartModel from '@/common/utils/chartModel'
import mapData from './data'
import China from './China'
import geoCoordMap from './geoCoordMap'
export default {
  name: 'PieChart',
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
    this.initMigrationMap()  // 流动人口地域图
  },
  methods: {
    // 初始化流动人口地图
    initMigrationMap () {
      let dom = document.getElementById('MigrationMap')
      let chart = echarts.init(dom)
      if (dom) {
        let geoJson = China.features ? China : fly.evalJSON(China)

        echarts.registerMap('china', geoJson)

        chart.setOption({
          series: [{
            type: 'map',
            map: 'china'
          }]
        })
        let option = chartModel.PopuMigrationCharts({
          mapData: mapData,
          geoCoordMap: geoCoordMap
        })

        chartModel.initCharts('MigrationMap', option)
      } else {
        setTimeout(() => {
          this.initMigrationMap()
        }, 200)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>

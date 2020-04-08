<template>
  <div class="page-wuhumap">
    <div :id="eleId" class="chart-wrap"></div>
  </div>
</template>

<script>
const geoCoordMap = {
  '合肥市': [117.37, 31.786],
  '六安市': [116.27, 31.586],
  '滁州市': [118.07, 32.486],
  '蚌埠市': [117.27, 33.086],
  '淮南市': [116.87, 32.586],
  '宿州市': [117.37, 33.716],
  '淮北市': [116.67, 33.686],
  '亳州市': [116.27, 33.386],
  '阜阳市': [115.57, 32.916],
  '安庆市': [116.47, 30.586],
  '池州市': [117.47, 30.286],
  '黄山市': [118.17, 29.886],
  '宣城市': [118.87, 30.716],
  '芜湖市': [118.17, 31.186],
  '马鞍山市': [118.298, 31.676],
  '铜陵市': [117.47, 30.856]
}

export default {
  name: 'VAnHuimap',
  components: {},
  data () {
    return {
      eleId: this.mapId,
      myChart: ''
    }
  },
  props: ['optMap', 'mapId'],
  watch: {
    optMap: {
      handler (newVal, oldVal) {
        this.getMapSource()
      },
      deep: true
    }
  },
  mounted () {
    // 基于准备好的dom，初始化echarts实例
    this.myChart = this.$echarts.init(document.getElementById(this.mapId))
  },
  methods: {
    // 获取地图数据
    getMapSource () {
      let mapData = this.optMap.data[0]
      let toolTip = this.optMap.mapDot
      let mapPointData = []
      for (let i = 0; i < mapData.length; i++) {
        let geoCoord = geoCoordMap[mapData[i].name]
        if (geoCoord) {
          mapPointData.push({
            name: mapData[i].name,
            value: geoCoord.concat(mapData[i].value)
          })
        }
      }
      this.getMapAnhuiRender(mapData, mapPointData, toolTip, this.optMap.minNum, this.optMap.maxNum)
    },

    // 渲染地图
    getMapAnhuiRender (mapData, mapPointData, toolTip, minNum, maxNum) {
      console.log(mapData)
      console.log(minNum, maxNum)
      const geoJson = require('../../../public/mock/anhui_map.json')
      this.$echarts.registerMap('anhui', geoJson)
      let that = this
      let option = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: function (params) {
            if (typeof (params.value[2]) === 'undefined') {

            } else {
              let toolTiphtml = ''
              for (let i = 0; i < toolTip.length; i++) {
                if (params.name === toolTip[i].name) {
                  toolTiphtml += toolTip[i].name + `市` + '<br>'
                  for (let j = 0; j < toolTip[i].value.length; j++) {
                    toolTiphtml += toolTip[i].value[j].name + ':' + toolTip[i].value[j].value + '<br>'
                  }
                }
              }
              return toolTiphtml
            }
          }
        },
        visualMap: {
          show: false,
          type: 'continuous',
          calculable: true,
          text: ['', ''],
          showLabel: true,
          seriesIndex: [1],
          min: minNum,
          max: maxNum,
          inRange: {
            color: ['#aad1f4', '#70a4e3', '#4e8dd7', '#1c5cc6']
          },
          left: 'left'
        },
        geo: {
          map: 'anhui',
          roam: true,
          scaleLimit: {
            min: 0.8,
            max: 2
          },
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#4c4c4c'
              }
            },
            emphasis: {
              textStyle: {
                color: '#fff'
              }
            }
          },
          itemStyle: {
            normal: {
              borderColor: '#fafcfe',
              borderWidth: 1,
              areaColor: '#a2c7e9'
            },
            emphasis: {
              areaColor: '#f5adaf',
              borderWidth: 1,
              shadowColor: '#f5adaf',
              shadowBlur: 5,
              shadowOffsetX: -2,
              shadowOffsetY: 2
            }
          }
        },
        series: [
          {
            name: '地区数据',
            type: 'scatter',
            coordinateSystem: 'geo',
            data: mapPointData,
            symbolSize: val => 8
          },
          {
            type: 'map',
            map: 'anhui',
            geoIndex: 0,
            hoverAnimation: false,
            roam: true,
            tooltip: {
              show: false
            },
            itemStyle: {
              normal: {
                borderColor: '#fafcfe',
                borderWidth: 1,
                areaColor: '#a2c7e9'
              },
              emphasis: {
                areaColor: '#f5adaf',
                borderWidth: 1,
                shadowColor: '#f5adaf',
                shadowBlur: 5,
                shadowOffsetX: -2,
                shadowOffsetY: 2
              }
            },
            data: mapData,
            textFixed: {}
          },
          {
            name: 'point',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: val => 8,
            itemStyle: {
              normal: {
                color: '#00d9eb',
                borderColor: '#00d9eb',
                borderWidth: 2
              }
            },
            zlevel: 1,
            data: mapPointData
          }
        ]
      }
      that.myChart.clear()
      // 绘制图表
      that.myChart.setOption(option, true)

      window.addEventListener('resize', that.myChart.resize)
    }
  }

}
</script>
<style lang="less">
// @import url("./Wuhumap.less");
</style>

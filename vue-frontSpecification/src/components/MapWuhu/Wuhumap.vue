<template>
  <div class="page-wuhumap">
    <div :id="eleId" class="chart-wrap"></div>
  </div>
</template>

<script>
export default {
  name: 'VWuhumap',
  components: {},
  data () {
    return {
      eleId: this.mapId,
      myChart: ''
    }
  },
  props: ['opt', 'mapId'],
  watch: {
    opt: {
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
      let data = this.opt.data
      let attrObject = this.opt.attrObject || 'name'
      let attrValue = this.opt.attrValue || 'value'
      let defaultMapList = [{
        'name': '鸠江区',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '江北集中区',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '经开区',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '繁昌县',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '三山区',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '南陵县',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '弋江区',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '镜湖区',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '芜湖县',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '无为县',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }, {
        'name': '长江大桥开发区',
        'realName': '',
        'value': '无数据',
        'value1': ''
      }]

      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < defaultMapList.length; j++) {
          if (defaultMapList[j].name === data[i][attrObject]) {
            defaultMapList[j].value = data[i][attrValue]
          }
        }
      }
      this.getMapWuhuRender(defaultMapList, this.opt.maxNum, this.opt.minNum)
    },

    // 渲染地图
    getMapWuhuRender (randomData, maxNum, minNum) {
      const geoJson = require('../../../public/mock/wuhu_map.json')
      this.$echarts.registerMap('wuhu', geoJson)

      let that = this
      let util = that.opt.util || '人'
      let option = {
        tooltip: {
          trigger: 'item',
          confine: true,
          formatter: function (params) {
            let valStr = params.data.value
            if (params.data.value === '无数据') {
              valStr = '0'
              return params.name + '<br/>' + valStr + util
            } else {
              return params.name + '<br/>' + valStr + util
            }
          }
        },
        visualMap: { // 颜色的设置  dataRange
          show: false,
          type: 'continuous',
          text: ['', ''],
          showLabel: true,
          seriesIndex: [0],
          min: minNum,
          max: maxNum,
          inRange: {
            color: ['#aad1f4', '#70a4e3', '#4e8dd7', '#1c5cc6']
          },
          textStyle: {
            color: '#000'
          },
          left: 'left'
        },
        series: [{
          type: 'map',
          map: 'wuhu',
          hoverAnimation: false,
          roam: true,
          scaleLimit: {
            min: 0.5,
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
          },
          data: randomData,
          textFixed: {
            '鸠江区': [-50, 1],
            '弋江区': [10, 20],
            '江北集中区': [-10, 10],
            '长江大桥开发区': [-30, 0],
            '经开区': [-10, 0]
          }
        }]
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
@import url("./Wuhumap.less");
</style>

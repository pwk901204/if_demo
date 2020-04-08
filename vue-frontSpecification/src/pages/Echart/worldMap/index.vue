<template>
  <div class="page-header-index-wide page-chart">
    <a-row class="fly" :gutter="12">
      <a-col :span="24">
        <div class="chart-item">
          <div class="chart-title">
            <h2>世界地图</h2>
          </div>
          <div class="chart-content">
            <div class="chart-chart" id="worldMap"></div>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import chartModel from '@/common/utils/chartModel'

const geoJson = require('./world.json')
const geoCoordMap = {
  '合肥': [117.29,32.0581],
  'Jakarta': [106.845599,-6.208763],
  'Athens': [-83.357567,33.951935],
  'Auckland': [174.763332,-36.84846],
  'Caracas': [-66.903606,10.480594],
  'Moscow': [37.6173,55.755826],
  'Sydney': [151.209296,-33.86882],
  'Prague': [14.4378,50.075538],
  'Toronto': [-79.383184,43.653226],
  'London': [-0.127758,51.507351],
  'Johannesburg': [28.047305,-26.204103]
}

const ahData = [
  [{name:'Jakarta'},{name:'合肥',value:95}],
  [{name:'Athens'},{name:'合肥',value:90}],
  [{name:'Auckland'},{name:'合肥',value:80}],
  [{name:'Caracas'},{name:'合肥',value:70}],
  [{name:'Moscow'},{name:'合肥',value:60}],
  [{name:'Sydney'},{name:'合肥',value:50}],
  [{name:'Prague'},{name:'合肥',value:40}],
  [{name:'Toronto'},{name:'合肥',value:30}],
  [{name:'London'},{name:'合肥',value:20}],
  [{name:'Johannesburg'},{name:'合肥',value:10}]
]

const imgPath = 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAECAYAAACKqs+rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NzcwQzgwRDIyN0JGMTFFQTkxMUZBMEVGRUE3QTMxMkQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NzcwQzgwRDMyN0JGMTFFQTkxMUZBMEVGRUE3QTMxMkQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3NzBDODBEMDI3QkYxMUVBOTExRkEwRUZFQTdBMzEyRCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3NzBDODBEMTI3QkYxMUVBOTExRkEwRUZFQTdBMzEyRCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtmeZsEAAAB7SURBVHjaYqx/9J8BDxCE0jxAzArEHEDMCcTMQMwHxFxQPj9UDReUvskC1awJxCZArAdlGwMxOwP5YDPI4PdAfAyKYYAJiOWBWBWIlYFYEYiVoGIyQCxBwGBBFhwS/4D4PhRjAyDfiAOxJBCLArEIELNBg+cnED8GCDAAN2cOGDoYQDcAAAAASUVORK5CYII='

export default {
  name: 'PieChart',
  components: {
  },
  data () {
    return {

    }
  },
  mounted () {
    this.initChartWorldMap()  // 社会管理
  },
  methods: {
    // 初始化世界地图
    initChartWorldMap () {
      let dom = document.getElementById('worldMap')
      if (dom) {
        chartModel.registMapForCharts('world', geoJson) // 世界地图
        let option = chartModel.worldMapCharts({})
        let color = ['#a6c84c', '#ffa022', '#46bee9'];
        let data = this.convertData(ahData)
        // 给地图不同区域渲染颜色
        option.geo.regions = [{
          name: 'China',
          itemStyle: {
            normal: {
              areaColor: '#96b8ef'
            }
          }
        }, {
          name: 'Mongolia', // 外蒙古
          itemStyle: {
            normal: {
              areaColor: '#f5adaf'
            }
          }
        }, {
          name: 'Kazakhstan', // 哈萨克斯坦
          itemStyle: {
            normal: {
              areaColor: '#f9d4d5'
            }
          }
        }, {
          name: 'South Korea', // 韩国
          itemStyle: {
            normal: {
              areaColor: '#f5adaf'
            }
          }
        }, {
          name: 'Japan', // 日本
          itemStyle: {
            normal: {
              areaColor: '#f9d4d5'
            }
          }
        }, {
          name: 'Vietnam', // 越南
          itemStyle: {
            normal: {
              areaColor: '#f5adaf'
            }
          }
        }, {
          name: 'Myanmar', // 缅甸
          itemStyle: {
            normal: {
              areaColor: '#f9d4d5'
            }
          }
        }, {
          name: 'India', // 印度
          itemStyle: {
            normal: {
              areaColor: '#f5adaf'
            }
          }
        }, {
          name: 'United States of America', // 美国
          itemStyle: {
            normal: {
              areaColor: '#f9d4d5'
            }
          }
        }, {
          name: 'Costa Rica', // 哥斯达黎加
          itemStyle: {
            normal: {
              areaColor: '#f5adaf'
            }
          }
        }]
        option.series.push({
          name: '安徽',
          type: 'lines',
          zlevel: 1,
          effect: {
            show: true,
            period: 3,
            trailLength: 0,
            color: '#7fe2ff',
            symbol: imgPath,
            symbolSize: [4, 22]
          },
          lineStyle: {
            normal: {
              color: '#7fe2ff',
              width: 1,
              opacity: 0.6,
              curveness: 0.2
            }
          },
          data: data.lines
        })
        option.series.push({
          name: '安徽',
          type: 'effectScatter',
          coordinateSystem: 'geo',
          zlevel: 1,
          rippleEffect: {
            brushType: 'stroke'
          },
          label: {
            normal: {
              show: false,
              position: 'right',
              formatter: '{b}'
            }
          },
          // symbolSize: function (val) {
          //     return val[2] / 8;
          // },
          itemStyle: {
              normal: {
                  color: '#7fe2ff'
              }
          },
          data: data.points
        })
        chartModel.initCharts('worldMap', option) 

      } else {
        setTimeout(() => {
          this.initChartWorldMap()
        }, 200);
      }
    },
    convertData (data) {
      let res = []
      let points = []
      for (let i = 0; i < data.length; i++) {
          let dataItem = data[i]
          let fromCoord = geoCoordMap[dataItem[0].name]
          let toCoord = geoCoordMap[dataItem[1].name]
          if (fromCoord && toCoord) {
              res.push({
                  fromName: dataItem[0].name,
                  toName: dataItem[1].name,
                  coords: [fromCoord, toCoord]
              });
              points.push({
                name: dataItem[0].name,
                value: fromCoord.concat(dataItem[1].value)
              })
          }
      }
      return {
        lines: res,
        points: points
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

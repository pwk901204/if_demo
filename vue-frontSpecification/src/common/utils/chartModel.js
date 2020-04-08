import echarts from 'echarts'
import formatNumber from './formatNumber'
let chartModel = {
  // 初始化图表
  initCharts: (id, option) => {
    let dom = document.getElementById(id)
    let chart = echarts.init(dom)
    chart.setOption(option, true)
    window.addEventListener('resize', () => {
      chart.resize()
    }, false)
  },
  // 获取图标实例
  getCharts: (id) => {
    let dom = document.getElementById(id)
    let chart = echarts.init(dom)
    return chart
  },
  // 渲染图标,已有实例
  initChartsByChart: (chart, option) => {
    chart.setOption(option, true)
    window.addEventListener('resize', () => {
      chart.resize()
    }, false)
  },
  // 地图注册
  registMapForCharts: (name, geoJson) => {
    echarts.registerMap(name, geoJson)
  },
  // 折线图 / 柱状图
  lineChartsOption: (data) => {
    let option = {
      color: data.color || {},
      grid: {
        left: '3%', // 组件离容器左侧的距离
        top: '40px',
        right: '40px',
        bottom: '20px',
        containLabel: true // grid 区域是否包含坐标轴的刻度标签
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisTick: {
          show: false
        },
        interval: 0,
        axisLabel: {
          show: true,
          interval: 0,
          formatter: function (value) {
            let _val = sessionStorage.getItem('xAxisName') || ''
            if (_val === value) {
              return ''
            } else {
              sessionStorage.setItem('xAxisName', value)
              return value
            }
          },
          textStyle: {
            color: 'black'
          }
        },
        axisLine: {
          symbol: ['none', 'arrow'],
          lineStyle: {
            color: '#ced7e2'
          }
        },
        data: data.xAxisLabel
      },
      yAxis: {
        splitLine: { show: false },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#505364'
          }
        },
        axisLine: {
          symbol: ['none', 'arrow'],
          lineStyle: {
            color: '#ced7e2'
          }
        },
        color: 'red',
        type: 'value',
        scale: true

        // min : 0
      },
      series: [{
        name: '事件数',
        data: data.seriesData,
        type: data.charttype || 'line',
        radius: '100%',
        itemStyle: {
          normal: {
            color: '#3435b7' // 线颜色
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ // 折线图颜色渐变
              offset: 0,
              color: '#c1c1e8'
            }, {
              offset: 1,
              color: '#fcfcfd'
            }])
          }
        }
      }]
    }
    return option
  },
  // 饼图
  pieCharts: (data) => {
    let option = {
      color: data.color || {},
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        top: 'middle',
        right: '40',
        data: data.legendData || []
      },
      series: [{
        name: data.name || '',
        type: 'pie',
        radius: ['30%', '58%'],
        center: ['50%', '50%'],
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '16'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: data.data || []
      }]
    }
    return option
  },
  // 漏斗图
  funnelCharts: (data) => {
    let option = {
      color: data.color || [],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        data: data.legendData || []
      },
      series: [
        {
          name: data.name || '',
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside'
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          data: data.data || []
        }
      ]
    }
    return option
  },
  // 仪表盘
  gaugeCharts: (data) => {
    let option = {
      color: data.color || [],
      tooltip: {
        formatter: '{a} <br/>{b} : {c}%'
      },
      series: [
        {
          name: data.name || '',
          type: 'gauge',
          min: 0,
          max: 100,
          splitLine: {
            length: 20
          },
          axisLine: {
            lineStyle: {
              width: 10,
              color: data.color || [[0.2, '#91c7ae'], [0.8, '#63869e'], [1, '#c23531']]
            }
          },
          detail: { formatter: '{value}%' },
          data: data.data || []
        }
      ]
    }
    return option
  },
  // 世界地图
  worldMapCharts: (data) => {
    let option = {
      tooltip: {
        trigger: 'item'
      },
      geo: {
        map: 'world',
        silent: true,
        label: {
          normal: {
            show: false,
            textStyle: {
              color: '#4c4c4c'
            }
          },
          emphasis: {
            show: true,
            textStyle: {
              color: '#fff'
            }
          }
        },
        itemStyle: {
          normal: {
            areaColor: '#ffffff',
            borderWidth: 0.2,
            borderColor: '#32ade2'
          }
        },
        roam: true
      },
      series: []
    }
    return option
  },
  // 流动人口地域图
  PopuMigrationCharts: (data) => {
    let series = []
    let convertData = function (e) {
      let res = []
      for (let i = 0; i < e.length; i++) {
        let dataItem = e[i]
        let fromCoord = data.geoCoordMap[dataItem[0].name]
        let toCoord = data.geoCoordMap[dataItem[1].name]
        if (fromCoord && toCoord) {
          res.push({
            fromName: dataItem[0].name,
            toName: dataItem[1].name,
            coords: [fromCoord, toCoord]
          })
        }
      }
      return res
    }
    data.mapData.forEach(function (item, i) {
      series.push({
        name: item[0],
        type: 'lines',
        zlevel: 2,

        // 线特效配置
        effect: {
          show: true,
          period: 4,
          trailLength: 0.6,
          symbol: 'circle',
          symbolSize: 6
        },
        lineStyle: {
          normal: {
            color: '#f6c54c',
            width: 1,
            opacity: 0.4,
            curveness: 0.2
          }
        },
        data: convertData(item[1])
      },
        {
          type: 'scatter',
          coordinateSystem: 'geo',
          zlevel: 2,
          label: {
            normal: {
              show: true,
              textStyle: {
                color: '#4d4d4d',
                fontSize: '12',
                fontFamily: 'Microsoft YaHei'
              },
              position: 'right',
              formatter: '{b}'
            }
          },
          // 终点形象
          // symbol: 'image:./map-point.png',
          // 圆点大小
          symbolSize: function (val) {
            return [9, 9]
          },
          itemStyle: {
            normal: {
              color: '#224381',
              borderColor: '#1192ff',
              borderWidth: 2
            }
          },
          data: [{
            name: item[0],
            value: data.geoCoordMap[item[0]].concat([-1])
          }].concat(item[1].map(function (dataItem) {
            return {
              name: dataItem[0].name,
              value: data.geoCoordMap[dataItem[0].name].concat([dataItem[0].value])
            }
          }))
        })
    })
    let option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}'
      },
      grid: {
        x: 80,
        y: 120,
        x2: 80,
        y2: 60
      },
      // 地图相关设置
      geo: {
        map: 'china',
        zoom: 1.4,
        center: [104.5, 34.5],
        scaleLimit: {
          min: 0.5,
          max: 2
        },
        // 显示文本样式
        label: {
          normal: {
            show: false,
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
        tooltip: {
          show: true,
          trigger: 'item',
          formatter: function (params) {
            var addStr = ''
            if (params.data.value && params.data.value[2] > -1) {
              addStr = ' : ' + params.data.value[2] + '人'
            }

            return params.data.fromName ? (params.data.fromName + ' > ' + params.data.toName) : params.data.name + addStr
          },
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(255,255,255, .8)',
          borderRadius: 4,
          borderWidth: 0,
          padding: [14, 6, 16, 11],
          textStyle: {
            color: '#4c4c4c',
            fontSize: '14'
          }
        },
        // 鼠标缩放和平移
        roam: true,
        itemStyle: {
          normal: {
            areaColor: '#a2c7e9',
            borderColor: '#fff'
          },
          emphasis: {
            areaColor: '#bbdeff'
          }
        }
      },
      series: series
    }
    return option
  },
  // 多个横坐标折线图
  multipleAbscChart: (data) => {
    let option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          'type': 'shadow'
        },
        backgroundColor: 'rgba(255,255,255, .8)',
        borderRadius: 4,
        borderWidth: 0,
        confine: true,
        padding: [14, 6, 16, 11],
        textStyle: {
          color: '#4c4c4c',
          fontSize: '14',
          align: 'left'
        },
        z: 10,
        formatter: function (params) {
          return params[0].axisId.replace(/[^\u4e00-\u9fa5]/g, '') + '<br/>' + params[0].name + ' : ' + parseFloat(params[0].value) + '亿元'
        }

      },
      grid: data.gridArray,
      xAxis: data.xAxisArray,
      yAxis: data.yAxisArray,
      series: data.seriesArray
    }
    return option
  },
  // 叠加柱形折线混合图
  overlyingChart: (data) => {
    let option = {
      legend: {
        data: data.legendData
      },
      grid: {
        bottom: '40px'
      },
      xAxis: data.xAxis,
      yAxis: [
        {
          name: '万人',
          type: 'value',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#666'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#f0f0f0 '
            }
          },
          axisLabel: {
            textStyle: {
              color: '#4c4c4c',
              fontWeight: 'normal',
              fontSize: '12'
            },
            formatter: '{value}'
          }
        },
        {
          name: '%',
          type: 'value',
          axisTick: {
            show: true
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#666'
            }
          },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#f0f0f0 '
            }
          },
          axisLabel: {
            textStyle: {
              color: '#4c4c4c',
              fontWeight: 'normal',
              fontSize: '12'
            },
            formatter: '{value}'
          }
        }
      ],
      series: [{
        name: data.legendData[0],
        type: 'bar',
        barWidth: 22,
        xAxisIndex: 1,
        zlevel: 1,
        data: data.seriesData[0],
        itemStyle: {
          normal: {
            color: '#698ebc'
          }
        }
      }, {
        name: data.legendData[1],
        type: 'bar',
        barMaxWidth: 12,
        zlevel: 10,
        itemStyle: {
          normal: {
            color: '#4ad6a9'
          }
        },
        data: data.seriesData[1]
      },
      data.seriesData[2]],
      color: ['#ff6967'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          'type': 'shadow'
        },
        backgroundColor: 'rgba(255,255,255, .8)',
        borderRadius: 4,
        borderWidth: 0,
        confine: true,
        padding: [14, 6, 16, 11],
        textStyle: {
          color: '#4c4c4c',
          fontSize: '14',
          align: 'left'
        },
        z: 10,
        formatter: function (params) {
          var topStrArray = []
          if (params.length) {
            topStrArray.push(params[0].name + '<br/>')
            for (var i = 0; i < params.length - 1; i++) {
              topStrArray.push(params[i].seriesName + ' : ' + formatNumber(params[i].value) + (params[i].seriesName.indexOf('率') > 0 ? '%' : '万人') + '<br/>')
            }
            if (params.length > 0) {
              topStrArray.push(params[params.length - 1].seriesName + ' : ' + formatNumber(params[params.length - 1].value) + '万人')
            }
          }
          return topStrArray.join('')
        }

      }
    }
    return option
  }
}

export default chartModel

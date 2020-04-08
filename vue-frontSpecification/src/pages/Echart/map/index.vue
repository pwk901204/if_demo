<template>
  <div class="page-header-index-wide page-chart">
    <a-row class="fly" :gutter="12">
      <a-col :span="24">
        <div class="chart-item">
          <div class="chart-title">
            <h2>事项运行情况</h2>
          </div>
          <div class="chart-content">
            <v-citymap :opt="optMap" mapId="cityMap"></v-citymap>
          </div>
        </div>
      </a-col>
      <a-col :span="24">
        <div class="chart-item">
          <div class="chart-title">
            <h2>安徽地图</h2>
          </div>
          <div class="chart-content">
            <v-huimap :optMap="optMap2" mapId="anHuiMap"></v-huimap>
          </div>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import VCitymap from '@/components/MapWuhu/Wuhumap.vue'
import VHuimap from '@/components/MapAnHui/Anhuimap.vue'
import convert from './convert'
const mapData = [
  { 'name': '镜湖区', 'value': 457, 'attr': 'xzqh' },
  { 'name': '鸠江区', 'value': 342, 'attr': 'xzqh' },
  { 'name': '无为县', 'value': 273, 'attr': 'xzqh' },
  { 'name': '弋江区', 'value': 262, 'attr': 'xzqh' },
  { 'name': '繁昌县', 'value': 155, 'attr': 'xzqh' },
  { 'name': '南陵县', 'value': 91, 'attr': 'xzqh' },
  { 'name': '芜湖县', 'value': 88, 'attr': 'xzqh' },
  { 'name': '三山区', 'value': 56, 'attr': 'xzqh' }
]
const anHuiData = [
  { name: '合肥市', value: [{ name: '合肥创新产业园', value: 95 }, { name: '合肥留学人员创业园', value: 82 }, { name: '合肥市庐山区百帮创业园', value: 82 }] },
  { name: '芜湖市', value: [{ name: '芜湖创新产业园', value: 20 }] }
]
export default {
  name: 'wuhuMap',
  components: {
    VCitymap,
    VHuimap
  },
  data () {
    return {
      convert: convert,
      optMap: {},
      optMap2: {}
    }
  },
  mounted () {
    let numArray = []
    let dotArray = []
    for (let i = 0; i < mapData.length; i++) {
      numArray.push(mapData[i].value)
    }
    let minNum = Math.min.apply(null, numArray)
    let maxNum = Math.max.apply(null, numArray)
    this.optMap = {
      data: mapData,
      minNum: minNum,
      maxNum: maxNum,
      unit: '人'
    }
    for (let i = 0; i < this.convert[0].length; i++) {
      dotArray.push(this.convert[0][i].value)
    }
    let minDotNum = Math.min.apply(null, dotArray)
    let maxDotNum = Math.max.apply(null, dotArray)
    this.optMap2 = {
      data: convert,
      mapDot: anHuiData,
      minNum: minDotNum,
      maxNum: maxDotNum
    }
  }
}
</script>

<style lang="less" scoped>
@import url("./index.less");
</style>

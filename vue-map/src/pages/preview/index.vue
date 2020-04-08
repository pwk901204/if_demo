<template>
  <div class="page-view">
    <page-header :breadcrumb="breadcrumb" />
    <div class="page-container page-preview">
      <!-- <div class="page-search">
        <a-form class="form-inline" :form="searchForm" @submit.prevent="handleSearch">
          <a-form-item label="地图">
            <a-select v-decorator="['mapId']" :options="mapDict" placeholder="请选择"></a-select>
          </a-form-item>
          <a-form-item class="search-buttons">
            <a-button type="primary" html-type="submit">查询</a-button>
          </a-form-item>
        </a-form>
      </div>-->
      <div class="component-map">
        <a-select class="select-map" v-model="mapId" :options="mapDict" @change="layerChange"></a-select>
        <canvas ref="map" id="map"></canvas>
        <div v-show="menuVisible" class="right-menu" :style="menuStyle">
          <a href="javascript:;" v-if="!start && !end" @click="handleSetStart">设为起点</a>
          <a href="javascript:;" v-if="start" @click="handleSetEnd">设为终点</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import { Map, PathRoute } from '@/components/map/preview'
import { Map, PathRoute } from '@/components/map/core'
// 全局变量
let GLOBAL = {
  mapInstance: undefined,
  mapInfo: { points: [], pointType: 0 },
  pointTypes: ['elevator', 'start', 'end', 'line'],
  currentPoint: undefined, // 当前地图上操作的点
  routes: [],
  routePoints: [],
  routeList: []
}
export default {
  name: 'preview',
  data () {
    return {
      breadcrumb: [{ name: '地图管理系统', path: '' }, { name: '预览', path: '/preview' }],
      mapId: '',
      // searchForm: this.$form.createForm(this),
      menuVisible: false, // 右键菜单是否显示
      menuStyle: {}, // 右键菜单位置
      start: undefined, // 起点
      end: undefined // 终点
    }
  },
  computed: {
    ...mapState({
      mapDict: state => Object.freeze(state.dict.mapDict)
    })
  },
  mounted () {
    const mapId = this.mapDict[0].value
    this.mapId = mapId
    this.init(mapId)
    // this.searchForm.setFieldsValue({ mapId })
  },
  methods: {
    // 初始化
    init (mapId) {
      const currentMap = this.mapDict.find(item => item.value === mapId)
      GLOBAL.mapInfo.floorName = currentMap.code
      GLOBAL.mapInfo.layerNum = currentMap.mapLayers
      GLOBAL.mapInfo.mapX = currentMap.mapX
      GLOBAL.mapInfo.mapY = currentMap.mapY
      GLOBAL.mapInfo.mapId = currentMap.value
      GLOBAL.mapInfo.pointType = 0

      // 获取点位
      this.fetchPoints({ mapId })
      this.fetchRoutePoint({ mapId })
      this.fetchRoute({ mapId })
    },
    // 楼层变换
    layerChange (val) {
      this.init(val)
      // console.log(val)
      // alert('功能未实现！')
    },
    async fetchPoints (params) {
      const res = await this.$axios.post('/map/pointAllList', params)
      GLOBAL.mapInfo.points = res.result
      // console.log(res)
      // 初始化地图
      this.renderMap()
    },

    // 获取所有路径点
    async fetchRoutePoint (params) {
      const res = await this.$axios.post('/map/queryAllRoutePoint', params)
      GLOBAL.routePoints = res.result
    },

    // 获取所有的路径
    async fetchRoute (params) {
      const res = await this.$axios.post('/map/queryAllRoute', params)
      const list = res.result || []
      for (let i = 0; i < list.length; i++) {
        GLOBAL.routes.push({ point: list[i].startPointId, connect_point: list[i].endPointId, distance: Number(list[i].distance) })
        GLOBAL.routes.push({ point: list[i].endPointId, connect_point: list[i].startPointId, distance: Number(list[i].distance) })
      }
      // debugger
      GLOBAL.routeList = list
    },

    // 渲染地图
    renderMap () {
      const mapId = this.mapId
      // console.log(mapId)
      const NODE_ENV = process.env.NODE_ENV
      const imgSrc = `${NODE_ENV === 'development' ? '/api' : ''}/map/files/${GLOBAL.mapInfo.floorName}/`
      GLOBAL.mapInstance = new Map()
      // console.log(GLOBAL.mapInstance)
      GLOBAL.mapInstance.init({
        floor: mapId,
        src: imgSrc,
        iconSrc: '/icon/',
        mapLevelMax: GLOBAL.mapInfo.layerNum,
        mapTiles: { x: GLOBAL.mapInfo.mapX, y: GLOBAL.mapInfo.mapY } // 瓦片数量（1级）
      })

      // GLOBAL.mapInstance.loadIconImages(GLOBAL.pointTypes)
      // 显示点位
      GLOBAL.mapInstance.showPoint(GLOBAL.mapInfo.points)

      const canvas = GLOBAL.mapInstance.canvas
      canvas.oncontextmenu = this.onContentMenu // 右键显示菜单
    },

    // 设为起点
    handleSetStart () {
      this.start = GLOBAL.currentPoint
      GLOBAL.mapInstance.setStartPoint(GLOBAL.currentPoint, 'start')
      this.menuVisible = false
    },

    // 设为终点
    handleSetEnd () {
      this.end = GLOBAL.currentPoint
      GLOBAL.mapInstance.setEndPoint(GLOBAL.currentPoint, 'end')
      this.menuVisible = false

      // 显示路径
      this.showRoute(this.start.pointId, this.end.pointId)
      // this.showRoute(GLOBAL.mapInstance.getStartPoint().pointId, GLOBAL.mapInstance.getEndPoint().pointId)
    },

    // 显示规划路径线路
    showRoute (sId, eId) {
      // console.log(sId)
      // console.log(eId)
      const path = new PathRoute()
      // console.log(GLOBAL.routes)
      path.Map = GLOBAL.routes

      let route = path.route(sId, eId)
      console.log(route)
      // debugger
      // let routeText = ''
      // let total_distance = 0
      let nodeConnect = []
      let nodePoints = []
      for (let i = 0, len = route.length; i < len; i++) {
        let id = route[i]
        // let j = i + 1
        // let connectNode = j === len ? route[0] : route[j]

        var point = this.getRoutePointInfo(id)
        // debugger
        nodeConnect.push({
          pointId: id,
          posX: point.posX,
          posY: point.posY,
          floor: point.mapId
        })

        nodePoints.push(point)
      }
      // debugger
      console.log(nodeConnect)
      GLOBAL.mapInstance.connectRoutes(nodeConnect)
    },

    // 根据ID获取路径点信息
    getRoutePointInfo (id) {
      const routePoints = GLOBAL.routePoints
      // debugger
      for (var key in routePoints) {
        if (routePoints[key].pointId === id) {
          return routePoints[key]
        }
      }
    },

    // 右键菜单设置
    onContentMenu (e) {
      e.preventDefault()
      const clickPos = GLOBAL.mapInstance.getPoint(e)
      if (clickPos !== 'idle') {
        GLOBAL.currentPoint = this.getClickPoint(clickPos)
        if (GLOBAL.currentPoint) {
          this.menuStyle = {
            left: e.clientX + 'px',
            top: e.clientY + 'px'
          }
          this.menuVisible = true
        }
        console.log(GLOBAL.currentPoint)
      }
      // if (this.operate === 'addPath') return
      // debugger
      // this.handleClick(e)
      // this.menuVisible = false
      // this.menuStyle = {
      //   left: e.clientX + 'px',
      //   top: e.clientY + 'px'
      // }
      // this.menuVisible = true
      // this.judgePoint()
    },

    // 是否选中点
    getClickPoint (clickPos) {
      const points = GLOBAL.mapInfo.points || []
      let checked = false
      for (let i = 0; i < points.length; i++) {
        if (Math.abs(clickPos.x - points[i].posX) < 10 && Math.abs(clickPos.y - points[i].posY) < 10) {
          checked = points[i]
        }
      }
      return checked
    },

    handleSearch () {

    }
  }
}
</script>

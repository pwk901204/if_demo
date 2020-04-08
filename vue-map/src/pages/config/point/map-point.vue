<template>
  <div class="page-point-map">
    <div class="table-operator">
      <a-tooltip title="列表" placement="topLeft">
        <a-button size="large" icon="ordered-list" @click="showDrawer"></a-button>
      </a-tooltip>
    </div>

    <div class="component-map">
      <a-select class="select-map" v-model="selectMap" :options="mapDict" @change="layerChange"></a-select>
      <canvas ref="map" id="map"></canvas>
      <div v-show="menuVisible" class="right-menu" :style="menuStyle">
        <a v-if="operate === 'add'" href="javascript:;" @click="onMenuAdd">添加点位</a>
        <a v-if="operate === 'edit'" href="javascript:;" @click="onMenuEdit">编辑点位</a>
        <a v-if="operate === 'edit'" href="javascript:;" @click="onMenuDel">删除点位</a>
      </div>
    </div>

    <!-- 弹框-新增/修改 -->
    <modal-update :operate="operate" :visible="visible" :values="formObj" @close="handleClose" />
    <!-- 抽屉表格展示点位 -->
    <a-drawer
      width="640"
      placement="right"
      :closable="false"
      @close="closeDrawer"
      :visible="drawerVisible"
    >
      <standard-table
        rowKey="pointName"
        :pagination="{total:dataSource.length}"
        :columns="columns"
        :dataSource="dataSource"
      />
    </a-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { Map } from '@/components/map/core'
import ModalUpdate from './update.vue'
// 全局变量
let GLOBAL = {
  mapInstance: undefined,
  mapInfo: { points: [], pointType: 0 },
  clickPoition: undefined, // 点击坐标
  currentPoint: undefined // 当前地图上操作的点
}
export default {
  name: 'PointMap', // 点位管理地图
  components: { ModalUpdate },
  data () {
    const columns = [
      { title: '序号', dataIndex: '_index' },
      { title: '名称', dataIndex: 'pointName' },
      {
        title: '坐标',
        dataIndex: 'point_pos',
        customRender: (text, record) => {
          return ('(' + record.posX + ',' + record.posY + ')')
        }
      },
      { title: '类型', dataIndex: 'pointTypeName' },
      { title: '显示图层', width: 90, dataIndex: 'showLayers' },
      {
        title: '操作',
        align: 'center',
        width: 120,
        customRender: (text, record) => {
          return (
            <span class="table-oprt">
              <a href="javascript:;" onClick={() => this.onTableEdit(record)}>修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除？" onConfirm={() => this.onTableDel(record)}>
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>
          )
        }
      }
    ]

    return {
      form: this.$form.createForm(this),
      selectMap: '',
      visible: false, // 添加点位弹窗是否显示
      formObj: {}, // 添加点位弹窗中的数据
      menuVisible: false, // 右键菜单是否显示
      menuStyle: {}, // 右键菜单位置
      operate: 'add', // 添加点位
      selectEditPoint: {}, // 被选中要编辑的点位

      drawerVisible: false,
      columns: Object.freeze(columns),
      dataSource: []
    }
  },
  computed: {
    ...mapState({
      mapDict: state => Object.freeze(state.dict.mapDict)
    })
  },
  mounted () {
    // const mapId = this.$route.query.mapId
    const mapId = this.mapDict[0].value
    this.selectMap = mapId

    this.init(mapId)
    // const currentMap = this.mapDict.find(item => item.value === mapId)
    // console.log(currentMap)
    // GLOBAL.mapInfo.floorName = currentMap.code
    // GLOBAL.mapInfo.layerNum = currentMap.mapLayers
    // GLOBAL.mapInfo.mapX = currentMap.mapX
    // GLOBAL.mapInfo.mapY = currentMap.mapY
    // GLOBAL.mapInfo.mapId = currentMap.value
    // // 地图层级
    // // GLOBAL.mapInfo.mapLayers = currentMap.mapLayers
    // // GLOBAL.mapInfo.pointType = 0
    // this.axiosPointGet({ mapId })
  },
  methods: {
    // 初始化页面
    init (mapId) {
      // const mapId = this.selectMap
      // this.selectMap = mapId
      const currentMap = this.mapDict.find(item => item.value === mapId)
      console.log(currentMap)
      GLOBAL.mapInfo.floorName = currentMap.code
      GLOBAL.mapInfo.layerNum = currentMap.mapLayers
      GLOBAL.mapInfo.mapX = currentMap.mapX
      GLOBAL.mapInfo.mapY = currentMap.mapY
      GLOBAL.mapInfo.mapId = currentMap.value
      // 地图层级
      // GLOBAL.mapInfo.mapLayers = currentMap.mapLayers
      // GLOBAL.mapInfo.pointType = 0
      this.axiosPointGet({ mapId })
    },
    // 显示drawer
    showDrawer () {
      this.drawerVisible = true
    },
    // 关闭drawer
    closeDrawer () {
      this.drawerVisible = false
    },
    // 楼层变换
    layerChange (val) {
      this.init(val)
      // console.log(val)
      // alert('功能未实现！')
    },
    // 渲染地图
    renderMap () {
      const NODE_ENV = process.env.NODE_ENV
      const imgSrc = `${NODE_ENV === 'development' ? '/api' : ''}/map/files/${GLOBAL.mapInfo.floorName}/`
      // 显示地图
      GLOBAL.mapInstance = new Map()
      GLOBAL.mapInstance.init({
        src: imgSrc,
        mapLevelMax: GLOBAL.mapInfo.layerNum,
        mapTiles: { x: GLOBAL.mapInfo.mapX, y: GLOBAL.mapInfo.mapY } // 瓦片数量（1级）
      })

      // 显示点
      GLOBAL.mapInstance.showPoint(GLOBAL.mapInfo.points)

      // 添加事件
      const canvas = GLOBAL.mapInstance.canvas
      canvas.onclick = () => {
        if (this.menuVisible) this.menuVisible = false
      }
      canvas.oncontextmenu = this.onContentMenu // 右键显示菜单
    },

    // 右键菜单设置
    onContentMenu (e) {
      e.preventDefault()
      GLOBAL.clickPoition = GLOBAL.mapInstance.getPoint(e)
      if (GLOBAL.clickPoition !== 'idle') {
        GLOBAL.currentPoint = this.getClickPoint(GLOBAL.clickPoition)
        this.menuStyle = {
          left: e.clientX + 'px',
          top: e.clientY + 'px'
        }
        this.operate = GLOBAL.currentPoint ? 'edit' : 'add'
        this.menuVisible = true
      }
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

    // 处理弹框关闭
    handleClose (returnValue) {
      this.visible = false
      this.drawerVisible = false

      if (returnValue) {
        GLOBAL.mapInfo.points = Object.freeze(returnValue.data)
        this.dataSource = Object.freeze(returnValue.data)
        GLOBAL.mapInstance.showPoint(GLOBAL.mapInfo.points)
      }
    },

    onMenuAdd () {
      this.$confirm({
        title: '提示',
        content: `确定在该位置处添加点位吗？`,
        onOk: () => {
          this.formObj = {
            mapId: GLOBAL.mapInfo.mapId,
            floorName: GLOBAL.mapInfo.floorName,
            layerNum: GLOBAL.mapInfo.layerNum,
            point_pos: `(${GLOBAL.clickPoition.x},${GLOBAL.clickPoition.y})`
          }
          this.operate = 'add'
          this.menuVisible = false
          this.visible = true
        }
      })
    },

    onMenuEdit () {
      this.menuVisible = false
      this.onTableEdit(GLOBAL.currentPoint)
    },

    onMenuDel () {
      this.$confirm({
        title: '提示',
        content: `确定删除该点位吗？`,
        onOk: () => {
          const params = {
            pointId: GLOBAL.currentPoint.pointId,
            mapId: GLOBAL.currentPoint.mapId
          }

          this.axiosPointDel(params)
        }
      })
    },

    onTableEdit (record) {
      let formObj = Object.assign({}, record)
      debugger
      formObj.point_pos = `(${formObj.posX},${formObj.posY})`
      formObj.layerNum = GLOBAL.mapInfo.layerNum
      this.formObj = formObj
      this.operate = 'edit'
      this.visible = true
    },

    // 表格删除
    onTableDel (record) {
      const params = { mapId: record.mapId, pointId: record.pointId }
      this.axiosPointDel(params)
    },

    // 获取点请求
    async axiosPointGet (params) {
      const res = await this.$axios.post('/map/pointAllList', params)
      GLOBAL.mapInfo.points = Object.freeze(res.result)
      this.dataSource = Object.freeze(res.result)

      this.renderMap()
    },

    // 删除请求
    async axiosPointDel (params) {
      const res = await this.$axios.post('/map/delPoint', params)
      GLOBAL.mapInfo.points = Object.freeze(res.result)
      this.dataSource = Object.freeze(res.result)
    }
  }
}
</script>
<style lang='less'>
.page-point-map {
  .component-map {
    margin-top: -44px;
  }
}
</style>

<template>
  <div class="page-route-map">
    <div class="table-operator">
      <a-tooltip title="列表" placement="topLeft">
        <a-button size="large" icon="ordered-list" @click="showDrawer"></a-button>
      </a-tooltip>
    </div>

    <div class="component-map">
      <a-select class="select-map" v-model="mapId" :options="mapDict" @change="layerChange"></a-select>
      <canvas
        ref="map"
        id="map"
        :style="{cursor: operate=='addPath' || operate=='delPath' ? 'crosshair' : 'default'}"
      ></canvas>
      <div v-show="menuVisible" class="right-menu" :style="menuStyle">
        <template v-if="operate === 'add'">
          <a href="javascript:;" @click="onMenuAdd">新增路径点</a>
        </template>
        <template v-if="operate === 'edit'">
          <a href="javascript:;" @click="onMenuEdit">编辑路径点</a>
          <a href="javascript:;" @click="onMenuDel">删除路径点</a>
        </template>
        <template v-else>
          <a-divider />
          <a href="javascript:;" @click="onAddPath">新增路径</a>
          <a href="javascript:;" @click="onDelPath">删除路径</a>
        </template>
      </div>
    </div>
    <!-- 弹框修改 -->
    <modal-update :operate="operate" :visible="visible" :record="formObj" @close="handleClose" />

    <a-drawer
      width="640"
      placement="right"
      :closable="false"
      @close="closeDrawer"
      :visible="drawerVisible"
    >
      <standard-table
        rowKey="pointId"
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
  currentPoint: undefined, // 当前地图上操作的点
  start: undefined,
  end: undefined
}
export default {
  name: 'MapPoint', // 地图路径点管理
  components: { ModalUpdate },
  data () {
    const columns = [
      { title: '序号', dataIndex: '_index' },
      { title: '名称', dataIndex: 'pointName' },
      {
        title: '坐标',
        dataIndex: 'point_pos',
        customRender: (text, record, index) => {
          return ('(' + record.posX + ',' + record.posY + ')')
        }
      },
      {
        title: '操作',
        align: 'center',
        width: 150,
        customRender: (text, record, index) => {
          return (
            <span class="table-oprt">
              <a href="javascript:;" onClick={() => { this.onTableEdit(record) }}>修改</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确定删除？" onConfirm={() => { this.onTableDel(record) }}>
                <a href="javascript:;">删除</a>
              </a-popconfirm>
            </span>
          )
        }
      }
    ]
    return {
      form: this.$form.createForm(this),
      visible: false, // 添加路径点弹窗是否显示
      formObj: {}, // 添加路径点弹窗中的数据
      menuVisible: false, // 右键菜单是否显示
      menuStyle: {}, // 右键菜单位置
      operate: 'add', // 添加路径点
      selectEditPoint: {}, // 被选中要编辑的路径点
      mapId: '',
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
    const mapId = this.mapDict[0].value
    this.mapId = mapId
    this.init(mapId)
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
      const context = GLOBAL.mapInstance.context
      canvas.onclick = (e) => {
        if (this.menuVisible) this.menuVisible = false
        // if (this.operate === 'addPath') {
        const clickPos = GLOBAL.mapInstance.getPoint(e)
        if (clickPos !== 'idle') {
          const checked = this.getClickPoint(clickPos)
          if (checked) {
            // console.log(start)
            if (GLOBAL.start && !GLOBAL.end) {
              GLOBAL.end = checked
            }
            if (!GLOBAL.start) {
              GLOBAL.start = checked
            }

            if (GLOBAL.start && GLOBAL.end) {
              if (this.operate === 'addPath') {
                if (GLOBAL.start.connectPoints.includes(GLOBAL.end.pointId) || GLOBAL.end.connectPoints.includes(GLOBAL.start.pointId)) {
                  GLOBAL.end = null
                  this.$message.warning('路径已连接！')
                  return
                }
                const dx = Math.abs(Number(GLOBAL.start.posX) - Number(GLOBAL.end.posX))
                const dy = Math.abs(Number(GLOBAL.start.posY) - Number(GLOBAL.end.posY))
                const distance = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)))
                const list = [{ startPointId: GLOBAL.start.pointId, endPointId: GLOBAL.end.pointId, distance }]
                // console.log(list)
                this.axiosRoutePut(list)
              }
              if (this.operate === 'delPath') {
                if (!GLOBAL.start.connectPoints.includes(GLOBAL.end.pointId) && !GLOBAL.end.connectPoints.includes(GLOBAL.start.pointId)) {
                  GLOBAL.end = null
                  this.$message.warning('路径未连接！')
                  return
                }
                this.axiosRouteDel({ startPointId: GLOBAL.start.pointId, endPointId: GLOBAL.end.pointId })
              }
              // this.createPathAjax(list)
            }
            // GLOBAL.mapInstance.setStartPoint(clickPos)
            context.beginPath()
            context.arc(Number(checked.posX), Number(checked.posY), 5, 0, Math.PI * 2, false)
            context.fillStyle = '#ff0'
            context.fill()
          }
        }
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
        this.axiosPointGet({ mapId: this.mapId }, true)
      }
    },

    // 右键按钮操作-新增
    onMenuAdd () {
      this.$confirm({
        title: '提示',
        content: `确定在该位置处添加点位吗？`,
        onOk: () => {
          this.formObj = {
            mapId: GLOBAL.mapInfo.mapId,
            floorName: GLOBAL.mapInfo.floorName,
            mapLayers: GLOBAL.mapInfo.layerNum,
            point_pos: `(${GLOBAL.clickPoition.x},${GLOBAL.clickPoition.y})`
          }
          this.operate = 'add'
          this.menuVisible = false
          this.visible = true
        }
      })
    },

    // 右键按钮操作-编辑
    onMenuEdit () {
      this.menuVisible = false
      this.onTableEdit(GLOBAL.currentPoint)
    },

    // 右键按钮操作-删除
    onMenuDel () {
      this.$confirm({
        title: '提示',
        content: '确定删除该路径点吗？',
        onOk: () => {
          const params = {
            pointId: GLOBAL.currentPoint.pointId,
            mapId: GLOBAL.currentPoint.mapId
          }

          this.axiosPointDel(params)
        }
      })
    },

    // 新增路径
    onAddPath () {
      this.operate = 'addPath'
      this.menuVisible = false
    },

    // 删除路径
    onDelPath () {
      this.operate = 'delPath'
      this.menuVisible = false
    },

    // 更新路径
    updateRoute (points) {
      GLOBAL.mapInfo.points = points
      GLOBAL.mapInstance.showPoint(points)
      GLOBAL.start = GLOBAL.end
      GLOBAL.end = null

      const context = GLOBAL.mapInstance.context
      context.beginPath()
      context.arc(Number(GLOBAL.start.posX), Number(GLOBAL.start.posY), 5, 0, Math.PI * 2, false)
      context.fillStyle = '#ff0'
      context.fill()
    },

    // 表格按钮操作-编辑
    onTableEdit (record) {
      let formObj = Object.assign({}, record)
      formObj.point_pos = `(${formObj.posX},${formObj.posY})`
      this.formObj = formObj
      this.operate = 'edit'
      this.visible = true
    },

    // 表格按钮操作-删除
    onTableDel (record) {
      const params = { mapId: record.mapId, pointId: record.pointId }
      this.menuVisible = false
      this.axiosPointDel(params)
    },

    /**
     * [axiosPointGet 获取点请求]
     * @param   {[Object]}   [params 请求参数]
     * @param   {[Boolean]}  [updatePoint 是否更新点位]
     * @return  {[type]}     [return 初始化地图或者更新点位]
     */
    async axiosPointGet (params, updatePoint) {
      const res = await this.$axios.post('/map/queryAllRoutePoint', params)
      GLOBAL.mapInfo.points = Object.freeze(res.result)
      this.dataSource = Object.freeze(res.result)

      if (updatePoint) {
        // 显示点
        GLOBAL.mapInstance.showPoint(GLOBAL.mapInfo.points)
      } else {
        this.renderMap()
      }
    },

    // 删除请求
    async axiosPointDel (params) {
      await this.$axios.post('/map/delPoint', params)
      this.axiosPointGet({ mapId: this.mapId }, true)
    },

    // 路径新增
    async axiosRoutePut (list) {
      const params = { listString: JSON.stringify(list), mapId: this.mapId }
      const res = await this.$axios.post('/map/addRoute', params)
      this.updateRoute(res.result)
    },

    // 删除路径
    async axiosRouteDel (tRoute) {
      const params = { ...tRoute, mapId: this.mapId }
      const res = await this.$axios.post('/map/delRoute', params)
      this.updateRoute(res.result)
    }
  }
  // methods: {
  //   showDrawer () {
  //     this.drawerVisible = true
  //   },
  //   closeDrawer () {
  //     this.drawerVisible = false
  //   },
  //   // 楼层变换
  //   layerChange (val) {
  //     debugger
  //   },
  //   // 获取所有点
  //   async getAllPathPoint (params) {
  //     const res = await this.$axios.post('/map/queryAllRoutePoint', params)
  //     // if (res.resultCode === '200') {
  //     // let list = res.result || []
  //     // list.forEach(item => {
  //     //   // item.pointId = item.pointId.replace(/-/g, '')
  //     //   // item.connectPoints = item.connectPoints.replace(/-/g, '')
  //     //   // item.pointId = item.pointId.replace(/-/g, '')
  //     //   // item.pointName = item.pointId
  //     //   console.log(item)
  //     // })
  //     mapInfo.points = Object.freeze(res.result)
  //     this.dataSource = Object.freeze(res.result)
  //     this.renderMap()
  //     // } else {
  //     // this.$message.warn(res.resultMsg)
  //     // }
  //     // })
  //   },
  //   // 初始化地图
  //   renderMap () {
  //     const NODE_ENV = process.env.NODE_ENV
  //     const imgSrc = `${NODE_ENV === 'development' ? '/api' : ''}/map/files/${mapInfo.floorName}/`
  //     // 显示地图
  //     GLOBAL.mapInstance = new Map()
  //     GLOBAL.mapInstance.init({
  //       src: imgSrc,
  //       mapLevelMax: mapInfo.layerNum,
  //       mapTiles: { x: mapInfo.mapX, y: mapInfo.mapY } // 瓦片数量（1级）
  //     })
  //     // console.log(GLOBAL.mapInstance)

  //     // GLOBAL.mapInstance.setShowPointType(mapInfo.pointType)
  //     GLOBAL.mapInstance.showPoint(mapInfo.points)
  //     // debugger
  //     // 添加地图点击事件
  //     // if (mapInfo.pointType === 0 || mapInfo.pointType === 1) {
  //     // debugger
  //     const canvas = GLOBAL.mapInstance.canvas
  //     const context = GLOBAL.mapInstance.context
  //     canvas.onclick = (e) => {
  //       if (this.menuVisible) {
  //         this.menuVisible = false
  //       }
  //       // if (this.operate === 'addPath') {
  //       const clickPos = GLOBAL.mapInstance.getPoint(e)
  //       if (clickPos !== 'idle') {
  //         const checked = this.clickPoint(clickPos)
  //         if (checked) {
  //           console.log(start)
  //           if (start && !end) {
  //             end = checked
  //           }
  //           if (!start) {
  //             start = checked
  //           }

  //           if (start && end) {
  //             if (this.operate === 'addPath') {
  //               if (start.connectPoints.includes(end.pointId) || end.connectPoints.includes(start.pointId)) {
  //                 end = null
  //                 this.$message.warning('路径已连接！')
  //                 return
  //               }
  //               const dx = Math.abs(Number(start.posX) - Number(end.posX))
  //               const dy = Math.abs(Number(start.posY) - Number(end.posY))
  //               const distance = Math.round(Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2)))
  //               const list = [{ startPointId: start.pointId, endPointId: end.pointId, distance }]
  //               console.log(list)
  //               this.createPathAjax(list)
  //             }
  //             if (this.operate === 'delPath') {
  //               this.delPathAjax({ startPointId: start.pointId, endPointId: end.pointId })
  //             }
  //             // this.createPathAjax(list)
  //           }
  //           // GLOBAL.mapInstance.setStartPoint(clickPos)
  //           context.beginPath()
  //           context.arc(Number(checked.posX), Number(checked.posY), 5, 0, Math.PI * 2, false)
  //           context.fillStyle = '#ff0'
  //           context.fill()
  //           // context.clearRect(Number(checked.posX), Number(checked.posY), 5, 5)
  //           // clearRect(x, y, widh, height)
  //         }
  //       }
  //       // }
  //     }
  //     canvas.oncontextmenu = this.rightMenu // 右键显示菜单
  //     // canvas.onwheel = this.mousewheel // 图层缩放
  //     // }
  //   },
  //   // 是否选中点
  //   clickPoint (clickPos) {
  //     const points = mapInfo.points || []
  //     let checked = false
  //     // if (points.length > 0) {
  //     for (let i = 0; i < points.length; i++) {
  //       if (Math.abs(clickPos.x - points[i].posX) < 10 && Math.abs(clickPos.y - points[i].posY) < 10) {
  //         checked = points[i]
  //       }
  //       // }
  //     }
  //     return checked
  //   },
  //   // 判断路径点是否在地图外
  //   handleClick (event) {
  //     pos = GLOBAL.mapInstance.getPoint(event)
  //     if (pos !== 'idle') {
  //       if (mapInfo.pointType === 0) {
  //         if (!pos) {
  //           this.$message.warning('不允许在地图外添加路径点！')
  //         }
  //       }
  //     }
  //   },
  //   // 添加路径点二次确认
  //   addDot () {
  //     this.operate = 'add'
  //     // let self = this
  //     this.$confirm({
  //       title: '提示',
  //       content: `确定在该位置处添加路径点吗？`,
  //       onOk: () => {
  //         this.pointEcho()
  //       }
  //     })
  //   },
  //   mousewheel (e) {
  //     // debugger
  //   },
  //   // 回显弹窗中的路径点信息
  //   pointEcho () {
  //     let layerNum = this.form.getFieldValue('layerNum')
  //     if (this.operate === 'add') {
  //       this.formObj = {
  //         mapId: mapInfo.mapId,
  //         floorName: mapInfo.floorName,
  //         mapLayers: layerNum,
  //         point_pos: '(' + pos.x + ',' + pos.y + ')'
  //       }
  //       // debugger
  //       this.visible = true
  //     } else {
  //       this.formObj = {
  //         pointId: this.selectEditPoint.pointId,
  //         mapId: this.selectEditPoint.mapId,
  //         floorName: mapInfo.floorName,
  //         mapLayers: layerNum,
  //         point_pos: '(' + this.selectEditPoint.posX + ',' + this.selectEditPoint.posY + ')',
  //         pointName: this.selectEditPoint.pointName,
  //         typeId: this.selectEditPoint.typeId,
  //         layers: this.selectEditPoint.showLayers
  //       }
  //       this.visible = true
  //     }
  //   },
  //   // 右键菜单设置
  //   rightMenu (e) {
  //     e.preventDefault()
  //     if (this.operate === 'addPath') return
  //     // debugger
  //     this.handleClick(e)
  //     this.menuVisible = false
  //     this.menuStyle = {
  //       left: e.clientX + 'px',
  //       top: e.clientY + 'px'
  //     }
  //     this.menuVisible = true
  //     this.judgePoint()
  //   },
  //   // 新增、修改
  //   handleForm (operate) {
  //     // 关闭弹框
  //     // if (operate === 'cancel') {
  //     this.visible = false
  //     this.menuVisible = false
  //     // }
  //     // 确定
  //     if (operate === 'ok') {
  //       // this.visible = false
  //       // this.menuVisible = false
  //       const mapId = this.$route.query.mapId
  //       this.getAllPathPoint({ mapId })
  //     }
  //   },
  //   // 新增路径
  //   onAddPath () {
  //     this.operate = 'addPath'
  //     this.menuVisible = false
  //   },

  //   // 新增路径
  //   async createPathAjax (list) {
  //     const params = { listString: JSON.stringify(list), mapId: this.mapId }
  //     const res = await this.$axios.post('/map/addRoute', params)
  //     this.updateRoute(res.result)
  //   },

  //   // 删除路径
  //   onDelPath () {
  //     this.operate = 'delPath'
  //     this.menuVisible = false
  //   },
  //   async delPathAjax (tRoute) {
  //     const params = { ...tRoute, mapId: this.mapId }
  //     const res = await this.$axios.post('/map/delRoute', params)
  //     this.updateRoute(res.result)
  //   },
  //   // 新增/编辑的路径点提交信息
  //   // pointSubmit (params) {
  //   //   let url = '/map/' + (this.operate === 'add' ? 'saveRoutePoint' : 'updatePoint')
  //   //   this.$axios.post(url, params).then(res => {
  //   //     if (res.resultCode === '200') {
  //   //       mapInfo.points = res.result
  //   //       GLOBAL.mapInstance.showPoint(mapInfo.points)
  //   //       this.visible = false
  //   //       this.menuVisible = false
  //   //     } else {
  //   //       this.$message.warn(res.resultMsg)
  //   //     }
  //   //   })
  //   // },
  //   // 删除路径点
  //   deleteDot () {
  //     // let self = this
  //     this.$confirm({
  //       title: '提示',
  //       content: `确定删除该路径点吗？`,
  //       onOk: () => {
  //         // 发送删除请求
  //         this.delAjax()
  //       }
  //     })
  //   },
  //   // 删除请求
  //   async delAjax () {
  //     const params = {
  //       pointId: this.selectEditPoint.pointId,
  //       mapId: this.selectEditPoint.mapId,
  //       level: '1'
  //     }

  //     const res = await this.$axios.post('/map/delPoint', params)
  //     mapInfo.points = res.result
  //     GLOBAL.mapInstance.showPoint(mapInfo.points)
  //     this.menuVisible = false
  //     // console.log(res)
  //   },
  //   // 更新路径点
  //   updateRoute (points) {
  //     mapInfo.points = points
  //     GLOBAL.mapInstance.showPoint(points)
  //     start = end
  //     end = null

  //     const context = GLOBAL.mapInstance.context
  //     context.beginPath()
  //     context.arc(Number(start.posX), Number(start.posY), 5, 0, Math.PI * 2, false)
  //     context.fillStyle = '#ff0'
  //     context.fill()
  //     // console.log(res)
  //   },
  //   // 判断路径点是否存在
  //   judgePoint () {
  //     if (mapInfo.points && mapInfo.points.length > 0) {
  //       for (var i = 0; i < mapInfo.points.length; i++) {
  //         if (Math.abs(pos.x - mapInfo.points[i].posX) < 10 && Math.abs(pos.y - mapInfo.points[i].posY) < 10) {
  //           this.operate = 'edit'
  //           this.selectEditPoint = mapInfo.points[i]
  //           return
  //         }
  //       }
  //     }
  //   }
  // }
}
</script>
<style lang='less'>
.page-route-map {
  .component-map {
    margin-top: -44px;
  }
}
.right-menu .ant-divider-horizontal {
  margin: 6px 0;
}
</style>

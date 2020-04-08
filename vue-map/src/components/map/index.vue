<template>
  <div class="component-map">
    <canvas id="map"></canvas>
    <!-- 操作 -->
    <!-- <a-modal v-model="visible" title="提示">
      <template slot="footer">
        <a-button key="submit" type="primary" @click="handleOk">修改</a-button>
        <a-button key="submit" type="primary" @click="handleOk">删除</a-button>
        <a-button key="back" @click="handleCancel">取消</a-button>
      </template>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
      <p>Some contents...</p>
    </a-modal>-->
  </div>
</template>
<script>
var mapInfo = {
  points: [{ "id": "1", "pointName": "\u6536\u94f6\u53f0(1)", "posX": "253", "posY": "297", "pathPointId": 0 }, { "id": "2", "pointName": "\u697c\u68af(2)", "posX": "408", "posY": "327", "pathPointId": 0 }, { "id": "3", "pointName": "\u5395\u6240(3)", "posX": "542", "posY": "482", "pathPointId": 0 }, { "id": "4", "pointName": "111(4)", "posX": "520", "posY": "432", "pathPointId": 0 }, { "id": "5", "pointName": "1212(5)", "posX": "472", "posY": "385", "pathPointId": 0 }],
  pointType: 0,
  floorName: 'L',
  layerNum: 3,
  mapX: 12,
  mapY: 6
}
let MAP
import { Map } from './core'
export default {
  name: 'ComponentMap', // 地图组件
  props: {
    pointType: { type: Number, default: 0 } // 点类型，基本点位0，路径点：1
  },
  data () {
    return {
      loading: false,
      visible: true
    }
  },
  mounted () {
    this.initMap()
  },
  methods: {
    // 初始化地图
    initMap () {
      //显示地图
      MAP = new Map()
      MAP.init({
        src: 'http://10.40.204.224:8888/simple/upload/RYGC/' + mapInfo.floorName + '/',
        imageFormat: '.png',
        point: {
          x: 'posX',
          y: 'posY',
          name: 'pointName'
        },
        mapLevelMax: mapInfo.layerNum,
        mapTiles: { x: mapInfo.mapX, y: mapInfo.mapY } // 瓦片数量（1级）
      })

      // 添加地图点击事件
      if (mapInfo.pointType === 0 || mapInfo.pointType === 1) {
        const canvas = MAP.canvas
        canvas.onclick = this.handleClick
      }


      // this.addPoint(map, mapInfo)
    },
    // 点击事件
    handleClick (event) {
      const pos = MAP.getPoint(event)
      if (pos !== 'idle') {
        if (0 == mapInfo.pointType) {
          if (!pos) {
            this.$message.warning('不允许在地图外添加点位！')
          } else {
            this.showAddConfirm(pos)
            // if (confirm('是否在位置x:' + parseInt(pos.x) + ',y:' + parseInt(pos.y) + '处添加点位？')) {
            //   getPointEditInfo(0, parseInt(pos.x), parseInt(pos.y));
            //   //location.href = "point.php?act=add&floor="+ $("#floor").val() +"&x="+parseInt(pos.x)+"&y="+parseInt(pos.y);
            // }
          }
        }
      }
      // console.log(point)
      // this.showOperate()
      // console.log(this)
    },
    // 显示点位操作对话框
    showOperate () {
      let onCancel = () => {
        modal.destroy()
      }
      const modal = this.$confirm({
        content: h => <div><p>请选择你对节点操作！</p><a-button onClick={onCancel} class="btn-update">取消</a-button></div>,
        // closable: true,
        // centered: true,
        okText: '删除',
        okType: 'danger',
        cancelText: '修改',
        onOk () {
          console.log('删除');
        },
        onCancel () {
          console.log('修改');
        },
        class: 'confirm-operate',
      })
    },
    // 显示新增点位确认对话框
    showAddConfirm (pos) {
      this.$confirm({
        title: '提示',
        content: `确定在该位置处添加点位吗？`,
        onOk () {
          console.log('ok');
        },
        onCancel () {
          console.log('cancel');
        }
      })
    },
    // 添加标记点
    addPoint (map, mapInfo) {
      // var canvas = map.canvas;
      // canvas.onclick = function (event) {
      //   var pos = map.getPoint(event);
      //   console.log(pos)
      //   if (pos !== 'idle') {
      //     // if (mapInfo.points && mapInfo.points.length > 0) {
      //     //   for (var i = 0; i < mapInfo.points.length; i++) {
      //     //     if (Math.abs(pos.x - mapInfo.points[i].posX) < 10 && Math.abs(pos.y - mapInfo.points[i].posY) < 10) {
      //     //       if (0 == mapInfo.pointType) {
      //     //         showPointOperation(mapInfo.points[i].id, '点位“' + mapInfo.points[i].pointName + '”');
      //     //       } else if (1 == mapInfo.pointType) {
      //     //         showPointOperation(mapInfo.points[i].id, '路径点“' + mapInfo.points[i].pointName + '”');
      //     //       }
      //     //       return;
      //     //     }
      //     //   }
      //     // }

      //     if (0 == mapInfo.pointType) {
      //       if (!pos) {
      //         this.$message.warning('不允许在地图外添加点位！')
      //       }
      //       else {
      //         if (confirm('是否在位置x:' + parseInt(pos.x) + ',y:' + parseInt(pos.y) + '处添加点位？')) {
      //           getPointEditInfo(0, parseInt(pos.x), parseInt(pos.y));
      //           //location.href = "point.php?act=add&floor="+ $("#floor").val() +"&x="+parseInt(pos.x)+"&y="+parseInt(pos.y);
      //         }
      //       }
      //     }
      //     else if (1 == mapInfo.pointType) {
      //       if (!pos) {
      //         alert('不允许在地图外添加路径点！');
      //       }
      //       else {
      //         if (confirm('是否在位置x:' + parseInt(pos.x) + ',y:' + parseInt(pos.y) + '处添加路径点？')) {
      //           getPointEditInfo(0, parseInt(pos.x), parseInt(pos.y));
      //           //location.href = "route.php?act=add&floor="+ $("#floor").val() +"&x="+parseInt(pos.x)+"&y="+parseInt(pos.y);
      //         }
      //       }
      //     }
      //   }
      // }
    }
  }
}
</script>
<style lang="less">
.component-map {
  padding-bottom: 10px;
  canvas {
    border: 1px solid #dedede;
  }
}
.confirm-operate {
  .ant-modal-confirm-content {
    margin-top: 0;
  }
  .btn-update {
    position: absolute;
    bottom: 24px;
    right: 176px;
  }
}
</style>
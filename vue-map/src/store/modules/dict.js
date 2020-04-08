import axios from '@/common/utils/request'

export default {
  namespaced: true,
  state: {
    approvalState: [],
    mapDict: [], // 地图
    pointDict: [], // 点位类型
    // pathPointDict: [], // 路径点类型
    waypoint: undefined // 路径点
  },
  mutations: {
    SET_DICT (state, { options, lxjp }) {
      state[lxjp] = Object.freeze(options)
    }
  },
  actions: {
    fetchDict ({ commit, state }, lxjp) {
      if (lxjp in state && state[lxjp].length > 0) {
        return
      }

      // axios.post('/base/getDict', { lxjp }).then(res => {
      axios.mock('mock/approvalState.json').then(res => {
        const options = res.data || []
        commit('SET_DICT', { options, lxjp })
      }).catch(err => {
        console.log(err)
        commit('SET_DICT', { options: [], lxjp })
      })
    },
    // 地图字典项
    fetchMap ({ commit }) {
      axios.post('/map/queryAllMapList').then(res => {
        const options = []
        if (res.result.length > 0) {
          res.result.forEach(item => {
            options.push({
              label: item.mapName,
              title: item.mapName,
              value: item.mapId,
              code: item.mapCode,
              mapLayers: item.mapLayers,
              mapX: item.mapX,
              mapY: item.mapY
            })
          })
        }
        commit('SET_DICT', { options, lxjp: 'mapDict' })
      })
    },
    // 点位类型字典项
    fetchPoint ({ commit }) {
      axios.post('/map/pointTypeList').then(res => {
        const options = []
        // const pathPoint = []
        if (res.result.length > 0) {
          res.result.forEach(item => {
            if (['起点', '终点', '路径点'].indexOf(item.typeName) === -1) {
              options.push({
                label: item.typeName,
                title: item.typeName,
                value: item.typeId,
                code: item.typeCode
              })
            } else if (item.typeName === '路径点') {
              commit('SET_DICT', { options: item.typeId, lxjp: 'waypoint' })
              // pathPoint.push({
              //   label: item.typeName,
              //   title: item.typeName,
              //   value: item.typeId,
              //   code: item.typeCode
              // })
            }
          })
        }
        // debugger
        // commit('SET_DICT', { options: pathPoint, lxjp: 'pathPointDict' })
        commit('SET_DICT', { options, lxjp: 'pointDict' })
      })
      // this.pointType = Object.freeze(res.result)
      // const res = await this.$axios.post('/map/pointAllList', params)
      // // if (res.resultCode === '200') {
      // mapInfo.points = Object.freeze(res.result)
      // this.initMap()
    }
  }
}

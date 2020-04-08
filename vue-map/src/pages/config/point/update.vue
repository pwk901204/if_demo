<template>
  <div class="modal-update">
    <a-modal
      destroyOnClose
      :title="modalTitle"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <!-- <a-form-item label="所在楼层" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['floorName']" disabled />
        </a-form-item>-->
        <a-form-item label="名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="decorator.pointName" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="坐标" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['point_pos']" disabled />
        </a-form-item>
        <a-form-item label="类型" :label-col="{ span:7 }" :wrapper-col="{ span: 12 }">
          <a-select v-decorator="decorator.typeId" :options="pointDict" placeholder="请选择"></a-select>
        </a-form-item>
        <a-form-item label="显示图层" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-checkbox-group v-decorator="decorator.showLayers">
            <a-checkbox v-for="(item,index) in layerNum" :key="index" :value="item+''">{{item}}层</a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import GlobalMixin from '@/mixins/global'
import decorator from './decorator'
export default {
  name: 'PointUpdate',
  mixins: [GlobalMixin],
  props: {
    operate: { type: String, required: true, default: 'add' },
    visible: { type: Boolean, required: true, default: false },
    values: { type: Object }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      decorator: Object.freeze(decorator),
      confirmLoading: false,
      layerNum: 1 // 图层数据
    }
  },
  computed: {
    ...mapState({
      pointDict: state => Object.freeze(state.dict.pointDict)
    }),
    modalTitle: function () {
      return `${this.operate === 'add' ? '添加' : '修改'}点位`
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.initModal()
      }
    }
  },
  methods: {
    // 初始化弹框
    initModal () {
      this.layerNum = this.values.layerNum
      this.$nextTick(() => {
        this._setFieldsValue(this.form, this.values, {
          showLayers: 'Array'
        })
      })
    },
    // 确定
    handleOk (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          // console.log(values)
          // debugger
          let params = {
            pointName: values.pointName,
            typeId: values.typeId,
            // level: 1, // 当前展示的图层
            showLayers: values.showLayers.join(),
            mapId: this.values.mapId
          }
          // console.log(params)
          if (this.operate === 'add') {
            params.posX = values.point_pos.match(/(?<=\().*?(?=,)/)[0]
            params.posY = values.point_pos.match(/(?<=,).*?(?=\))/)[0]
            // params.posX = values.point_pos.substring(values.point_pos.indexOf('(') + 1, values.point_pos.indexOf(','))
            // params.posY = values.point_pos.substring(values.point_pos.indexOf(',') + 1, values.point_pos.indexOf(')'))
          } else {
            params.pointId = this.values.pointId
          }
          // 发送请求
          this.axiosPoint(params)
        }
      })
    },

    // 关闭弹框
    handleCancel () {
      this.$emit('close')
    },

    // 新增、修改点请求
    async axiosPoint (params) {
      this.confirmLoading = true
      const url = `/map/${this.operate === 'add' ? 'addPoint' : 'updatePoint'}`
      const res = await this.$axios.post(url, params)
      this.confirmLoading = false
      this.$emit('close', {
        operate: this.operate,
        data: res.result
      })
    }
  }
}
</script>

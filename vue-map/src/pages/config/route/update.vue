<template>
  <div class="modal-update">
    <a-modal
      destroyOnClose
      :title="title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
    >
      <a-form :form="form">
        <a-form-item label="名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="decorator.pointName" placeholder="请输入" />
        </a-form-item>
        <a-form-item label="坐标" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
          <a-input v-decorator="['point_pos']" disabled />
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
    record: { type: Object }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      decorator: Object.freeze(decorator),
      confirmLoading: false,
      layers: 2 // 图层数据
    }
  },
  computed: {
    ...mapState({
      waypoint: state => state.dict.waypoint
    }),
    title: function () {
      return `${this.operate === 'add' ? '添加' : '修改'}路径点类型`
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
      this.$nextTick(() => {
        this._setFieldsValue(this.form, this.record)
      })
    },
    // 确定
    handleOk (e) {
      this.form.validateFields((err, values) => {
        if (!err) {
          values.mapId = this.record.mapId

          values.posX = values.point_pos.match(/(?<=\().*?(?=,)/)[0]
          values.posY = values.point_pos.match(/(?<=,).*?(?=\))/)[0]
          delete values.point_pos

          if (this.record.pointId) {
            values.pointId = this.record.pointId
            values.typeId = this.record.typeId
          } else {
            values.typeId = this.waypoint
          }

          this.axiosPoint(values)
        }
      })
    },
    // 关闭弹框
    handleCancel () {
      this.$emit('close')
    },

    // 确定请求
    async axiosPoint (params) {
      this.confirmLoading = true
      let url = '/map/' + (this.operate === 'add' ? 'saveRoutePoint' : 'updatePoint')
      await this.$axios.post(url, params)

      this.confirmLoading = false
      this.$emit('close', {
        operate: this.operate
      })
    }
  }
}
</script>

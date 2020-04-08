<template>
  <div class="page-form">
    <div class="card">
      <a-form :form="form"
              @submit="handleSubmit"
              style="width: 400px;margin: 0 auto;">
        <!-- <a-form-item label="邮箱">
          <a-input
            placeholder="请输入邮箱"
            v-decorator="decorator.email"
            autocomplete="off"
            maxlength="50"
          />
        </a-form-item>-->
        <a-form-item label="密码">
          <a-input placeholder="请输入密码"
                   v-decorator="decorator.password"
                   autocomplete="off"
                   maxlength="18" />
        </a-form-item>
        <a-form-item label="下拉框">
          <a-select :options="approvalDict"
                    placeholder="请下拉选择"
                    v-decorator="decorator.select"
                    allowClear />
        </a-form-item>
        <a-form-item label="时间">
          <a-date-picker v-decorator="decorator.time" />
        </a-form-item>
        <a-form-item label="时间范围">
          <a-range-picker data-key="time1,time2"
                          format="YYYY-MM-DD HH:mm"
                          data-format="YYYY-MM-DD HH:mm"
                          v-decorator="decorator.range" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary"
                    html-type="submit">提交</a-button>
          <a-button @click="onEcho"
                    style="margin-left: 12px;">回显</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import { mapState } from 'vuex'
import decorator from './decorator'
import GlobalMixin from '@/mixins/global'
moment.locale('zh-cn')
export default {
  name: 'DemoForm', // 表单
  mixins: [GlobalMixin],
  data () {
    return {
      value: [],
      form: this.$form.createForm(this),
      decorator: Object.freeze(decorator)
    }
  },
  computed: {
    ...mapState({
      approvalDict: state => state.dict.approvalState
    })
  },
  beforeMount () {
    // 获取字典项
    this.$store.dispatch('dict/fetchDict', 'approvalState')
  },
  methods: {
    // 回显
    onEcho () {
      const values = {
        email: '970426404@qq.com',
        password: '123456',
        select: '0',
        time: '2020-1-1',
        range: ['2020-1-1', '2020-2-12']
      }
      this._setFieldsValue(this.form, values, {
        time: 'Moment',
        range: 'Moment'
      })
    },
    // 提交
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          let values = this._getFieldsValue(this.form)
          console.log(values)
        }
      })
    }
  }
}
</script>

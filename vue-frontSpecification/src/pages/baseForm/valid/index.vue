<template>
  <div class="container">
    <div class="demo">
      <!-- 配置 -->
      <div class="form-config">
        <a-form>
          <a-form-item v-bind="formItemLayout1"
                       :label-col="formItemLayout1.labelCol"
                       :wrapper-col="formItemLayout1.wrapperCol"
                       label="提示位置：">
            <a-radio-group v-model="tipsPos">
              <a-col :span="24">
                <a-radio value="bottom">元素底部</a-radio>
              </a-col>
              <a-col :span="24">
                <a-radio value="bottomFocus">元素底部-focus</a-radio>
              </a-col>
              <a-col :span="24">
                <a-radio value="rightFocus">元素右部-focus</a-radio>
              </a-col>
              <a-col :span="24">
                <a-radio value="center">系统提示</a-radio>
              </a-col>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-bind="formItemLayout1"
                       :label-col="formItemLayout1.labelCol"
                       :wrapper-col="formItemLayout1.wrapperCol"
                       label="校验方式：">
            <a-radio-group v-model="tipsType">
              <a-col :span="24">
                <a-radio value="1">逐字段校验</a-radio>
              </a-col>
              <a-col :span="24">
                <a-radio value="2">全部字段校验</a-radio>
              </a-col>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-bind="formItemLayout1"
                       :label-col="formItemLayout1.labelCol"
                       :wrapper-col="formItemLayout1.wrapperCol"
                       label="实时校验：">
            <a-radio-group v-model="tipsTrigger">
              <a-col :span="24">
                <a-radio value="1">是</a-radio>
              </a-col>
              <a-col :span="24">
                <a-radio value="0">否</a-radio>
              </a-col>
            </a-radio-group>
          </a-form-item>
          <div class="btn-wrap">
            <a-button type="primary"
                      @click="validHandle">配置完成</a-button>
          </div>
        </a-form>
      </div>
      <!-- 表单demo -->
      <div class="form">
        <a-form :form="form">
          <a-form-item :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol"
                       label="输入框">
            <a-input v-validator="valid.input"
                     v-decorator="['input']"
                     placeholder="请输入手机号码" />
          </a-form-item>
          <a-form-item :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol"
                       label="多行输入">
            <a-textarea v-validator="valid.textarea"
                        v-decorator="['textarea']"
                        :rows="4" />
          </a-form-item>
          <a-form-item :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol"
                       label="下拉框">
            <a-select v-validator="valid.select"
                      v-decorator="['select']">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="1">测试-1</a-select-option>
              <a-select-option value="2">测试-2</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol"
                       label="建议框">
            <a-select v-validator="valid.selectSearch"
                      v-decorator="['selectSearch']"
                      showSearch
                      placeholder="请选择"
                      optionFilterProp="children"
                      style="width: 200px"
                      @focus="handleFocus"
                      @blur="handleBlur"
                      @change="handleChange"
                      :filterOption="filterOption">
              <a-select-option value="">请选择</a-select-option>
              <a-select-option value="1">测试-1</a-select-option>
              <a-select-option value="2">测试-2</a-select-option>
              <a-select-option value="3">测试-3</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-bind="formItemLayout"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol"
                       label="下拉树">
            <a-tree-select v-validator="valid.tree"
                           v-decorator="['tree']"
                           style="width: 300px"
                           :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }"
                           :treeData="treeData"
                           placeholder="请选择"
                           treeDefaultExpandAll
                           allowClear>
              <span style="color: #08c"
                    slot="title"
                    slot-scope="{key, value}"
                    v-if="key='0-0-1'">
                {{value}}
              </span>
            </a-tree-select>
          </a-form-item>
          <a-form-item v-bind="formItemLayout"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol"
                       label="日期选择">
            <a-range-picker v-validator="valid.rangeTimePicker"
                            v-decorator="['rangeTimePicker', rangeConfig]"
                            show-time
                            format="YYYY-MM-DD HH:mm:ss" />
          </a-form-item>
          <a-form-item v-bind="formItemLayout"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol"
                       label="单选">
            <a-radio-group v-validator="valid.radioGroup"
                           v-decorator="['radioGroup']"
                           name="radioGroup">
              <a-col :span="4">
                <a-radio :value="1">A</a-radio>
              </a-col>
              <a-col :span="4">
                <a-radio :value="2">B</a-radio>
              </a-col>
              <a-col :span="4">
                <a-radio :value="3">C</a-radio>
              </a-col>
              <a-col :span="4">
                <a-radio :value="4">D</a-radio>
              </a-col>
            </a-radio-group>
          </a-form-item>
          <a-form-item v-bind="formItemLayout"
                       :label-col="formItemLayout.labelCol"
                       :wrapper-col="formItemLayout.wrapperCol"
                       label="单选">
            <a-checkbox-group v-validator="valid.checkboxGroup"
                              v-decorator="['checkboxGroup']"
                              @change="onChange">
              <a-row>
                <a-col :span="4">
                  <a-checkbox value="A">A</a-checkbox>
                </a-col>
                <a-col :span="4">
                  <a-checkbox value="B">B</a-checkbox>
                </a-col>
                <a-col :span="4">
                  <a-checkbox value="C">C</a-checkbox>
                </a-col>
              </a-row>
            </a-checkbox-group>
          </a-form-item>
        </a-form>
      </div>
    </div>
    <a-card title="API">
      <a-table :columns="columns"
               :dataSource="data"
               :pagination="false"
               bordered
               rowKey='id'></a-table>
    </a-card>
    <a-card title="使用">
      <p>
        1: 请在需要校验的表单组件集合外面包裹a-form，并声明form，
        请在表单组件声明：v-validator 、v-decorator，分别对应校验配置项和表单获取值。
        eg:v-validator="valid.age" v-decorator="['age']"
      </p>
      <a-divider />
      <p>
        1:支持check自定义函数，请返回具体的msg。
        eg：'校验出错了'
      </p>
      <a-divider />
    </a-card>
    <a-divider />
  </div>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 2 },
  wrapperCol: { span: 18 }
}
const formItemLayout1 = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}
const columns = [{
  title: '参数',
  dataIndex: 'parameter'
},
{
  title: '说明',
  dataIndex: 'intro'
},
{
  title: '类型',
  dataIndex: 'type',
  className: 'type-style'
},
{
  title: '默认值',
  dataIndex: 'default'
}
]
const data = [{
  id: '1',
  parameter: 'position',
  intro: '提示位置( bottom || bottomFocus || rightFocus || center)',
  type: 'string',
  default: 'bottom'
},
{
  id: '2',
  parameter: 'checkAll',
  intro: '校验方式',
  type: 'boolean',
  default: 'false'
},
{
  id: '3',
  parameter: 'changedFields',
  intro: '校验字段',
  type: 'string',
  default: ''
}
]
const treeData = [{
  title: '节点1',
  value: '0-0',
  key: '0-0',
  children: [{
    title: '节点1-1',
    value: '节点1-1',
    key: '0-0-1',
    scopedSlots: {
      title: 'title'
    }
  },
  {
    title: '节点1-2',
    value: '0-0-2',
    key: '0-0-2'
  }
  ]
},
{
  title: '节点2',
  value: '0-2',
  key: '0-2'
}
]

let valid = {
  input: {
    required: true,
    type: 'string',
    min: 10,
    max: 20,
    // pattern: /^1(3|4|5|6|7|8|9)\d{9}$/,
    check: function (value) {
      // todo
      // return '验证不通过';
    }
  },
  textarea: {
    required: true,
    min: 5
  },
  select: {
    required: true
  },
  selectSearch: {
    required: true
  },
  tree: {
    required: true
  },
  rangeTimePicker: {
    required: true
  },
  radioGroup: {
    required: true
  },
  checkboxGroup: {
    required: true
  }
}
export default {
  name: 'HelloWorld',
  data () {
    return {
      input: '',
      /* textarea: '', */
      formItemLayout: formItemLayout,
      formItemLayout1: formItemLayout1,

      rangeConfig: {
        //  rules: [{ type: 'array', required: true, message: 'Please select time!' }],
      },

      value: '请选择',
      treeData: treeData,
      configForm: this.$form.createForm(this),
      tipsPos: 'bottom',
      tipsType: '1',
      tipsTrigger: '0',
      columns: columns,
      data: data,

      // 校验
      form: null,
      // form:this.$form.createForm(this),
      valid: valid
    }
  },
  methods: {
    validHandle () {
      let self = this

      // 获取配置
      let position = this.tipsPos
      let checkAll = this.tipsType !== '1'
      let tipstrigger = this.tipsTrigger === '1'

      // if (!this.form) {
      this.form = this.$form.createForm(this, {
        onFieldsChange: (vnode, changedFields) => {
          if (!tipstrigger) {
            // 值改变的时候清除提示信息--- 实时校验为false的时候执行
            self.$valid.clearTips(changedFields)
          } else {
            // 实时校验方法 || 校验某个单独字段方法--- 实时校验为true的时候执行
            this.$valid.validSingleField({
              ctx: this,
              changedFields: changedFields, // 校验字段
              position: position // bottom || bottomFocus || rightFocus || center
            })
          }
        }
      })
      // }

      // 点击提交进行校验--- 实时校验为false的时候执行
      if (!tipstrigger) {
        let checkResult = this.$valid.checkForm({
          ctx: this,
          checkAll: checkAll, // 是否全部校验， true || false
          position: position // bottom || bottomFocus || rightFocus || center
        })
        if (checkResult) {
          this.$message.success('恭喜你，校验成功')
        }
      }
    },

    onChange (checkedValues) {
      console.log('checked = ', checkedValues)
    },

    handleChange (value) {
      console.log(`selected ${value}`)
    },
    handleBlur () {
      console.log('blur')
    },
    handleFocus () {
      console.log('focus')
    },
    filterOption (input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    }
  },
  watch: {
    form: function (value) {
      this.value = value
    }
  }
}

</script>
<style>
.ant-select,
.ant-calendar-picker,
.ant-radio-group,
.ant-checkbox-group {
  width: 100% !important;
}

/* 下方文字提示 */
.tips-bottom {
  color: #f5222d;
  margin-bottom: -1px;
  clear: both;
  min-height: 22px;
  margin-top: -2px;
  line-height: 1.5;
  /* transition:color 1.5s ; */
}

/* 下方focus提示 */
.tips-focus {
  position: absolute;
  z-index: 1001;
  background: #fff;
  line-height: 21px;
  /*  height: 30px; */
}

.tips-arrow-wrap {
  display: inline-block;
  /*  margin-top: 10px; */
  position: relative;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
}

.tips-focus .tips-arrow-wrap .arrow-a {
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  border: 8px dashed transparent;
}

.tips-focus .tips-arrow-wrap .arrow-b {
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
  border: 8px dashed transparent;
}

.tips-bottom-focus .tips-arrow-wrap .arrow-a {
  left: 15px;
  top: -16px;
  border-bottom: 8px solid #7c7c7c;
}

.tips-bottom-focus .tips-arrow-wrap .arrow-b {
  left: 15px;
  top: -15px;
  border-bottom: 8px solid #fff;
}

.tips-arrow-wrap .tips-text {
  display: inline-block;
  border: 1px solid #7c7c7c;
  min-width: 54px;
  padding: 4px 8px;
  border-radius: 5px;
  color: #333;
  /* line-height: 22px; */
}

/* 右方focus 提示 */
.tips-right-focus .tips-arrow-wrap .arrow-a {
  left: -16px;
  top: 8px;
  border-right: 8px solid #7c7c7c;
}

.tips-right-focus .tips-arrow-wrap .arrow-b {
  top: 8px;
  left: -15px;
  border-right: 8px solid #fff;
}

.ant-form-item-children {
  line-height: 40px;
}
</style>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
/* demo样式 */
.demo {
  position: relative;
  min-height: 500px;
  padding: 20px;
  overflow: hidden;
  background: #fff;
}

.form-config {
  position: absolute;
  top: 20px;
  bottom: 20px;
  padding: 20px;
  width: 20%;
  float: left;
  border: 1px solid #ebedf0;
  box-shadow: 1px 1px 8px 1px #e3dfdf;
}

.form {
  height: 100%;
  padding-top: 20px;
  width: 78%;
  float: right;
  border: 1px solid #ebedf0;
  box-shadow: 1px 1px 8px 1px #e3dfdf;
}

.btn-wrap {
  text-align: center;
}

.container >>> .ant-card {
  margin-bottom: 10px;
}
</style>

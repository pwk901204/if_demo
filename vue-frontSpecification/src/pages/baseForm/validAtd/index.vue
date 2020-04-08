<template>
  <div>
    <!-- 表单联动 start -->
    <a-row class="flexBtweetn">
      <a-col :span="12"
             class="equlHeight">
        <a-card class="card"
                title="表单联动"
                :bordered="false">
          <a-form :form="form"
                  @submit="handleSubmit">

            <a-form-item label="Note">
              <a-input v-decorator="['note', { rules: [{ required: true, message: 'Please input your note!' }] }]" />
            </a-form-item>
            <a-form-item label="Gender">
              <a-select v-decorator="[
                            'gender',{ rules: [{ required: true, message: 'Please select your gender!' }] },
                            ]"
                        placeholder="Select a option and change input text above"
                        @change="handleSelectChange">
                <a-select-option value="male">
                  male
                </a-select-option>
                <a-select-option value="female">
                  female
                </a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item class="center"
                         :colon=false>
              <a-button type="primary"
                        html-type="submit"
                        style="margin-left:0px">
                Submit
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <!-- 表单联动 end-->
      <!-- 动态改变校验 start -->
      <a-col :span="12"
             class="equlHeight">
        <a-card class="card"
                title="动态改变校验"
                :bordered="false">
          <a-form :form="form2">
            <a-form-item label="Name">
              <a-input v-decorator="['username',
                      { rules: [{ required: true, message: 'Please input your name' }] },
                    ]"
                       placeholder="Please input your name" />
            </a-form-item>
            <a-form-item label="Nickname">
              <a-input v-decorator="[
                          'nickname',
                          { rules: [{ required: checkNick, message: 'Please input your nickname' }] },
                        ]"
                       placeholder="Please input your nickname" />
            </a-form-item>
            <a-form-item class="checkbox">
              <a-checkbox :checked="checkNick"
                          @change="handleChange">
                Nickname is required
              </a-checkbox>
            </a-form-item>
            <a-form-item class="center"
                         :colon=false>
              <a-button type="primary"
                        style="margin-left:0px"
                        @click="check2">
                Check
              </a-button>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <!-- 动态改变校验 end-->
    </a-row>

    <!-- 自定义表单控件校验 start -->
    <a-card class="card"
            title="自定义表单控件校验"
            :bordered="false">
      <a-form layout="inline"
              :form="form3"
              @submit="handleSubmit3">
        <a-form-item label="Price">
          <price-input v-decorator="[
                      'price',
                      {
                        initialValue: { number: 0, currency: 'rmb' },
                        rules: [{ validator: checkPrice }],
                      },
                    ]" />
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
          <a-button type="primary"
                    html-type="submit">
            Submit
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 自定义表单控件校验 end-->
    <!-- 弹出层结合表单校验 start -->
    <a-card class="card"
            title="弹出层结合表单校验"
            :bordered="false">
      <div>
        <a-button type="primary"
                  @click="showModal">
          New Collection
        </a-button>
        <collection-create-form ref="collectionForm"
                                :visible="visible"
                                @cancel="handleCancel"
                                @create="handleCreate" />
      </div>
    </a-card>
    <!-- 弹出层结合表单校验 end-->
    <!-- 综合demo（注册） start -->
    <a-card class="card"
            title="综合demo（注册）"
            :bordered="false">
      <a-form :form="form5"
              @submit="handleSubmit5">
        <a-form-item v-bind="formItemLayout"
                     label="E-mail">
          <a-input v-decorator="[
                          'email',
                          {
                            rules: [
                              {
                                type: 'email',
                                message: 'The input is not valid E-mail!',
                              },
                              {
                                required: true,
                                message: 'Please input your E-mail!',
                              },
                            ],
                          },
                        ]" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout"
                     label="Password">
          <a-input v-decorator="[
                          'password',
                          {
                            rules: [
                              {
                                required: true,
                                message: 'Please input your password!',
                              },
                              {
                                validator: validateToNextPassword,
                              },
                            ],
                          },
                        ]"
                   type="password" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout"
                     label="Confirm Password">
          <a-input v-decorator="[
                          'confirm',
                          {
                            rules: [
                              {
                                required: true,
                                message: 'Please confirm your password!',
                              },
                              {
                                validator: compareToFirstPassword,
                              },
                            ],
                          },
                        ]"
                   type="password"
                   @blur="handleConfirmBlur" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout">
          <span slot="label">
            Nickname&nbsp;
            <a-tooltip title="What do you want others to call you?">
              <a-icon type="question-circle-o" />
            </a-tooltip>
          </span>
          <a-input v-decorator="[
                          'nickname',
                          {
                            rules: [{ required: true, message: 'Please input your nickname!', whitespace: true }],
                          },
                        ]" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout"
                     label="Habitual Residence">
          <a-cascader v-decorator="[
                          'residence',
                          {
                            initialValue: ['zhejiang', 'hangzhou', 'xihu'],
                            rules: [
                              { type: 'array', required: true, message: 'Please select your habitual residence!' },
                            ],
                          },
                        ]"
                      :options="residences" />
        </a-form-item>
        <a-form-item v-bind="formItemLayout"
                     label="Phone Number">
          <a-input v-decorator="[
                          'phone',
                          {
                            rules: [{ required: true, message: 'Please input your phone number!' }],
                          },
                        ]"
                   style="width: 100%">
            <a-select slot="addonBefore"
                      v-decorator="['prefix', { initialValue: '86' }]"
                      style="width: 70px">
              <a-select-option value="86">
                +86
              </a-select-option>
              <a-select-option value="87">
                +87
              </a-select-option>
            </a-select>
          </a-input>
        </a-form-item>
        <a-form-item v-bind="formItemLayout"
                     label="Website">
          <a-auto-complete v-decorator="['website', { rules: [{ required: true, message: 'Please input website!' }] }]"
                           placeholder="website"
                           @change="handleWebsiteChange">
            <template slot="dataSource">
              <a-select-option v-for="website in autoCompleteResult"
                               :key="website">
                {{ website }}
              </a-select-option>
            </template>
            <a-input />
          </a-auto-complete>
        </a-form-item>
        <a-form-item v-bind="formItemLayout"
                     label="Captcha"
                     extra="We must make sure that your are a human.">
          <a-row :gutter="8">
            <a-col :span="12">
              <a-input v-decorator="[
                                  'captcha',
                                  { rules: [{ required: true, message: 'Please input the captcha you got!' }] },
                                ]" />
            </a-col>
            <a-col :span="12">
              <a-button>Get captcha</a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout">
          <a-checkbox v-decorator="['agreement', { valuePropName: 'checked' }]">
            I have read the
            <a href="">
              agreement
            </a>
          </a-checkbox>
        </a-form-item>
        <a-form-item v-bind="tailFormItemLayout">
          <a-button type="primary"
                    html-type="submit"
                    style="margin-left:0px">
            Register
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
    <!-- 综合demo（注册） end-->
    <!-- <a-card title="valid外部拓展">
        <a-button type="primary" @click="linkHandle">查看</a-button>
    </a-card> -->
    <!-- API start -->
    <a-card title="options 配置 ">
      <table class="ant-table-body">
        <thead class="ant-table-thead">
          <tr>
            <th>参数</th>
            <th>说明</th>
            <th>类型</th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          <tr>
            <td>props</td>
            <td>仅仅支持 Form.create({})(CustomizedForm)的使用方式，父组件需要映射到表单项上的属性声明(和<a href="https://vuejs.org/v2/api/#props">vue 组件 props 一致</a>)
            </td>
            <td>{}</td>
          </tr>
          <tr>
            <td>mapPropsToFields</td>
            <td>把父组件的属性映射到表单项上（如：把 Redux store 中的值读出），需要对返回值中的表单域数据用 <a href="#Form.createFormField"><code>Form.createFormField</code></a>
              标记，如果使用$form.createForm 创建收集器，你可以将任何数据映射到 Field 中，不受父组件约束
            </td>
            <td>(props) =&gt; ({ [fieldName]: FormField { value } })</td>
          </tr>
          <tr>
            <td>name</td>
            <td>设置表单域内字段 id 的前缀</td>
            <td>-</td>
          </tr>
          <tr>
            <td>validateMessages</td>
            <td>默认校验信息，可用于把默认错误信息改为中文等，格式与 <a href="https://github.com/yiminghe/async-validator/blob/master/src/messages.js">newMessages</a> 返回值一致
            </td>
            <td>Object { [nested.path]: String }</td>
          </tr>
          <tr>
            <td>onFieldsChange</td>
            <td>当 <code>Form.Item</code> 子节点的值发生改变时触发，可以把对应的值转存到 Redux store</td>
            <td>Function(props, fields)</td>
          </tr>
          <tr>
            <td>onValuesChange</td>
            <td>任一表单域的值发生改变时的回调</td>
            <td>(props, values) =&gt; void</td>
          </tr>
        </tbody>
      </table>
    </a-card>
    <a-card title="校验规则 ">
      <table class="ant-table-body">
        <thead class="ant-table-thead">
          <tr>
            <th>参数</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          <tr>
            <td>enum</td>
            <td>枚举类型</td>
            <td>string</td>
            <td>-</td>
          </tr>
          <tr>
            <td>len</td>
            <td>字段长度</td>
            <td>number</td>
            <td>-</td>
          </tr>
          <tr>
            <td>max</td>
            <td>最大长度</td>
            <td>number</td>
            <td>-</td>
          </tr>
          <tr>
            <td>message</td>
            <td>校验文案</td>
            <td>string</td>
            <td>-</td>
          </tr>
          <tr>
            <td>min</td>
            <td>最小长度</td>
            <td>number</td>
            <td>-</td>
          </tr>
          <tr>
            <td>pattern</td>
            <td>正则表达式校验</td>
            <td>RegExp</td>
            <td>-</td>
          </tr>
          <tr>
            <td>required</td>
            <td>是否必选</td>
            <td>boolean</td>
            <td><code>false</code></td>
          </tr>
          <tr>
            <td>transform</td>
            <td>校验前转换字段值</td>
            <td>function(value) =&gt; transformedValue:any</td>
            <td>-</td>
          </tr>
          <tr>
            <td>type</td>
            <td>内建校验类型，<a href="https://github.com/yiminghe/async-validator#type">可选项</a></td>
            <td>string</td>
            <td>'string'</td>
          </tr>
          <tr>
            <td>validator</td>
            <td>自定义校验（注意，<a href="https://github.com/ant-design/ant-design/issues/5155">callback 必须被调用</a>）</td>
            <td>function(rule, value, callback)</td>
            <td>-</td>
          </tr>
          <tr>
            <td>whitespace</td>
            <td>必选时，空格是否会被视为错误</td>
            <td>boolean</td>
            <td><code>false</code></td>
          </tr>
        </tbody>
      </table>
    </a-card>
    <a-card title="方法 ">
      <table class="ant-table-body">
        <thead class="ant-table-thead">
          <tr>
            <th>方法</th>
            <th>说明</th>
            <th>类型</th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          <tr>
            <td>getFieldDecorator</td>
            <td>用于和表单进行双向绑定，单文件 template 可以使用指令<code>v-decorator</code>进行绑定，详见下方描述</td>
            <td></td>
          </tr>
          <tr>
            <td>getFieldError</td>
            <td>获取某个输入控件的 Error</td>
            <td>Function(name)</td>
          </tr>
          <tr>
            <td>getFieldsError</td>
            <td>获取一组输入控件的 Error ，如不传入参数，则获取全部组件的 Error</td>
            <td>Function([names: string[]])</td>
          </tr>
          <tr>
            <td>getFieldsValue</td>
            <td>获取一组输入控件的值，如不传入参数，则获取全部组件的值</td>
            <td>Function([fieldNames: string[]])</td>
          </tr>
          <tr>
            <td>getFieldValue</td>
            <td>获取一个输入控件的值</td>
            <td>Function(fieldName: string)</td>
          </tr>
          <tr>
            <td>isFieldsTouched</td>
            <td>判断是否任一输入控件经历过 <code>getFieldDecorator</code> 或 <code>v-decorator</code>
              的值收集时机 <code>options.trigger</code></td>
            <td>(names?: string[]) =&gt; boolean</td>
          </tr>
          <tr>
            <td>isFieldTouched</td>
            <td>判断一个输入控件是否经历过 <code>getFieldDecorator</code> 或 <code>v-decorator</code>
              的值收集时机 <code>options.trigger</code></td>
            <td>(name: string) =&gt; boolean</td>
          </tr>
          <tr>
            <td>isFieldValidating</td>
            <td>判断一个输入控件是否在校验状态</td>
            <td>Function(name)</td>
          </tr>
          <tr>
            <td>resetFields</td>
            <td>重置一组输入控件的值（为 <code>initialValue</code>）与状态，如不传入参数，则重置所有组件</td>
            <td>Function([names: string[]])</td>
          </tr>
          <tr>
            <td>setFields</td>
            <td>设置一组输入控件的值与错误状态。</td>
            <td>Function({ [fieldName]: { value: any, errors: [Error] } })</td>
          </tr>
          <tr>
            <td>setFieldsValue</td>
            <td>设置一组输入控件的值</td>
            <td>Function({ [fieldName]: value })</td>
          </tr>
          <tr>
            <td>validateFields</td>
            <td>校验并获取一组输入域的值与 Error，若 fieldNames 参数为空，则校验全部组件</td>
            <td>Function([fieldNames: string[]], [options: object], callback: Function(errors, values))</td>
          </tr>
          <tr>
            <td>validateFieldsAndScroll</td>
            <td>与 <code>validateFields</code> 相似，但校验完后，如果校验不通过的菜单域不在可见范围内，则自动滚动进可见范围</td>
            <td>参考 <code>validateFields</code></td>
          </tr>
        </tbody>
      </table>
    </a-card>
    <!-- API end-->
  </div>
</template>
<script>
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8 }
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 8, offset: 4 }
}
const hasProp = (instance, prop) => {
  const $options = instance.$options || {}
  const propsData = $options.propsData || {}
  return prop in propsData
}
const PriceInput = {
  props: ['value'],
  template: `
    <span>
      <a-input
        type='text'
        :value="number"
        @change="handleNumberChange"
        style="width: 63%; margin-right: 2%;"
      />
      <a-select
        :value="currency"
        style="width: 32%"
        @change="handleCurrencyChange"
      >
        <a-select-option value='rmb'>RMB</a-select-option>
        <a-select-option value='dollar'>Dollar</a-select-option>
      </a-select>
    </span>
  `,
  data () {
    const value = this.value || {}
    return {
      number: value.number || 0,
      currency: value.currency || 'rmb'
    }
  },
  watch: {
    value (val = {}) {
      this.number = val.number || 0
      this.currency = val.currency || 'rmb'
    }
  },
  methods: {
    handleNumberChange (e) {
      const number = parseInt(e.target.value || 0, 10)
      if (isNaN(number)) {
        return
      }
      if (!hasProp(this, 'value')) {
        this.number = number
      }
      this.triggerChange({ number })
    },
    handleCurrencyChange (currency) {
      if (!hasProp(this, 'value')) {
        this.currency = currency
      }
      this.triggerChange({ currency })
    },
    triggerChange (changedValue) {
      // Should provide an event to pass value to Form.
      this.$emit('change', Object.assign({}, this.$data, changedValue))
    }
  }
}
const CollectionCreateForm = {
  props: ['visible'],
  beforeCreate () {
    this.form = this.$form.createForm(this, { name: 'form_in_modal' })
  },
  template: `
    <a-modal
      :visible="visible"
      title='Create a new collection'
      okText='Create'
      @cancel="() => { $emit('cancel') }"
      @ok="() => { $emit('create') }"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item label='Title'>
          <a-input
            v-decorator="[
              'title',
              {
                rules: [{ required: true, message: 'Please input the title of collection!' }],
              }
            ]"
          />
        </a-form-item>
        <a-form-item label='Description'>
          <a-input
            type='textarea'
            v-decorator="['description']"
          />
        </a-form-item>
        <a-form-item class='collection-create-form_last-form-item'>
          <a-radio-group
            v-decorator="[
              'modifier',
              {
                initialValue: 'private',
              }
            ]"
          >
              <a-radio value='public'>Public</a-radio>
              <a-radio value='private'>Private</a-radio>
            </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  `
}
const residences = [{
  value: 'zhejiang',
  label: 'Zhejiang',
  children: [{
    value: 'hangzhou',
    label: 'Hangzhou',
    children: [{
      value: 'xihu',
      label: 'West Lake'
    }]
  }]
},
{
  value: 'jiangsu',
  label: 'Jiangsu',
  children: [{
    value: 'nanjing',
    label: 'Nanjing',
    children: [{
      value: 'zhonghuamen',
      label: 'Zhong Hua Men'
    }]
  }]
}
]
export default {
  components: {
    PriceInput,
    CollectionCreateForm
  },
  beforeCreate () {
    this.form3 = this.$form.createForm(this, { name: 'customized_form_controls' })
    this.form5 = this.$form.createForm(this, { name: 'register' })
  },
  data () {
    const value = this.value || {}
    return {
      // demo1
      formLayout: 'horizontal',
      form: this.$form.createForm(this, { name: 'coordinated' }),

      hasErrors (fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field])
      },

      // demo2
      checkNick: false,
      formItemLayout,
      formTailLayout,
      form2: this.$form.createForm(this, { name: 'dynamic_rule' }),

      // demo3
      number: value.number || 0,
      currency: value.currency || 'rmb',

      // demo4
      visible: false,

      // demo5
      confirmDirty: false,
      residences,
      autoCompleteResult: [],
      /* formItemLayout: {
       labelCol: {
       xs: { span: 24 },
       sm: { span: 8 },
       },
       wrapperCol: {
       xs: { span: 24 },
       sm: { span: 16 },
       },
       }, */
      tailFormItemLayout: {
        wrapperCol: {
          xs: {
            span: 24,
            offset: 0
          },
          sm: {
            span: 16,
            offset: 4
          }
        }
      }
    }
  },

  methods: {
    linkHandle () {
      this.$router.push({ path: '/pages/valid' })
    },

    // demo1
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleSelectChange (value) {
      console.log(value)
      this.form.setFieldsValue({
        note: `Hi, ${value === 'male' ? 'man' : 'lady'}!`
      })
    },

    // demo2
    check2 () {
      this.form2.validateFields(err => {
        if (!err) {
          console.info('success')
        }
      })
    },
    handleChange (e) {
      this.checkNick = e.target.checked
      this.$nextTick(() => {
        this.form2.validateFields(['nickname'], { force: true })
      })
    },

    // demo3
    handleSubmit3 (e) {
      e.preventDefault()
      this.form3.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    checkPrice (rule, value, callback) {
      if (value.number > 0) {
        callback()
      }
      callback('Price must greater than zero!')
    },

    // demo4
    showModal () {
      this.visible = true
    },
    handleCancel () {
      this.visible = false
    },
    handleCreate () {
      const form = this.$refs.collectionForm.form
      form.validateFields((err, values) => {
        if (err) {
          return
        }
        console.log('Received values of form: ', values)
        form.resetFields()
        this.visible = false
      })
    },

    // demo5
    handleSubmit5 (e) {
      e.preventDefault()
      this.form5.validateFieldsAndScroll((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    handleConfirmBlur (e) {
      const value = e.target.value
      this.confirmDirty = this.confirmDirty || !!value
    },
    compareToFirstPassword (rule, value, callback) {
      const form = this.form5
      if (value && value !== form.getFieldValue('password')) {
        // callback('Two passwords that you enter is inconsistent!')
      } else {
        callback()
      }
    },
    validateToNextPassword (rule, value, callback) {
      const form = this.form5
      if (value && this.confirmDirty) {
        form.validateFields(['confirm'], { force: true })
      }
      callback()
    },
    handleWebsiteChange (value) {
      let autoCompleteResult
      if (!value) {
        autoCompleteResult = []
      } else {
        autoCompleteResult = ['.com', '.org', '.net'].map(domain => `${value}${domain}`)
      }
      this.autoCompleteResult = autoCompleteResult
    }
  },

  watch: {
    value (val = {}) {
      this.number = val.number || 0
      this.currency = val.currency || 'rmb'
    }
  },

  mounted () {
  }
}

</script>
<style lang="less" scoped>
.card {
  margin-bottom: 24px;
  padding: 0 20px;

  /deep/ .ant-card-head {
    padding-left: 0;
    .ant-card-head-title {
      position: relative;
      padding: 13px 0 13px 10px;

      &:before {
        content: "";
        position: absolute;
        left: 0;
        top: 16px;
        width: 3px;
        height: 17px;
        border-radius: 2px;
        background: #44aeff;
      }
    }
  }

  /deep/ .ant-card-body {
    padding: 17px 0 20px;

    .ant-form-item {
      margin-bottom: 10px;

      &.checkbox {
        margin-bottom: 4px;

        .ant-form-item-control {
          line-height: inherit;
        }
      }
    }

    .ant-btn {
      margin: 0;
    }
  }
}

.card,
.ant-card {
  margin-bottom: 10px;
}

.model {
  padding: 10px;
  background: #fff;
}

.ant-table-body {
  width: 100%;
}

.ant-btn {
  margin: 10px 15px;
}

.model .ant-card {
  margin-bottom: 10px;
}

table th,
table td {
  border-right: 1px solid #e8e8e8;
}

table {
  border: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.ant-table-thead > tr > th {
  background: #fafafa;
}
</style>

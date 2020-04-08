<template>
  <div class="page-form">
    <a-card title="1.基本用法,简单的checkbox">
      <a-checkbox @change="onChange">Checkbox</a-checkbox>
    </a-card>
    <a-card title="2.全选,在实现全选效果时，你可能会用到indeterminate属性">
      <div>
        <div :style="{ borderBottom: '1px solid #E9E9E9' }">
          <a-checkbox :indeterminate="indeterminate"
                      @change="onCheckAllChange2"
                      :checked="checkAll">
            Check all
          </a-checkbox>
        </div>
        <br />
        <a-checkbox-group :options="plainOptions"
                          v-model="checkedList"
                          @change="onChange2" />
      </div>
    </a-card>
    <a-card title="3.不可用,checkbox 不可用">
      <div>
        <a-checkbox :defaultChecked="false"
                    disabled />
        <br />
        <a-checkbox defaultChecked
                    disabled />
      </div>
    </a-card>
    <a-card title="4.受控的checkbox,联动checkbox">
      <div>
        <p :style="{ marginBottom: '20px' }">
          <a-checkbox :checked="checked"
                      :disabled="disabled"
                      @change="onChange3">
            {{label}}
          </a-checkbox>
        </p>
        <p>
          <a-button type="primary"
                    size="small"
                    @click="toggleChecked">
            {{!checked ? 'Check' : 'Uncheck'}}
          </a-button>
          <a-button :style="{ marginLeft: '10px' }"
                    type="primary"
                    size="small"
                    @click="toggleDisable">
            {{!disabled ? 'Disable' : 'Enable'}}
          </a-button>
        </p>
      </div>
    </a-card>
    <a-card title="5.Checkbox组,方便的从数组生成checkbox">
      <div>
        <a-checkbox-group :options="plainOptions"
                          v-model="value"
                          @change="onChange" />
        <br />
        <a-checkbox-group :options="plainOptions"
                          :defaultValue="['Apple']"
                          @change="onChange" />
        <br />
        <a-checkbox-group :options="options"
                          :value="['Pear']"
                          @change="onChange" />
        <br />
        <a-checkbox-group :options="optionsWithDisabled"
                          disabled
                          :defaultValue="['Apple']"
                          @change="onChange4">
          <span style="color: red"
                slot="label"
                slot-scope="{value}">{{value}}</span>
        </a-checkbox-group>
      </div>
    </a-card>
    <a-card title="6.布局,Checkbox.Group内嵌Checkbox并与Grid组件一起使用，可以实现灵活的布局">
      <a-checkbox-group @change="onChange5">
        <a-row>
          <a-col :span="8">
            <a-checkbox value="A">A</a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="B">B</a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="C">C</a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="D">D</a-checkbox>
          </a-col>
          <a-col :span="8">
            <a-checkbox value="E">E</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </a-card>
    <a-card title="API">
      <a-table :columns="columns"
               :dataSource="data"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="事件">
      <a-table :columns="columnsEvent"
               :dataSource="dataEvent"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="Checkbox Group">
      <a-table :columns="columnsGroup"
               :dataSource="dataGroup"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="事件">
      <a-table :columns="columnsButtonEvent"
               :dataSource="dataButtonEvent"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="方法 Checkbox">
      <a-table :columns="columnsCheckboxEvent"
               :dataSource="dataCheckboxEvent"
               :pagination="false"
               bordered></a-table>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
const plainOptions = ['Apple', 'Pear', 'Orange']
const defaultCheckedList = ['Apple', 'Orange']
const options = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' }
]
const optionsWithDisabled = [
  { value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange', disabled: false }
]
export default {
  name: 'DemoDropdown', // 表单
  mixins: [GlobalMixin],
  data () {
    return {
      options,
      optionsWithDisabled,
      value: [],
      checked: true,
      disabled: false,
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      plainOptions,
      columns: [{
        title: '参数',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '类型',
        dataIndex: 'type'
      },
      {
        title: '默认值',
        dataIndex: 'default'
      }],
      columnsEvent: [{
        title: '事件名称',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '回调参数',
        dataIndex: 'callback'
      }],
      columnsGroup: [{
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
      }],
      columnsButtonEvent: [{
        title: '事件名称',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '回调参数',
        dataIndex: 'callback'
      }],
      columnsCheckboxEvent: [{
        title: '名称',
        dataIndex: 'parameter'
      },
      {
        title: '描述',
        dataIndex: 'intro'
      }],
      data: [{
        parameter: 'autoFocus',
        intro: '自动获取焦点',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'checked',
        intro: '指定当前是否选中',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'defaultChecked',
        intro: '初始是否选中',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'disabled',
        intro: '失效状态',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'indeterminate',
        intro: '设置 indeterminate 状态，只负责样式控制',
        type: 'boolean',
        default: 'false'
      }],
      dataEvent: [{
        parameter: 'change',
        intro: '变化时回调函数',
        callback: 'Function(e:Event)'
      }],
      dataGroup: [{
        parameter: 'defaultValue',
        intro: '默认选中的选项',
        type: 'string[]',
        default: '[]'
      }, {
        parameter: 'disabled',
        intro: '整组失效',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'options',
        intro: '指定可选项，可以通过 slot="label" slot-scope="option" 定制label',
        type: 'string[] | Array<{ label: string value: string disabled?: boolean, onChange?: function }>',
        default: '[]'
      }, {
        parameter: 'value',
        intro: '指定选中的选项',
        type: 'string[]',
        default: '[]'
      }],
      dataButtonEvent: [{
        parameter: 'change',
        intro: '变化时回调函数',
        callback: 'Function(checkedValue)'
      }],
      dataCheckboxEvent: [{
        parameter: 'blur()',
        intro: '移除焦点'
      }, {
        parameter: 'focus()',
        intro: '获取焦点'
      }]
    }
  },
  computed: {
    label () {
      const { checked, disabled } = this
      return `${checked ? 'Checked' : 'Unchecked'}-${disabled ? 'Disabled' : 'Enabled'}`
    }
  },
  mounted () { },
  methods: {
    onChange (e) {
      console.log(`checked = ${e.target.checked}`)
    },
    onChange2 (checkedList) {
      this.indeterminate = !!checkedList.length && checkedList.length < plainOptions.length
      this.checkAll = checkedList.length === plainOptions.length
    },
    onCheckAllChange2 (e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      })
    },
    toggleChecked () {
      this.checked = !this.checked
    },
    toggleDisable () {
      this.disabled = !this.disabled
    },
    onChange3 (e) {
      this.checked = e.target.checked
    },
    onChange4 (checkedValues) {
      console.log('checked = ', checkedValues)
      console.log('value = ', this.value)
    },
    onChange5 (checkedValues) {
      console.log('checked = ', checkedValues)
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>

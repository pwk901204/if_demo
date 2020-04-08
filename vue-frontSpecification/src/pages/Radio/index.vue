<template>
  <div class="page-form">
    <a-card title="1.基本,最简单的用法">
      <a-radio>Radio</a-radio>
    </a-card>
    <a-card title="2.不可用,Radio 不可用">
      <div>
        <a-radio :defaultChecked="false"
                 :disabled="disabled">Disabled</a-radio>
        <br />
        <a-radio defaultChecked
                 :disabled="disabled">Disabled</a-radio>
        <div :style="{ marginTop: 20 }">
          <a-button type="primary"
                    @click="toggleDisabled">
            Toggle disabled
          </a-button>
        </div>
      </div>
    </a-card>
    <a-card title="3.按钮样式,按钮样式的单选组合">
      <div>
        <div>
          <a-radio-group @change="onChange"
                         v-model="value">
            <a-radio-button value="a">Hangzhou</a-radio-button>
            <a-radio-button value="b">Shanghai</a-radio-button>
            <a-radio-button value="c">Beijing</a-radio-button>
            <a-radio-button value="d">Chengdu</a-radio-button>
          </a-radio-group>
        </div>
        <div :style="{ marginTop: '16px' }">
          <a-radio-group @change="onChange"
                         defaultValue="a">
            <a-radio-button value="a">Hangzhou</a-radio-button>
            <a-radio-button value="b"
                            disabled>Shanghai</a-radio-button>
            <a-radio-button value="c">Beijing</a-radio-button>
            <a-radio-button value="d">Chengdu</a-radio-button>
          </a-radio-group>
        </div>
        <div :style="{ marginTop: '16px' }">
          <a-radio-group disabled
                         @change="onChange"
                         defaultValue="a">
            <a-radio-button value="a">Hangzhou</a-radio-button>
            <a-radio-button value="b">Shanghai</a-radio-button>
            <a-radio-button value="c">Beijing</a-radio-button>
            <a-radio-button value="d">Chengdu</a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </a-card>
    <a-card title="4.填底的按钮样式,实色填底的单选按钮样式">
      <div>
        <div>
          <a-radio-group defaultValue="a"
                         buttonStyle="solid">
            <a-radio-button value="a">Hangzhou</a-radio-button>
            <a-radio-button value="b">Shanghai</a-radio-button>
            <a-radio-button value="c">Beijing</a-radio-button>
            <a-radio-button value="d">Chengdu</a-radio-button>
          </a-radio-group>
        </div>
        <div :style="{ marginTop: '16px' }">
          <a-radio-group defaultValue="c"
                         buttonStyle="solid">
            <a-radio-button value="a">Hangzhou</a-radio-button>
            <a-radio-button value="b"
                            disabled>Shanghai</a-radio-button>
            <a-radio-button value="c">Beijing</a-radio-button>
            <a-radio-button value="d">Chengdu</a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </a-card>
    <a-card title="5.RadioGroup 垂直,垂直的 RadioGroup，配合更多输入框选项">
      <a-radio-group @change="onChange4"
                     v-model="value4">
        <a-radio :style="radioStyle"
                 :value="1">Option A</a-radio>
        <a-radio :style="radioStyle"
                 :value="2">Option B</a-radio>
        <a-radio :style="radioStyle"
                 :value="3">Option C</a-radio>
        <a-radio :style="radioStyle"
                 :value="4">
          More...
          <a-input v-if="value4 === 4"
                   :style="{ width: 100, marginLeft: 10 }" />
        </a-radio>
      </a-radio-group>
    </a-card>
    <a-card title="6.RadioGroup 组合 - 配置方式,通过配置 options 参数来渲染单选框">
      <div>
        <a-radio-group :options="plainOptions1"
                       @change="onChange1"
                       :defaultValue="value1" />
        <br />
        <a-radio-group :options="options1"
                       @change="onChange2"
                       v-model="value2" />
        <br />
        <a-radio-group :options="optionsWithDisabled1"
                       disabled
                       @change="onChange3"
                       v-model="value3" />
      </div>
    </a-card>
    <a-card title="7.单选组合 - 配合 name 使用,可以为 RadioGroup 配置 name 参数，为组合内的 input 元素赋予相同的 name 属性，使浏览器把 RadioGroup 下的 Radio 真正看作是一组（例如可以通过方向键始终在同一组内更改选项）">
      <a-radio-group name="radioGroup"
                     :defaultValue="1">
        <a-radio :value="1">A</a-radio>
        <a-radio :value="2">B</a-radio>
        <a-radio :value="3">C</a-radio>
        <a-radio :value="4">D</a-radio>
      </a-radio-group>
    </a-card>
    <a-card title="8.单选组合,一组互斥的 Radio 配合使用">
      <div>
        <a-radio-group @change="onChange6"
                       v-model="value6">
          <a-radio :value="1">A</a-radio>
          <a-radio :value="2">B</a-radio>
          <a-radio :value="3">C</a-radio>
          <a-radio :value="4">D</a-radio>
        </a-radio-group>
      </div>
    </a-card>
    <a-card title="9.大小,大中小三种组合，可以和表单输入框进行对应配合">
      <div>
        <div>
          <a-radio-group defaultValue="a"
                         size="large">
            <a-radio-button value="a">Hangzhou</a-radio-button>
            <a-radio-button value="b">Shanghai</a-radio-button>
            <a-radio-button value="c">Beijing</a-radio-button>
            <a-radio-button value="d">Chengdu</a-radio-button>
          </a-radio-group>
        </div>
        <div :style="{ marginTop: '16px' }">
          <a-radio-group defaultValue="a">
            <a-radio-button value="a">Hangzhou</a-radio-button>
            <a-radio-button value="b">Shanghai</a-radio-button>
            <a-radio-button value="c">Beijing</a-radio-button>
            <a-radio-button value="d">Chengdu</a-radio-button>
          </a-radio-group>
        </div>
        <div :style="{ marginTop: '16px' }">
          <a-radio-group defaultValue="a"
                         size="small">
            <a-radio-button value="a">Hangzhou</a-radio-button>
            <a-radio-button value="b">Shanghai</a-radio-button>
            <a-radio-button value="c">Beijing</a-radio-button>
            <a-radio-button value="d">Chengdu</a-radio-button>
          </a-radio-group>
        </div>
      </div>
    </a-card>
    <a-card title="API">
      <a-table :columns="columns"
               :dataSource="data"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="RadioGroup">
      <a-table :columns="columnsRadioGroup"
               :dataSource="dataRadioGroup"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="RadioGroup 事件">
      <a-table :columns="columnsEvent"
               :dataSource="dataEvent"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="Radio">
      <a-table :columns="columnsRadio"
               :dataSource="dataRadio"
               :pagination="false"
               bordered></a-table>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
export default {
  name: 'DemoDropdown', // 表单
  mixins: [GlobalMixin],
  data () {
    return {
      value6: 1,
      value: 1,
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px'
      },
      disabled: true,
      value4: 'a',
      plainOptions: ['Apple', 'Pear', 'Orange'],
      options: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' }
      ],
      optionsWithDisabled: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: false }
      ],
      plainOptions1: ['Apple', 'Pear', 'Orange'],
      options1: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange' }
      ],
      optionsWithDisabled1: [
        { label: 'Apple', value: 'Apple' },
        { label: 'Pear', value: 'Pear' },
        { label: 'Orange', value: 'Orange', disabled: false }
      ],
      value1: 'Apple',
      value2: 'Apple',
      value3: 'Apple',
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
      columnsRadioGroup: [{
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
      columnsRadio: [{
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
        parameter: 'value',
        intro: '根据 value 进行比较，判断是否选中',
        type: 'any',
        default: '-'
      }],
      dataEvent: [{
        parameter: 'change',
        intro: '选项变化时的回调函数',
        callback: 'Function(e:Event)'
      }],
      dataRadioGroup: [{
        parameter: 'defaultValue',
        intro: '默认选中的值',
        type: 'any',
        default: '-'
      }, {
        parameter: 'disabled',
        intro: '禁选所有子单选器',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'name',
        intro: 'RadioGroup 下所有 input[type="radio"] 的 name 属性',
        type: 'string',
        default: '-'
      }, {
        parameter: 'options',
        intro: '以配置形式设置子元素',
        type: 'string[] | Array<{ label: string value: string disabled?: boolean }>',
        default: '-'
      }, {
        parameter: 'size',
        intro: '大小，只对按钮样式生效',
        type: 'large | default | small',
        default: 'default'
      }, {
        parameter: 'value(v-model)',
        intro: '用于设置当前选中的值',
        type: 'any',
        default: '-'
      }, {
        parameter: 'buttonStyle',
        intro: 'RadioButton 的风格样式，目前有描边和填色两种风格',
        type: 'outline | solid',
        default: 'outline'
      }],
      dataRadio: [{
        parameter: 'blur()',
        intro: '移除焦点'
      }, {
        parameter: 'focus()',
        intro: '获取焦点'
      }]
    }
  },
  mounted () { },
  methods: {
    toggleDisabled () {
      this.disabled = !this.disabled
    },
    onChange (e) {
      console.log(`checked = ${e.target.value}`)
    },
    onChange1 (e) {
      console.log('radio1 checked', e.target.value)
    },
    onChange2 (e) {
      console.log('radio2 checked', e.target.value)
    },
    onChange3 (e) {
      console.log('radio3 checked', e.target.value)
    },
    onChange4 (e) {
      console.log('radio checked', e.target.value)
    },
    onChange6 (e) {
      console.log('radio checked', e.target.value6)
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>

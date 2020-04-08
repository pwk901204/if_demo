<template>
  <div class="page-form">
    <a-card title="1.基本使用">
      <div>
        <a-select defaultValue="lucy"
                  style="width: 120px"
                  @change="handleChange1">
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="disabled"
                           disabled>Disabled</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
        <a-select defaultValue="lucy"
                  style="width: 120px"
                  disabled>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
        <a-select defaultValue="lucy"
                  style="width: 120px"
                  loading>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </div>
    </a-card>
    <a-card title="2.三种大小,三种大小的选择框，当 size 分别为 large 和 small 时，输入框高度为 40px 和 24px ，默认高度为 32px">
      <div>
        <a-radio-group v-model="size">
          <a-radio-button value="large">Large</a-radio-button>
          <a-radio-button value="default">Default</a-radio-button>
          <a-radio-button value="small">Small</a-radio-button>
        </a-radio-group>
        <br /><br />
        <a-select :size="size"
                  defaultValue="a1"
                  style="width: 200px"
                  @change="handleChange2">
          <a-select-option v-for="i in 25"
                           :key="(i + 9).toString(36) + i">
            {{(i + 9).toString(36) + i}}
          </a-select-option>
        </a-select>
        <br />
        <a-select mode="multiple"
                  :size="size"
                  placeholder="Please select"
                  :defaultValue="['a1', 'b2']"
                  style="width: 200px"
                  @change="handleChange"
                  @popupScroll="popupScroll">
          <a-select-option v-for="i in 25"
                           :key="(i + 9).toString(36) + i">
            {{(i + 9).toString(36) + i}}
          </a-select-option>
        </a-select>
        <br />
        <a-select mode="tags"
                  :size="size"
                  placeholder="Please select"
                  :defaultValue="['a1', 'b2']"
                  style="width: 200px"
                  @change="handleChange">
          <a-select-option v-for="i in 25"
                           :key="(i + 9).toString(36) + i">
            {{(i + 9).toString(36) + i}}
          </a-select-option>
        </a-select>
      </div>
    </a-card>
    <a-card title="3.标签,tags select，随意输入的内容（scroll the menu）">
      <a-select mode="tags"
                style="width: 100%"
                @change="handleChange3"
                placeholder="Tags Mode">
        <a-select-option v-for="i in 25"
                         :key="(i + 9).toString(36) + i">{{(i + 9).toString(36) + i}}</a-select-option>
      </a-select>
    </a-card>
    <a-card title="4.自动分词,试下复制 露西,杰克 到输入框里。只在 tags 和 multiple 模式下可用">
      <a-select mode="tags"
                style="width: 100%"
                :tokenSeparators="[',']"
                @change="handleChange4">
        <a-select-option v-for="i in 25"
                         :key="(i + 9).toString(36) + i">{{(i + 9).toString(36) + i}}</a-select-option>
      </a-select>
    </a-card>
    <a-card title="5.获得选项的文本,默认情况下 onChange 里只能拿到 value，如果需要拿到选中的节点文本 label，可以使用 labelInValue 属性。选中项的 label 会被包装到 value 中传递给 onChange 等函数，此时 value 是一个对象">
      <a-select labelInValue
                :defaultValue="{ key: 'lucy' }"
                style="width: 120px"
                @change="handleChange5">
        <a-select-option value="jack">Jack (100)</a-select-option>
        <a-select-option value="lucy">Lucy (101)</a-select-option>
      </a-select>
    </a-card>
    <a-card title="6.多选,多选，从已有条目中选择（scroll the menu）">
      <a-select mode="multiple"
                :defaultValue="['a1', 'b2']"
                style="width: 100%"
                @change="handleChange6"
                placeholder="Please select">
        <a-select-option v-for="i in 25"
                         :key="(i + 9).toString(36) + i">{{(i + 9).toString(36) + i}}</a-select-option>
      </a-select>
    </a-card>
    <a-card title="7.联动,省市联动是典型的例子">
      <div>
        <a-select :defaultValue="provinceData[0]"
                  style="width: 120px"
                  @change="handleProvinceChange">
          <a-select-option v-for="province in provinceData"
                           :key="province">{{province}}</a-select-option>
        </a-select>
        <a-select v-model="secondCity"
                  style="width: 120px">
          <a-select-option v-for="city in cities"
                           :key="city">{{city}}</a-select-option>
        </a-select>
      </div>
    </a-card>
    <a-card title="8.分组,用 OptGroup 进行选项分组">
      <a-select defaultValue="lucy"
                style="width: 200px"
                @change="handleChange7">
        <a-select-opt-group>
          <span slot="label">
            <a-icon type="user" />Manager</span>
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select-opt-group>
        <a-select-opt-group label="Engineer">
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select-opt-group>
      </a-select>
    </a-card>
    <a-card title="9.搜索框,搜索和远程数据结合">
      <a-select showSearch
                :value="value1"
                placeholder="input search text"
                style="width: 200px"
                :defaultActiveFirstOption="false"
                :showArrow="false"
                :filterOption="false"
                @search="handleSearch"
                @change="handleChange8"
                :notFoundContent="null">
        <a-select-option v-for="d in data1"
                         :key="d.value">{{d.text}}</a-select-option>
      </a-select>
    </a-card>
    <a-card title="10.带搜索框,展开后可对选项进行搜索">
      <a-select showSearch
                placeholder="Select a person"
                optionFilterProp="children"
                style="width: 200px"
                @focus="handleFocus"
                @blur="handleBlur"
                @change="handleChange9"
                :filterOption="filterOption">
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
        <a-select-option value="tom">Tom</a-select-option>
      </a-select>
    </a-card>
    <a-card title="11.搜索用户,一个带有远程搜索，节流控制，请求时序控制，加载状态的多选示例">
      <a-select mode="multiple"
                labelInValue
                :value="value2"
                placeholder="Select users"
                style="width: 100%"
                :filterOption="false"
                @search="fetchUser"
                @change="handleChange10"
                :notFoundContent="fetching ? undefined : null">
        <a-spin v-if="fetching"
                slot="notFoundContent"
                size="small" />
        <a-select-option v-for="d in data2"
                         :key="d.value">{{d.text}}</a-select-option>
      </a-select>
    </a-card>
    <a-card title="12.后缀图标,基本使用">
      <div>
        <a-select defaultValue="lucy"
                  style="width: 120px"
                  @change="handleChange11">
          <a-icon slot="suffixIcon"
                  type="smile" />
          <a-select-option value="jack">Jack</a-select-option>
          <a-select-option value="lucy">Lucy</a-select-option>
          <a-select-option value="disabled"
                           disabled>Disabled</a-select-option>
          <a-select-option value="Yiminghe">yiminghe</a-select-option>
        </a-select>
        <a-select defaultValue="lucy"
                  style="width: 120px"
                  disabled>
          <a-icon slot="suffixIcon"
                  type="meh" />
          <a-select-option value="lucy">Lucy</a-select-option>
        </a-select>
      </div>
    </a-card>
    <a-card title="13.隐藏已选择选项,隐藏下拉列表中已选择的选项">
      <a-select mode="multiple"
                placeholder="Inserted are removed"
                :value="selectedItems"
                @change="handleChange12"
                style="width: 100%">
        <a-select-option v-for="item in filteredOptions"
                         :key="item"
                         :value="item">
          {{item}}
        </a-select-option>
      </a-select>
    </a-card>
    <a-card title="14.扩展菜单,使用 dropdownRender 对下拉菜单进行自由扩展">
      <a-select defaultValue="lucy"
                style="width: 120px">
        <div slot="dropdownRender"
             slot-scope="menu">
          <v-nodes :vnodes="menu" />
          <a-divider style="margin: 4px 0;" />
          <div style="padding: 8px; cursor: pointer;">
            <a-icon type="plus" /> Add item</div>
        </div>
        <a-select-option value="jack">Jack</a-select-option>
        <a-select-option value="lucy">Lucy</a-select-option>
      </a-select>
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
    <a-card title="Select Methods">
      <a-table :columns="columnsMethods"
               :dataSource="dataMethods"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="Option props">
      <a-table :columns="columnsprops"
               :dataSource="dataprops"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="OptGroup props">
      <a-table :columns="columnsOptGroup"
               :dataSource="dataOptGroup"
               :pagination="false"
               bordered></a-table>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
import jsonp from 'fetch-jsonp'
import querystring from 'querystring'
import debounce from 'lodash/debounce'
const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters']
const provinceData = ['Zhejiang', 'Jiangsu']
const cityData = {
  Zhejiang: ['Hangzhou', 'Ningbo', 'Wenzhou'],
  Jiangsu: ['Nanjing', 'Suzhou', 'Zhenjiang']
}

let timeout
let currentValue

function fetch (value, callback) {
  if (timeout) {
    clearTimeout(timeout)
    timeout = null
  }
  currentValue = value

  function fake () {
    const str = querystring.encode({
      code: 'utf-8',
      q: value
    })
    jsonp(`https://suggest.taobao.com/sug?${str}`)
      .then(response => response.json())
      .then(d => {
        if (currentValue === value) {
          const result = d.result
          const data = []
          result.forEach(r => {
            data.push({
              value: r[0],
              text: r[0]
            })
          })
          callback(data)
        }
      })
  }

  timeout = setTimeout(fake, 300)
}
export default {
  name: 'DemoDropdown', // 表单
  mixins: [GlobalMixin],
  data () {
    this.lastFetchId = 0
    this.fetchUser = debounce(this.fetchUser, 800)
    return {
      console: console,
      selectedItems: [],
      data2: [],
      value2: [],
      fetching: false,
      data1: [],
      value1: undefined,
      provinceData,
      cityData,
      cities: cityData[provinceData[0]],
      secondCity: cityData[provinceData[0]][0],
      size: 'default',
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
      columnsMethods: [{
        title: '参数',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      }],
      columnsprops: [{
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
      columnsOptGroup: [{
        title: '参数',
        dataIndex: 'parameter'
      }, {
        title: '说明',
        dataIndex: 'intro'
      }, {
        title: '类型',
        dataIndex: 'type'
      }, {
        title: '默认值',
        dataIndex: 'default'
      }],
      data: [{
        parameter: 'allowClear',
        intro: '支持清除',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'autoClearSearchValue',
        intro: '是否在选中项后清空搜索框，只在 mode 为 multiple 或 tags 时有效',
        type: 'boolean',
        default: 'true'
      }, {
        parameter: 'autoFocus',
        intro: '默认获取焦点',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'defaultActiveFirstOption',
        intro: '是否默认高亮第一个选项',
        type: 'boolean',
        default: 'true'
      }, {
        parameter: 'defaultValue',
        intro: '指定默认选中的条目',
        type: 'string|string[]|number|number[]',
        default: '-'
      }, {
        parameter: 'disabled',
        intro: '是否禁用',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'dropdownClassName',
        intro: '下拉菜单的 className 属性',
        type: 'string',
        default: '-'
      }, {
        parameter: 'dropdownMatchSelectWidth',
        intro: '下拉菜单和选择器同宽',
        type: 'boolean',
        default: 'true'
      }, {
        parameter: 'dropdownRender',
        intro: '自定义下拉框内容',
        type: '(menuNode: VNode, props) => VNode',
        default: '-'
      }, {
        parameter: 'dropdownStyle',
        intro: '下拉菜单的 style 属性',
        type: 'object',
        default: '-'
      }, {
        parameter: 'filterOption',
        intro: '是否根据输入项进行筛选。当其为一个函数时，会接收 inputValue option 两个参数，当 option 符合筛选条件时，应返回 true，反之则返回 false',
        type: 'boolean or function(inputValue, option)',
        default: 'true'
      }, {
        parameter: 'firstActiveValue',
        intro: '默认高亮的选项',
        type: 'string|string[]',
        default: '-'
      }, {
        parameter: 'getPopupContainer',
        intro: '菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位',
        type: 'Function(triggerNode)',
        default: '() => document.body'
      }, {
        parameter: 'labelInValue',
        intro: '是否把每个选项的 label 包装到 value 中，会把 Select 的 value 类型从 string 变为 {key: string, label: vNodes} 的格式',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'maxTagCount',
        intro: '最多显示多少个 tag',
        type: 'number',
        default: '-'
      }, {
        parameter: 'maxTagPlaceholder',
        intro: '隐藏 tag 时显示的内容',
        type: 'slot/function(omittedValues)',
        default: '-'
      }, {
        parameter: 'maxTagTextLength',
        intro: '最大显示的 tag 文本长度',
        type: 'number',
        default: '-'
      }, {
        parameter: 'mode',
        intro: '设置 Select 的模式为多选或标签',
        type: 'default | multiple | tags | combobox',
        default: '-'
      }, {
        parameter: 'notFoundContent',
        intro: '当下拉列表为空时显示的内容',
        type: 'string|slot',
        default: 'Not Found'
      }, {
        parameter: 'optionFilterProp',
        intro: '搜索时过滤对应的 option 属性，如设置为 children 表示对内嵌内容进行搜索',
        type: 'string',
        default: 'value'
      }, {
        parameter: 'optionLabelProp',
        intro: '回填到选择框的 Option 的属性值，默认是 Option 的子元素。比如在子元素需要高亮效果时，此值可以设为 value',
        type: 'string',
        default: 'children （combobox 模式下为 value）'
      }, {
        parameter: 'placeholder',
        intro: '选择框默认文字',
        type: 'string|slot',
        default: '-'
      }, {
        parameter: 'showSearch',
        intro: '使单选模式可搜索',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'showArrow',
        intro: '是否显示下拉小箭头',
        type: 'boolean',
        default: 'true'
      }, {
        parameter: 'size',
        intro: '选择框大小，可选 large small',
        type: 'string',
        default: 'default'
      }, {
        parameter: 'suffixIcon',
        intro: '自定义的选择框后缀图标',
        type: 'VNode | slot',
        default: '-'
      }, {
        parameter: 'removeIcon',
        intro: '自定义的多选框清除图标',
        type: 'VNode | slot',
        default: '-'
      }, {
        parameter: 'clearIcon',
        intro: '自定义的多选框清空图标',
        type: 'VNode | slot',
        default: '-'
      }, {
        parameter: 'menuItemSelectedIcon',
        intro: '自定义当前选中的条目图标',
        type: 'VNode | slot',
        default: '-'
      }, {
        parameter: 'tokenSeparators',
        intro: '在 tags 和 multiple 模式下自动分词的分隔符',
        type: 'string[]',
        default: ''
      }, {
        parameter: 'value(v-model)',
        intro: '指定当前选中的条目',
        type: 'string|string[]|number|number[]',
        default: '-'
      }, {
        parameter: 'options',
        intro: 'options 数据，如果设置则不需要手动构造 selectOption 节点',
        type: 'array<{value, label, [disabled, key, title]}>',
        default: '[]'
      }, {
        parameter: 'defaultOpen',
        intro: '是否默认展开下拉菜单',
        type: 'boolean',
        default: '-'
      }, {
        parameter: 'open',
        intro: '是否展开下拉菜单',
        type: 'boolean',
        default: '-'
      }],
      dataEvent: [{
        parameter: 'blur',
        intro: '失去焦点的时回调',
        callback: 'function'
      }, {
        parameter: 'change',
        intro: '选中 option，或 input 的 value 变化（combobox 模式下）时，调用此函数',
        callback: 'function(value, option:Option/Array<Option>)'
      }, {
        parameter: 'deselect',
        intro: '取消选中时调用，参数为选中项的 value (或 key) 值，仅在 multiple 或 tags 模式下生效',
        callback: 'function(value，option:Option)'
      }, {
        parameter: 'focus',
        intro: '获得焦点时回调',
        callback: 'function'
      }, {
        parameter: 'inputKeydown',
        intro: '键盘按下时回调',
        callback: 'function'
      }, {
        parameter: 'mouseenter',
        intro: '鼠标移入时回调',
        callback: 'function'
      }, {
        parameter: 'mouseleave',
        intro: '鼠标移出时回调',
        callback: 'function'
      }, {
        parameter: 'popupScroll',
        intro: '下拉列表滚动时的回调',
        callback: 'function'
      }, {
        parameter: 'search',
        intro: '文本框值变化时回调',
        callback: 'function(value: string)'
      }, {
        parameter: 'select',
        intro: '被选中时调用，参数为选中项的 value (或 key) 值',
        callback: 'function(value, option:Option)'
      }, {
        parameter: 'dropdownVisibleChange',
        intro: '展开下拉菜单的回调',
        callback: 'function(open)'
      }],
      dataMethods: [{
        parameter: 'blur()',
        intro: '取消焦点'
      }, {
        parameter: 'focus()',
        intro: '获取焦点'
      }],
      dataprops: [{
        parameter: 'disabled',
        intro: '是否禁用',
        type: 'boolean',
        default: 'false'
      },
      {
        parameter: 'key',
        intro: '和 value 含义一致。如果 Vue 需要你设置此项，此项值与 value 的值相同，然后可以省略 value 设置',
        type: 'string',
        default: ''
      }, {
        parameter: 'title',
        intro: '选中该 Option 后，Select 的 title',
        type: 'string',
        default: '-'
      }, {
        parameter: 'value',
        intro: '默认根据此属性值进行筛选',
        type: 'string|number',
        default: '-'
      }, {
        parameter: 'class',
        intro: 'Option 器类名',
        type: 'string',
        default: '-'
      }],
      dataOptGroup: [{
        parameter: 'key',
        intro: '',
        type: 'string',
        default: '-'
      }, {
        parameter: 'label',
        intro: '组名',
        type: 'string||function(h)|slot',
        default: '无'
      }]
    }
  },
  computed: {
    filteredOptions () {
      return OPTIONS.filter(o => !this.selectedItems.includes(o))
    }
  },
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  mounted () { },
  methods: {
    handleChange1 (value) {
      console.log(`selected ${value}`)
    },
    handleChange2 (value) {
      console.log(`Selected: ${value}`)
    },
    popupScroll () {
      console.log('popupScroll')
    },
    handleChange3 (value) {
      console.log(`selected ${value}`)
    },
    handleChange4 (value) {
      console.log(`selected ${value}`)
    },
    handleChange5 (value) {
      console.log(value) // { key: "lucy", label: "Lucy (101)" }
    },
    handleChange6 (value) {
      console.log(`selected ${value}`)
    },
    handleProvinceChange (value) {
      this.cities = cityData[value]
      this.secondCity = cityData[value][0]
    },
    handleChange7 (value) {
      console.log(`selected ${value}`)
    },
    handleSearch (value) {
      fetch(value, data => (this.data1 = data))
    },
    handleChange8 (value) {
      console.log(value)
      this.value1 = value
      fetch(value, data => (this.data1 = data))
    },
    handleChange9 (value) {
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
    },
    fetchUser (value) {
      console.log('fetching user', value)
      this.lastFetchId += 1
      const fetchId = this.lastFetchId
      this.data = []
      this.fetching = true
      fetch('https://randomuser.me/api/?results=5')
        .then(response => response.json())
        .then(body => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return
          }
          const data = body.results.map(user => ({
            text: `${user.name.first} ${user.name.last}`,
            value: user.login.username
          }))
          this.data = data
          this.fetching = false
        })
    },
    handleChange10 (value) {
      Object.assign(this, {
        value,
        data: [],
        fetching: false
      })
    },
    handleChange11 (value) {
      console.log(`selected ${value}`)
    },
    handleChange12 (selectedItems) {
      this.selectedItems = selectedItems
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>

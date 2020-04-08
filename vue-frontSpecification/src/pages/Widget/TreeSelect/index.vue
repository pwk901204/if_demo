<template>
  <div class="page-form">
    <a-card title="基本用法">
      <a-tree-select style="width: 300px" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" :treeData="treeData" placeholder="Please select" treeDefaultExpandAll v-model="value">
        <span style="color: #08c" slot="title" slot-scope="{key, value}" v-if="key='0-0-1'">
      Child Node1 {{value}}
    </span>
      </a-tree-select>
    </a-card>
    <a-card title="多选的树选择">
      <a-tree-select style="width: 300px" :treeData="treeData1" :value="value1" @change="onChange" treeCheckable :showCheckedStrategy="SHOW_PARENT" searchPlaceholder="Please select" />
    </a-card>
    <a-card title="后缀图标">
      <a-tree-select showSearch style="width: 300px" :value="value2" :dropdownStyle="{ maxHeight: '400px', overflow: 'auto' }" placeholder="Please select" allowClear treeDefaultExpandAll @change="onChange2">
        <a-icon slot="suffixIcon" type="smile" />
        <a-tree-select-node value="parent 1" title="parent 1" key="0-1">
          <a-tree-select-node value="parent 1-0" title="parent 1-0" key="0-1-1">
            <a-tree-select-node value="leaf1" title="my leaf" key="random" />
            <a-tree-select-node value="leaf2" title="your leaf" key="random1" />
          </a-tree-select-node>
          <a-tree-select-node value="parent 1-1" title="parent 1-1" key="random2">
            <a-tree-select-node value="sss" key="random3">
              <b style="color: #08c" slot="title">sss</b>
            </a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select-node>
      </a-tree-select>
    </a-card>
    <a-card title="API">
      <a-table :columns="columns" :dataSource="data" :pagination="false" bordered></a-table>
    </a-card>
    <a-card title="事件">
      <a-table :columns="columnsEvent" :dataSource="dataEvent" :pagination="false" bordered></a-table>
    </a-card>
    <a-card title="Tree 方法">
      <a-table :columns="columnsFunc" :dataSource="dataFunc" :pagination="false" bordered></a-table>
    </a-card>
    <a-card title="TreeNode props(建议使用 treeData 来代替 TreeNode，免去手工构造麻烦)">
      <a-table :columns="columns" :dataSource="dataProps" :pagination="false" bordered></a-table>
    </a-card>
  </div>
</template>
<script>
import GlobalMixin from '@/mixins/global'
import { TreeSelect } from 'ant-design-vue'
const SHOW_PARENT = TreeSelect.SHOW_PARENT

const treeData1 = [{
  title: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    title: 'Child Node1',
    value: '0-0-0',
    key: '0-0-0'
  }]
},
{
  title: 'Node2',
  value: '0-1',
  key: '0-1',
  children: [{
    title: 'Child Node3',
    value: '0-1-0',
    key: '0-1-0',
    disabled: true
  },
  {
    title: 'Child Node4',
    value: '0-1-1',
    key: '0-1-1'
  },
  {
    title: 'Child Node5',
    value: '0-1-2',
    key: '0-1-2'
  }
  ]
}
]

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
  parameter: 'allowClear',
  intro: '显示清除按钮',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'defaultValue',
  intro: '指定默认选中的条目',
  type: 'string/string[]',
  default: '-'
},
{
  parameter: 'disabled',
  intro: '是否禁用',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'dropdownClassName',
  intro: '下拉菜单的 className 属性',
  type: 'string',
  default: '-'
},
{
  parameter: 'dropdownMatchSelectWidth',
  intro: '下拉菜单和选择器同宽',
  type: 'boolean',
  default: 'true'
},
{
  parameter: 'dropdownStyle',
  intro: '下拉菜单的样式',
  type: 'object',
  default: '-'
},
{
  parameter: 'filterTreeNode',
  intro: '是否根据输入项进行筛选，默认用 treeNodeFilterProp 的值作为要筛选的 TreeNode 的属性值',
  type: 'boolean|Function(inputValue: string, treeNode: TreeNode) (函数需要返回 bool 值)',
  default: 'Function'
},
{
  parameter: 'getPopupContainer',
  intro: '菜单渲染父节点。默认渲染到 body 上，如果你遇到菜单滚动定位问题，试试修改为滚动的区域，并相对其定位。',
  type: 'Function(triggerNode)',
  default: '() => document.body'
},
{
  parameter: 'labelInValue',
  intro: '是否把每个选项的 label 包装到 value 中，会把 value 类型从 string 变为 {value: string, label: VNode, halfChecked(treeCheckStrictly 时有效): string[] } 的格式',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'loadData',
  intro: '异步加载数据',
  type: 'function(node)',
  default: '-'
},
{
  parameter: 'maxTagCount',
  intro: '最多显示多少个 tag',
  type: 'number',
  default: '-'
},
{
  parameter: 'maxTagPlaceholder',
  intro: '隐藏 tag 时显示的内容',
  type: 'slot/function(omittedValues)',
  default: '-'
},
{
  parameter: 'multiple',
  intro: '支持多选（当设置 treeCheckable 时自动变为 true）',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'placeholder',
  intro: '选择框默认文字',
  type: 'string|slot',
  default: '-'
},
{
  parameter: 'searchPlaceholder',
  intro: '搜索框默认文字',
  type: 'string|slot',
  default: '-'
},
{
  parameter: 'searchValue(.sync)',
  intro: '搜索框的值，可以通过 search 事件获取用户输入',
  type: 'string',
  default: '-'
},
{
  parameter: 'treeIcon',
  intro: '是否展示 TreeNode title 前的图标，没有默认样式，如设置为 true，需要自行定义图标相关样式',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'showCheckedStrategy',
  intro: '定义选中项回填的方式。TreeSelect.SHOW_ALL: 显示所有选中节点(包括父节点). TreeSelect.SHOW_PARENT: 只显示父节点(当父节点下所有子节点都选中时). 默认只显示子节点.',
  type: 'enum{TreeSelect.SHOW_ALL, TreeSelect.SHOW_PARENT, TreeSelect.SHOW_CHILD }',
  default: 'TreeSelect.SHOW_CHILD'
},
{
  parameter: 'showSearch',
  intro: '在下拉中显示搜索框(仅在单选模式下生效)',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'size',
  intro: '选择框大小，可选 large small',
  type: 'string',
  default: 'defalut'
},
{
  parameter: 'suffixIcon',
  intro: '自定义的选择框后缀图标',
  type: 'VNode | slot',
  default: '-'
},
{
  parameter: 'treeCheckable',
  intro: '显示 checkbox',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'treeCheckStrictly',
  intro: 'checkable 状态下节点选择完全受控（父子节点选中状态不再关联），会使得 labelInValue 强制为 true',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'treeData',
  intro: 'treeNodes 数据，如果设置则不需要手动构造 TreeNode 节点（value 在整个树范围内唯一）',
  type: 'array<{value, label, children, [disabled, disableCheckbox, selectable]}>',
  default: '[]'
},
{
  parameter: 'treeDataSimpleMode',
  intro: '使用简单格式的 treeData，具体设置参考可设置的类型 (此时 treeData 应变为这样的数据结构: [{id:1, pId:0, value:"1", label:"test1",...},...], pId 是父节点的 id)',
  type: 'false|Array<{ id: string, pId: string, rootPId: null }>',
  default: 'false'
},
{
  parameter: 'treeDefaultExpandAll',
  intro: '默认展开所有树节点',
  type: 'boolean',
  default: 'false'
},
{
  parameter: 'treeDefaultExpandedKeys',
  intro: '默认展开的树节点',
  type: 'string[] | number[]',
  default: '-'
},
{
  parameter: 'treeExpandedKeys(.sync)',
  intro: '设置展开的树节点',
  type: 'string[] | number[]',
  default: '-'
},
{
  parameter: 'treeNodeFilterProp',
  intro: '输入项过滤对应的 treeNode 属性',
  type: 'string',
  default: 'value'
},
{
  parameter: 'treeNodeLabelProp',
  intro: '作为显示的 prop 设置',
  type: 'string',
  default: 'title'
},
{
  parameter: 'value(v-model)',
  intro: '指定当前选中的条目',
  type: 'string/string[]',
  default: '-'
}
]

const columnsFunc = [{
  title: '名称',
  dataIndex: 'name'
},
{
  title: '描述',
  dataIndex: 'intro'
}
]

const dataFunc = [{
  name: 'blur()',
  intro: '移除焦点'
}, {
  name: 'focus()',
  intro: '获取焦点'
}]

const columnsEvent = [{
  title: '事件名称',
  dataIndex: 'eventName'
},
{
  title: '说明',
  dataIndex: 'intro'
},
{
  title: '回调参数',
  dataIndex: 'callbackKey',
  className: 'type-style'
}
]

const dataEvent = [{
  eventName: 'change',
  intro: '选中树节点时调用此函数',
  callbackKey: 'function(value, label, extra)'
}, {
  eventName: 'search',
  intro: '文本框值变化时回调',
  callbackKey: 'function(value: string)'
}, {
  eventName: 'select',
  intro: '被选中时调用',
  callbackKey: 'function(value, node, extra)'
}, {
  eventName: 'treeExpand',
  intro: '展开节点时调用',
  callbackKey: 'function(expandedKeys)'
}]

const dataProps = [{
  parameter: 'selectable',
  intro: '是否可选',
  type: 'boolean',
  default: 'true'
}, {
  parameter: 'disableCheckbox',
  intro: '禁掉 checkbox',
  type: 'boolean',
  default: 'false'
}, {
  parameter: 'disabled',
  intro: '是否禁用',
  type: 'boolean',
  default: 'false'
}, {
  parameter: 'isLeaf',
  intro: '是否是叶子节点',
  type: 'boolean',
  default: 'false'
}, {
  parameter: 'key',
  intro: '此项必须设置（其值在整个树范围内唯一）',
  type: 'string | number',
  default: '-'
}, {
  parameter: 'title',
  intro: '树节点显示的内容',
  type: 'string | slot',
  default: '---'
}, {
  parameter: 'value',
  intro: '默认根据此属性值进行筛选（其值在整个树范围内唯一）',
  type: 'string',
  default: '-'
}, {
  parameter: 'scopedSlots',
  intro: '使用 treeData 时，可以通过该属性配置支持 slot 的属性，如 scopedSlots: { title: "XXX"}',
  type: 'object',
  default: '-'
}]

export default {
  name: 'Tree', // 表单
  mixins: [GlobalMixin],
  data () {
    return {
      treeData: [{
        title: 'Node1',
        value: '0-0',
        key: '0-0',
        children: [{
          value: '0-0-1',
          key: '0-0-1',
          scopedSlots: {
            // custom title
            title: 'title'
          }
        },
        {
          title: 'Child Node2',
          value: '0-0-2',
          key: '0-0-2'
        }
        ]
      },
      {
        title: 'Node2',
        value: '0-1',
        key: '0-1'
      }
      ],
      value: undefined,

      SHOW_PARENT,
      treeData1,
      value1: ['0-0-0'],

      value2: undefined,

      data,
      columns,
      columnsEvent,
      dataEvent,
      columnsFunc,
      dataFunc,
      dataProps
    }
  },
  mounted () {

  },
  methods: {
    onChange (value) {
      console.log('onChange ', value)
      this.value1 = value
    },
    onChange2 (value) {
      console.log(value)
      this.value2 = value
    }
  },
  watch: {
    value (value) {
      console.log(value)
    }
  }
}

</script>
<style lang="less">
@import "./index.less";

</style>

<template>
  <div class="page-form">
    <a-card title="受控操作示例">
      <a-tree
        checkable
        @expand="onExpand"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        v-model="checkedKeys"
        @select="onSelect"
        :selectedKeys="selectedKeys"
        :treeData="treeData1"
      />
    </a-card>
    <a-card title="基本用法">
      <a-tree
        checkable
        :treeData="treeData2"
        :defaultExpandedKeys="['0-0-0', '0-0-1']"
        :defaultSelectedKeys="['0-0-0', '0-0-1']"
        :defaultCheckedKeys="['0-0-0', '0-0-1']"
        @select="this.onSelect"
        @check="this.onCheck"
      >
        <span slot="title0010" style="color: #1890ff">sss</span>
      </a-tree>
    </a-card>
    <a-card title="自定义图标 ">
      <a-tree :treeData="treeData4" showIcon defaultExpandAll :defaultSelectedKeys="['0-0-0']">
        <a-icon type="down" slot="switcherIcon" />
        <a-icon slot="smile" type="smile-o" />
        <a-icon slot="meh" type="smile-o" />
        <template slot="custom" slot-scope="{selected}">
          <a-icon :type="selected ? 'frown':'frown-o'" />
        </template>
      </a-tree>
    </a-card>
    <a-card title="拖动示例">
      <a-tree
        class="draggable-tree"
        :defaultExpandedKeys="expandedNewKeys"
        draggable
        @dragenter="onDragEnter"
        @drop="onDrop"
        :treeData="gData"
      />
    </a-card>
    <a-card title="异步数据加载">
      <a-tree :loadData="onLoadData" :treeData="treeData6" />
    </a-card>
    <a-card title="连接线">
      <a-tree showLine :defaultExpandedKeys="['0-0-0']" @select="onSelect">
        <a-tree-node key="0-0">
          <span slot="title" style="color: #1890ff">parent 1</span>
          <a-tree-node title="parent 1-0" key="0-0-0">
            <a-tree-node title="leaf" key="0-0-0-0" />
            <a-tree-node title="leaf" key="0-0-0-1" />
            <a-tree-node title="leaf" key="0-0-0-2" />
          </a-tree-node>
          <a-tree-node title="parent 1-1" key="0-0-1">
            <a-tree-node title="leaf" key="0-0-1-0" />
          </a-tree-node>
          <a-tree-node title="parent 1-2" key="0-0-2">
            <a-tree-node title="leaf" key="0-0-2-0" />
            <a-tree-node title="leaf" key="0-0-2-1" />
          </a-tree-node>
        </a-tree-node>
      </a-tree>
    </a-card>
    <a-card title="可搜索">
      <div>
        <a-input-search style="margin-bottom: 8px" placeholder="Search" @change="onChange" />
        <a-tree
          @expand="onExpand"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          :treeData="gDataSearch"
        >
          <template slot="title" slot-scope="{title}">
            <span v-if="title.indexOf(searchValue) > -1">
              {{title.substr(0, title.indexOf(searchValue))}}
              <span
                style="color: #f50"
              >{{searchValue}}</span>
              {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
            </span>
            <span v-else>{{title}}</span>
          </template>
        </a-tree>
      </div>
    </a-card>
    <a-card title="目录 ">
      <a-directory-tree multiple defaultExpandAll @select="onSelect" @expand="onExpand">
        <a-tree-node title="parent 0" key="0-0">
          <a-tree-node title="leaf 0-0" key="0-0-0" isLeaf />
          <a-tree-node title="leaf 0-1" key="0-0-1" isLeaf />
        </a-tree-node>
        <a-tree-node title="parent 1" key="0-1">
          <a-tree-node title="leaf 1-0" key="0-1-0" isLeaf />
          <a-tree-node title="leaf 1-1" key="0-1-1" isLeaf />
        </a-tree-node>
      </a-directory-tree>
    </a-card>
    <a-card title="API">
      <a-table :columns="columns" :dataSource="data" :pagination="false" bordered></a-table>
    </a-card>
    <a-card title="事件">
      <a-table :columns="columnsEvent" :dataSource="data1" :pagination="false" bordered></a-table>
    </a-card>
    <a-card title="TreeNode props">
      <a-table :columns="columns" :dataSource="data2" :pagination="false" bordered></a-table>
    </a-card>
    <a-card title="DirectoryTree props">
      <a-table :columns="columns" :dataSource="data3" :pagination="false" bordered></a-table>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'

const x = 3
const y = 2
const z = 1

// 实例1数据
const treeData1 = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' }
        ]
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' }
        ]
      },
      {
        title: '0-0-2',
        key: '0-0-2'
      }
    ]
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' }
    ]
  },
  {
    title: '0-2',
    key: '0-2'
  }
]

// 实例2数据
const treeData2 = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          { title: 'leaf', key: '0-0-0-0', disableCheckbox: true },
          { title: 'leaf', key: '0-0-0-1' }
        ]
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [{ key: '0-0-1-0', slots: { title: 'title0010' } }]
      }
    ]
  }
]

// 实例4数据
const treeData4 = [
  {
    title: 'parent 1',
    key: '0-0',
    slots: {
      icon: 'smile'
    },
    children: [
      { title: 'leaf', key: '0-0-0', slots: { icon: 'meh' } },
      { title: 'leaf', key: '0-0-1', scopedSlots: { icon: 'custom' } }
    ]
  }
]

// 实例5数据模拟
const gData = []
const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || gData

  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateData(level, key, tns[index].children)
  })
}
generateData(z)

// 实例6数据
const treeData6 = [
  { title: 'Expand to load', key: '0' },
  { title: 'Expand to load', key: '1' },
  { title: 'Tree Node', key: '2', isLeaf: true }
]

// 实例7数据
const gDataSearch = []
const generateDataSearch = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0'
  const tns = _tns || gDataSearch

  const children = []
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`
    tns.push({ title: key, key, scopedSlots: { title: 'title' } })
    if (i < y) {
      children.push(key)
    }
  }
  if (_level < 0) {
    return tns
  }
  const level = _level - 1
  children.forEach((key, index) => {
    tns[index].children = []
    return generateDataSearch(level, key, tns[index].children)
  })
}
generateDataSearch(z)
const dataList = []
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i]
    const key = node.key
    dataList.push({ key, title: key })
    if (node.children) {
      generateList(node.children, node.key)
    }
  }
}
generateList(gDataSearch)
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

// API表头
const columns =
  [{
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
const columnsEvent =
  [{
    title: '事件名称',
    dataIndex: 'parameter'
  },
  {
    title: '说明',
    dataIndex: 'intro'
  },
  {
    title: '回调参数',
    dataIndex: 'type',
    className: 'type-style'
  }]
// API详细数据
const data =
  [{
    key: '1',
    parameter: 'treeData',
    intro: '节点的配置描述，具体项见下表, 1.1.4 之前的版本使用treeNodes',
    type: 'array',
    default: '--'
  },
  {
    key: '2',
    parameter: 'replaceFields',
    intro: '替换treeNode中 title,key,children字段为treeData中对应的字段',
    type: 'object',
    default: "{children:'children', title:'title', key:'key'}"
  },
  {
    key: '3',
    parameter: 'autoExpandParent',
    intro: '是否自动展开父节点',
    type: 'boolean',
    default: 'true'
  },
  {
    key: '4',
    parameter: 'checkable',
    intro: '节点前添加 Checkbox 复选框',
    type: 'boolean',
    default: 'false'
  },
  {
    key: '5',
    parameter: 'checkedKeys(v-model)',
    intro: '（受控）选中复选框的树节点（注意：父子节点有关联，如果传入父节点 key，则子节点自动选中；相应当子节点 key 都传入，父节点也自动选中。当设置checkable和checkStrictly，它是一个有checked和halfChecked属性的对象，并且父子节点的选中与否不再关联',
    type: 'string[] | number[] | {checked: string[] | number[], halfChecked: string[] | number[]}',
    default: '[]'
  },
  {
    key: '6',
    parameter: 'checkStrictly',
    intro: 'checkable 状态下节点选择完全受控（父子节点选中状态不再关联）',
    type: 'boolean',
    default: 'false'
  },
  {
    key: '7',
    parameter: 'defaultCheckedKeys',
    intro: '默认选中复选框的树节点',
    type: 'string[] | number[]',
    default: '[]'
  },
  {
    key: '8',
    parameter: 'defaultExpandAll',
    intro: '默认展开所有树节点',
    type: 'boolean',
    default: 'false'
  },
  {
    key: '9',
    parameter: 'defaultExpandedKeys',
    intro: '默认展开指定的树节点',
    type: 'string[] | number[]',
    default: '[]'
  },
  {
    key: '10',
    parameter: 'defaultExpandParent',
    intro: '默认展开父节点',
    type: 'bool',
    default: 'true'
  },
  {
    key: '11',
    parameter: 'defaultSelectedKeys',
    intro: '默认选中的树节点',
    type: 'string[] | number[]',
    default: '[]'
  }, {
    key: '12',
    parameter: 'disabled',
    intro: '将树禁用',
    type: 'bool',
    default: 'false'
  }, {
    key: '13',
    parameter: 'draggable',
    intro: '设置节点可拖拽',
    type: 'bool',
    default: 'false'
  }, {
    key: '14',
    parameter: 'expandedKeys(.sync)',
    intro: '（受控）展开指定的树节点',
    type: 'string[] | number[]',
    default: '[]'
  }, {
    key: '15',
    parameter: 'filterTreeNode',
    intro: '按需筛选树节点（高亮），返回 true',
    type: 'function(node)',
    default: '-'
  }, {
    key: '16',
    parameter: 'loadData',
    intro: '异步加载数据',
    type: 'function(node)',
    default: '-'
  }, {
    key: '17',
    parameter: 'loadedKeys',
    intro: '（受控）已经加载的节点，需要配合 loadData 使用',
    type: 'string[] | number[]',
    default: '[]'
  }, {
    key: '18',
    parameter: 'multiple',
    intro: '支持点选多个节点（节点本身）',
    type: 'bool',
    default: 'false'
  }, {
    key: '19',
    parameter: 'selectedKeys(.sync)',
    intro: '（受控）设置选中的树节点',
    type: 'string[] | number[]',
    default: '-'
  }, {
    key: '20',
    parameter: 'showIcon',
    intro: '是否展示 TreeNode title前的图标，没有默认样式，如设置为true，需要自行定义图标相关样式',
    type: 'boolean',
    default: 'false'
  }, {
    key: '21',
    parameter: 'switcherIcon',
    intro: '自定义树节点的展开/折叠图标',
    type: 'slot',
    default: '-'
  }, {
    key: '22',
    parameter: 'showLine',
    intro: '是否展示连接线',
    type: 'boolean',
    default: 'false'
  }
  ]
const data1 =
  [{
    key: '1',
    parameter: 'check',
    intro: '点击复选框触发',
    type: 'function(checkedKeys, e:{checked: bool, checkedNodes, node, event})'
  }, {
    key: '2',
    parameter: 'dragend',
    intro: 'dragend 触发时调用',
    type: 'function({event, node})'
  }, {
    key: '3',
    parameter: 'dragenter',
    intro: 'dragenter 触发时调用',
    type: 'function({event, node, expandedKeys})'
  }, {
    key: '4',
    parameter: 'dragleave',
    intro: 'dragleave 触发时调用',
    type: 'function({event, node})'
  }, {
    key: '5',
    parameter: 'dragover',
    intro: 'dragover 触发时调用',
    type: 'function({event, node})'
  }, {
    key: '6',
    parameter: 'dragstart',
    intro: '开始拖拽时调用',
    type: 'function({event, node}'
  }, {
    key: '7',
    parameter: 'drop',
    intro: 'drop 触发时调用',
    type: 'function({event, node, dragNode, dragNodesKeys})'
  }, {
    key: '8',
    parameter: 'expand',
    intro: '展开/收起节点时触发',
    type: 'function(expandedKeys, {expanded: bool, node})'
  }, {
    key: '9',
    parameter: 'load',
    intro: '节点加载完毕时触发',
    type: 'function(loadedKeys, {event, node})'
  }, {
    key: '10',
    parameter: 'rightClick',
    intro: '响应右键点击',
    type: 'function({event, node})'
  }, {
    key: '11',
    parameter: 'select',
    intro: '点击树节点触发',
    type: 'function(selectedKeys, e:{selected: bool, selectedNodes, node, event})'
  }]
const data2 =
  [{
    key: '1',
    parameter: 'class',
    intro: '节点的 class',
    type: 'string',
    default: '-'
  }, {
    key: '2',
    parameter: 'style',
    intro: '节点的 style',
    type: 'string|object',
    default: '-'
  }, {
    key: '3',
    parameter: 'disableCheckbox',
    intro: '禁掉 checkbox',
    type: 'boolean',
    default: 'false'
  }, {
    key: '4',
    parameter: 'disabled',
    intro: '禁掉响应',
    type: 'boolean',
    default: 'false'
  }, {
    key: '5',
    parameter: 'icon',
    intro: '自定义图标。可接收组件，props 为当前节点 props',
    type: 'slot|slot-scope',
    default: '-'
  }, {
    key: '6',
    parameter: 'isLeaf',
    intro: '设置为叶子节点(设置了loadData时有效)',
    type: 'boolean',
    default: 'false'
  }, {
    key: '7',
    parameter: 'key',
    intro: '被树的 (default)ExpandedKeys / (default)CheckedKeys / (default)SelectedKeys 属性所用。注意：整个树范围内的所有节点的 key 值不能重复！',
    type: 'string | number',
    default: '内部计算出的节点位置'
  }, {
    key: '8',
    parameter: 'selectable',
    intro: '设置节点是否可被选中',
    type: 'boolean',
    default: 'true'
  }, {
    key: '9',
    parameter: 'title',
    intro: '标题',
    type: 'string|slot|slot-scope',
    default: "'---'"
  }, {
    key: '10',
    parameter: 'slots',
    intro: "使用 treeNodes 时，可以通过该属性配置支持 slot 的属性，如 slots: { title: 'XXX'}",
    type: 'object',
    default: '-'
  }, {
    key: '11',
    parameter: 'scopedSlots',
    intro: "使用 columns 时，可以通过该属性配置支持 slot-scope 的属性，如 scopedSlots: { title: 'XXX'}",
    type: 'object',
    default: '-'
  }, {
    key: '12',
    parameter: 'on',
    intro: '事件对象，仅在 treeNodes 使用方式中生效，如{click: () => {}}',
    type: 'object',
    default: "'---'"
  }]

const data3 =
  [{
    key: '1',
    parameter: 'expandAction',
    intro: "目录展开逻辑，可选 false 'click' 'dbclick'",
    type: 'string',
    default: 'click'
  }]

export default {
  name: 'Tree', // 表单
  mixins: [GlobalMixin],
  data () {
    return {
      expandedKeys: ['0-0-0', '0-0-1'],
      expandedNewKeys: ['0-0', '0-0-0', '0-0-0-0'],
      autoExpandParent: true,
      checkedKeys: ['0-0-0'],
      selectedKeys: [],
      treeData1,
      treeData2,
      treeData4,
      gData,
      treeData6,
      gDataSearch,
      searchValue: '',
      replaceFieldsConfig: {
        children: 'child',
        title: 'name',
        key: 'key'
      },
      data,
      columns,
      columnsEvent,
      data1,
      data2,
      data3
    }
  },

  watch: {
    checkedKeys (val) {
      console.log('onCheck', val)
    }
  },

  mounted () {

  },

  methods: {
    onExpand (expandedKeys) {
      console.log('onExpand', expandedKeys)
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) {
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) {
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    onDragEnter (info) {
      console.log(info)
      // expandedKeys 需要受控时设置
      // this.expandedKeys = info.expandedKeys
    },
    onDrop (info) {
      console.log(info)
      const dropKey = info.node.eventKey
      const dragKey = info.dragNode.eventKey
      const dropPos = info.node.pos.split('-')
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data, key, callback) => {
        data.forEach((item, index, arr) => {
          if (item.key === key) {
            return callback(item, index, arr)
          }
          if (item.children) {
            return loop(item.children, key, callback)
          }
        })
      }
      const data = [...this.gData]
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 && // Has children
        info.node.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || []
          // where to insert 示例添加到尾部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        let ar
        let i
        loop(data, dropKey, (item, index, arr) => {
          ar = arr
          i = index
        })
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      this.gData = data
    },
    onLoadData (treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve()
          return
        }
        setTimeout(() => {
          treeNode.dataRef.children = [
            { title: 'Child Node', key: `${treeNode.eventKey}-0` },
            { title: 'Child Node', key: `${treeNode.eventKey}-1` }
          ]
          this.treeData6 = [...this.treeData6]
          resolve()
        }, 1000)
      })
    },
    onChange (e) {
      const value = e.target.value
      const expandedKeys = dataList
        .map(item => {
          if (item.key.indexOf(value) > -1) {
            return getParentKey(item.key, gData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    }
  }
}
</script>
<style lang="less">
@import "./index.less";
</style>

<template>
  <div class="m-tree">
    <a-input-search v-if="search" style="margin-bottom: 8px" placeholder="查询" @change="debounce(onSearchChange,500,$event)" />
    <a-tree
      v-bind="$attrs"
      :treeData="treeDataState"
      :autoExpandParent='autoExpandParent'
      :expandedKeys='expandedKeys'
      :draggable="$attrs.draggable && edit"
      :selectedKeys='selectedKeys'
      @dragenter="onDragEnter"
      @drop="onDrop"
      @expand='onExpand'
      @select="select"
    >
      <template slot="title" slot-scope="item">
        <a-input v-if="item._edit" size="small" :defaultValue="item.title" @click.stop="" @change="treeChange"/>
        <template v-else>
          <span v-if="item.title.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()) > -1">
            {{item.title.substr(0, item.title.toLocaleLowerCase().indexOf(searchValue.toLocaleLowerCase()))}}
            <span style="color: #f50">{{item.title.substr(item.title.toLocaleLowerCase().indexOf(searchValue),item.title.toLocaleLowerCase().indexOf(searchValue) + searchValue.length)}}</span>
            {{item.title.substr(item.title.toLocaleLowerCase().indexOf(searchValue) + searchValue.length)}}
          </span>
          <span v-else>{{item.title}}</span>
        </template>
        <span class="edit-wrap" @click.stop="" v-if="edit&&item._showEdit">
          <template v-if="item._edit">
            <a-button type="primary" size="small" @click="editNodeOk(item.key)">确定</a-button>
            <a-button size="small" @click="editNodeCancel(item.key)">取消</a-button>
          </template>
          <a-icon v-else type="edit" @click="editNode(item.key)" />
          <a-icon type="plus-circle" @click="editAddNode(item.key)"/>
          <a-popconfirm
            title="确定删除该条?"
            @confirm="editDeleteNode(item.key)"
            okText="是"
            cancelText="否"
          >
            <a-icon type="minus-circle" />
          </a-popconfirm>
        </span>
      </template>
    </a-tree>
    <a-button type="link" class="add-root-btn" v-if="edit" @click="rootAdd">添加根节点</a-button>
    <div class="btn-wrap" v-show="editShow">
      <a-button type="primary" v-if="!edit" @click="editFn">编辑</a-button>
      <a-button type="primary" v-if="edit" @click="save">确定</a-button>
      <a-button type="primary" v-if="edit" @click="cancel">取消</a-button>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils/util.js'
const cloneDeep = require('lodash.clonedeep')
export default {
  data () {
    return {
      expandedKeys: [],
      searchValue: '',
      autoExpandParent: true,
      treeDataState: [],
      inputVal: '',
      customProps: Object.freeze({ _edit: false, _showEdit: false, scopedSlots: { title: 'title' } }),
      edit: false,
      snapshoot: [],
      selectedKeys: []
    }
  },
  props: {
    treeData: {
      require: true,
      type: Array
    },
    search: {
      type: Boolean,
      default: false
    },
    editShow: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    treeData: {
      handler (newValue, oldValue) {
        this.initTree(newValue)
      },
      deep: true
    },
    edit (newValue, oldValue) {
      if (newValue) {
        this.snapshoot = this.formatTreeData(cloneDeep(this.treeDataState), 'cover')
      }
    }
  },
  mounted () {
    this.initTree(this.$props.treeData)
  },
  methods: {
    // 防抖
    debounce,
    editFn () {
      this.edit = true
    },
    initTree (data) {
      this.treeDataState = this.formatTreeData(cloneDeep(data))
    },
    // 添加内部属性
    formatTreeData (data, type) {
      const iter = (element) => {
        if (type === 'cover' || element._showEdit === undefined) {
          for (var name in this.customProps) {
             this.$set(element, name, this.customProps[name])
          }
        }
        if (element.children) {
          element.children.forEach(iter)
        }
      }
      data.forEach(iter)
      return data
    },
    // 反格式化
    unformatTreeData (data) {
      data = cloneDeep(data)
      const iter = (element) => {
        if (element._showEdit !== undefined) {
          delete element._edit
          delete element._showEdit
        }
        if (element.children) {
          element.children.forEach(iter)
        }
      }
      data.forEach(iter)
      return data
    },
    // 选中事件的混合
    select (selectedKeys, e) {
      this.clearState()
      this.findItemByKey(this.treeDataState, e.node.dataRef.key)._showEdit = e.selected
      e.selected ? this.selectedKeys = [e.node.dataRef.key] : this.selectedKeys = []
      this.$emit('select', selectedKeys, e)
    },
    // 添加根节点
    rootAdd () {
      this.treeDataState.push({
        ...this.basicNode()
      })
    },
    // 点击编辑 节点
    editNode (key) {
      const selected = this.findItemByKey(this.treeDataState, key)
      this.inputVal = selected.title
      selected._edit = true
    },
    // 编辑完毕 节点
    editNodeOk (key) {
      const selected = this.findItemByKey(this.treeDataState, key)
      selected.title = this.inputVal
      selected._edit = false
      this.$nextTick(() => {
        this.inputVal = ''
      })
    },
    // 取消编辑 节点
    editNodeCancel (key) {
      const selected = this.findItemByKey(this.treeDataState, key)
      selected._edit = false
    },
    // 添加子节点 节点
    editAddNode (key) {
      const selected = this.findItemByKey(this.treeDataState, key)
      if (!selected.children) {
        selected.children = []
      }
      selected.children.push({
        ...selected,
        ...this.basicNode()
      })
      this.expandedKeys.push(key)
    },
    // 删除子节点 节点
    editDeleteNode (key) {
      const { children } = this.findItemByKey(this.treeDataState, key)
      if (children && children.length > 0) {
        this.$message.error('无法删除，该节点包含子节点')
      } else {
        this.deleteTreeItem(this.treeDataState, 'key', key)
      }
    },
    // 树的保存
    save () {
      this.clearState()
      this.selectedKeys = []
      this.changeAllByProp(this.treeDataState, '_showEdit', false)
      const data = this.unformatTreeData(this.treeDataState)
      this.$emit('save', data)
      this.edit = false
    },
    // 取消编辑，回到上次快照
    cancel () {
      this.selectedKeys = []
      this.treeDataState = this.snapshoot
      this.edit = false
    },
    // 展开控制
    onExpand (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    treeChange (e) {
      this.inputVal = e.target.value
    },
    // 搜索功能
    onSearchChange (e) {
      const value = e.target.value.trim()
      const expandedKeys = this.findkey(this.treeDataState, 'title', value)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
      this.$emit('searchHandle', value, e)
    },
    // 清除节点 编辑状态
    clearState () {
      this.changeAllByProp(this.treeDataState, '_showEdit', false)
      this.changeAllByProp(this.treeDataState, '_edit', false)
    },
    onDragEnter () {},
    // 节点拖拽
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
      const data = this.treeDataState
      let dragObj
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        loop(data, dropKey, item => {
          item.children = item.children || []
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 &&
        info.node.expanded &&
        dropPosition === 1
      ) {
        loop(data, dropKey, item => {
          item.children = item.children || []
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
    },
    // 节点数据的基础模型
    basicNode () {
      return {
        title: '请编辑内容',
        key: Math.random() * 10,
        children: null,
        ...this.customProps
      }
    },
    // 查找指定节点数据
    findItemByKey (tree, key) {
      let r
      tree.forEach(function iter (a) {
        if (a.key === key) {
          r = a
          return
        }
        return Array.isArray(a.children) && a.children.forEach(iter)
      })
      return r
    },
    // 修改指定节点熟悉
    changeAllByProp (tree, prop, value) {
      tree.forEach(function iter (a) {
        a[prop] = value
        return Array.isArray(a.children) && a.children.forEach(iter)
      })
    },
    // 删除节点
    deleteTreeItem (tree, prop, value) {
      tree.forEach(function iter (a, i) {
        if (a[prop] === value) {
          return this.splice(i, 1)
        }
        Array.isArray(a.children) && a.children.forEach(iter.bind(a.children))
      }.bind(tree))
    },
    // 查找key
    findkey (tree, prop, value) {
      if (value === '') { return }
      const r = []
      const iter = (a, i) => {
        if (a[prop].toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) >= 0) {
          const parentKey = this.findParentKey(tree, 'key', a.key)
          parentKey && r.push(parentKey)
        }
        Array.isArray(a.children) && a.children.forEach(iter)
      }
      tree.forEach(iter)
      return r
    },
    // 查找父节点 key
    findParentKey (tree, prop, value) {
      let r = ''
      tree.forEach(function iter (a, i) {
        if (a[prop] === value) {
          r = this[prop]
          return
        }
        Array.isArray(a.children) && a.children.forEach(iter.bind(a))
      }.bind(tree))
      return r
    }
  }
}
</script>
<style lang="less">
.m-tree{
  overflow-y: auto;
  .edit-wrap{
    margin-left:10px;
    .anticon,button{
      margin-left:10px;
    }
  }
  .add-root-btn:hover{
    border-color: transparent !important;
  }
  .btn-wrap{
    margin-top:20px;
    button{
      margin-right: 10px;
    }
  }
}
.m-tree .ant-tree li .ant-tree-node-content-wrapper{
  padding: 0;
}

</style>

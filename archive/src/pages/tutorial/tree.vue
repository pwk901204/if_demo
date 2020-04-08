<template>
  <div>
    <div class="options">
      <div class="switch">
        <span class="title">打开编辑：</span>
        <a-switch @change="()=>{editShow=!editShow}"/>
      </div>
      <div class="switch">
        <span class="title">打开拖拽：</span>
        <a-switch @change="()=>{draggable=!draggable}"/>
      </div>
      <div class="switch">
        <span class="title">打开搜索：</span>
        <a-switch @change="()=>{search=!search}"/>
      </div>
    </div>

    <Tree
      :treeData='gData'
      :editShow="editShow"
      :search='search'
      :draggable='draggable'
      @searchHandle="searchHandle"
      @save="save"
      @select="select"
    ></Tree>
       <!-- :loadData="onLoadData" -->
  </div>

</template>

<script>
import Tree from '@/components/Tree/index'
const gData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '222',
        key: '222',
        children: [
          {
            title: '333',
            key: '333'
          }
        ]
      }
    ]
  },
  {
    title: '0-2',
    key: '0-2',
    children: [
      {
        title: '224',
        key: '224',
        children: [
          {
            title: '334',
            key: '334'
          }
        ]
      }
    ]
  }, {
    title: '0-22',
    key: '0-22'
    // isLeaf: false
  }
]
export default {
  components: {
    Tree
  },
  data () {
    return {
      gData,
      editShow: false,
      draggable: false,
      search: false
    }
  },
  methods: {
    select (selectedKeys, e) {
      console.log(selectedKeys, e)
    },
    searchHandle (value, e) {
      console.log(value, e)
    },
    save (treedata) {
      console.log(treedata)
    }
    // onLoadData (treeNode) {
    //   return new Promise(resolve => {
    //     if (treeNode.dataRef.children) {
    //       resolve()
    //       return
    //     }
    //     setTimeout(() => {
    //       treeNode.dataRef.children = [
    //         { title: 'Child Node', key: `${Math.random()}` },
    //         { title: 'Child Node', key: `${Math.random()}` }
    //       ]
    //       // this.gData = [...this.gData]
    //       resolve()
    //     }, 1000)
    //   })
    // }
  }
}
</script>
<style lang="less">
.options{
  margin-bottom: 10px;;
}
</style>

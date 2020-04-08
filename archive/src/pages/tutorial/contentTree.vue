<template>
  <div>
    <Tree
      v-if="gData.length>0"
      :treeData='gData'
      :search='search'
      @searchHandle="searchHandle"
      @select="select"
    ></Tree>
  </div>
</template>

<script>
import Tree from '@/components/Tree/index'
import { mapState } from 'vuex'
export default {
  components: {
    Tree
  },
  data () {
    return {
      search: true
    }
  },
   computed: {
    ...mapState({
      // 动态主路由
      gData: state => state.dict.contentTreeDict
    })
  },
  methods: {
    select (selectedKeys, e) {
      console.log(selectedKeys, e)
    },
    searchHandle (value, e) {
      console.log(value, e)
    }
  }
}
</script>
<style lang="less">
.options{
  margin-bottom: 10px;;
}
</style>

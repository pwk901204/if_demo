<template>
  <!-- <div class="page-header"> -->
  <div class="page-breadcrumb">
    <a-breadcrumb>
      <a-breadcrumb-item :key="item.path"
                         v-for="(item, index) in breadcrumb">
        <span v-if="index === 0">
          <router-link to="/">
            {{item.name}}
          </router-link>
        </span>
        <span v-else>
          <a href="javascript: void(0)" @click="refreshCall">{{item.name}}</a>
          <em v-if="item.meta.pathFile">（ 文件目录 ：{{item.meta.pathFile}} ）</em></span>
      </a-breadcrumb-item>
    </a-breadcrumb>
  </div>
  <!-- </div> -->
</template>

<script>
export default {
  name: 'PageHeader',
  props: {
    breadcrumb: {
      type: Array,
      required: false
    }
  },
  methods: {
    refreshCall () {
      console.log(this.$route)
      this.$emit('refresh-page')
    }
  }
}
</script>
<style lang="less">
.page-breadcrumb {
  line-height: 45px;
  background: #fff !important;
  margin-bottom: 10px;
  .ant-breadcrumb {
    height: 100%;
    height: 45px !important;
    line-height: 45px !important;
    em {
      color: red;
      margin-left: 12px;
      letter-spacing: 2px;
    }
  }
}
</style>

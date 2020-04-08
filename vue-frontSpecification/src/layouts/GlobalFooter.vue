<template>
  <div class="layout-footer">
    <!-- <div class="links">
      <a
        target="_blank"
        :key="index"
        :href="item.link ? item.link : 'javascript: void(0)'"
        v-for="(item, index) in linkList"
      >
        <a-icon v-if="item.icon" :type="item.icon"/>
        {{item.name}}
      </a>
    </div> -->
    <div class="copyright">
      Copyright
      <a-icon type="copyright" />芜湖技术中心
    </div>
  </div>
</template>

<script>
export default {
  name: 'GlobalFooter',
  props: ['copyright', 'linkList']
}
</script>
<style scoped>
.layout-footer {
  background: #f5f5f5;
  height: 60px;
}
</style>

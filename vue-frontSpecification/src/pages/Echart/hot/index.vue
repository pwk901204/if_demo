<template>
  <div class="page-header-index-wide">
    <a-row class="fly"
           :gutter="24">
      <a-col :span="24"
             :style="{ marginBottom: '24px' }">
        <hot-one></hot-one>
      </a-col>

    </a-row>
    <a-row :gutter="24">
      <a-col :span="24"
             :style="{ marginBottom: '24px' }">
        <hot-two></hot-two>
      </a-col>
    </a-row>
  </div>
</template>

<script>

import { HotOne, HotTwo } from '@/components/Charts'
export default {
  name: 'Analysis',
  components: {
    HotOne,
    HotTwo
  },
  data () {
    return {

    }
  },
  created () {

  }
}
</script>

<style lang="less">
.page-header-index-wide {
  padding: 0 24px;
  background: #f5f5f5;
  .fly {
    margin-bottom: 20px;
  }
  .ant-col-24 {
    background: #fff;
  }
}
</style>

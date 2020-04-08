<template>
  <div class="page-header-index-wide">
    <a-row :gutter="24">
      <a-col :span="12"
             :style="{ marginBottom: '24px' }">
        <zhu-one>
        </zhu-one>
      </a-col>
      <a-col :span="12"
             :style="{ marginBottom: '24px' }">
        <zhu-two>
        </zhu-two>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12"
             :style="{ marginBottom: '24px' }">
        <zhu-three></zhu-three>
      </a-col>
      <a-col :span="12"
             :style="{ marginBottom: '24px' }">
        <zhu-six></zhu-six>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="12"
             :style="{ marginBottom: '24px' }">
        <zhu-four>
        </zhu-four>
      </a-col>
      <a-col :span="12"
             :style="{ marginBottom: '24px' }">
        <zhu-five></zhu-five>
      </a-col>
    </a-row>
    <a-row :gutter="24">
      <a-col :span="24"
             :style="{ marginBottom: '24px' }">
        <zhu-senve></zhu-senve>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import {
  zhuOne,
  zhuTwo,
  zhuThree,
  zhuFour,
  zhuFive,
  zhuSix,
  zhuSenve
} from '@/components/Charts'
export default {
  name: 'Analysis',
  components: {
    zhuOne,
    zhuTwo,
    zhuThree,
    zhuFour,
    zhuFive,
    zhuSix,
    zhuSenve
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
    margin-bottom: 10px;
  }
  .ant-col-12 {
    background: #fff;
  }
  .ant-col-24 {
    background: #fff;
  }
}
</style>

<template>
  <div class="IMOnline">
    <IM></IM>
    <div class="IM-entrance">
      <a-badge :count="99">
        <a-icon type="message"  class="message-icon"/>
      </a-badge>
    </div>
  </div>
</template>
<script>
import IM from '@/components/IM'
export default {
  components: {
    IM
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="less">
.IMOnline{
  position: relative;
  .IM-entrance{
    position: absolute;
    right:20px;
    bottom: 20px;
    .message-icon{
      font-size: 30px;
    }
  }
  ::-webkit-scrollbar {
    width : 8px;
    height: 1px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #535353;
    cursor: pointer;
  }
  ::-webkit-scrollbar-track {
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background   : #ededed;
  }
}
</style>

<template>
  <div class="IM-options">
    <div class="options-item flex-col-center active">
      <img src="./assets/message.png" />
    </div>
    <div class="options-item flex-col-center">
      <img src="./assets/contacts.png" />
    </div>
  </div>
</template>
<style lang="less">
.IM-options{
  width: 50px;
  height: 100%;
  background: #001529;
  overflow: hidden;
  .options-item{
    width: 50px;
    height: 50px;
    &.active{
      background: #1890ff;
    }
    img{
      width:20px;
      height: 20px;
    }
  }
}
</style>
